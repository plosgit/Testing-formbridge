import {useContext, useEffect, useState} from "react";
import {GlobalContext} from "../../GlobalContext";

export default function Company() {
  const {UsePost} = useContext(GlobalContext);

  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toggleAdd, setToggleAdd] = useState(false);

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [companyId, setCompanyId] = useState(0);

  const {user} = useContext(GlobalContext);

  async function getUsers() {
    try {
      let rawResponse = await fetch("/api/users");
      let response = await rawResponse.json();
      setUsers(response);
    } catch (error) {
      setError("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getUsers();
  }, []);

  // Handle Add Support (adds a dummy support with no input data)
  async function handleAddUser() {

    const newUser = {
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: '12345',
      company_id: companyId
    };

    try {
      const route = "/api/users";
      await UsePost(newUser, route);

      setToggleAdd(false);
      await getUsers();
    } catch (error) {
      setError("Failed to add user", error);
    }
  }

  async function handleDeleteUser(user_id) {
    try {
      let rawResponse = await fetch(`/api/users/${user_id}`, {
        method: "DELETE",
      });
      if (!rawResponse.ok) {
        throw new Error("Failed to delete user");
      }
      setUsers(users.filter((user) => user.id !== user_id));
    } catch (error) {
      setError("Error deleting user", error);
    }
  }

  return (
    user.role != "ADMIN"
      ?
      <p>Du är inte admin</p>
      :
      <div className="company-container">
        <div className="header">
          <h1>Support Admin Dashboard</h1>
        </div>

        <div className="menu">
          <h2><i className="fa-solid fa-table-list"></i> Overview</h2>
          <h2><i className="fa-solid fa-user"></i> Users</h2>
          <button className="add-user-btn"
                  onClick={() => toggleAdd ? setToggleAdd(false) : setToggleAdd(true)}>Add User
          </button>
        </div>

        <div className="content">
          {loading ? (
            <p>Loading Users...</p>
          ) : error ? (
            <p style={{color: "red"}}>{error}</p>
          ) : users.length > 0 ? (
            <table>
              <thead>
              <tr>
                <th>User ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Company</th>
                <th>Actions</th>
              </tr>
              </thead>
              <tbody>
              {
                toggleAdd ?
                  <tr id="add_user">
                    <td></td>
                    <td>
                      <input type="text" onChange={(e) => setFirstname(e.target.value)}
                             placeholder="First name"></input>
                    </td>
                    <td>
                      <input type="text" onChange={(e) => setLastname(e.target.value)}
                             placeholder="Last name"></input>
                    </td>
                    <td>
                      <input type="text" onChange={(e) => setEmail(e.target.value)}
                             placeholder="Email"></input>
                    </td>
                    <td>
                      <input type="number" onChange={(e) => setCompanyId(e.target.value)}
                             placeholder="Company ID"></input>
                    </td>
                    <td>
                      <button className="add-user-btn" onClick={handleAddUser}>Accept</button>
                    </td>
                  </tr>
                  :
                  <></>
              }
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.firstname}</td>
                  <td>{user.lastname}</td>
                  <td>{user.email}</td>
                  <td>{user.company_id}</td>
                  <td>
                    <button className="delete-user-btn" onClick={() => handleDeleteUser(user.id)}>
                      Delete User
                    </button>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          ) : (
            <p>No users found</p>
          )}
        </div>

        <div className="footer"><h1>Formbridge All Rights Reserved</h1>
        </div>

      </div>
  );
}

