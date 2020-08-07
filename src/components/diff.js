import React, { Component } from "react";
import "../App.css";
import "../App.scss";
import { LinearProgress } from "@material-ui/core";

class Diff extends Component {
  constructor(props) {
    super(props);
  }

  ValidateIPaddress(ipaddress) {
    return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
      ipaddress
    );
  }

  render() {
    const d = this.props.revision;
    const h =
      "<tr class='header'><td class='before' colspan='2'>Before</td><td class='after' colspan='2'>After</td></tr>";
    if (d === undefined) return <LinearProgress />;
    return (
      <div class="tooltip">
        <strong>Revision ID: </strong>
        <a
          href={
            "https://en.wikipedia.org/w/index.php?title=&diff=prev&oldid=" +
            d.rev_id
          }
          target="_blank"
        >
          {d.rev_id}
        </a>
        <div class="row">
          <div>
            <strong>Article Title: </strong>
            {d.title}
          </div>
        </div>
        <h5>
          Edited by{" "}
          {this.ValidateIPaddress(d.username) ? "Anonymous" : d.username} at{" "}
          {d.timestamp.toLocaleTimeString()} on{" "}
          {d.timestamp.toLocaleDateString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </h5>
        {d.comment !== "" && (
          <div>
            <strong>Comment from Editor:</strong>
            <p dangerouslySetInnerHTML={{ __html: d.comment }} />
          </div>
        )}
        <table dangerouslySetInnerHTML={{ __html: h + d.diff }} />
      </div>
    );
  }
}

export default Diff;
