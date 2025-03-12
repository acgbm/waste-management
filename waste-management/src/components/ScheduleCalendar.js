import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./ScheduleCalendar.css"; // Custom styles

const ScheduleCalendar = ({ schedules }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Function to find schedules for the selected date
  const getSchedulesForDate = (date) => {
    return schedules.filter(
      (schedule) => schedule.date === date.toISOString().split("T")[0]
    );
  };

  return (
    <div className="calendar-container">
      {/* Small Calendar */}
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        tileContent={({ date }) => {
          const scheduleForDay = getSchedulesForDate(date);
          return scheduleForDay.length > 0 ? (
            <div className="calendar-marker">📌</div>
          ) : null;
        }}
        className="small-calendar"
      />

      {/* Schedule List */}
      <div className="schedule-list">
        <h3>Schedules on {selectedDate.toDateString()}:</h3>
        <ul>
          {getSchedulesForDate(selectedDate).length > 0 ? (
            getSchedulesForDate(selectedDate).map((schedule, index) => (
              <li key={index}>
                <strong>{schedule.type}</strong> - {schedule.location}
              </li>
            ))
          ) : (
            <p>No scheduled collections.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ScheduleCalendar;
