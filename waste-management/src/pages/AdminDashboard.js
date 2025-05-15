import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [activeTab, setActiveTab] = useState("users");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
    fetchSchedules();
  }, []);

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const userData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(userData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  const fetchSchedules = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "schedules"));
      const scheduleData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        location: doc.data().barangay || 'No location set'
      }));
      setSchedules(scheduleData);
    } catch (error) {
      console.error("Error fetching schedules:", error);
    }
  };

  const formatTime = (time24) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const handleArchiveUser = async (userId) => {
    if (window.confirm("Are you sure you want to archive this user?")) {
      try {
        await updateDoc(doc(db, "users", userId), {
          status: "archived"
        });
        setUsers(users.filter(user => user.id !== userId));
        alert("User archived successfully!");
      } catch (error) {
        console.error("Error archiving user:", error);
        alert("Failed to archive user");
      }
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    if (window.confirm("Are you sure you want to delete this schedule?")) {
      try {
        await updateDoc(doc(db, "schedules", scheduleId), {
          status: "deleted"
        });
        setSchedules(schedules.filter(schedule => schedule.id !== scheduleId));
      } catch (error) {
        console.error("Error deleting schedule:", error);
      }
    }
  };

  const handleUpdateSchedule = async (scheduleId, newStatus) => {
    try {
      await updateDoc(doc(db, "schedules", scheduleId), {
        status: newStatus
      });
      setSchedules(schedules.map(schedule => 
        schedule.id === scheduleId 
          ? { ...schedule, status: newStatus }
          : schedule
      ));
    } catch (error) {
      console.error("Error updating schedule status:", error);
      alert("Failed to update schedule status");
    }
  };

  return (
    <div className="admin-dashboard-container">
      <div className="admin-dashboard-content">
        <h2>Admin Dashboard</h2>
        
        <div className="admin-tabs">
          <button 
            className={`tab-button ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>
          <button 
            className={`tab-button ${activeTab === "schedules" ? "active" : ""}`}
            onClick={() => setActiveTab("schedules")}
          >
            Schedules
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="tab-content">
            {activeTab === "users" && (
              <div className="users-table">
                <div className="table-header">
                  <h3>Registered Users ({users.filter(user => user.email !== 'keneki06113@gmail.com' && user.email !== '202210388@gordoncollege.edu.ph').length})</h3>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Address</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length > 0 ? (
                      users.filter(user => user.email !== 'keneki06113@gmail.com' && user.email !== '202210388@gordoncollege.edu.ph').map(user => (
                        <tr key={user.id}>
                          <td>{String(user.firstName || '') + ' ' + String(user.lastName || '')}</td>
                          <td>{String(user.email || '')}</td>
                          <td>{String(user.phone || 'N/A')}</td>
                          <td>{String(user.address || 'N/A')}</td>
                          <td>
                            <div className="action-buttons">
                              <button 
                                className="archive-btn"
                                onClick={() => handleArchiveUser(user.id)}
                              >
                                Archive
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center' }}>No users found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "schedules" && (
              <div className="schedules-table">
                <div className="table-header">
                <h3>Collection Schedules</h3>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Location</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedules.map((schedule) => (
                      <tr key={schedule.id} className={schedule.type}>
                        <td>{String(schedule.barangay || 'No location set')}</td>
                        <td>{String(schedule.date || '')}</td>
                        <td>{String(schedule.timeFormatted || formatTime(schedule.time) || '')}</td>
                        <td>{String(schedule.type || '')}</td>
                        <td>
                          <select
                            value={schedule.status || "pending"}
                            onChange={(e) => handleUpdateSchedule(schedule.id, e.target.value)}
                            className={`status-${schedule.status}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td>
                          <button 
                            className="archive-btn"
                            onClick={() => handleDeleteSchedule(schedule.id)}
                          >
                            Archive
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
