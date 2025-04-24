import React, { useState, useEffect, useRef } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import ScheduleCalendar from "../components/ScheduleCalendar";
import "./Dashboard.css";

const Dashboard = () => {
  const [schedules, setSchedules] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [activeSection, setActiveSection] = useState("schedule");
  const sliderRef = useRef();

  // 🧠 Convert 24-hour time to 12-hour format
  const formatTime = (time24) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // 📦 Calculate when to put out trash (30 min earlier)
  const calculatePutOutTime = (time24) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    let hour = parseInt(hours);
    let minute = parseInt(minutes);

    if (minute < 30) {
      hour = (hour - 1 + 24) % 24;
      minute = minute + 30;
    } else {
      minute = minute - 30;
    }

    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
  };

  // ✅ Check if schedule date is today or in the future
  const isUpcoming = (dateString) => {
    const today = new Date();
    const scheduleDate = new Date(dateString + "T00:00:00");
    return scheduleDate >= new Date(today.toDateString());
  };

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "schedules"));
        const scheduleData = querySnapshot.docs
          .map((doc) => {
            let rawDate = doc.data().date;
            const formattedDate = new Date(rawDate + "T00:00:00Z")
              .toISOString()
              .split("T")[0];

            return {
              id: doc.id,
              ...doc.data(),
              date: formattedDate,
            };
          })
          .filter(schedule => isUpcoming(schedule.date)); // ⛔ Filter out past

        setSchedules(scheduleData);
      } catch (error) {
        console.error("Error fetching schedules:", error);
      }
    };

    fetchSchedules();
  }, []);

  const scrollList = (direction) => {
    const container = sliderRef.current;
    const scrollAmount = 250;
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const filteredSchedules =
    filterType === "all"
      ? schedules
      : schedules.filter(
          (schedule) =>
            schedule.type.toLowerCase() === filterType.toLowerCase()
        );

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <h2>Dashboard</h2>
        <p>Upcoming Waste Collection</p>

        {/* Filters */}
        {activeSection === "schedule" && (
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
        )}

        {/* Nav Buttons */}
        <div className="nav-buttons-wrapper">
          <button onClick={() => setActiveSection("schedule")} className="nav-button left">&lt;</button>
          <button onClick={() => setActiveSection("calendar")} className="nav-button right">&gt;</button>
        </div>

        {/* Schedule Section */}
        {activeSection === "schedule" && (
          <div className="slider-controls">
            <div className="slider-container" ref={sliderRef}>
              {filteredSchedules.length > 0 ? (
                filteredSchedules.map((schedule) => (
                  <div key={schedule.id} className={`schedule-card ${schedule.type.replace(/\s+/g, "-").toLowerCase()}`}>
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
                  </div>
                ))
              ) : (
                <p className="no-schedules">No schedules available!</p>
              )}
            </div>
          </div>
        )}

        {/* Calendar Section */}
        {activeSection === "calendar" && (
          <div className="calendar-section">
            <ScheduleCalendar schedules={schedules} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
