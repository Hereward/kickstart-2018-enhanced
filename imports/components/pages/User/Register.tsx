import { Meteor } from "meteor/meteor";
//import { Session } from 'meteor/session';
import * as React from "react";
import * as PropTypes from 'prop-types';
import { Accounts } from "meteor/accounts-base";
import ReactRouterPropTypes from "react-router-prop-types";
import { withRouter } from "react-router-dom";
import { withTracker } from "meteor/react-meteor-data";
import QRCode from "react-qr-code";
import { Alert } from "reactstrap";
import Transition from "../../partials/Transition";
import RegistrationForm from "../../forms/RegistrationForm";
//import { createProfile } from "../../../api/profiles/methods";
import * as ProfileMethods from "../../../api/profiles/methods";
import * as AuthMethods from "../../../api/auth/methods";
import * as Library from "../../../modules/library";

import SignInForm from "../../forms/SignInForm";

interface IProps {
  history: any;
  AuthVerified: boolean;
  enhancedAuth: boolean;
  signedIn: boolean;
}

interface IState {
  email: string;
  password1: string;
  password2: string;
}


class Register extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password1: "",
      password2: ""
    };
    this.registerUser = this.registerUser.bind(this);
    this.handleChange = this.handleChange.bind(this);

    let objData = JSON.stringify(this.props);
    console.log(`Register: objData: [${objData}]`);
  }

  static propTypes = {
    enhancedAuth: PropTypes.bool,
    history: ReactRouterPropTypes.history,
  };

  componentDidUpdate() {}

  sendVerificationEmail(id) {

    let authFields = {
      id: id
    };

    ProfileMethods.sendVerificationEmail.call(authFields, (err, res) => {
      console.log("sendVerificationEmail.call", authFields);
      if (err) {
        Library.modalErrorAlert(err.reason);
        console.log(`sendVerificationEmail error`, err);
      } else {
        console.log(`sendVerificationEmail success`);
      }
    });

    /*
    Meteor.call("user.sendVerificationEmail", (error, response) => {
      if (error) {
        console.warn(error);
        swal({
          title: "Verification email not sent.",
          text: "There was a problem sending the verification email.",
          showConfirmButton: true,
          type: "error"
        });
      }
      console.log(`sendVerificationEmail: done. response =[${response}]`);
    });
    */
  }

  handleChange(e) {
    let target = e.target;
    let value = target.type === "checkbox" ? target.checked : target.value;
    let id = target.id;

    this.setState({ [id]: value });
  }

  registerUserZ(event) {
    console.log(`FORM SUBMIT >> EMAIL =  ${this.state.email}`);
  }

  registerUser(event) {
    //event.preventDefault();
    //console.log(`FORM SUBMIT >> EMAIL =  ${this.state.email}`);

    let email = this.state.email.trim();
    let password1 = this.state.password1.trim();
    let password2 = this.state.password2.trim();

    let isValidPassword = function isValidPassword(password1, password2) {
      if (password1 === password2) {
        return password1.length >= 6 ? true : false;
      } else {
        return Library.modalErrorAlert("Passwords don't match");
      }
    };

    if (isValidPassword(password1, password2)) {
      Accounts.createUser(
        {
          email: email,
          password: password1
        },
        err => {
          if (err) {
            console.log(`Error: ${err.reason}`);
            return Library.modalErrorAlert(err.reason);
          } else {
            //console.log("createUser: done");

            //Session.set('showQRcode', true);

            let profileFields = {
              fname: "Adolf",
              initial: "K",
              lname: "Hitler"
            };

            ProfileMethods.createProfile.call(profileFields, (err, id) => {
              if (err) {
                Library.modalErrorAlert(err.reason);
              } else {
                //console.log(`profile successfully created`);
                this.sendVerificationEmail(id);
              }
            });

            let authFields = {
              owner: Meteor.userId()
            };

            AuthMethods.createAuth.call(authFields, (err, id) => {
              console.log("createAuth.call", authFields);
              if (err) {
                Library.modalErrorAlert(err.reason);
                console.log(`createAuth error: [${err.reason}]`);
              } else {
                console.log(`auth successfully created. res = [${id}]`);
               
              }
            });


            //console.log("Successfully created account!");
            //this.sendVerificationEmail(0);

            if (this.props.enhancedAuth) {
              //this.props.history.push("/");
              this.props.history.push("/authenticate");
            } else {
              this.props.history.push("/");
            }
          }
        }
      );
    } else {
      return swal({
        title: "Password must be at least 6 characters.",
        text: "Please try again",
        showConfirmButton: true,
        type: "error"
      });
    }
  }

  /*

  verificationNotice() {
    if (this.props.verificationEmailSent) {
      return (
        <div className="messages">
          <Alert color="success">
            A verification email has been sent. Please check your email and
            click on the verification link.
          </Alert>
        </div>
      );
    }
  }

  */


  getLayout() {
    let layout: any;
    let form = (
      <RegistrationForm
        handleChange={this.handleChange}
        handleSubmit={this.registerUser}
      />
    );

    layout = form;

    return <div>{layout}</div>;
  }

  render() {
    let layout = this.getLayout();

    return <Transition>{layout}</Transition>;
  }
}

export default withRouter(
  withTracker(({ params }) => {
    Meteor.subscribe("userData");
    return {};
  })(Register)
);
