import React, { Component } from "react";
import * as d3 from "d3";
import axios from "axios";
import "./App.css";
import "./App.scss";
import data_sheet from "./data/data-moreinfo.csv";
import Diff from "./components/diff";
import DataDisplay from "./components/dataDisplay";
import { ThemeProvider } from "@material-ui/styles";
import Dot from "@material-ui/icons/FiberManualRecord";
import Highlight from "@material-ui/icons/Colorize";

import {
  makeStyles,
  Typography,
  FormLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  LinearProgress,
  createMuiTheme,
  responsiveFontSizes,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";

import {
  BrowserRouter,
  HashRouter,
  Route,
  Link,
  Switch,
} from "react-router-dom";

let theme = createMuiTheme({
  typography: {
    root: {
      component: "div",
    },
    fontFamily: "Noto Sans KR",
    subtitle1: {
      fontFamily: "Noto Serif",
      fontSize: "24px",
    },
    subtitle2: {
      fontSize: "12px",
      marginBottom: "10px",
      color: "#C57619",
      fontWeight: "bold",
      textTransform: "uppercase",
      textAlign: "left",
    },
    h6: {
      fontWeight: "bold",
      fontSize: "16px",
      textAlign: "left",
    },
    body1: {
      textAlign: "left",
      fontSize: 14,
    },
    body2: {
      textAlign: "left",
      fontSize: 12,
    },
    button: {
      fontStyle: "italic",
    },
    h5: {
      fontSize: "15px",
      color: "#3777a5",
      fontWeight: "bold",
      textTransform: "none",
      textAlign: "left",
    },
  },
});

theme = responsiveFontSizes(theme);

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    // fontFamily: 'Noto Sans, sans-serif',
  },
  paper: {
    textAlign: "left",
    padding: "20px 20px",
  },
  list: {
    fontSize: "16px",
    textDecoration: "none",
  },
  // necessary for content to be below app bar
  toolbar: {
    padding: theme.spacing(2),
  },
}));

class App extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      data: null,
      thresholdsFound: false,
      titles: {
        damaging: "Edit quality predictions (damaging)",
        goodfaith: "User intent predictions (good-faith)",
        experience: "User registration and experience",
      },
      filters: {
        damaging: {
          likelygood: {
            thresholds: { min: 0, max: "maximum recall @ precision >= 0.995" },
            checked: false,
            highlight: null,
            title: "Very likely good",
            description:
              "Highly accurate at finding almost all problem-free edits",
          },
          maybebad: {
            thresholds: { min: "maximum filter_rate @ recall >= 0.9", max: 1 },
            checked: false,
            highlight: null,
            title: "May have problems",
            description:
              "Finds most flawed or damaging edits, but with lower accuracy",
          },
          likelybad: {
            thresholds: { min: "maximum recall @ precision >= 0.6", max: 1 },
            checked: false,
            highlight: null,
            title: "Likely have problems",
            description:
              "With medium accuracy, finds and intermediate fraction of problem edits",
          },
          verylikelybad: {
            thresholds: { min: "maximum recall @ precision >= 0.9", max: 1 },
            checked: false,
            highlight: null,
            title: "Very likely have problems",
            description:
              "Very accurate at finding the most obviously flawed or damaging edits",
          },
        },
        goodfaith: {
          likelygood: {
            thresholds: { min: "maximum recall @ precision >= 0.995", max: 1 },
            checked: false,
            highlight: null,
            title: "Very likely good faith",
            description:
              "Highly accurate at finding almost all good-faith edits",
          },
          maybebad: {
            thresholds: { min: 0, max: "maximum filter_rate @ recall >= 0.9" },
            checked: false,
            highlight: null,
            title: "May be bad faith",
            description: "Finds most bad-faith edits but with a lower accuracy",
          },
          likelybad: {
            thresholds: { min: 0, max: "maximum recall @ precision >= 0.6" },
            checked: false,
            highlight: null,
            title: "Likely bad faith",
            description:
              "With medium accuracy, finds an intermediate fraction of bad-faith edits",
          },
          verylikelybad: {
            thresholds: { min: 0, max: 0 },
            checked: false,
            highlight: null,
            title: "Very likely bad faith",
            description:
              "Very accurate at finding the most obvious bad-faith edits",
          },
        },
        experience: {
          anonymous: {
            comparison: (d) => d.anonymous,
            checked: false,
            highlight: null,
            title: "Anonymous",
            description: "Editors who aren't logged in",
          },
          loggedIn: {
            comparison: (d) => !d.anonymous,
            checked: false,
            highlight: null,
            title: "Registered",
            description: "Logged-in editors",
          },
          newcomers: {
            comparison: (d) => d.newcomer,
            checked: false,
            highlight: null,
            title: "Newcomers",
            description: "Editors with less than 8 years of experience",
          },
          experienced: {
            comparison: (d) => !d.newcomer,
            checked: false,
            highlight: null,
            title: "Experienced users",
            description: "Editors with more than 8 years of experience",
          },
        },
      },
    };
  }

  getFilterThresholds() {
    var filters = this.state.filters;
    for (const model in filters) {
      for (const filter in filters[model]) {
        for (const bound in filters[model][filter].thresholds) {
          if (typeof filters[model][filter].thresholds[bound] === "string")
            axios
              .get(
                "https://ores.wikimedia.org/v3/scores/enwiki/?models=" +
                  model +
                  '&model_info=statistics.thresholds.true."' +
                  filters[model][filter].thresholds[bound] +
                  '"'
              )
              .then((res) => {
                filters[model][filter].thresholds[bound] = parseFloat(
                  res.data.enwiki.models[
                    model
                  ].statistics.thresholds.true[0].threshold.toFixed(3)
                );
              });
        }
      }
    }
    this.setState({ filters: filters, thresholdsFound: true });
  }

  componentDidMount() {
    this.getFilterThresholds();
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
      };
    }).then((data) => this.setState({ data: data }));
  }

  toggle(model, range) {
    var filters = this.state.filters;
    filters[model][range].checked = !filters[model][range].checked;
    this.setState({ filters: filters });
  }

  changeColor(model, range, event) {
    var filters = this.state.filters;
    filters[model][range].highlight = event.target.value;
    this.setState({ filters: filters });
  }

  render() {
    let data = this.state.data || [];
    let filters = this.state.filters || {};
    return (
      <BrowserRouter basename={process.env.PUBLIC_URL + "/"}>
        <ThemeProvider theme={theme}>
          <div className="App">
            <div
              className="box"
              style={{ marginTop: "-2em", borderTop: "none" }}
            >
              <Link to="/">
                <Typography variant="subtitle1">Recent Changes</Typography>
              </Link>
            </div>

            <Switch>
              {data && data !== undefined && (
                <Route
                  path="/d/:id"
                  render={({ match }) => (
                    <Diff
                      revision={data.find(
                        (e) => e.rev_id === parseInt(match.params.id)
                      )}
                    />
                  )}
                />
              )}

              <Route path="/">
                {this.state.thresholdsFound ? (
                  <FormControl className="filter">
                    {Object.keys(filters).map((model) => (
                      <div className="modelGroup box">
                        <FormLabel>
                          <Typography variant="subtitle2">
                            {this.state.titles[model]}
                          </Typography>
                        </FormLabel>
                        <FormGroup>
                          {Object.keys(filters[model]).map((range) => (
                            <div className="filterItem">
                              <FormControlLabel
                                className="filterBox"
                                control={
                                  <Checkbox
                                    onClick={() => this.toggle(model, range)}
                                    value={filters[model][range].checked}
                                  />
                                }
                                label={
                                  <div>
                                    <Typography variant="h6">
                                      {filters[model][range].title}
                                    </Typography>
                                    <Typography variant="body2">
                                      {filters[model][range].description}
                                    </Typography>
                                  </div>
                                }
                              />
                              <Select
                                className="highlightBox"
                                value={filters[model][range].highlight}
                                onChange={(event) =>
                                  this.changeColor(model, range, event)
                                }
                                displayEmpty="true"
                                renderValue={(value) => {
                                  if (value)
                                    return <Dot style={{ fill: value }} />;
                                  else return <Highlight />;
                                }}
                              >
                                {[
                                  null,
                                  "#495cd0",
                                  "#43b286",
                                  "#f6d00e",
                                  "#f06d1f",
                                  "#ce2d37",
                                ].map((color) => (
                                  <MenuItem value={color}>
                                    <Dot style={{ fill: color || "#fff" }} />
                                  </MenuItem>
                                ))}
                              </Select>
                            </div>
                          ))}
                        </FormGroup>
                      </div>
                    ))}
                  </FormControl>
                ) : (
                  <LinearProgress />
                )}
                <DataDisplay data={data} filters={filters} />
              </Route>
            </Switch>
          </div>
        </ThemeProvider>
      </BrowserRouter>
    );
  }
}

export default App;
