// src/pages/dashboard/users.js
import Layout from "../../components/common/Layout";
import { useState } from "react";
import { User, Plus, Edit, Trash2 } from "lucide-react";

export default function UserManagementPage() {
  const [users, setUsers] = useState([
    { id: 1, name: "Admin Utama", email: "admin@example.com", role: "Admin" },
    { id: 2, name: "User Biasa", email: "user@example.com", role: "User" },
  ]);
  const [message, setMessage] = useState("");

  const handleDeleteUser = (id) => {
    setMessage("");
    if (window.confirm("Apakah Anda yakin ingin menghapus user ini?")) {
      setUsers(users.filter((user) => user.id !== id));
      setMessage("User berhasil dihapus!");
      // Di sini Anda akan memanggil API backend untuk menghapus user
    }
  };

  const handleAddUser = () => {
    setMessage("");
    alert("Fungsi Tambah User belum diimplementasikan!");
    // Logika untuk menampilkan form tambah user
  };

  const handleEditUser = (id) => {
    setMessage("");
    alert(`Fungsi Edit User untuk ID ${id} belum diimplementasikan!`);
    // Logika untuk menampilkan form edit user
  };

  return (
    <Layout title="Manajemen User">
      <h1 className="text-4xl lg:text-5xl font-extrabold mb-8 text-text-light border-b-2 border-primary pb-4 ">
        Manajemen Pengguna
      </h1>

      {message && (
        <div className="bg-success/20 text-success p-4 rounded-lg mb-6 border ">
          {message}
        </div>
      )}

      <div className="bg-background-card p-6 rounded-lg shadow-xl border border-background-border ">
        <div className="flex justify-between items-center mb-6 border-b border-background-border pb-3">
          <h2 className="text-2xl font-semibold text-text-light">
            Daftar Pengguna
          </h2>
          <button
            onClick={handleAddUser}
            className="bg-primary hover:bg-primary-dark text-text-light font-bold py-2 px-5 rounded-lg transition-colors duration-200 shadow-md flex items-center"
          >
            <Plus className="mr-2 w-5 h-5" /> Tambah User
          </button>
        </div>

        <div className="overflow-x-auto horizontal-scroll-container rounded-lg border border-background-border">
          <table className="min-w-full divide-y divide-background-border">
            <thead className="bg-background-hover">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-dark uppercase tracking-wider">
                  Nama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-dark uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-dark uppercase tracking-wider">
                  Peran
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-dark uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-background-card divide-y divide-background-border">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-background-hover transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-light">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === "Admin"
                          ? "bg-primary-dark text-primary-lighter"
                          : "bg-secondary/80 text-text-light"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleEditUser(user.id)}
                      className="text-primary hover:text-primary-dark mr-4"
                      title="Edit User"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-error hover:text-red-700"
                      title="Hapus User"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
