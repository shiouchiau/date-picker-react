import React, { Component } from "react";
import data from "../config/data";
import DatePage from "./DatePage";
import MonthPage from "./MonthPage";
import YearPage from "./YearPage";

class Calendar extends Component {
  constructor() {
    super();
    const initialDate = new Date();
    this.state = {
      date: initialDate.getDate(),
      month: initialDate.getMonth(),
      year: initialDate.getFullYear(),
      // for component date.js
      dayTitle: [],
      dates: [],
      years: [],
      // for page switching between months and years
      currentPage: "dates",
      buttonContext: ""
    };
    this.handleYearClick = this.handleYearClick.bind(this);
    this.handleMonthClick = this.handleMonthClick.bind(this);
  }

  componentDidMount() {
    this.renderDates(this.state.year, this.state.month + 1);
  }

  isLeapYear(year) {
    return (0 === year % 4 && 0 !== year % 100) || 0 === year % 400
      ? true
      : false;
  }

  getDaysOfMonth(year, month) {
    let daysOfMonth = data.daysInMonth[month-1];
    if (2 === month && this.isLeapYear(year)) {
      daysOfMonth++;
    }
    return daysOfMonth;
  }

  getFirstDayOfMonth(year, month) {
    const _d = this.getDaysOfMonth(year, month);
    const _m = (month-1 + 9) % 12 + 1;
    const _y = parseInt(year.toString().slice(0, 2), 10);
    const _c = parseInt(year.toString().slice(2), 10);
    
    return (_d + Math.ceil(2.6 * _m - 0.2) + _y + _y % 4 + _c % 4 - 2 * _c) % 7;
  }

  getDays(year, month) {
    const days = [];
    const firstDaysOfMonth = this.getFirstDayOfMonth(year, month);
    const daysOfMonth = data.daysInMonth[month-1];
    const daysLastMonth = (month===1) ? '31' : this.getDaysOfMonth(year, month - 1);
    console.log(month);
    console.log(daysLastMonth);

    // days from previous month
    return days
      .concat(
        Array.from(
          { length: firstDaysOfMonth },
          (value, i) => i + daysLastMonth - firstDaysOfMonth + 1
        )
      )
      .concat(Array.from({ length: daysOfMonth }, (value, i) => i + 1))
      .concat(
        Array.from(
          { length: 42 - firstDaysOfMonth - daysOfMonth },
          (value, i) => i + 1
        )
      );
  }

  onSelect(e) {
    const selected = e.target;
    const lastSelected = document.querySelector(".dates .selected");

    if (lastSelected) lastSelected.classList.remove("selected");
    selected.classList.toggle("selected");
  }

  renderDates(year, month) {
    const dayTitle = data.weekDisplay.map(title => <li>{title}</li>);
    let isThisMonth = false;
    let dates = this.getDays(year, month).map(date => {
      if (1 === date) isThisMonth = !isThisMonth;
      return isThisMonth ? (
        (this.state.date === parseInt(date,10)) ? (
            <li key={date} className="selected" onClick={this.onSelect.bind(this)}>
                {date}
             </li>
        ) : (
            <li key={date} onClick={this.onSelect.bind(this)}>
                {date}
            </li>
        )
      ) : (
        <li className="grey">{date}</li>
      );
    });

    this.setState({
      dayTitle,
      dates,
      buttonContext: data.monthDisplay[this.state.month] + " " + this.state.year
    });
  }

  renderYears(_year) {
    console.log(_year);
    const _yearPrefix = _year.toString().slice(0, 3);
    const _years = [].concat(
      Array.from({ length: 10 }, (value, i) => _yearPrefix + i)
    );
    this.setState({
      year: _year,
      buttonContext: `${_years[0]}-${_years[_years.length - 1]}`,
      currentPage: "years",
      years: _years
    });
  }

  onClickButton() {
    switch (this.state.currentPage) {
      case "dates":
        this.setState({
          buttonContext: this.state.year,
          currentPage: "months"
        });
        return;
      case "months":
        this.renderYears(this.state.year);
        return;
      default:
        return;
    }
  }

  renderContent() {
    switch (this.state.currentPage) {
      case "dates":
        return (
          <DatePage dayTitle={this.state.dayTitle} dates={this.state.dates} />
        );
      case "months":
        return <MonthPage currentMonth={this.state.month+1} onHandleMonthClick={this.handleMonthClick} />;
      default:
        return (
          <YearPage
            currentYear={this.state.year}
            years={this.state.years}
            currentPage={this.state.currentPage}
            onHandleYearClick={this.handleYearClick}
          />
        );
    }
  }

  handleYearClick(e) {
    const selectedYear = e.target;
    const lastSelected = document.querySelector(".years .selected");

    if (lastSelected) lastSelected.classList.remove("selected");
    selectedYear.classList.toggle("selected");

    this.setState({
        year: parseInt(selectedYear.innerHTML,10),
        currentPage: "months",
        buttonContext: selectedYear.innerHTML
    });
  }

  handleMonthClick(e) {
    const selectedMonth = e.target;
    const lastSelected = document.querySelector(".months .selected");

    if (lastSelected) lastSelected.classList.remove("selected");
    selectedMonth.classList.toggle("selected");

    this.setState({
        month: selectedMonth.dataset.key-1,
        currentPage: "dates",
        buttonContext: selectedMonth.innerHTML+" "+this.state.year
    }, () => this.renderDates(this.state.year, parseInt(selectedMonth.dataset.key, 10)));
  }

  onLastPage = () => {
    switch(this.state.currentPage) {
        case "dates":
            const _month = (this.state.month+1===1) ? 12 : this.state.month+1-1;
            const _year = (this.state.month+1===1) ? this.state.year-1 : this.state.year;
            this.setState({
                year: _year,
                month: _month-1,
                buttonContext: data.monthDisplay[_month-1]+" "+_year
            }, () => this.renderDates(_year, _month));
            return;
        case "months":
            if (this.state.year === 1600) return;
            this.setState({
                year: this.state.year-1,
                buttonContext: this.state.year-1
            });
            return;
        default:
            if (this.state.year <= 1609 && this.state.year >= 1600) return;
            this.renderYears(this.state.year-10);
            return;
    }
    
  }

  onNextPage = () => {
    switch(this.state.currentPage) {
        case "dates":
            const _year = (this.state.month+1===12) ? this.state.year+1 : this.state.year;
            const _month = (this.state.month+1===12) ? 1 : this.state.month+1+1;
            this.setState({
                year: _year,
                month: _month-1,
                buttonContext: data.monthDisplay[_month-1]+" "+_year
            }, () => this.renderDates(_year, _month));
            return;
        case "months":
            if (this.state.year === 2100) return;
            this.setState({
                year: this.state.year+1,
                buttonContext: this.state.year+1
            });
            return;
        default:
            if (this.state.year <= 2109 && this.state.year >= 2100) return;
            this.renderYears(this.state.year+10);
            return;
    }
  }

  render() {
    return (
      <div className="calendar">
        <div className="navBar">
          <span className="lastPage" onClick={this.onLastPage}>{"<"}</span>
          <div className="switchButton" onClick={this.onClickButton.bind(this)}>
            {this.state.buttonContext}
          </div>
          <span className="lastPage" onClick={this.onNextPage}>{">"}</span>
        </div>
        <div className="content">{this.renderContent()}</div>
      </div>
    );
  }
}

export default Calendar;
