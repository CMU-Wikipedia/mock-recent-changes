import React, { Component } from "react";
import axios from "axios";
import { LinearProgress, Typography } from "@material-ui/core";

class Hist extends Component {
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
          "?action=query&titles=" +
          this.props.revision.title +
          "&prop=revisions&format=json&rvstart=" +
          this.props.revision.timestamp.toISOString() +
          "&rvprop=ids|timestamp|user|size|parsedcomment&rvlimit=500"
      )
      .then((res) => {
        const arr =
          res.data.query.pages[Object.keys(res.data.query.pages)[0]].revisions;
        this.setState({ data: arr, loaded: true });
      });
  }

  render() {
    return (
      <div className="box">
        <Typography variant="h6" style={{ marginBottom: 20 }}>
          Edit history of{" "}
          {this.props.revision ? this.props.revision.title : "user"}
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
              <div style={{ fontWeight: "bold", marginRight: 20 }}>
                {" "}
                {d.user}
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

export default Hist;
