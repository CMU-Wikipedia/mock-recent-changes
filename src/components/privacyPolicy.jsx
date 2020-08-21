import React, { Component } from "react";
import { Typography } from "@material-ui/core";

class PrivacyPolicy extends Component {
  render() {
    return (
      <div className="box">
        <Typography variant="h6">Privacy Policy</Typography>
        <Typography variant="body1" component="p">
          Mock Recent Changes's use of information received from Google APIs
          will adhere to Google API Services User Data Policy, including the
          Limited Use requirements.
        </Typography>
        <Typography variant="body1" component="p">
          When you 'revert' an edit, the ID of that revision, and the timestamp,
          will be sent to a Google Sheet for data collection in our research. No
          identifying information will be sent.
        </Typography>
      </div>
    );
  }
}

export default PrivacyPolicy;
