import React, { Component } from "react";
import "./App.css";
import "./App.scss";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import * as d3 from "d3";
import data_sheet from "./data/data-moreinfo.csv";
import LinearProgress from "@material-ui/core/LinearProgress";
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";
import Diff from "./components/diff";
import axios from "axios";
import { keys } from "d3";

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
      all_data: null,
      filtered: null,
      thresholds: {
        damaging: {
          likelygood: { min: 0, max: "maximum recall @ precision >= 0.995" },
          maybebad: { min: "maximum filter_rate @ recall >= 0.9", max: 1 },
          likelybad: { min: "maximum recall @ precision >= 0.6", max: 1 },
          verylikelybad: { min: "maximum recall @ precision >= 0.9", max: 1 },
        },
        goodfaith: {
          likelygood: { min: "maximum recall @ precision >= 0.995", max: 1 },
          maybebad: { min: 0, max: "maximum filter_rate @ recall >= 0.9" },
          likelybad: { min: 0, max: "maximum recall @ precision >= 0.6" },
        },
      },
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
    };
  }

  getFilterThresholds() {
    var thresholds = this.state.thresholds;
    for (const model in thresholds) {
      for (const filter in thresholds[model]) {
        for (const bound in thresholds[model][filter]) {
          if (typeof thresholds[model][filter][bound] === "string")
            axios
              .get(
                "https://ores.wikimedia.org/v3/scores/enwiki/?models=" +
                  model +
                  '&model_info=statistics.thresholds.true."' +
                  thresholds[model][filter][bound] +
                  '"'
              )
              .then((res) => {
                thresholds[model][filter][bound] = parseFloat(
                  res.data.enwiki.models[
                    model
                  ].statistics.thresholds.true[0].threshold.toFixed(3)
                );
              });
        }
      }
    }
    this.setState({ thresholds: thresholds });
  }

  componentDidMount() {
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
        all_data: data,
        filtered: data,
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

    this.getFilterThresholds();
  }

  toggle(model, range) {
    var checks = this.state.checked;
    checks[model][range] = !checks[model][range];
    this.state.checked = checks;
  }

  render() {
    let data = this.state.filtered || [];
    let thresholds = this.state.thresholds || {};
    let checks = this.state.checked || {};
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
                <FormControl style={{ flexDirection: "row" }}>
                  {Object.keys(checks).map((model) => (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <FormLabel>{model}</FormLabel>
                      <FormGroup style={{ flexDirection: "row" }}>
                        {Object.keys(checks[model]).map((range) => (
                          <FormControlLabel
                            control={
                              <Checkbox
                                // checked={checks[model][range]}
                                onClick={this.toggle(model, range)}
                              />
                            }
                            label={range}
                          />
                        ))}
                      </FormGroup>
                    </div>
                  ))}
                </FormControl>

                <pre>{JSON.stringify(checks, null, 2)}</pre>
                <ul>
                  {data ? (
                    data.map((obj, index) => (
                      <li>
                        <strong>
                          {obj.confidence_damage.toFixed(3)} /{" "}
                          {obj.confidence_faith.toFixed(3)}
                        </strong>
                        <Link to={"/d/" + obj.rev_id}>Diff</Link> -{" "}
                        <strong>{obj.title}</strong>{" "}
                        {obj.timestamp.toLocaleTimeString()} ({obj.size}) . .{" "}
                        {obj.username} . .{" "}
                        <em dangerouslySetInnerHTML={{ __html: obj.comment }} />
                      </li>
                    ))
                  ) : (
                    <LinearProgress />
                  )}
                </ul>
              </Route>
            </Switch>
          </div>
        </ThemeProvider>
      </BrowserRouter>
    );
  }
}

export default App;
