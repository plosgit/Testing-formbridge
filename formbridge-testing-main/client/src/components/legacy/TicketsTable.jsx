import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import chatIcon from "../assets/chaticon.png";
import checkIcon from "../assets/checkIcon.png";
import status_active from "../assets/status_active.png";
import status_resolved from "../assets/status_resolved.png";
import { GlobalContext } from "../../GlobalContext";

export default function Tickets() {
  const { user } = useContext(GlobalContext);

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const [expandedTicket, setExpandedTicket] = useState(null);

  async function toggleExpandTicket(id) {
    if (expandedTicket === id) {
      setExpandedTicket(null);
    } else {
      setExpandedTicket(id);
    }
  }

  async function getTickets() {
    let rawResponse = await fetch(`/api/tickets/${user.company_id}`);

    let response = await rawResponse.json();
    console.log(response);

    setTickets(response);
    setLoading(false);
  }

  async function resolveTicket(ticket_id) {
    let response = await fetch(`/api/tickets/${ticket_id}/resolve`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });
    //handle try-catch
    getTickets(); //update and re-read all tickets
  }

  useEffect(() => {
    getTickets();
  }, []);

  return (
    <div className="content">
      {loading ? (
        <p>Loading tickets...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : tickets.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Status</th>
              <th>Created at</th>
              <th>Subject</th>
              <th>Name</th>
              <th>Email</th>
              <th>Message</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id} onClick={() => toggleExpandTicket(ticket.id)}>
                <td>
                  <img
                    src={ticket.resolved ? status_resolved : status_active}
                    alt="status_icon"
                  />
                </td>
                <td className="date">
                  {new Date(ticket.created_at).toISOString().split('T')[0]}
                </td>
                <td>{ticket.subject}</td>
                <td className={`table-text ${expandedTicket == ticket.id ? "expanded" : ""}`}>
                  {ticket.firstname} {ticket.lastname}
                </td>
                <td className={`table-text ${expandedTicket == ticket.id ? "expanded" : ""}`}>
                  {ticket.email}
                </td>
                <td className={`table-text ${expandedTicket == ticket.id ? "expanded" : ""}`}>
                  {ticket.message}
                </td>
                <td className="table-actions">
                  <img
                    src={chatIcon}
                    onClick={() => navigate(`/chat/${ticket.id}`)}
                    alt="chatIcon"
                    className="ticket-chaticon"
                  />
                  <img
                    src={checkIcon}
                    onClick={() => resolveTicket(ticket.id)}
                    alt="checkIcon"
                    className="ticket-checkicon"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No tickets found</p>
      )}
    </div>
  );
}
