import React, { Component } from "react";
import { Link } from "react-router-dom";
import { LinearProgress } from "@material-ui/core";
import Dot from "@material-ui/icons/FiberManualRecord";

class DataDisplay extends Component {
  constructor(props) {
    super(props);
  }

  renderItem(d) {
    if (!this.props.filters) return;
    var show = false;
    var filterCount = 0;
    var colors = [];
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
          show = show || pass;
        }

        if (pass && col !== "#ffffff") {
          color = col;
          colors.push(col);
        }
      }
    }

    if (filterCount === 0) show = true;

    if (show)
      return (
        <div className="editLine">
          <div className="dots">
            {colors.map((c) => (
              <Dot
                fontSize="small"
                style={{ fill: c, height: 10, width: 10 }}
              />
            ))}
          </div>

          <li style={{ backgroundColor: color + "44" }}>
            <strong>
              {d.confidence_damage.toFixed(3)} / {d.confidence_faith.toFixed(3)}
            </strong>{" "}
            <Link to={"/d/" + d.rev_id}>Diff</Link> - <strong>{d.title}</strong>{" "}
            {d.timestamp.toLocaleTimeString()}{" "}
            <strong style={{ color: d.size ? "green" : "" }}>({d.size})</strong>{" "}
            . . {d.username} . .{" "}
            <em dangerouslySetInnerHTML={{ __html: d.comment }} />
          </li>
        </div>
      );
    else return <li style={{ display: "none" }} />;
  }

  render() {
    return (
      <div style={{ paddingTop: 20 }}>
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
