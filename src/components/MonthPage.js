import React, { Component } from "react";
import data from "../config/data";

class MonthPage extends Component {
  render() {
    const months = data.monthDisplay.map((month, i) => (
        (i===this.props.currentMonth-1) ? (
            <li key={i} data-key={i+1} className="selected" onClick={this.props.onHandleMonthClick}>
                {month}
            </li>
        ) : (
            <li key={i} data-key={i+1} onClick={this.props.onHandleMonthClick}>
                {month}
            </li>
        )
    ));
    return (
      <div className="monthPage">
        <ul className="months">{months}</ul>
      </div>
    );
  }
}

export default MonthPage;
