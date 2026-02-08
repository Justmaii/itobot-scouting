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
      setFirebaseUser(user);

      if (user) {
        const p = await getUserProfile(user.uid);
        setProfile(p);
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  const register = async (
    email: string,
    password: string,
    name: string,
    surname: string
  ) => {
    const res = await registerAuth(email, password);

    const newProfile: UserProfile = {
      uid: res.user.uid,
      email,
      name,
      surname,
      role: "user"
    };

    await createUserProfile(newProfile);
    setProfile(newProfile);
  };

  const login = async (email: string, password: string) => {
    await loginAuth(email, password);
  };

  const logout = async () => {
    await logoutAuth();
  };

  return {
    firebaseUser,
    profile,
    loading,
    register,
    login,
    logout
  };
};
