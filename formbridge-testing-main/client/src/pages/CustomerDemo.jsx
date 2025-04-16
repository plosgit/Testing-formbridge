import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Form from "../components/Form.jsx";

export default function CustomerDemo() {
  const [selectedCompanyId, setSelectedCompanyId] = useState(0);
  const [formList, setFormList] = useState([]);
  const navigate = useNavigate();

  async function getForm() {
    let rawResponse = await fetch("/api/forms");
    let response = await rawResponse.json();

    setSelectedCompanyId(response[0].companyId);

    setFormList(response);
  }

  useEffect(() => {
    getForm();
    console.log("Getting all forms!");
  }, []);

  return (
    <>
      <div className="placement">
        <div className="form-container">
          <header>
            <h1>Choose Company</h1>
          </header>
          <select
            className="company-select"
            onChange={(e) => setSelectedCompanyId(e.target.value)}
          >
            {formList.map((form, index) => (
              <option
                className="company-option"
                key={index}
                value={form.companyId}
              >
                {form.name}
              </option>
            ))}
          </select>
          <div className="button-container company-buttons">
            <button id="close" onClick={() => navigate("/")}>
              Return
            </button>
            <button
              id="submit"
              onClick={() => navigate(`/form/${selectedCompanyId}`)}
            >
              Pick
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
