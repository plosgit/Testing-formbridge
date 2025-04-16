import { useNavigate } from "react-router"


export default function Formbridge() {
  const navigate = useNavigate();
  return <p className="footer-text">
    Copyright © 2025
    <span className="formbridge" onClick={() => navigate("/")}> Formbridge </span>
    AB</p>
}