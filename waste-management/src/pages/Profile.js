import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, supabase } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import './Profile.css';

const DEFAULT_AVATAR = '/default-avatar.png';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    photoURL: '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!editMode && user?.uid) {
      setLoading(true);
      getDoc(doc(db, 'users', user.uid))
        .then((docSnap) => {
          if (docSnap.exists()) {
            setProfile(docSnap.data());
            setForm({
              firstName: docSnap.data().firstName || '',
              lastName: docSnap.data().lastName || '',
              email: docSnap.data().email || '',
              phone: docSnap.data().phone || '',
              address: docSnap.data().address || '',
              photoURL: docSnap.data().photoURL || '',
            });
          }
        })
        .catch(() => setError('Failed to fetch profile.'))
        .finally(() => setLoading(false));
    }
  }, [user, editMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => {
    setEditMode(true);
    setSuccess('');
    setError('');
  };

  const handleCancel = () => {
    if (profile) {
      setForm({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        phone: profile.phone || '',
        address: profile.address || '',
        photoURL: profile.photoURL || '',
      });
    }
    setEditMode(false);
    setSuccess('');
    setError('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, {
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        address: form.address,
        photoURL: form.photoURL,
      });
      setSuccess('Profile updated successfully!');
      setEditMode(false);
      setProfile((prev) => ({ ...prev, ...form }));
    } catch (err) {
      console.error(err);
      setError('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop();
    const filePath = `${user.uid}-${Date.now()}.${fileExt}`;

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const imageUrl = urlData.publicUrl;
      setForm((prev) => ({ ...prev, photoURL: imageUrl }));
      setSuccess('Image uploaded successfully!');
    } catch (error) {
      console.error(error);
      setError('Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  if (loading && !profile) return <div className="loading">Loading...</div>;
  if (!profile) return <div className="loading">No profile found.</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 style={{ textAlign: 'center', marginBottom: 8 }}>Profile</h2>
        <div className="profile-avatar-section">
            <div className="avatar-upload-row">
              <img
                src={form.photoURL || DEFAULT_AVATAR}
                alt="Profile"
                className="profile-avatar"
              />
              {editMode && (
                <div className="upload-input-wrapper">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                  {uploading && <div>Uploading...</div>}
                </div>
              )}
            </div>
          </div>

        <form
          className="profile-form"
          onSubmit={handleSave}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
              e.preventDefault();
            }
          }}
        >
          <div className="form-row">
            <div className="form-group">
              <label>First Name *</label>
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                disabled={!editMode}
                required
              />
            </div>
            <div className="form-group">
              <label>Last Name *</label>
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                disabled={!editMode}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input name="email" value={form.email} disabled />
            </div>
            <div className="form-group">
              <label>Mobile Number *</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                disabled={!editMode}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group" style={{ width: '100%' }}>
              <label>Residential Address</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                disabled={!editMode}
              />
            </div>
          </div>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          <div className="form-actions">
            {editMode && (
              <>
                <button type="submit" className="save-btn" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </form>

        {!editMode && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
            <button type="button" className="edit-btn" onClick={handleEdit}>
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
