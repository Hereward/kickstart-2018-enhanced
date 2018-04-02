import { Meteor } from "meteor/meteor";
import * as speakeasy from "speakeasy";
import ReactRouterPropTypes from "react-router-prop-types";
import * as PropTypes from "prop-types";
import * as React from "react";
import { withTracker } from "meteor/react-meteor-data";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import Loader from "react-loader-spinner";
import { Alert, Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import RaisedButton from "material-ui/RaisedButton";

import * as Library from "../../../modules/library";
import Transition from "../../partials/Transition";
import * as Methods from "../../../api/auth/methods";
import { Auth } from "../../../api/auth/publish";
import * as User from "../../../modules/user";

const LoadingPlaceHolder = styled.div`
  border: 1px dashed Silver;
  margin: 1rem;
  height: 228px;
  width: 228px;
  text-align: center;
  background-color: WhiteSmoke;
  color: #303030;
`;

interface IProps {
  history: any;
  boojam: string;
  authData: {
    _id: string;
    verified: boolean;
    currentAttempts: number;
    private_key: string;
    owner: string;
    keyObj: any;
    QRCodeShown: boolean;
    QRCodeURL: string;
  };
}

interface IState {
  showQRcode: boolean;
  authCode: string;
  currentValidToken: string;
  disableSubmit: boolean;
}

class Authenticator extends React.Component<IProps, IState> {
  oldToken: string;
  counter: number;
  timerID: any;
  expiredTokens: string[];
  allowKeyGeneration: boolean = true;
  timerWasSet: boolean;

  constructor(props) {
    super(props);

    if (this.props.authData && this.props.authData.verified) {
      this.props.history.push("/");
    }

    this.handleQRClick = this.handleQRClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.checkTokens = this.checkTokens.bind(this);
    this.renderExpiredTokens = this.renderExpiredTokens.bind(this);
    this.oldToken = "";
    this.counter = 0;
    this.expiredTokens = [];
    this.timerID = 0;
    this.timerWasSet = false;
    let showQRcode = this.props.authData && this.props.authData.QRCodeShown === false ? true : false;

    this.state = {
      showQRcode: showQRcode,
      authCode: "",
      currentValidToken: "",
      disableSubmit: false
    };
  }

  static propTypes = {
    history: ReactRouterPropTypes.history,
    authData: PropTypes.shape({
      _id: PropTypes.string,
      verified: PropTypes.bool,
      currentAttempts: PropTypes.number,
      private_key: PropTypes.string,
      owner: PropTypes.string,
      keyObj: PropTypes.any,
      QRCodeShown: PropTypes.bool,
      QRCodeURL: PropTypes.string
    })
  };

  componentWillMount() {}

  componentDidUpdate() {}

  componentWillReceiveProps(nextProps) {
    this.setTimer(nextProps);
  }

  componentDidMount() {
    this.setTimer();
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  setTimer(nextProps: any = '') {
    let props: any;
    if (nextProps) {
      props = nextProps;
    } else {
      props = this.props;
    }

    if (props.authData) {
      console.log(`Authenticator setTimer - authData`, props.authData);
      if (props.authData.private_key && !this.timerWasSet) {
        this.timerID = Meteor.setInterval(() => this.checkTokens(props.authData.private_key), 2000);
        this.timerWasSet = true;
      }
    } else {
      console.log(`Authenticator setTimer - NO AUTH DATA!`);
    }
  }

  getQRCodeLayout() {
    let QRcode = (
      <div className="QRcode">
        <div>
          <img alt="QR Code" src={this.props.authData.QRCodeURL} />
        </div>
        <div className="private-key">{this.props.authData.private_key}</div>
      </div>
    );
    return QRcode;
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({
      disableSubmit: true
    });
    this.verifyToken();
  }

  handleQRClick() {
    this.setState({ showQRcode: false });
    this.setTimer();
  }

  handleChange(e) {
    let target = e.target;
    let value = target.type === "checkbox" ? target.checked : target.value;
    let id = target.id;

    this.setState({ [id]: value });
  }

  verifyToken() {
    console.log(`verifyToken`);
    let myToken = this.state.authCode.trim();
    let verified;

    let authFields = {
      key: this.props.authData.private_key,
      myToken: myToken
    };

    Methods.verifyToken.call(authFields, (err, verified) => {
      if (err) {
        Library.invalidAuthCodeAlert(err);
        console.log(`verifyToken error`, err);
        this.setState({
          disableSubmit: false
        });
      } else {
        console.log(`verifyToken: Authenticator> push('/')`);
        this.props.history.push("/");
      }
    });
  }

  checkTokens(key) {
    let authFields = {
      key: key
    };
    Methods.currentValidToken.call(authFields, (err, token) => {
      if (err) {
        Library.modalErrorAlert(err.reason);
        console.log(`currentValidToken error`, err);
      } else if (token && this.oldToken !== token) {
        if (this.oldToken !== token) {
          this.setState({ currentValidToken: token });
          this.oldToken = token;
          this.expiredTokens.push(this.oldToken);
        }
      }
    });
  }

  QRCodeReady() {
    let flag = false;
    if (this.props.authData.QRCodeURL) {
      flag = true;
    }
    return flag;
  }

  getLayout() {
    let layout = (
      <div className="container page-content">{this.state.showQRcode ? this.QRLayout() : this.verifyLayout()}</div>
    );
    return layout;
  }

  getLoadingPlaceHolder() {
    let tag = (
      <LoadingPlaceHolder className="d-flex align-items-center">
        <div className="m-auto">
          <Loader type="Oval" color="red" height="80" width="80" />
          <div className="mx-2 mt-2">Loading QR code, please wait...</div>
        </div>
      </LoadingPlaceHolder>
    );

    return tag;
  }

  QRLayout() {
    let QRLayout = (
      <Transition>
        <div>
          <h2>Register For 2 Factor Authentication</h2>
          <p className="lead">
            In order to use the full range of our services you will need to use 2 factor authentication.
          </p>
          <p className="lead">Below you will see a graphical QR code followed by the private key text string.</p>
          <div>{this.props.authData.QRCodeURL ? this.getQRCodeLayout() : this.getLoadingPlaceHolder()}</div>

          <p className="lead">Please scan the QR code or manually enter the private key into Google Authenticator.</p>
          <Button id="QRDone" onClick={this.handleQRClick}>
            Click Here When Done
          </Button>
        </div>
      </Transition>
    );
    return QRLayout;
  }

  showCode() {
    let layout = (
      <div>
        <Alert color="primary">{this.state.currentValidToken}</Alert>
      </div>
    );

    return Meteor.settings.public.enhancedAuth.displayCode ? layout : "";
  }

  verifyLayout() {
    let layout = (
      <div>
        <Transition>
          <h2>Verify Authorisation Code</h2>
          <Form onSubmit={this.handleSubmit}>
            <FormGroup>
              <Label for="authCode">Please enter the 6 digit authorisation code:</Label>
              <Input
                onChange={this.handleChange}
                type="text"
                name="authCode"
                id="authCode"
                placeholder="Enter the 6 digit authorisation code"
              />
            </FormGroup>
            <FormGroup>
              <RaisedButton disabled={this.state.disableSubmit} type="submit" primary={true} label="Submit" />
            </FormGroup>
          </Form>

          {this.showCode()}
        </Transition>
      </div>
    );
    return layout;
  }

  renderExpiredTokens() {
    let items = this.expiredTokens.map(d => <li key={d}>{d}</li>);

    return <div>{items}</div>;
  }

  render() {
    return this.getLayout();
  }
}

export default withRouter(
  withTracker(() => {
    let authData: any;
    //Meteor.subscribe("userData");
    let authDataReady = Meteor.subscribe("enhancedAuth");

    if (User.id()) {
      let id = User.id();

      if (authDataReady) {
        authData = Auth.findOne({ owner: id });
      }
    }

    return { authData: authData };
  })(Authenticator)
);
