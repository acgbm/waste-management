import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./ScheduleCalendar.css"; // Custom styles

const ScheduleCalendar = ({ schedules }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Function to find schedules for the selected date
  const getSchedulesForDate = (date) => {
    const adjustedDate = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    ) // ✅ Fix timezone shift
      .toISOString()
      .split("T")[0];

    return schedules.filter((schedule) => schedule.date === adjustedDate);
  };

  return (
    <div className="calendar-container">
      {/* Small Calendar */}
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        tileContent={({ date }) => {
          const schedulesForDay = getSchedulesForDate(date);
          if (schedulesForDay.length > 0) {
            return (
              <div className="calendar-markers">
                {schedulesForDay.map((schedule, index) => (
                  <div 
                    key={index} 
                    className={`calendar-marker calendar-marker-${schedule.type}`}
                    title={`${schedule.type} collection`}
                  >
                    📌
                  </div>
                ))}
              </div>
            );
          }
          return null;
        }}
        className="small-calendar"
      />

      {/* Schedule List */}
      <div className="schedule-list">
        <h3>Schedules on {selectedDate.toDateString()}:</h3>
        <ul>
          {getSchedulesForDate(selectedDate).length > 0 ? (
            getSchedulesForDate(selectedDate).map((schedule, index) => (
              <li key={index} className={`schedule-item-${schedule.type}`}>
                <strong>{schedule.type}</strong> - {schedule.barangay}
                <div className="schedule-time">
                  {schedule.timeFormatted || schedule.time}
                </div>
              </li>
            ))
          ) : (
            <p>No scheduled collections.</p>
          )}
        </ul>
      </div>

      {/* Legend */}
      <div className="calendar-legend">
        <div className="legend-item">
          <div className="legend-marker calendar-marker-biodegradable">📌</div>
          <span>Biodegradable</span>
        </div>
        <div className="legend-item">
          <div className="legend-marker calendar-marker-non-biodegradable">📌</div>
          <span>Non-biodegradable</span>
        </div>
        <div className="legend-item">
          <div className="legend-marker calendar-marker-recyclable">📌</div>
          <span>Recyclable</span>
        </div>
      </div>
    </div>
  );
};

export default ScheduleCalendar;
