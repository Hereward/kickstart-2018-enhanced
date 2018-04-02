import * as React from "react";
import * as ReactDOM from "react-dom";
import { Meteor } from "meteor/meteor";
import { Session } from "meteor/session";
import * as jquery from "jquery";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import App from "../../components/layouts/App/App";
import { addMeta } from "./meta";
import * as Library from "../../modules/library";
import * as AuthMethods from "../../api/auth/methods";
import * as ContentManagement from "../../modules/contentManagement";
import { keepAliveUserSession } from "../../api/sessions/methods";

class Launch extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <MuiThemeProvider>
        <App />
      </MuiThemeProvider>
    );
  }
}

Meteor.startup(() => {
  ReactDOM.render(<Launch />, document.getElementById("react-root"));
  addMeta();

  let timeOutOn = Meteor.settings.public.session.timeOutOn === false ? false : true;
  if (timeOutOn === true) {
    let heartbeatInterval = Meteor.settings.public.session.heartbeatInterval || 300000;
    let inactivityTimeout = Meteor.settings.public.session.inactivityTimeout || 3600000;
    let activityDetected = false;

    let activityEvents = "mousemove click keydown";
    Meteor.setInterval(function keepAlive() {
      if (Meteor.userId()) {
        keepAliveUserSession.call({ id: Meteor.userId(), activityDetected: activityDetected }, (err, res) => {
          if (err) {
            console.log(`keepAliveUserSession client error`, err.reason);
          }
        });
        activityDetected = false;
      }
    }, heartbeatInterval);

    jquery(document).on(activityEvents, function monitorActivity() {
      activityDetected = true;
    });
  }
});
