import React, { Component } from "react";
import axios from "axios";
import { LinearProgress, Typography } from "@material-ui/core";

class Contribs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      data: null,
    };
  }

  componentDidMount() {
    const cors = "https://cors-anywhere.herokuapp.com/";
    const api = "https://en.wikipedia.org/w/api.php";
    if (!this.props.revision || this.props.revision === undefined) return;
    axios
      .get(
        cors +
          api +
          "?action=query&list=usercontribs&ucuser=" +
          this.props.revision.username +
          "&ucstart=" +
          this.props.revision.timestamp.toISOString() +
          "&uclimit=500&format=json&ucprop=sizediff|title|timestamp|parsedcomment|ids"
      )
      .then((res) => {
        const arr = res.data.query.usercontribs;
        this.setState({ data: arr, loaded: true });
      });
  }

  render() {
    return (
      <div class="box">
        <Typography variant="h6" style={{ marginBottom: 20 }}>
          Contributions made by{" "}
          {this.props.revision ? this.props.revision.username : "user"}
        </Typography>
        {this.state.data ? (
          this.state.data.map((d) => (
            <Typography
              variant="body1"
              component="div"
              style={{ display: "flex", flexFlow: "row nowrap" }}
            >
              <div style={{ width: 240, display: "flex", flexShrink: 0 }}>
                {new Date(d.timestamp).toLocaleTimeString()}
                {", "}
                {new Date(d.timestamp).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div
                style={{
                  color: d.sizediff >= 0 ? "#009933" : "#ff0000",
                  fontWeight: "bold",
                  width: 75,
                }}
              >
                (
                {d.sizediff.toLocaleString("en-US", {
                  signDisplay: "always",
                })}
                )
              </div>
              <div style={{ fontWeight: "bold", marginRight: 20 }}>
                {" "}
                {d.title}
              </div>
              <div
                style={{ fontStyle: "italic" }}
                dangerouslySetInnerHTML={{ __html: d.parsedcomment }}
              />
            </Typography>
          ))
        ) : (
          <LinearProgress />
        )}
      </div>
    );
  }
}

export default Contribs;
