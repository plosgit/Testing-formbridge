import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { GlobalContext } from "../GlobalContext.jsx";
import TicketsList from "../components/TicketsList.jsx";
import Formbridge from "../components/Formbridge.jsx";

export default function Admin() {
  const { getLogin, logout, user } = useContext(GlobalContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [allTickets, setAllTickets] = useState([]);
  const [productTickets, setProductTickets] = useState([]);
  const [serviceTickets, setServiceTickets] = useState([]);
  const [activeTickets, setActiveTickets] = useState([]);
  const [resolvedTickets, setResolvedTickets] = useState([]);

  const [activeTicketList, setActiveTicketList] = useState([]);
  const [currentActiveList, setCurrentActiveList] = useState("all-tickets");
  const [ticketsMenu, setTicketsMenu] = useState(true);


  async function getTickets() {
    let rawResponse = await fetch(`/api/tickets/${user.company_id}`);

    let response = await rawResponse.json();

    setAllTickets(response);
    setProductTickets(filterTickets(response, 'subject', 'product'));
    setServiceTickets(filterTickets(response, 'subject', 'service'));
    setActiveTickets(filterTickets(response, 'resolved', false));
    setResolvedTickets(filterTickets(response, 'resolved', true));

    setLoading(false);

    switch (currentActiveList) {
      case 'all-tickets':
        setActiveTicketList(response);
        break;
      case 'product-tickets':
        setActiveTicketList(filterTickets(response, 'subject', 'product'));
        break;
      case 'service-tickets':
        setActiveTicketList(filterTickets(response, 'subject', 'service'));
        break;
      case 'active-tickets':
        setActiveTicketList(filterTickets(response, 'resolved', false));
        break;
      case 'resolved-tickets':
        setActiveTicketList(filterTickets(response, 'resolved', true));
        break;
    }
  }

  function filterTickets(data, column, filter) {
    return data.filter((ticket => ticket[column] == filter));
  }

  useEffect(() => {
    getLogin();
    getTickets();
  }, []);


  function changeContent(option) {
    setCurrentActiveList(option);
    
    switch (option) {
      case 'all-tickets':
        setActiveTicketList(allTickets);
        break;
      case 'product-tickets':
        setActiveTicketList(productTickets);
        break;
      case 'service-tickets':
        setActiveTicketList(serviceTickets);
        break;
      case 'active-tickets':
        setActiveTicketList(activeTickets);
        break;
      case 'resolved-tickets':
        setActiveTicketList(resolvedTickets);
        break;
    }
  }

  async function logoutUser() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="placement">
      <div className="container">
        <header>
          <h1>{user.company_name}</h1>
          <h2>Support Dashboard</h2>
        </header>
        <aside className="menu">
          <div>
            <button
              onClick={() => setTicketsMenu(!ticketsMenu)}
            >
              Tickets
            </button>
            {ticketsMenu ? (
              <>
                <button
                  id="all-tickets"
                  className="sub-button"
                  onClick={(e) => changeContent(e.target.id)}
                  disabled={currentActiveList == 'all-tickets'}
                >
                  All Tickets
                </button>
                <button
                  id="product-tickets"
                  className="sub-button"
                  onClick={(e) => changeContent(e.target.id)}
                  disabled={currentActiveList == 'product-tickets'}
                >
                  Product
                </button>
                <button
                  id="service-tickets"
                  className="sub-button"
                  onClick={(e) => changeContent(e.target.id)}
                  disabled={currentActiveList == 'service-tickets'}
                >
                  Service
                </button>
                <button
                  id="active-tickets"
                  className="sub-button"
                  onClick={(e) => changeContent(e.target.id)}
                  disabled={currentActiveList == 'active-tickets'}
                >
                  Active
                </button>
                <button
                  id="resolved-tickets"
                  className="sub-button"
                  onClick={(e) => changeContent(e.target.id)}
                  disabled={currentActiveList == 'resolved-tickets'}
                >
                  Resolved
                </button>
              </>
            ) : (
              <></>
            )}
          </div>
          <div>
            <div className="image-text">
              <img src="../src/assets/agents_icon.png" />
              <p>{user.firstname} {user.lastname}</p>
            </div>
            {user.role == "ADMIN" && (
              <button id="change-dashboard" onClick={() => navigate("/admin")}>
                Admin Dashboard
              </button>
            )}

            <button id="logout" className="image-text" onClick={logoutUser}>
              <img src="../src/assets/signout_icon.png" />
              Logout
            </button>
          </div>
        </aside>
        <main>
          {
            loading ?
              <p>Loading tickets...</p>
              :
              <TicketsList tickets={activeTicketList} getTickets={getTickets} />
          }
        </main>
        <footer>
          <Formbridge />
        </footer>
      </div>
    </div>
  );
}
