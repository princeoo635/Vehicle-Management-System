import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../services/api";
import "./index.css";

export default function ProfileCard({
  customerData,
  setCustomerData,
}) {
  const [profileForm, setProfileForm] = useState({
    name: customerData?.name || "",
    email: customerData?.email || "",
    phone: customerData?.phone || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [profileImageFile, setProfileImageFile] =
    useState(null);

  const [actionMessage, setActionMessage] =
    useState("");

  const [actionError, setActionError] =
    useState("");

  useEffect(() => {
    if (customerData) {
      setProfileForm({
        name: customerData.name || "",
        email: customerData.email || "",
        phone: customerData.phone || "",
      });
    }
  }, [customerData]);

  const resetMessages = () => {
    setActionMessage("");
    setActionError("");
  };

  // UPDATE PROFILE
  const onUpdateProfile = async (e) => {
    e.preventDefault();

    resetMessages();

    try {
      const res = await axios.patch(
        `${API_BASE_URL}/users/updateAccount`,
        {
          name: profileForm.name,
          email: profileForm.email,
          phone: profileForm.phone,
        },
        {
          withCredentials: true,
        }
      );

      setCustomerData((prev) => ({
        ...prev,
        ...res.data.data,
      }));

      setActionMessage(
        "Profile updated successfully."
      );
    } catch (err) {
      console.log(err);

      setActionError(
        err?.response?.data?.message ||
          "Failed to update profile."
      );
    }
  };

  // CHANGE PASSWORD
  const onChangePassword = async (e) => {
    e.preventDefault();

    resetMessages();

    try {
      await axios.patch(
        `${API_BASE_URL}/users/updatePassword`,
        {
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword,
        },
        {
          withCredentials: true,
        }
      );

      setActionMessage(
        "Password changed successfully."
      );

      setPasswordForm({
        oldPassword: "",
        newPassword: "",
      });
    } catch (err) {
      console.log(err);

      setActionError(
        err?.response?.data?.message ||
          "Failed to change password."
      );
    }
  };

  // UPDATE PROFILE IMAGE
  const onUpdateProfileImage = async (e) => {
    e.preventDefault();

    resetMessages();

    if (!profileImageFile) {
      setActionError("Please select an image");
      return;
    }

    try {
      const formData = new FormData();

      formData.append(
        "profileImage",
        profileImageFile
      );

      const res = await axios.patch(
        `${API_BASE_URL}/users/profileImage`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      setCustomerData((prev) => ({
        ...prev,
        ...res.data.data,
      }));

      setActionMessage(
        "Profile image updated successfully."
      );

      setProfileImageFile(null);
    } catch (err) {
      console.log(err);

      setActionError(
        err?.response?.data?.message ||
          "Failed to update profile image."
      );
    }
  };

  return (
    <div className="cust-panel">
      {(actionMessage || actionError) && (
        <div className="cust-action-banner">
          {actionMessage && (
            <p className="cust-action-success">
              {actionMessage}
            </p>
          )}

          {actionError && (
            <p className="cust-action-error">
              {actionError}
            </p>
          )}
        </div>
      )}

      <div className="cust-card cust-profile-info">
        <h3>My Profile</h3>

        {customerData?.profileImage && (
          <img
            className="cust-avatar"
            src={customerData.profileImage}
            alt="avatar"
          />
        )}

        <div className="cust-info-row">
          <span className="cust-label">
            Name
          </span>

          <span>{customerData?.name}</span>
        </div>

        <div className="cust-info-row">
          <span className="cust-label">
            Username
          </span>

          <span>
            @{customerData?.userName}
          </span>
        </div>

        <div className="cust-info-row">
          <span className="cust-label">
            Email
          </span>

          <span>{customerData?.email}</span>
        </div>

        <div className="cust-info-row">
          <span className="cust-label">
            Phone
          </span>

          <span>{customerData?.phone}</span>
        </div>

        <div className="cust-info-row">
          <span className="cust-label">
            Address
          </span>

          <span>
            {customerData?.address || "—"}
          </span>
        </div>
      </div>

      <div className="cust-panel-grid">
        {/* UPDATE ACCOUNT */}
        <form
          className="cust-card"
          onSubmit={onUpdateProfile}
        >
          <h3>Update Account</h3>

          <div className="cust-form-row">
            <label>Name</label>

            <input
              className="cust-text-input"
              value={profileForm.name}
              onChange={(e) =>
                setProfileForm((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              required
            />
          </div>

          <div className="cust-form-row">
            <label>Email</label>

            <input
              className="cust-text-input"
              type="email"
              value={profileForm.email}
              onChange={(e) =>
                setProfileForm((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
              required
            />
          </div>

          <div className="cust-form-row">
            <label>Phone</label>

            <input
              className="cust-text-input"
              value={profileForm.phone}
              onChange={(e) =>
                setProfileForm((prev) => ({
                  ...prev,
                  phone: e.target.value,
                }))
              }
              required
            />
          </div>

          <button
            className="button"
            type="submit"
          >
            Save Changes
          </button>
        </form>

        {/* CHANGE PASSWORD */}
        <form
          className="cust-card"
          onSubmit={onChangePassword}
        >
          <h3>Change Password</h3>

          <div className="cust-form-row">
            <label>
              Current Password
            </label>

            <input
              className="cust-text-input"
              type="password"
              value={passwordForm.oldPassword}
              onChange={(e) =>
                setPasswordForm((prev) => ({
                  ...prev,
                  oldPassword:
                    e.target.value,
                }))
              }
              required
            />
          </div>

          <div className="cust-form-row">
            <label>New Password</label>

            <input
              className="cust-text-input"
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm((prev) => ({
                  ...prev,
                  newPassword:
                    e.target.value,
                }))
              }
              required
            />
          </div>

          <button
            className="button"
            type="submit"
          >
            Change Password
          </button>
        </form>

        {/* UPDATE PROFILE IMAGE */}
        <form
          className="cust-card"
          onSubmit={onUpdateProfileImage}
        >
          <h3>Update Profile Image</h3>

          <div className="cust-form-row">
            <label>New Image</label>

            <input
              className="cust-text-input"
              type="file"
              accept="image/*"
              onChange={(e) =>
                setProfileImageFile(
                  e.target.files?.[0] || null
                )
              }
              required
            />
          </div>

          <button
            className="button"
            type="submit"
          >
            Upload
          </button>
        </form>
      </div>
    </div>
  );
}
