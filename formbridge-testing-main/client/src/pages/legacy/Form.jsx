import {useContext, useEffect, useState} from "react";
import {GlobalContext} from "../../GlobalContext";

export default function Form() {

  const {UsePost} = useContext(GlobalContext);

  const [message, setMessage] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");

  const [selectedCompanyId, setSelectedCompanyId] = useState(0);
  const [formList, setFormList] = useState([]);

  async function getForm() {
    let rawResponse = await fetch('/api/forms');
    let response = await rawResponse.json();
    setSelectedCompanyId(response[0].companyId);
    setFormList(response);
  }

  useEffect(() => {
    getForm();
    console.log("useEffect is called!");
  }, []);

  async function sendEmail(ticketId) {

    let data = {
      email,
      firstname,
      lastname,
      ticket_id: ticketId
    };
    

    let rawResponse = await fetch('api/sendemail', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }

  async function postTicket(e) {
    e.preventDefault();

    const data = {
      firstname,
      lastname,
      email,
      message,
      company_id: selectedCompanyId
    }

    try {
      // form/api/tickets is for dynamic routing
      const rawResponse = await fetch('api/tickets', {
        // tell the server we want to send/create data
        method: 'post', // and that we will send data json formatted
        headers: {'Content-Type': 'application/json'}, // the data encoded as json
        body: JSON.stringify(data)
      });

      const response = await rawResponse.json();
      await sendEmail(response.id);

      rawResponse.ok
        ?
        console.log("Connected to backend.. \nConnected to database.. \n" + response.message)
        :
        console.log("Could not connect to backend.. \n" + rawResponse.status + " " + rawResponse.statusText);

    } catch (error) {
      console.error(error);
    }
  }


  return (
    <div className="placement">
      <div className="form-container">
        <header>Form</header>
        <select className="company-select" onChange={(e) => setSelectedCompanyId(e.target.value)}>
          {formList.map((form, index) => (
            <option className="company-option" key={index} value={form.companyId}>
              {form.name}
            </option>
          ))}
        </select>

        <h2>Customer support form</h2>
        <form id="form">
          <p>Message to customer</p>
          
          <input type="text" onChange={(e) => setFirstname(e.target.value)} id="firstname" placeholder="First name" />
          <input type="text" onChange={(e) => setLastname(e.target.value)} id="lastname" placeholder="Last name" />
          <input type="text" onChange={(e) => setEmail(e.target.value)} id="email" placeholder="Email" />
          <textarea onChange={(e) => setMessage(e.target.value)} id="message" placeholder="Your message here" />
          <input type="submit" onClick={postTicket} value="Submit" />
        </form>
      </div>
    </div>
  );
}
