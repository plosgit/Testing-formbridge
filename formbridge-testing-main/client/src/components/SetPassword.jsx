import { useContext } from "react";
import { GlobalContext } from "../GlobalContext.jsx";
import { useNavigate } from "react-router";

export default function SetPassword() {
  const { user } = useContext(GlobalContext);
  const navigate = useNavigate();

  async function setPassword(formData) {
    const response = await fetch("/api/users/setpassword", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });
    const data = await response.json();
    console.log("MAXTEST", data);
    if (response.ok) {
      alert("Password changed successfully! \n Redirecting to Login..");
      navigate("/login");
    } else {
      alert(data.message);
    }
  }

  return (
    <>
      <div className="placement">
        <div className="login-container">
          <img src="../src/assets/fingerprint.png"></img>
          <h1>Set your own password</h1>
          <h2>You only get one try..</h2>
          <form className="inputboxes" action={setPassword}>
            <input
              className="inputbox"
              type="text"
              name="email"
              placeholder="Email address"
            ></input>
            <input
              className="inputbox"
              type="password"
              name="password"
              placeholder="Type your new password"
            ></input>
            <button className="login" type="submit">
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
