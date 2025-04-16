import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { GlobalContext } from "../GlobalContext";

export default function Form() {
  // useParams is only used in demo
  const { company_id } = useParams();

  const navigate = useNavigate();

  const { UsePost, user } = useContext(GlobalContext);

  const current_company_id = user ? user.company_id : company_id;

  const [message, setMessage] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("SERVICE");

  const [companyName, setCompanyName] = useState("");

  async function getForm() {
    let rawResponse = await fetch("/api/forms");
    let response = await rawResponse.json();

    let name = await response.find(
      (company) => company.id == current_company_id
    ).name;
    setCompanyName(name);
  }

  useEffect(() => {
    getForm();
  }, []);

  async function postTicket(e) {
    e.preventDefault();

    const data = {
      firstname,
      lastname,
      email,
      message,
      subject,
      company_id: current_company_id,
    };

    const route = `/api/tickets/${current_company_id}`;

    // the UsePost method will return an id if there is one (otherwise it retun 0)
    const ticket_id = await UsePost(data, route);

    if (ticket_id) {
      await sendEmail(ticket_id);
      // alert that email has been sent, then clear form
      alert(
        `Thank you for submitting your inquiry!\n An email with a chat-link has been sent to "${email}".`
      );
      setFirstname("");
      setLastname("");
      setEmail("");
      setMessage("");
    }
  }

  async function sendEmail(ticketId) {
    const data = {
      email,
      firstname,
      lastname,
      ticket_id: ticketId,
    };
    const route = `/api/sendemail/${current_company_id}`;

    UsePost(data, route);
  }

  return (
    <div className="form-placement">
      <div className="form-container">
        <header>
          <h1>Customer Support</h1>
        </header>
        <h1>{companyName}</h1>
        <h2>Customer support form</h2>
        <form id="form" onSubmit={postTicket}>
          <input
            type="text"
            onChange={(e) => setFirstname(e.target.value)}
            id="firstname"
            value={firstname}
            placeholder="First name"
            required
          />
          <input
            type="text"
            onChange={(e) => setLastname(e.target.value)}
            id="lastname"
            value={lastname}
            placeholder="Last name"
            required
          />
          <input
            type="text"
            onChange={(e) => setEmail(e.target.value)}
            id="email"
            value={email}
            placeholder="Email"
            required
          />
          <div className="radio-container">
            <div className="radio-products">
              <input
                type="radio"
                id="products"
                name="form-type"
                value="PRODUCT"
                checked={subject === "PRODUCT"}
                onChange={(e) => setSubject(e.target.value)}
              ></input>
              <label id="products">Products</label>
            </div>
            <div className="radio-services">
              <input
                type="radio"
                id="services"
                name="form-type"
                value="SERVICE"
                checked={subject === "SERVICE"}
                onChange={(e) => setSubject(e.target.value)}
              ></input>
              <label id="services">Services</label>
            </div>
          </div>
          <textarea
            onChange={(e) => setMessage(e.target.value)}
            id="message"
            value={message}
            placeholder="Your message here"
            required
          />
          <div className="button-container">
            <button
              id="close"
              disabled={user ? true : false}
              onClick={() => navigate("/customer")}
            >
              Close
            </button>
            <input
              type="submit"
              disabled={user ? true : false}
              value="Submit"
            />
          </div>
        </form>
        {user ? (
          <p className="iframe-link">
            [ <strong>iFrame link: </strong>
            {`http://localhost:5173/form/${user.company_id}`} ]
          </p>
        ) : null}
      </div>
    </div>
  );
}
