import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import './Scheduling.css';

const Scheduling = () => {
  const [schedules, setSchedules] = useState([]);
  const [newSchedule, setNewSchedule] = useState({
    barangay: '',
    date: '',
    time: '',
    type: 'biodegradable',
    status: 'pending'
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // Get today's date in YYYY-MM-DD format for disabling past dates
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'schedules'));
      const scheduleData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log("Fetched schedules:", scheduleData);
      setSchedules(scheduleData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSchedule(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Format 24-hour time to 12-hour AM/PM
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate barangay
    if (!newSchedule.barangay.trim()) {
      alert('Please enter a barangay location');
      return;
    }

    // Validate date is not in the past
    if (newSchedule.date < minDate) {
      alert('You cannot select a past date.');
      return;
    }

    try {
      const scheduleData = {
        ...newSchedule,
        barangay: newSchedule.barangay.trim(),
        time: newSchedule.time,
        timeFormatted: formatTime(newSchedule.time),
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'schedules'), scheduleData);

      setNewSchedule({
        barangay: '',
        date: '',
        time: '',
        type: 'biodegradable',
        status: 'pending'
      });

      fetchSchedules();
      alert('Schedule added successfully!');
    } catch (error) {
      console.error('Error adding schedule:', error);
      alert('Failed to add schedule');
    }
  };

  const handleDelete = async (scheduleId) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      try {
        await deleteDoc(doc(db, 'schedules', scheduleId));
        setSchedules(schedules.filter(schedule => schedule.id !== scheduleId));
        alert('Schedule deleted successfully!');
      } catch (error) {
        console.error('Error deleting schedule:', error);
        alert('Failed to delete schedule');
      }
    }
  };

  const handleUpdateStatus = async (scheduleId, newStatus) => {
    try {
      await updateDoc(doc(db, 'schedules', scheduleId), {
        status: newStatus
      });
      setSchedules(schedules.map(schedule =>
        schedule.id === scheduleId
          ? { ...schedule, status: newStatus }
          : schedule
      ));
    } catch (error) {
      console.error('Error updating schedule status:', error);
      alert('Failed to update schedule status');
    }
  };

  const filteredSchedules = filter === 'all'
    ? schedules
    : schedules.filter(schedule => schedule.type === filter);

  return (
    <div className="scheduling-container">
      <div className="scheduling-content">
        <h2>Collection Schedule Management</h2>

        {/* Schedule Creation Form */}
        <div className="schedule-form">
          <h3>Create New Schedule</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Barangay:</label>
              <input
                type="text"
                name="barangay"
                value={newSchedule.barangay}
                onChange={handleInputChange}
                required
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Date:</label>
              <input
                type="date"
                name="date"
                value={newSchedule.date}
                onChange={handleInputChange}
                required
                className="form-control"
                min={minDate}
              />
            </div>

            <div className="form-group">
              <label>Time:</label>
              <input
                type="time"
                name="time"
                value={newSchedule.time}
                onChange={handleInputChange}
                required
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Type:</label>
              <select
                name="type"
                value={newSchedule.type}
                onChange={handleInputChange}
                required
                className="form-control"
              >
                <option value="biodegradable">Biodegradable</option>
                <option value="non-biodegradable">Non-biodegradable</option>
                <option value="recyclable">Recyclable</option>
              </select>
            </div>

            <button type="submit" className="submit-btn">Add Schedule</button>
          </form>
        </div>

        {/* Schedule List */}
        <div className="schedule-list">
          <h3>Existing Schedules</h3>

          <div className="filter-buttons">
            <button
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={filter === 'biodegradable' ? 'active' : ''}
              onClick={() => setFilter('biodegradable')}
            >
              Biodegradable
            </button>
            <button
              className={filter === 'non-biodegradable' ? 'active' : ''}
              onClick={() => setFilter('non-biodegradable')}
            >
              Non-biodegradable
            </button>
            <button
              className={filter === 'recyclable' ? 'active' : ''}
              onClick={() => setFilter('recyclable')}
            >
              Recyclable
            </button>
          </div>

          {loading ? (
            <div className="loading">Loading schedules...</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Barangay</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSchedules.length > 0 ? (
                  filteredSchedules.map(schedule => (
                    <tr key={schedule.id} className={`schedule-row ${schedule.type}`}>
                      <td>{schedule.barangay || 'No location set'}</td>
                      <td>{schedule.date}</td>
                      <td>
                        {schedule.timeFormatted || formatTime(schedule.time)}
                        <div className="put-out-note">
                          Put out waste bags before {calculatePutOutTime(schedule.time)}
                        </div>
                      </td>
                      <td>{schedule.type}</td>
                      <td>
                        <select
                          value={schedule.status || 'pending'}
                          onChange={(e) => handleUpdateStatus(schedule.id, e.target.value)}
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
                          onClick={() => handleDelete(schedule.id)}
                          className="delete-btn"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-schedules">
                      No schedules found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scheduling;
