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

  const formatTime = (time24) => {
    if (!time24) return "";
    const [hours, minutes] = time24.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const calculatePutOutTime = (time24) => {
    if (!time24) return "";
    const [hours, minutes] = time24.split(":");
    let hour = parseInt(hours);
    let minute = parseInt(minutes);

    if (minute < 30) {
      hour = (hour - 1 + 24) % 24;
      minute = minute + 30;
    } else {
      minute = minute - 30;
    }

    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute.toString().padStart(2, "0")} ${ampm}`;
  };

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
          .filter((schedule) => isUpcoming(schedule.date));

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
    if (direction === "left") {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
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
      <header className="dashboard-header">
        <h1>Waste Management Dashboard</h1>
        <p>Upcoming Waste Collection Schedules</p>
      </header>

      {/* Navigation Tabs */}
      <nav className="dashboard-nav">
        <button
          className={activeSection === "schedule" ? "active" : ""}
          onClick={() => setActiveSection("schedule")}
        >
          Schedule
        </button>
        <button
          className={activeSection === "calendar" ? "active" : ""}
          onClick={() => setActiveSection("calendar")}
        >
          Calendar
        </button>
      </nav>

      {/* Filter Dropdown */}
      {activeSection === "schedule" && (
        <div className="filter-dropdown">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="all">All</option>
            <option value="biodegradable">Biodegradable</option>
            <option value="non-biodegradable">Non-Biodegradable</option>
            <option value="recyclable">Recyclable</option>
          </select>
        </div>
      )}

      {/* Schedule Cards or Calendar */}
      <main className="dashboard-main">
        {activeSection === "schedule" && (
          <div className="schedule-section">
            <button
              className="scroll-btn left"
              onClick={() => scrollList("left")}
              aria-label="Scroll left"
            >
              &lt;
            </button>
            <div className="schedule-slider" ref={sliderRef}>
              {filteredSchedules.length > 0 ? (
                filteredSchedules.map((schedule) => (
                  <article
                    key={schedule.id}
                    className={`schedule-card ${schedule.type
                      .replace(/\s+/g, "-")
                      .toLowerCase()}`}
                  >
                    <div className="card-header">
                      <span className="tag">{schedule.type}</span>
                      <span
                        className={`status-badge ${schedule.status || "pending"}`}
                      >
                        {schedule.status || "pending"}
                      </span>
                    </div>
                    <h3>{schedule.barangay}</h3>
                    <p className="schedule-time">
                      {schedule.date} at{" "}
                      {schedule.timeFormatted || formatTime(schedule.time)}
                    </p>
                    <p className="put-out-note">
                      Put out waste bags before {calculatePutOutTime(schedule.time)}
                    </p>
                  </article>
                ))
              ) : (
                <p className="no-schedules">No schedules available!</p>
              )}
            </div>
            <button
              className="scroll-btn right"
              onClick={() => scrollList("right")}
              aria-label="Scroll right"
            >
              &gt;
            </button>
          </div>
        )}

        {activeSection === "calendar" && (
          <section className="calendar-section">
            <ScheduleCalendar schedules={schedules} />
          </section>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
