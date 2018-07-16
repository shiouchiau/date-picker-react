import React from "react";

const DatePage = props => {
  return (
    <div>
      <ul className="dayTitle">{props.dayTitle}</ul>
      <ul className="dates">{props.dates}</ul>
    </div>
  );
};

export default DatePage;
