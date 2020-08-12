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
        const val =
          models[i] === "damaging" ? d.confidence_damage : d.confidence_faith;
        const min = this.props.filters[models[i]][filters[j]].thresholds.min;
        const max = this.props.filters[models[i]][filters[j]].thresholds.max;
        const col = this.props.filters[models[i]][filters[j]].highlight;

        if (this.props.filters[models[i]][filters[j]].checked) {
          filterCount++;
          show = show || !(val < min || val > max);
        }

        if (!(val < min || val > max) && col !== "#ffffff") {
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
            {d.timestamp.toLocaleTimeString()} ({d.size}) . . {d.username} . .{" "}
            <em dangerouslySetInnerHTML={{ __html: d.comment }} />
          </li>
        </div>
      );
    else return <li style={{ display: "none" }} />;
  }

  render() {
    return (
      <ul style={{ paddingInlineStart: 0 }}>
        {this.props.data ? (
          this.props.data.map((obj) => this.renderItem(obj))
        ) : (
          <LinearProgress />
        )}
      </ul>
    );
  }
}

export default DataDisplay;
