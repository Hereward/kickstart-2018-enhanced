import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import * as PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";
import * as React from "react";
import { connect } from "react-redux";
import * as SessionMethods from "../../../api/sessions/methods";
import * as Library from "../../../modules/library";
import Transition from "../../partials/Transition";
import SignInForm from "../../forms/SignInForm";
import * as User from "../../../modules/user";

interface IProps {
  history: any;
  enhancedAuth: boolean;
  sessionReady: boolean;
  sessionToken: string;
  userSettings: any;
  userData: any;
}

interface IState {
  email: string;
  password: string;
  keepMeLoggedIn: boolean;
  allowSubmit: boolean;
}

class SignIn extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);

    this.SignInUser = this.SignInUser.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.state = {
      password: "",
      email: "",
      keepMeLoggedIn: false,
      allowSubmit: true
    };
  }

  componentWillMount() {}

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {}

  handleChange(e) {
    let target = e.target;
    let value = target.value;
    let id = target.id;

    this.setState({ [id]: value });
  }

  handleCheck(isInputChecked) {
    this.setState({ keepMeLoggedIn: isInputChecked });
    log.info(`SignIn - handleCheck`, isInputChecked);
  }

  getLayout() {
    let form = (
      <SignInForm
        allowSubmit={this.state.allowSubmit}
        handleChange={this.handleChange}
        handleSubmit={this.SignInUser}
        handleCheck={this.handleCheck}
      />
    );

    if (!this.props.sessionReady) {
      return form;
    } else {
      return (
        <div>
          <h2>Signed In</h2>
          <div>
            You are signed in as <strong>{this.props.userData.emails[0].address}</strong>.
          </div>
        </div>
      );
    }
  }

  createSession() {
    let allowMultiSession = Meteor.settings.public.session.allowMultiSession || false;
    let sessionToken = User.sessionToken("create");
    //log.info(`Signin - createSession`, sessionToken);
    SessionMethods.createUserSession.call(
      { sessionToken: sessionToken, keepMeLoggedIn: this.state.keepMeLoggedIn },
      (err, res) => {
        if (err) {
          console.log(`createSession error: [${err.reason}]`, err);
          Library.modalErrorAlert(err.reason);
        }

        if (!allowMultiSession) {
          Accounts.logoutOtherClients();
          log.info(`Sign In - logout othere clients -DONE`);
          SessionMethods.purgeAllOtherSessions.call({ sessionToken: sessionToken }, (err, res) => {
            if (err) {
              Library.modalErrorAlert(err.reason);
              console.log(`purgeAllOtherSessions error`, err);
            }
          });
        }
      }
    );
  }

  SignInUser() {
    this.setState({ allowSubmit: false });

    Meteor.loginWithPassword(this.state.email, this.state.password, error => {
      this.setState({ allowSubmit: true });
      if (error) {
        return Library.modalErrorAlert({ message: error.reason, title: "Sign In Failed" });
      } else {
        log.info(`Sign In - SUCCESS!`);
      }
      this.createSession();
    });
  }

  render() {
    return (
      <Transition>
        <div className="container page-content">{this.getLayout()}</div>
      </Transition>
    );
  }
}

export default withTracker(() => {
  return {};
})(SignIn);
