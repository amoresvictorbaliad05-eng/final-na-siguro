import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useReports } from '../context/ReportContext';
import api from '../services/api';
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Edit,
  Save,
  X
} from 'lucide-react';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const { reports } = useReports();

  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || ""
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        phone: user.phone,
        address: user.address,
      });
    }
  }, [user]);

  if (!user) return null;

  const userReports = reports.filter(
    r => r.reporterId === user.id
  );

  const stats = {
    total: userReports.length,
    pending: userReports.filter(r => r.status === "pending").length,
    approved: userReports.filter(r => r.status === "approved").length,
    resolved: userReports.filter(r => r.status === "resolved").length,
  };

  // ✅ FIXED SAVE FUNCTION (DATABASE UPDATE)
  const handleSave = async () => {
    try {
      const result = await api.updateProfile({
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      });

      if (result?.user) {
        // update local storage with backend response
        localStorage.setItem(
          "barangay_auth",
          JSON.stringify(result.user)
        );

        setEditing(false);
        window.location.reload();
      } else {
        console.error('Update failed:', result.error);
      }
    } catch (error) {
      console.error('Profile update error:', error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-8">

        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">

          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700" />

          <div className="px-6 pb-6">

            <div className="-mt-12 flex items-end justify-between">

              <div className="flex items-end gap-4">

                <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-gradient-to-br from-blue-500 to-indigo-600 text-3xl font-bold text-white">
                  {user.name.charAt(0)}
                </div>

                <div>

                  {editing ? (
                    <input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          name: e.target.value
                        })
                      }
                      className="border rounded-lg px-3 py-2"
                    />
                  ) : (
                    <h1 className="text-2xl font-bold">
                      {user.name}
                    </h1>
                  )}

                  <span className="inline-flex mt-2 rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-700">
                    {user.role}
                  </span>

                </div>

              </div>

              {!editing ? (
                <div className="flex gap-2">

                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-white"
                  >
                    <Edit size={18} />
                    Edit Profile
                  </button>

                  <Link to="/edit-profile">

                    <button
                      className="
                      flex
                      items-center
                      gap-2
                      rounded-xl
                      bg-indigo-600
                      px-4
                      py-2
                      text-white
                      "
                    >
                      <Edit size={18}/>
                      Edit Info
                    </button>

                  </Link>

                </div>
              ) : (
                <div className="flex gap-2">

                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-white"
                  >
                    <Save size={18} />
                    Save
                  </button>

                  <button
                    onClick={() => setEditing(false)}
                    className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-white"
                  >
                    <X size={18} />
                    Cancel
                  </button>

                </div>
              )}

            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">

              <div className="space-y-4">

                <div className="flex gap-3">
                  <Mail />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p>{user.email}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Phone />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>

                    {editing ? (
                      <input
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            phone: e.target.value
                          })
                        }
                        className="border rounded-lg px-3 py-2"
                      />
                    ) : (
                      <p>{user.phone}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <MapPin />
                  <div>
                    <p className="text-xs text-gray-500">Address</p>

                    {editing ? (
                      <input
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            address: e.target.value
                          })
                        }
                        className="border rounded-lg px-3 py-2"
                      />
                    ) : (
                      <p>{user.address}</p>
                    )}
                  </div>
                </div>

              </div>

              <div className="space-y-4">

                <div className="flex gap-3">
                  <Calendar />
                  <div>
                    <p className="text-xs text-gray-500">
                      Member Since
                    </p>
                    <p>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Shield />
                  <div>
                    <p className="text-xs text-gray-500">
                      Verification
                    </p>
                    <p>
                      {user.isVerified ? "Verified" : "Pending"}
                    </p>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>

        {/* STATS */}
        <div className="mt-6 grid grid-cols-4 gap-4">

          <div className="bg-white p-4 rounded-xl text-center">
            <p className="text-2xl font-bold">{stats.total}</p>
            <p>Total</p>
          </div>

          <div className="bg-white p-4 rounded-xl text-center">
            <p className="text-2xl font-bold">{stats.pending}</p>
            <p>Pending</p>
          </div>

          <div className="bg-white p-4 rounded-xl text-center">
            <p className="text-2xl font-bold">{stats.approved}</p>
            <p>Approved</p>
          </div>

          <div className="bg-white p-4 rounded-xl text-center">
            <p className="text-2xl font-bold">{stats.resolved}</p>
            <p>Resolved</p>
          </div>

        </div>

      </div>
    </div>
  );
}