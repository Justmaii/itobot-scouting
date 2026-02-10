import { useState, useEffect } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

import { registerAuth, loginAuth, logoutAuth } from "../services/authService";
import { createUserProfile, getUserProfile } from "../services/userService";

import { type UserProfile } from "../types/index";

export const useAuth = () => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      try {
        setFirebaseUser(user);

        if (user) {
          try {
            const p = await getUserProfile(user.uid);
            setProfile(p);
          } catch (err: any) {
            console.error("Profile fetch error:", err);
            // If it's a permission error or other, we still want to know the user is logged in
            // but we'll have a null profile which stays on Login page.
            // Let's at least log it.
            setProfile(null);
          }
        } else {
          setProfile(null);
        }
      } finally {
        setLoading(false);
      }
    });

    return unsub;
  }, []);

  const register = async (
    email: string,
    password: string,
    name: string,
    surname: string,
  ): Promise<void> => {
    const res = await registerAuth(email, password);

    await createUserProfile({
      uid: res.user.uid,
      email,
      name,
      surname,
      role: "user",
    });
  };

  const login = (email: string, password: string) => loginAuth(email, password);

  const logout = () => logoutAuth();

  return {
    firebaseUser,
    profile,
    loading,
    register,
    login,
    logout,
  };
};
