import React, { Component } from "react";
import "../App.css";
import "../App.scss";
import { LinearProgress, Button } from "@material-ui/core";

class Diff extends Component {
  constructor(props) {
    super(props);
    this.onRevert = this.onRevert.bind(this);
    this.state = {
      revRow: null,
    };
  }

  ValidateIPaddress(ipaddress) {
    return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
      ipaddress
    );
  }

  async onRevert() {
    console.log("Reverting");
    const sheet = this.props.doc.sheetsByIndex[0];
    const d = this.props.revision;
    const date = new Date();
    const row = await sheet.addRow({
      id: d.rev_id,
      date: date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
      }),
      damagingLabel: d.label_damage ? "TRUE" : "FALSE",
      damagingScore: d.confidence_damage,
      goodfaithLabel: d.label_faith ? "TRUE" : "FALSE",
      goodfaithScore: d.confidence_faith,
    });
    await row.save({ raw: true });
    this.props.revision.reverted = true;
    this.setState({ revRow: row });
  }

  async undoRevert() {
    this.props.revision.reverted = false;
    await this.state.revRow.delete();
    this.setState({ revRow: null });
  }

  render() {
    const d = this.props.revision;
    const h =
      "<tr class='header'><td class='before' colspan='2'>Before</td><td class='after' colspan='2'>After</td></tr>";
    if (d === undefined) return <LinearProgress />;
    return (
      <div className="diff">
        <div className="box">
          <strong>Revision ID: </strong>
          <a
            href={
              "https://en.wikipedia.org/w/index.php?title=&diff=prev&oldid=" +
              d.rev_id
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            {d.rev_id}
          </a>
          <div className="row">
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
            <div style={{ marginBottom: 0 }}>
              <strong>Comment from Editor:</strong>
              <p dangerouslySetInnerHTML={{ __html: d.comment }} />
            </div>
          )}
          {d.reverted ? (
            <Button onClick={() => this.undoRevert()}>Undo Revert</Button>
          ) : (
            <Button onClick={() => this.onRevert()}>Revert</Button>
          )}
        </div>

        <table
          className="box"
          dangerouslySetInnerHTML={{ __html: h + d.diff }}
        />
      </div>
    );
  }
}

export default Diff;
