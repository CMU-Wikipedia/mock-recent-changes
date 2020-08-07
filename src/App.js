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
    this.state = {
      data: null,
    };
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
      this.setState({ data: data });
    });
  }

  render() {
    let data = this.state.data || [];
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
                  path="/d/:revId"
                  render={({ match }) => (
                    <Diff
                      revision={data.find(
                        (e) => e.rev_id === parseInt(match.params.revId)
                      )}
                    />
                  )}
                />
              )}

              <Route path="/">
                <ul>
                  {this.state.data ? (
                    this.state.data.map((obj, index) => (
                      <li>
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
