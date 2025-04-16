import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import { GlobalContext } from "../GlobalContext";
import Formbridge from "../components/Formbridge.jsx";
import chatIcon from "../assets/chaticon.png";
import sendButton from "../assets/sendbutton.png";
import sendButtonGrey from "../assets/sendbutton_grey.png";
import chat_active from "../assets/chat_active.png";
import chat_resolved from "../assets/chat_resolved.png";
import x_icon from "../assets/x.png";

export default function Chat() {
  const { UsePost, user } = useContext(GlobalContext);
  const { ticket_id } = useParams();

  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [firstMessage, setFirstMessage] = useState("");
  const [currentTicket, setCurrentTicket] = useState([]);
  const [selectedRating, setSelectedRating] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const isSupport = user ? true : false;

  //takes prompts and fetches ai-response
  async function promptAI(prompt) {
    setIsLoading(true);
    setNewMessage("");
    let rawModelFile = await fetch(`/api/ai/${user.company_id}`);
    let modelFile = await rawModelFile.json();

    try {
      const response = await fetch("http://127.0.0.1:11434/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3.2:latest",
          stream: false, // Get single response? TODO:
          prompt: modelFile.modelfile + prompt,
        }),
      });

      const data = await response.json();
      return {
        message: data.response,
        isAI: true,
      };
    } catch (error) {
      console.error("Error:", error);

      return {
        message: prompt,
        isAI: false,
      };
    } finally {
      setIsLoading(false);
    }
  }

  //Sends Messages to database (and is read through getMessages)
  async function sendMessage(e) {
    e.preventDefault();

    let message = newMessage;
    let isAI = false;

    if (user) {
      if (newMessage.startsWith(">")) {
        const aiResponse = await promptAI(newMessage);
        message = aiResponse.message;
        isAI = aiResponse.isAI;
      }
    }

    const sendData = {
      ticket_id: ticket_id,
      support_id: user ? user.id : 0,
      message: message,
      from_support: isSupport ? true : false,
      from_AI: isAI,
    };

    const route = `/api/messages/${ticket_id}`;
    await UsePost(sendData, route);

    console.log("isAI true?: ", isAI);

    setNewMessage(""); // Clear input field
    await getMessages(ticket_id); // Refresh messages
  }

  //Reads chat-messages
  async function getMessages(ticket_id) {
    //GetMessages:
    let rawResponse = await fetch(`/api/messages/${ticket_id}`);
    let data = await rawResponse.json();

    //GetSingleTicket:
    let rawTicket = await fetch(`/api/tickets/${ticket_id}/single`);
    let ticket = await rawTicket.json();

    setFirstMessage(ticket.message);
    setCompanyName(ticket.company_name);
    setCurrentTicket(ticket);
    setMessages(data);
  }

  async function submitRating(selectedRating) {
    const ratingData = {
      rating: selectedRating,
      ticket_id: ticket_id,
    };

    const route = `/api/ratings/${ticket_id}`;
    await UsePost(ratingData, route);
  }

  useEffect(() => {
    getMessages(ticket_id);
  }, [ticket_id]); //load when ticket_id change

  useEffect(() => {
    if (!ticket_id) return;

    console.log("Entering chatroom.. starting chat");
    setInterval(() => {
      getMessages(ticket_id);
    }, 3000); // message-check every 3 sec

    return () => {
      clearInterval();
      console.log("Clearing interval, closing chat..");
    };
  }, [ticket_id]);

  return (
    <>
      <div className="placement">
        <section className="chat-container">
          <header className="chat-header">
            <img src={chatIcon} className="chat-icon" alt="chatIcon" />
            <div className="chat-header-textstack">
              <h2>{companyName}</h2>
              <p>Customer Support Chat</p>
            </div>
            <div className="icon-stack">
              <img
                src={currentTicket.resolved ? chat_resolved : chat_active}
                className="chat-active"
                alt="chat_status"
              />
              <img
                src={x_icon}
                className="x-icon"
                alt="close"
                onClick={() => (user ? navigate("/support") : navigate("/"))}
              />
            </div>
          </header>
          <section className="chat-box">
            <ul>
              <div className="inquiry-message">
                <strong>
                  <u>Your Inquiry:</u>
                </strong>
                <br />
                {currentTicket.message}
              </div>

              <li className="message support">
                <div className="text">
                  <strong>
                    Welcome {currentTicket.firstname} {currentTicket.lastname}!
                  </strong>
                  <br />
                  Thank you for providing your details.
                  <br />
                  We're reviewing your information now..
                </div>
              </li>

              {currentTicket.subject == "product" ? (
                <li className="message support">
                  <div className="text">
                    To proceed, please specify the product ID or any specific
                    details related to the product you're inquiring about.
                  </div>
                </li>
              ) : (
                <li className="message support">
                  <div className="text">
                    To help us assist you better, could you please specify the
                    service-related issue or provide any relevant details?
                  </div>
                </li>
              )}

              {messages.map((chat, index) => (
                <li
                  key={index}
                  className={`message ${chat.from_ai
                      ? "ai"
                      : chat.from_support
                        ? "support"
                        : "customer"
                    }`}
                >
                  <div className="text">{chat.message}</div>
                </li>
              ))}
            </ul>
          </section>
          <section className="message-input">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !isLoading &&
                  !currentTicket.resolved
                ) {
                  sendMessage(e);
                }
              }}
              placeholder={
                isLoading
                  ? "Generating AI-response.."
                  : "' >' for AI.. | Write message.."
              }
              disabled={currentTicket.resolved ? true : false}
            />
            <img
              src={
                currentTicket.resolved || isLoading
                  ? sendButtonGrey
                  : sendButton
              }
              type="submit"
              onClick={
                !isLoading && !currentTicket.resolved ? sendMessage : null
              }
              className={`
    ${currentTicket.resolved || isLoading ? "sendButtonDisabled" : "sendbutton"}
  `}
              alt="sendbutton"
            />
          </section>
        </section>
      </div>

      {!user && (
        <div className="placement-feedback">

          <div className="feedback">
            <p>Please rate us!</p>
            <div className="stars">
              {[5, 4, 3, 2, 1].map((star) => (
                <button
                  key={star}
                  className={`star ${star <= selectedRating ? "selected" : ""}`}
                  onClick={() => {
                    setSelectedRating(star), submitRating(star);
                  }}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      <Formbridge />
    </>
  );
}
