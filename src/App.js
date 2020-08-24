import React, { Component } from "react";
import * as d3 from "d3";
import "./App.css";
import "./App.scss";
import data_sheet from "./data/data-moreinfo.csv";
import Main from "./content";
import { LinearProgress } from "@material-ui/core";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { GoogleSpreadsheet, GoogleSpreadsheetRow } from "google-spreadsheet";
import * as creds from "./data/mrc-service-acct-key.json";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      reverts: null,
    };
  }

  async loadGSheet() {
    const doc = new GoogleSpreadsheet(
      "1JPCU9fSQMh6s6TO-nSLnUzR2w9H-dwFBs5pXlFtOF4M"
    );
    await doc.useServiceAccountAuth(
      require("./data/mrc-service-acct-key.json")
    );
    await doc.loadInfo();
    console.log("Loaded " + doc.title);
    this.setState({ reverts: doc });
  }

  componentDidMount() {
    this.loadGSheet();
    d3.csv(data_sheet, (d) => {
      return {
        confidence_faith: +d.confidence_faith,
        faith_label: d.goodfaith === "TRUE" ? true : false,
        confidence_damage: +d.confidence_damage,
        damaging_label: d.damaging === "TRUE" ? true : false,
        rev_id: +d.rev_id,
        anonymous: d.anonymous === "TRUE" ? true : false,
        newcomer: d.edit_years <= 8.0 ? true : false,
        username: d.username,
        title: d.title,
        timestamp: new Date(d.timestamp),
        size: +d.size,
        comment: d.parsed_comment,
        diff: d.diff,
        reverted: false,
      };
    }).then((data) => this.setState({ data: data.slice(0, 2000) }));
  }

  getContent(variant = "") {
    return (
      <Main
        data={this.state.data}
        reverts={this.state.reverts}
        variant={variant}
      />
    );
  }

  render() {
    return (
      <Switch>
        <Route path={"/noflags"} render={() => this.getContent("noflags")} />
        <Route path={"/nocheck"} render={() => this.getContent("nocheck")} />
        <Route render={() => this.getContent("main")} />
      </Switch>
    );
  }
}

export default App;
