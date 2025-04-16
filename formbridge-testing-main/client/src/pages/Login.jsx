import { useContext } from "react";
import { GlobalContext } from "../GlobalContext.jsx";
import { useNavigate } from "react-router";
import Formbridge from "../components/Formbridge.jsx";

export default function Login() {
  const { getLogin, user } = useContext(GlobalContext);
  const navigate = useNavigate();

  async function login(formData) {
    const response = await fetch("/api/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });
    const data = await response.json();
    console.log("MAXTEST", data);
    if (response.ok) {
      //await getLogin()
      data.role == "ADMIN" ? navigate("/admin") : navigate("/support");
    } else {
      alert(data.message);
    }
  }

  return (
    <>
      <div className="placement">
        <div className="login-container">
          <img src="../src/assets/formbridge_logo_compact.png"></img>
          <h1>Sign in</h1>
          <h2>to access your Account & Forms</h2>
          <form className="inputboxes" action={login}>
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
              placeholder="Password"
            ></input>
            <button className="login" type="submit">
              Sign In
            </button>
          </form>
        </div>
      </div>
      <Formbridge />
    </>
  );
}
