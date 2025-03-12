import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import ScheduleCalendar from "../components/ScheduleCalendar";
import "./Dashboard.css";

const Dashboard = () => {
  const [schedules, setSchedules] = useState([]);
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "schedules"));
        const scheduleData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          date: new Date(doc.data().date + "T00:00:00").toISOString().split("T")[0],
        }));

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
        <ul className="schedule-list">
          {filteredSchedules.length > 0 ? (
            filteredSchedules.map((schedule) => (
              <li key={schedule.id} className={`schedule-item ${schedule.type.replace(/\s+/g, "-").toLowerCase()}`}>
                <span className="tag">{schedule.type}</span>
                <div>
                  <strong>{schedule.location}</strong>
                  <p>{schedule.date} at {schedule.time}</p>
                </div>
                <small>{schedule.notes}</small>
              </li>
            ))
          ) : (
            <p className="no-schedules">No schedules available.</p>
          )}
        </ul>

        {/* Calendar */}
        <ScheduleCalendar schedules={schedules} />
      </div>
    </div>
  );
};

export default Dashboard;
