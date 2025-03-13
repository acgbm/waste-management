import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import ScheduleCalendar from "../components/ScheduleCalendar";
import "./Dashboard.css";

const Dashboard = () => {
  const [schedules, setSchedules] = useState([]);
  const [filterType, setFilterType] = useState("all");

  // Add time format conversion function
  const formatTime = (time24) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Calculate put-out time (30 minutes before collection)
  const calculatePutOutTime = (time24) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    let hour = parseInt(hours);
    let minute = parseInt(minutes);
    
    // Subtract 30 minutes
    if (minute < 30) {
      hour = (hour - 1 + 24) % 24; // Handle midnight rollover
      minute = minute + 30;
    } else {
      minute = minute - 30;
    }
    
    // Format the time
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
  };

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "schedules"));
        const scheduleData = querySnapshot.docs.map((doc) => {
          let rawDate = doc.data().date;
          
          // Convert to correct date without timezone shifting
          const formattedDate = new Date(rawDate + "T00:00:00Z")
            .toISOString()
            .split("T")[0];

          return {
            id: doc.id,
            ...doc.data(),
            date: formattedDate,
          };
        });

        setSchedules(scheduleData);
      } catch (error) {
        console.error("Error fetching schedules:", error);
      }
    };

    fetchSchedules();
  }, []);

  const filteredSchedules =
    filterType === "all"
      ? schedules
      : schedules.filter((schedule) => schedule.type.toLowerCase() === filterType.toLowerCase());

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <h2>Dashboard</h2>
        <p>Upcoming Waste Collection</p>

        {/* Filters */}
        <div className="filters">
          {["all", "biodegradable", "non-biodegradable", "recyclable"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={filterType === type ? "active" : ""}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Schedule List */}
        <div className="schedules-section">
          <ul className="schedule-list">
            {filteredSchedules.length > 0 ? (
              filteredSchedules.map((schedule) => (
                <li key={schedule.id} className={`schedule-item ${schedule.type.replace(/\s+/g, "-").toLowerCase()}`}>
                  <span className="tag">{schedule.type}</span>
                  <div className="schedule-details">
                    <strong>{schedule.barangay}</strong>
                    <p className="schedule-time">
                      {schedule.date} at {schedule.timeFormatted || formatTime(schedule.time)}
                    </p>
                    <p className="put-out-note">
                      Put out waste bags before {calculatePutOutTime(schedule.time)}
                    </p>
                  </div>
                  <div className="schedule-status">
                    <span className={`status-badge ${schedule.status}`}>
                      {schedule.status || 'pending'}
                    </span>
                  </div>
                </li>
              ))
            ) : (
              <p className="no-schedules">No schedules available.</p>
            )}
          </ul>
        </div>

        {/* Calendar Section */}
        <div className="calendar-section">
          <ScheduleCalendar schedules={schedules} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
