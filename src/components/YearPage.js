import React, { Component } from "react";

class YearPage extends Component {
  render(props) {
    const years = this.props.years;
    let allYears = years.map((year, i) => (
        (this.props.currentYear === parseInt(year,10)) ? (
            <li key={i + 1} className="selected" onClick={this.props.onHandleYearClick}>
            {year}
            </li> 
        ) : (
            <li key={i + 1} onClick={this.props.onHandleYearClick}>
                {year}
            </li>
        )
    ));
    allYears = [
      <li className="grey">{parseInt(years[0],10) - 1}</li>,
      ...allYears,
      <li className="grey">{parseInt(years[years.length - 1], 10) + 1}</li>
    ];
    return (
      <div className="yearPage">
        <ul className="years">{allYears}</ul>
      </div>
    );
  }
}

export default YearPage;
