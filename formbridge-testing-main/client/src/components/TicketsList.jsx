import { useNavigate } from "react-router";
import chatIcon from "../assets/chaticon.png";
import checkIcon from "../assets/checkIcon.png";
import status_active from "../assets/status_active.png";
import status_resolved from "../assets/status_resolved.png";
import { useState } from "react";

export default function MyTickets({ tickets, getTickets }) {
  const navigate = useNavigate();

  const [expandedTicket, setExpandedTicket] = useState(null);

  function toggleExpandTicket(id) {
    if (expandedTicket == id) {
      setExpandedTicket(null);
    } else {
      setExpandedTicket(id);
    }
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

  return tickets.length > 0 ? (
    <div className="content">
      <table>
        <thead>
          <tr>
            <th>Status</th>
            <th>Created at</th>
            <th>Subject</th>
            <th>Name</th>
            <th>Email</th>
            <th>Message</th>
            <th>Rating</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id}>
              <td
                className="status"
                onClick={() => toggleExpandTicket(ticket.id)}
              >
                <img
                  className="status-icon"
                  src={ticket.resolved ? status_resolved : status_active}
                  alt="status_icon"
                />
              </td>
              <td
                className="date"
                onClick={() => toggleExpandTicket(ticket.id)}
              >
                {new Date(ticket.created_at).toISOString().split("T")[0]}
              </td>
              <td onClick={() => toggleExpandTicket(ticket.id)}>
                {ticket.subject}
              </td>
              <td
                className={`table-text ${
                  expandedTicket == ticket.id ? "expanded" : ""
                }`}
                onClick={() => toggleExpandTicket(ticket.id)}
              >
                {ticket.firstname} {ticket.lastname}
              </td>
              <td
                className={`table-text ${
                  expandedTicket == ticket.id ? "expanded" : ""
                }`}
                onClick={() => toggleExpandTicket(ticket.id)}
              >
                {ticket.email}
              </td>
              <td
                className={`table-text ${
                  expandedTicket == ticket.id ? "expanded" : ""
                }`}
                onClick={() => toggleExpandTicket(ticket.id)}
              >
                {ticket.message}
              </td>
              <td>{ticket.rating}</td>
              <td className="table-actions-support">
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
    </div>
  ) : (
    <div>
      <h2>There are no Tickets on this page...</h2>
    </div>
  );
}
