"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../utils/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SettingsPanel({ user, profile }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    avatar_url: "", // will be set to signedUrl
    email: user.email || "",
    theme: "light",
  });

  // Fetch signed URL for avatar on mount or when avatar path changes
  useEffect(() => {
    async function loadSignedUrl() {
      if (profile?.avatar_url) {
        const { data, error } = await supabase.storage
          .from("avatars")
          .createSignedUrl(profile.avatar_url, 60 * 60); // 1 hour validity
        if (!error && data?.signedUrl) {
          setFormData((prev) => ({
            ...prev,
            avatar_url: data.signedUrl,
          }));
        }
      }
    }
    loadSignedUrl();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.avatar_url]);

  useEffect(() => {
    // load already saved theme preference
    const savedTheme = localStorage.getItem("theme") || "light";
    setFormData((prev) => ({ ...prev, theme: savedTheme }));
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      setError(error.message);
    } else {
      router.push("/auth");
      router.refresh();
    }
    setLoading(false);
  };

  // profile update handler
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name,
        })
        .eq("id", user.id)
        .select();

      if (error) throw error;
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // theme change handler
  const handleThemeChange = (theme) => {
    setFormData({ ...formData, theme });
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  };

  // avatar upload handler (private bucket, signed URL)
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `avatar.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // 1. Upload to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // 2. Get signed URL
      const { data, error: signedError } = await supabase.storage
        .from("avatars")
        .createSignedUrl(filePath, 60 * 60); // 1 hour validity
      if (signedError) throw signedError;

      // 3. Update profile in database (store path, not signed URL)
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          avatar_url: filePath,
        })
        .eq("id", user.id);

      if (updateError) throw updateError;

      // 4. Update local state with fresh signed URL
      setFormData((prev) => ({
        ...prev,
        avatar_url: data.signedUrl,
      }));

      setSuccess("Avatar updated successfully!");
      router.refresh(); // Refresh to show new avatar everywhere
    } catch (err) {
      setError(err.message || "Failed to upload avatar");
      console.error("Avatar upload error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Section */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>

            <div className="flex items-center mb-6">
              <div className="relative group">
                {loading ? (
                  <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse"></div>
                ) : (
                  <>
                    <Image
                      src={
                        formData.avatar_url ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          formData.full_name || user.email
                        )}&background=random`
                      }
                      alt="Avatar"
                      className="w-16 h-16 rounded-full object-cover"
                      width={100}
                      height={100}
                    />
                    <label className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                      />
                      <span className="text-white text-xs">Change</span>
                    </label>
                  </>
                )}
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  readOnly
                  className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 dark:border-gray-600 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Contact support to change email
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 rounded text-white ${
                  loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>

          {/* App Preferences Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">App Preferences</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Theme</label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => handleThemeChange("light")}
                    className={`px-4 py-2 rounded border ${
                      formData.theme === "light"
                        ? "bg-blue-100 border-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    Light
                  </button>
                  <button
                    type="button"
                    onClick={() => handleThemeChange("dark")}
                    className={`px-4 py-2 rounded border ${
                      formData.theme === "dark"
                        ? "bg-gray-700 border-gray-500"
                        : "border-gray-300"
                    }`}
                  >
                    Dark
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Actions Section */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Account Actions</h2>

            <div className="space-y-3">
              <button
                onClick={() => router.push("/settings/password")}
                className="w-full text-left p-3 rounded border hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Change Password
              </button>

              <button
                onClick={() => router.push("/settings/delete")}
                className="w-full text-left p-3 rounded border hover:bg-gray-50 dark:hover:bg-gray-700 text-red-500"
              >
                Delete Account
              </button>

              <button
                onClick={handleLogout}
                disabled={loading}
                className={`w-full text-left p-3 rounded border ${
                  loading
                    ? "bg-gray-100"
                    : "hover:bg-red-50 dark:hover:bg-red-900"
                } text-red-500`}
              >
                {loading ? "Signing out..." : "Sign Out"}
              </button>
            </div>
          </div>

          {/* Account Information Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Account Information</h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">
                  Account Created
                </span>
                <span>
                  {new Date(user.created_at).toLocaleDateString("en-GB")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">
                  Last Login
                </span>
                <span>
                  {new Date(user.last_sign_in_at).toLocaleString("en-GB")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">
                  Login Provider
                </span>
                <span className="capitalize">
                  {user.app_metadata.provider || "email"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
