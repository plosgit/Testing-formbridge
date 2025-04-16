import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import chatIcon from "../assets/chaticon2.png"
import checkIcon from "../assets/check_icon.png"

export default function Tickets() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate(); 

    async function getTickets() {
        let rawResponse = await fetch('/api/tickets');

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
        <div className="tickets-container">
            <div className="header">
                <h1>Dashboard</h1>
            </div>

            <div className="menu">
                <h2><i className="fa-solid fa-table-list"></i> Overview</h2>
                <h2><i className="fa-solid fa-ticket"></i> All Tickets</h2>
                <h2><i className="fa-solid fa-user"></i> Assigned to Me</h2>
            </div>

            <div className="content">
                {loading ? (
                    <p>Loading tickets...</p>
                ) : error ? (
                    <p style={{ color: "red" }}>{error}</p>
                ) : tickets.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Ticket ID</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>Message</th>
                                <th>Status</th>
                                <th>Company</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map(ticket => (
                                <tr key={ticket.id}>
                                    <td>{ticket.id}</td>
                                    <td>{ticket.firstname}</td>
                                    <td>{ticket.lastname}</td>
                                    <td>{ticket.email}</td>
                                    <td>{ticket.message}</td>
                                    <td>{ticket.resolved ? "Resolved" : "Active"}</td>
                                    <td>{ticket.company_name}</td>
                                    <td>
                                        <button onClick={() => navigate(`/chat/${ticket.id}`)}>
                                            <img src={chatIcon} alt="chatIcon" />
                                        </button>
                                        <button onClick={() => resolveTicket(ticket.id)}>
                                            <img src={checkIcon} alt="checkIcon" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No tickets found</p>
                )}
            </div>

            <div className="footer"></div>
        </div>
    );
}

