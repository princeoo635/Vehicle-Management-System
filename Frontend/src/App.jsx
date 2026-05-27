import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login/index.jsx";
import Register from "./pages/auth/Register/index.jsx";

import Owner from "./pages/owner/index.jsx";
import Customer from "./pages/customer/index.jsx";

import Home from "./pages/home/index.jsx";
import NotFound from "./pages/NotFound/index.jsx";

import AuthContext from "./context/AuthContext/index.jsx";
import ProtectedRoute from "./components/ProtectedRoute/index.jsx";

const pageData = {
  whoEntered: null,
  currentUser: null,
  customer: [],
  owner: [],
};

function App() {
  const [userData, setUserData] = useState({});
  const [user, setUser] = useState(pageData);

  // Restore user from localStorage on refresh
  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Save logged in user
  const recordTheUserData = (data) => {
    const updatedUser = {
      ...user,
      currentUser: data,
      whoEntered: data?.whoEntered,
    };

    console.log("Updated User:", updatedUser);

    setUser(updatedUser);
    setUserData(data);

    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );
  };

  // Track who entered (customer/owner)
  const whoenteredtopage = (person) => {
    const existingUsersData = localStorage.getItem("user");

    const existingUsers = existingUsersData
      ? JSON.parse(existingUsersData)
      : {};

    const updatedUserData = {
      ...existingUsers,
      whoEntered: person,
    };

    localStorage.setItem(
      "user",
      JSON.stringify(updatedUserData)
    );

    setUser(updatedUserData);
  };

  // Logout
  const logout = () => {
    setUser(pageData);
    setUserData({});

    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        logout,
        whoenteredtopage,
        recordTheUserData,
      }}
    >
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/owner" element={<Owner />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/customer" element={<Customer />} />
        </Route>

        <Route path="/not-found" element={<NotFound />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthContext.Provider>
  );
}

export default App;
