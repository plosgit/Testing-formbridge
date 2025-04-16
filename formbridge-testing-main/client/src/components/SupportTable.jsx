import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../GlobalContext";
import deleteIcon from "../assets/delete_icon.png";
import checkIcon from "../assets/checkIcon.png";

export default function SupportTable({ toggleAdd, setToggleAdd }) {
  const { UsePost, user } = useContext(GlobalContext);

  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");

  async function getUsers() {
    try {
      let rawResponse = await fetch(`/api/users/${user.company_id}`);
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

  async function handleAddUser() {
    const newUser = {
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: "12345",
      company_id: user.company_id,
    };

    try {
      const route = "/api/users";
      await UsePost(newUser, route);

      setToggleAdd(false);
      await getUsers();
    } catch (error) {
      setError("Failed to add user", error);
    }
    console.log(email);
    await sendWelcomeEmail(email);
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

  async function sendWelcomeEmail(email) {
    let data = {
      email,
    };

    let rawResponse = await fetch("/api/users/sendwelcomeemail", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  return (
    <div className="support-table-container">
      <div className="content">
        {loading ? (
          <p>Loading Users...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : users.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {toggleAdd ? (
                <tr id="add_user">
                  <td className="name-input">
                    <input
                      type="text"
                      onChange={(e) => setFirstname(e.target.value)}
                      placeholder="First name"
                    ></input>
                    <input
                      type="text"
                      onChange={(e) => setLastname(e.target.value)}
                      placeholder="Last name"
                    ></input>
                  </td>
                  <td>
                    <input
                      type="text"
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                    ></input>
                  </td>
                  <td className="table-actions-admin">
                    <img
                      className="add-user-btn"
                      src={checkIcon}
                      onClick={handleAddUser}
                    ></img>
                  </td>
                </tr>
              ) : (
                <></>
              )}
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    {user.firstname} {user.lastname}
                  </td>
                  <td>{user.email}</td>
                  <td className="table-actions-admin">
                    <img
                      className="delete-user-btn"
                      src={deleteIcon}
                      onClick={() => handleDeleteUser(user.id)}
                    ></img>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No users found</p>
        )}
      </div>
    </div>
  );
}
