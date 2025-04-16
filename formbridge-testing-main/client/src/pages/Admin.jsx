import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { GlobalContext } from "../GlobalContext.jsx";
import SupportTable from "../components/SupportTable.jsx";
import Formbridge from "../components/Formbridge.jsx";
import Form from "../components/Form.jsx";
import EditForm from "../components/EditForm.jsx";
import EditAI from "../components/EditAI.jsx";

export default function Admin() {
  const { getLogin, logout, user } = useContext(GlobalContext);
  const navigate = useNavigate();

  const [content, setContent] = useState({});
  const [toggleAdd, setToggleAdd] = useState(false);

  const contentList = [
    { name: "view-support", parent: "support"},
    { name: "view-form", parent: "form"},
    { name: "edit-form", parent: "form"},
    { name: "edit-ai", parent: "edit-ai"},
  ];


  async function verifyUser() {
    await getLogin();
  }

  useEffect(() => {
    verifyUser();
    changeContent("view-support");
  }, []);

  function changeContent(option) {
    setContent(contentList.find((c) => c.name == option));
  }

  async function logoutUser() {
    await logout();
    navigate("/login");
  }

  function getComponent() {
    switch (content.name) {
      case 'view-support':
        return <SupportTable toggleAdd={toggleAdd} setToggleAdd={setToggleAdd} />
      case 'view-form':
        return <Form />
      case 'edit-form':
        return <EditForm />
      case 'edit-ai':
        return <EditAI />
    }
  }

  return !user ? (
    <p>You have no authority here!</p>
  ) : user.role != "ADMIN" ? (
    <p>You have no authority here!</p>
  ) : (
    <>
      <div className="placement">
        <div className="container">
          <header>
            <h1>{user.company_name}</h1>
            <h2>Admin Dashboard</h2>
          </header>
          <aside className="menu">
            <div>
              <button
                onClick={() => changeContent("view-support")}
                disabled={content.parent == "support"}
              >
                Support Agents
              </button>
              {content.parent == "support" ? (
                <>
                  <button
                    id="view-support"
                    className="sub-button"
                    onClick={(e) => changeContent(e.target.id)}
                    disabled={content.name == "view-support"}
                  >
                    All Support Personnel
                  </button>
                  <button
                    className={toggleAdd ? "sub-button toggled" : "sub-button"}
                    onClick={() => (toggleAdd ? setToggleAdd(false) : setToggleAdd(true))}>
                    Add User
                  </button>
                </>
              ) : (
                <></>
              )}
              <button
                onClick={() => changeContent("view-form")}
                disabled={content.parent == "form"}
              >
                Form
              </button>
              {content.parent == "form" ? (
                <>
                  <button
                    id="view-form"
                    className="sub-button"
                    onClick={(e) => changeContent(e.target.id)}
                    disabled={content.name == "view-form"}
                  >
                    View Form
                  </button>
                  <button
                    id="edit-form"
                    className="sub-button"
                    onClick={(e) => changeContent(e.target.id)}
                    disabled={content.name == "edit-form"}
                  >
                    Edit Form
                  </button>
                </>
              ) : (
                <></>
              )}
              <button
                id="edit-ai"
                onClick={(e) => changeContent(e.target.id)}
                disabled={content.name == "edit-ai"}
              >
                AI ChatBot
              </button>
            </div>
            <div>
              <div className="image-text">
                <img src="../src/assets/agents_icon.png" />
                <p>
                  {user.firstname} {user.lastname}
                </p>
              </div>
              <button
                id="change-dashboard"
                onClick={() => navigate("/support")}
              >
                Support Dashboard
              </button>
              <button id="logout" className="image-text" onClick={logoutUser}>
                <img src="../src/assets/signout_icon.png" />
                Logout
              </button>
            </div>
          </aside>
          <main>
            {
              getComponent(content.name)
            }
          </main>
          <footer>
            <Formbridge />
          </footer>
        </div>
      </div>
    </>
  );
}
