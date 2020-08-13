import React, { Component } from "react";
import { Link } from "react-router-dom";
import { LinearProgress, Typography } from "@material-ui/core";
import Dot from "@material-ui/icons/FiberManualRecord";

class DataDisplay extends Component {
  constructor(props) {
    super(props);
  }

  renderItem(d) {
    if (!this.props.filters) return;
    var show = true;
    var filterCount = 0;
    var colors = new Set();
    var color = "#ffffff";

    const models = Object.keys(this.props.filters);
    for (var i = 0; i < models.length; i++) {
      const filters = Object.keys(this.props.filters[models[i]]);
      for (var j = 0; j < filters.length; j++) {
        let pass = false;
        const f = this.props.filters[models[i]][filters[j]];
        const col = f.highlight;

        if (models[i] !== "experience") {
          const val =
            models[i] === "damaging" ? d.confidence_damage : d.confidence_faith;
          const min = f.thresholds.min;
          const max = f.thresholds.max;
          pass = !(val < min || val > max);
        } else pass = f.comparison(d);

        if (f.checked) {
          filterCount++;
          show = show && pass;
        }

        if (pass && col) {
          color = col;
          colors.add(col);
        }
      }
    }

    if (show)
      return (
        <div className="editLine">
          <div className="dots">
            {Array.from(colors).map((c) => (
              <Dot style={{ fill: c, height: 10, width: 10 }} />
            ))}
          </div>

          <Typography
            variant="body1"
            component="li"
            style={{ backgroundColor: (color || "#ffffff") + "44" }}
          >
            (<Link to={"/d/" + d.rev_id}>diff</Link>) -{" "}
            <strong>{d.title}</strong>
            <em> by {d.username} </em>{" "}
            <strong style={{ color: d.size >= 0 ? "green" : "red" }}>
              ({d.size.toLocaleString("en-US", { signDisplay: "always" })})
            </strong>{" "}
            <span dangerouslySetInnerHTML={{ __html: d.comment }} />
          </Typography>
        </div>
      );
    else return <li style={{ display: "none" }} />;
  }

  render() {
    return (
      <div className="box">
        {this.props.data ? (
          this.props.data.map((obj) => this.renderItem(obj))
        ) : (
          <LinearProgress />
        )}
      </div>
    );
  }
}

export default DataDisplay;
