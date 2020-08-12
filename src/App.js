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

const drawerWidth = 270;

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
      marginTop: "10px",
      color: "#B0B0B0",
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
      // textAlign: 'left',
      fontSize: "14px",
    },
    body2: {
      textAlign: "left",
      fontSize: "14px",
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
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    textAlign: "center",
    position: "relative",
  },
  drawerPaper: {
    width: drawerWidth,
    paddingTop: "35px",
    paddingBottom: "35px",
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
  content: {
    width: `calc(100% - ${drawerWidth}px)`,
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: "1.5vh",
    height: "100vh",
  },
}));

class App extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      data: null,
      thresholdsFound: false,
      filters: {
        damaging: {
          likelygood: {
            thresholds: { min: 0, max: "maximum recall @ precision >= 0.995" },
            checked: false,
            highlight: "#ffffff",
          },
          maybebad: {
            thresholds: { min: "maximum filter_rate @ recall >= 0.9", max: 1 },
            checked: false,
            highlight: "#ffffff",
          },
          likelybad: {
            thresholds: { min: "maximum recall @ precision >= 0.6", max: 1 },
            checked: false,
            highlight: "#ffffff",
          },
          verylikelybad: {
            thresholds: { min: "maximum recall @ precision >= 0.9", max: 1 },
            checked: false,
            highlight: "#ffffff",
          },
        },
        goodfaith: {
          likelygood: {
            thresholds: { min: "maximum recall @ precision >= 0.995", max: 1 },
            checked: false,
            highlight: "#ffffff",
          },
          maybebad: {
            thresholds: { min: 0, max: "maximum filter_rate @ recall >= 0.9" },
            checked: false,
            highlight: "#ffffff",
          },
          likelybad: {
            thresholds: { min: 0, max: "maximum recall @ precision >= 0.6" },
            checked: false,
            highlight: "#ffffff",
          },
          verylikelybad: {
            thresholds: { min: 0, max: 0 },
            checked: false,
            highlight: "#ffffff",
          },
        },
        experience: {
          anonymous: {
            comparison: (d) => d.anonymous,
            checked: false,
            highlight: "#ffffff",
          },
          loggedIn: {
            comparison: (d) => !d.anonymous,
            checked: false,
            highlight: "#ffffff",
          },
          newcomers: {
            comparison: (d) => d.newcomer,
            checked: false,
            highlight: "#ffffff",
          },
          experienced: {
            comparison: (d) => !d.newcomer,
            checked: false,
            highlight: "#ffffff",
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
    }).then((data) => {
      this.setState({
        data: data,
        checked: {
          damaging: {
            likelygood: false,
            maybebad: false,
            likelybad: false,
            verylikelybad: false,
          },
          goodfaith: {
            likelygood: false,
            maybebad: false,
            likelybad: false,
          },
        },
      });
    });
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
            <Link to="/">
              <Typography variant="subtitle1">Recent Changes</Typography>
            </Link>

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
                  <FormControl style={{ flexDirection: "row" }}>
                    {Object.keys(filters).map((model) => (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          width: 240,
                        }}
                      >
                        <FormLabel>{model}</FormLabel>
                        <FormGroup>
                          {Object.keys(filters[model]).map((range) => (
                            <div>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    onClick={() => this.toggle(model, range)}
                                  />
                                }
                                label={range}
                                style={{ width: 130 }}
                              />
                              <FormControl>
                                <Select
                                  value={filters[model][range].highlight}
                                  onChange={(event) =>
                                    this.changeColor(model, range, event)
                                  }
                                  style={{
                                    backgroundColor: "#f8f8f8",
                                    width: 50,
                                    alignItems: "center",
                                  }}
                                >
                                  {[
                                    "#ffffff",
                                    "#495cd0",
                                    "#43b286",
                                    "#f6d00e",
                                    "#f06d1f",
                                    "#ce2d37",
                                  ].map((color) => (
                                    <MenuItem value={color}>
                                      <Dot style={{ fill: color }} />
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
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
