import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

// ✅ Create Auth Context with a default object
const AuthContext = createContext({ user: null, loading: true });

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          // Fetch additional user data from Firestore
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const userData = {
              ...currentUser,
              ...userDoc.data(),
              isAdmin: userDoc.data().role === "admin"
            };
            setUser(userData);
            // Store minimal user data in localStorage
            localStorage.setItem('user', JSON.stringify({
              uid: userData.uid,
              isAdmin: userData.isAdmin
            }));
          } else {
            setUser(currentUser);
          }
        } else {
          setUser(null);
          localStorage.removeItem('user'); // Clear stored user data
        }
      } catch (error) {
        console.error("Error in auth state change:", error);
        setUser(null);
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom Hook to Use Auth
export const useAuth = () => {
  return useContext(AuthContext); // Ensure it never returns null
};
