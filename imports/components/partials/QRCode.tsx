///<reference path="../../../index.d.ts"/>
import * as React from "react";
import { Meteor } from "meteor/meteor";
import { Button } from "reactstrap";
import Loader from "react-loader-spinner";
import styled from "styled-components";
import * as Library from "../../modules/library";
import Transition from "./Transition";
import { getDecrpytedAuthData } from "../../api/auth/methods";

interface IProps {
  handleQRclick: any;
}

interface IState {
  QRCodeURL: string;
  privateKey: string;
  cancelEnabled: boolean;
}

const LoadingPlaceHolder = styled.div`
  border: 1px dashed Silver;
  margin: 1rem;
  height: 228px;
  width: 228px;
  text-align: center;
  background-color: WhiteSmoke;
  color: #303030;
`;

class QRCode extends React.Component<IProps, IState> {
  tipInitialised: boolean = false;
  clearTip: boolean = false;
  currentTip: string = "";
  emailVerifyPrompted: boolean;

  constructor(props) {
    super(props);
    this.handleQRClick = this.handleQRClick.bind(this);
    this.state = {
      QRCodeURL: "",
      privateKey: "",
      cancelEnabled: false
    };
  }

  componentWillReceiveProps(nextProps) {}

  componentWillUpdate(nextProps) {}

  componentDidUpdate() {}

  componentWillMount() {
    getDecrpytedAuthData.call({}, (err, res) => {
      if (err) {
        Library.modalErrorAlert(err.reason);
        console.log(`getDecrpytedAuthData error`, err);
      } else {
        this.setState({ privateKey: res.key, QRCodeURL: res.url });
      }
    });
  }

  componentDidMount() {}

  handleQRClick() {
    this.props.handleQRclick();
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

  getQRCodeLayout() {
    let QRcode = (
      <div className="QRcode">
        <div>
          <img alt="QR Code" src={this.state.QRCodeURL} />
        </div>
        <div className="private-key">{this.state.privateKey}</div>
      </div>
    );
    return QRcode;
  }

  render() {
    return (
      <Transition>
        <div>
          <h2>Register For 2 Factor Authentication</h2>
          <p className="lead">
            In order to use the full range of our services you will need to use 2 factor authentication.
          </p>
          <p className="lead">Below you will see a graphical QR code followed by the private key text string.</p>
          <div>{this.state.QRCodeURL ? this.getQRCodeLayout() : this.getLoadingPlaceHolder()}</div>

          <p className="lead">Please scan the QR code or manually enter the private key into Google Authenticator.</p>
          <Button color="primary" id="QRDone" onClick={this.handleQRClick}>
            Click Here When Done
          </Button>
        </div>
      </Transition>
    );
  }
}

export default QRCode;
