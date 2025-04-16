import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { GlobalContext } from "../GlobalContext";

export default function EditAi() {
  // useParams is only used in demo
  const { company_id } = useParams();
  const { user } = useContext(GlobalContext);

  const current_company_id = user ? user.company_id : company_id;

  const [message, setMessage] = useState("");
  const [modelFile, setModelFile] = useState("");

  async function getModelFile(current_company_id) {
    let rawModelFile = await fetch(`/api/ai/${current_company_id}`);
    let modelFile = await rawModelFile.json();
    setModelFile(modelFile);
  }

  async function updateModelFile(e) {
    e.preventDefault();

    console.log("ID: ", current_company_id);
    console.log("Message: ", message);

    const response = await fetch(`/api/ai/${current_company_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_id: current_company_id,
        modelfile: message,
      }),
    });
    const data = await response.json();
    console.log("Response-data: ", data);
    if (response.ok) {
      alert("Your AI has been updated!");
      setMessage("");
      getModelFile(current_company_id);
    } else {
      alert(data.message);
    }
  }

  useEffect(() => {
    getModelFile(current_company_id);
  }, []);

  return (
    <div className="form-placement">
      <div className="form-container">
        <header>
          <h1>Edit AI ChatBot</h1>
        </header>
        <h1>Customize your ChatBot</h1>
        <h3>Give your bot some personality!</h3>
        <form id="form" onSubmit={updateModelFile}>
          <textarea
            onChange={(e) => setMessage(e.target.value)}
            id="message"
            name="message"
            value={message}
            placeholder="Describe your personality and functionality.."
            required
          />
          <div className="button-container">
            <input type="submit" value="Submit" />
          </div>
        </form>
        <details className="modalfile-preview">
          <summary>
            <strong>Current Settings: </strong>
          </summary>
          <p>"{modelFile.modelfile} "</p>
        </details>
      </div>
    </div>
  );
}
