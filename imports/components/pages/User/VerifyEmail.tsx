import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import { Accounts } from "meteor/accounts-base";
import * as PropTypes from "prop-types";
import ReactRouterPropTypes from "react-router-prop-types";
import * as React from "react";
import { withRouter } from "react-router-dom";

import Transition from "../../partials/Transition";
import * as Library from "../../../modules/library";
import * as User from "../../../modules/user";
import { Auth } from "../../../api/auth/publish";
import { purgeAllOtherSessions } from "../../../api/sessions/methods";

interface IProps {
  enhancedAuth: boolean;
  history: any;
  sillyProp: string;
  signedIn: boolean;
  sessionToken: string;
  userData: any;
}

interface IState {}

class VerifyEmail extends React.Component<IProps, IState> {
  token: string;
  done: boolean;

  constructor(props) {
    super(props);
    this.checkToken = this.checkToken.bind(this);
    let url = window.location.href;
    this.token = url.substr(url.lastIndexOf("/") + 1);
    this.done = false;
  }

  componentDidUpdate() {}

  componentWillReceiveProps(nextProps) {}

  componentWillMount() {}

  /*
  static propTypes = {
    history: ReactRouterPropTypes.history,
    sillyProp: PropTypes.string
  };
  */

  //
  checkToken() {
    let verified = Library.nested(["userData", "emails", 0, "verified"], this.props);
    //log.info(`verify email checkToken`, verified);
    if (!User.id() || verified === false && !this.done) {
      this.done = true;
      Accounts.verifyEmail(
        this.token,
        function verified(err) {
          if (!err) {
            let token = User.sessionToken('get');
            purgeAllOtherSessions.call({sessionToken: token}, (err, res) => {
              if (err) {
                Library.modalErrorAlert(err.reason);
                console.log(`purgeAllOtherSessions error`, err);
              }
            });
            Library.modalSuccessAlert({ message: "Your email address has been verified." });
          } else {
            Library.modalErrorAlert({
              detail: err.reason,
              title: `Email verification failed`
            });
            console.log(err);
            this.props.history.push("/");
          }
        }.bind(this)
      );
    }
  }

  getLayout() {
    return <div className="lead">Verifying....</div>;
  }

  render() {
    this.checkToken();
    return (
      <Transition>
        <div className="container page-content">{this.getLayout()}</div>
      </Transition>
    );
  }
}

export default withRouter(
  withTracker(({ params }) => {
    return {};
  })(VerifyEmail)
);
