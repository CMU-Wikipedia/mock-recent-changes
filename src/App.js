import React, { Component } from "react";
import "./App.css";
import "./App.scss";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import * as d3 from "d3";
import data_sheet from "./data/data-moreinfo.csv";
import LinearProgress from "@material-ui/core/LinearProgress";
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";
import Diff from "./components/diff";
import Filters from "./components/filters";
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
      activeFilters: new Set(),
      checkedFilters: {
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
      });
    });

    this.getFilterThresholds();
  }

  toggle(model, range) {
    var checks = this.state.checkedFilters;
    var data = this.state.all_data;
    console.log("toggle", checks, data);
    if (!data) return;

    checks[model][range] = !checks[model][range];
    this.setState({
      checkedFilters: checks,
      filtered: this.filterData(data, checks),
    });
  }

  passFilter(d, model, range) {
    const confidence =
      model === "damaging" ? d.confidence_damage : d.confidence_faith;
    return (
      this.state.thresholds[model][range].min <= confidence &&
      this.state.thresholds[model][range].max >= confidence
    );
  }

  filterData(data, checks) {
    var newData = [];
    data.forEach((d) => {
      var valid = true;
      Object.keys(checks).forEach((model) => {
        Object.keys(checks[model]).forEach((range) => {
          valid = valid && this.passFilter(d, model, range);
        });
      });
      if (valid) newData.push(d);
    });
    return newData;
  }

  render() {
    let data = this.state.filtered || [];
    let thresholds = this.state.thresholds || {};
    let checks = this.state.checkedFilters || {};
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
                <Filters checked={checks} />
                <pre>{JSON.stringify(thresholds, null, 2)}</pre>
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
