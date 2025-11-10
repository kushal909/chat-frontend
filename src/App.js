import React, { useState, useEffect } from "react";
import axios from "axios";

// Global API URL
const URL = "http://65.2.81.219:5000";

function App() {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({ name: "", email: "", age: "" });
  const [editingId, setEditingId] = useState(null);

  // Fetch all users
  const fetchUsers = async () => {
    const res = await axios.get(`${URL}/api/users`);
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Add or Update user
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`${URL}/api/users/${editingId}`, user);
      setEditingId(null);
    } else {
      await axios.post(`${URL}/api/users`, user);
    }
    setUser({ name: "", email: "", age: "" });
    fetchUsers();
  };

  // Edit user
  const handleEdit = (user) => {
    setUser({ name: user.name, email: user.email, age: user.age });
    setEditingId(user._id);
  };

  // Delete user
  const handleDelete = async (id) => {
    await axios.delete(`${URL}/api/users/${id}`);
    fetchUsers();
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>MERN CRUD App</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          name="name"
          placeholder="Name"
          value={user.name}
          onChange={handleChange}
          required
          style={{ marginRight: "10px" }}
        />
        <input
          name="email"
          placeholder="Email"
          value={user.email}
          onChange={handleChange}
          required
          style={{ marginRight: "10px" }}
        />
        <input
          name="age"
          type="number"
          placeholder="Age"
          value={user.age}
          onChange={handleChange}
          required
          style={{ marginRight: "10px" }}
        />
        <button type="submit">{editingId ? "Update" : "Add"} User</button>
      </form>

      <h2>Users List</h2>
      {users.map((u) => (
        <div key={u._id} style={{ marginBottom: "10px" }}>
          {u.name} - {u.email} - {u.age}
          <button onClick={() => handleEdit(u)} style={{ marginLeft: "10px" }}>
            Edit
          </button>
          <button
            onClick={() => handleDelete(u._id)}
            style={{ marginLeft: "10px" }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;
