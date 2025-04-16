import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { GlobalContext } from "../../GlobalContext";

export default function Form() {

  const { company_id } = useParams();
  const { UsePost } = useContext(GlobalContext);

  const [message, setMessage] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");

  const [companyName, setCompanyName] = useState("");

  async function getForm() {
    let rawResponse = await fetch('/api/forms');
    let response = await rawResponse.json();

    let name = await response.find((company) => company.id == company_id).name;
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
      company_id: company_id
    };

    const route = `/api/tickets/${company_id}`;

    await UsePost(data, route);

    await sendEmail();
  }

  async function sendEmail() {

    let data = {
      email,
      firstname,
      lastname
    };

    let rawResponse = await fetch(`/api/sendemail/${company_id}`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    // TODO: add error handling
  }

  return (
    <div className="placement">
      <div className="form-container">
        <header>
          <h1>Customer Support</h1>
        </header>
        <h1>{companyName}</h1>
        <h2>Customer support form</h2>
        <form id="form">
          <input type="text" onChange={(e) => setFirstname(e.target.value)} id="firstname" placeholder="First name" />
          <input type="text" onChange={(e) => setLastname(e.target.value)} id="lastname" placeholder="Last name" />
          <input type="text" onChange={(e) => setEmail(e.target.value)} id="email" placeholder="Email" />
          <div className="radio-container">
            <div className="radio-products">
              <input type="radio" id="products" name="form-type" value="products"></input>
              <label for="products" id="products">Products</label>
            </div>
            <div className="radio-services">
              <input type="radio" id="services" name="form-type" value="services"></input>
              <label for="services" id="services">Services</label>
            </div>
          </div>
          <textarea onChange={(e) => setMessage(e.target.value)} id="message" placeholder="Your message here" />
          <div className="button-container">
          <button id="close">Close</button>
          <input type="submit" onClick={postTicket} value="Submit" />

          </div>
        </form>
      </div>
    </div>
  )
}
