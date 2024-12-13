import React, { useState } from "react";
import Calendar from "react-calendar";

const Calendar = () => {
  const [date, setDate] = React.useState(new Date());

  const onChange = (date) => {
    setDate(date);

    onDateSelected(date);
  };
  return (
    <div>
      <Calendar onChange={onChange} value={date} />
    </div>
  );
};

export default Calendar;
