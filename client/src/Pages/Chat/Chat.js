import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { UserContext } from "../Context/UserContext";
import "./Chat.css";

const socket = io("https://task-master-2.onrender.com");

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]); // Ensure messages is initialized as an empty array
  const [isChatOpen, setIsChatOpen] = useState(false); // Controls popup visibility
  const [projectName, setProjectName] = useState(""); // New state to store project name

  const { user, setUser, isDarkMode } = useContext(UserContext); // Access user from context

  const username = user?.username;
  const userId = user?.userId;
  const email = user?.email;

  const projectId = localStorage.getItem("selectedProjectId"); // Get projectId from localStorage

  useEffect(() => {
    if (projectId) {
      // Reset messages when project changes
      setMessages([]);
      setMessage("");

      // Fetch project and chat history in a single API call
      axios
        .get(
          `https://task-master-2.onrender.com/api/projects/chat/${projectId}`
        )
        .then((response) => {
          const { data } = response.data;
          if (data && data.length > 0) {
            setProjectName(data[0].projectname);
            setMessages(data);
          } else {
            console.error("No data found for this project.");
          }
        })
        .catch((err) =>
          console.error("Error fetching project and chat data:", err)
        );

      // Join the new project's chat room
      socket.emit("joinProject", { projectId });

      // Listen for new messages
      socket.on("receiveMessage", (newMessage) => {
        // Only add messages for the current project
        if (newMessage.projectId === projectId) {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      });
    } else {
      console.error("ProjectId is undefined or missing!");
    }

    // Cleanup the socket listener
    return () => {
      socket.off("receiveMessage");
    };
  }, [projectId]);

  const handleSendMessage = (e) => {
    e.preventDefault();

    const newMessage = {
      projectId,
      senderEmail: email,
      senderName: username,
      message,
    };

    // Emit the new message via Socket.IO to notify other users in the project
    socket.emit("sendMessage", newMessage);

    // Immediately append the new message to the chat without waiting for the backend
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    // Save the message to the backend
    axios
      .post(
        "https://task-master-2.onrender.com/api/projects/messages",
        newMessage
      )
      .then((response) => {
        console.log("Message saved:", response.data);

        // Fetch updated chat history after sending the message
        axios
          .get(
            `https://task-master-2.onrender.com/api/projects/chat/${projectId}`
          )
          .then((response) => {
            const chatHistory = response.data.data;
            if (Array.isArray(chatHistory)) {
              setMessages(chatHistory);
            } else {
              setMessages([chatHistory]);
            }
          })
          .catch((err) => console.error("Error fetching chat history:", err));
      })
      .catch((err) => console.error("Error sending message:", err));

    // Clear the message input field after sending
    setMessage("");
  };

  return (
    <div
      className="chat-system"
      style={{
        position: "absolute",
        bottom: window.innerWidth < 780 ? "1%" : "7%",
        right: window.innerWidth < 780 ? "1%" : "5.2%",
        width: window.innerWidth < 780 ? "90%" : "25%",
        height: isChatOpen ? "400px" : "60px",
        backgroundImage:
          "radial-gradient(circle 1300px at 58% 90%, #2c3e50, #1a252f 70%)",
        borderRadius: "12px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
        transition: "0.5s ease",
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: isDarkMode ? "white" : "#34495e",
          color: isDarkMode ? "black" : "white",
          padding: "12px 15px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          borderBottom: "1px solid #7f8c8d",
          borderTopLeftRadius: "12px",
          borderTopRightRadius: "12px",
        }}
        onClick={() => setIsChatOpen(!isChatOpen)}
      >
        <h3 style={{ margin: 0, fontSize: "1.1rem" }}>{projectName} Chats</h3>
        <span>{isChatOpen ? "▼" : "▲"}</span>
      </div>

      {/* Messages Area */}
      {isChatOpen && (
        <div
          className="chat-body"
          style={{
            flex: 1,
            padding: "15px",
            overflowY: "auto",
            backgroundColor: isDarkMode ? "white" : "#2c3e50",
            color: "#ecf0f1",
            borderBottom: "1px solid #7f8c8d",
            borderRadius: "2px",
            scrollbarWidth: "none",
          }}
        >
          {Array.isArray(messages) && messages.length > 0 ? (
            messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent:
                    msg.senderemail === email ? "flex-end" : "flex-start",
                  marginBottom: "15px",
                }}
              >
                <div
                  style={{
                    maxWidth: "70%",
                    padding: "12px",
                    backgroundColor:
                      msg.senderemail === email ? "#3498db" : "#95a5a6",
                    color: isDarkMode ? "black" : "#FFF",
                    borderRadius: "20px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.9rem",
                      opacity: 0.9,
                      fontWeight: "bold",
                    }}
                  >
                    {msg.username}
                  </p>
                  <p style={{ margin: "5px 0", fontSize: "1rem" }}>
                    {msg.message}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>No messages available</p>
          )}
        </div>
      )}

      {/* Input Area */}
      {isChatOpen && (
        <form
          onSubmit={handleSendMessage}
          style={{
            display: "flex",
            padding: "10px 15px",
            backgroundColor: "#34495e",
            borderTop: "1px solid #7f8c8d",
            borderBottomLeftRadius: "12px",
            borderBottomRightRadius: "12px",
          }}
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            style={{
              flex: 1,
              padding: "12px",
              border: "none",
              borderRadius: "20px",
              marginRight: "10px",
              outline: "none",
              fontSize: "1rem",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "12px",
              backgroundColor: "#3498db",
              border: "none",
              color: "#FFF",
              borderRadius: "20px",
              cursor: "pointer",
              fontSize: "1.1rem",
            }}
          >
            ➤
          </button>
        </form>
      )}
    </div>
  );
};

export default Chat;

// import React, { useState, useEffect, useContext } from 'react';
// import io from 'socket.io-client';
// import axios from 'axios';
// import { UserContext } from '../Context/UserContext';

// const socket = io('http://localhost:9000');

// const Chat = () => {
//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [isChatOpen, setIsChatOpen] = useState(true); // Controls popup visibility
//   const [projectName, setProjectName] = useState(''); // New state to store project name

//   const { user } = useContext(UserContext); // Access user from context

//   const projectId = localStorage.getItem('selectedProjectId');
//   const username = user?.username;
//   const userId = user?.userId;
//   const email = user?.email;

//   useEffect(() => {
//     if (projectId) {
//       // Reset messages when project changes
//       setMessages([]);
//       setMessage('');

//       // Fetch project and chat history in a single API call
//       axios
//         .get(`http://localhost:9000/api/projects/chat/${projectId}`) // Assuming the new backend endpoint
//         .then((response) => {
//           const { data } = response.data;  // Data contains both messages and project name

//           if (data && data.length > 0) {
//             setProjectName(data[0].projectname);  // Set project name from the response
//             console.log("Project Name:", data[0].projectname);

//             setMessages(data);  // Set all chat messages
//             console.log("Messages:", data);

//           } else {
//             console.error('No data found for this project.');
//           }
//         })
//         .catch((err) => console.error('Error fetching project and chat data:', err));

//       // Join the new project's chat room
//       socket.emit('joinProject', { projectId });
//       console.log("Joined project:", projectId);
//     } else {
//       console.error('ProjectId is undefined or missing!');
//     }

//     // Cleanup the socket listener to prevent duplicate handling
//     return () => {
//       socket.off('receiveMessage');
//     };
//   }, [projectId]);

//   const handleSendMessage = (e) => {
//     e.preventDefault();

//     const newMessage = {
//       projectId,
//       senderEmail: email,
//       senderName: username,
//       message,
//     };

//     // Emit message via Socket.IO
//     socket.emit('sendMessage', newMessage);

//     // Save message to backend
//     axios
//       .post('http://localhost:9000/api/projects/messages', newMessage)
//       .then((response) => {
//         console.log('Message saved:', response.data);
//       })
//       .catch((err) => console.error('Error sending message:', err));

//     setMessage('');
//   };

//   return (
//     <div
//       style={{
//         position: 'fixed',
//         bottom: '20px',
//         right: '20px',
//         width: isChatOpen ? '20%' : '20%',
//         height: isChatOpen ? '400px' : '50px',
//         backgroundColor: '#003534',
//         borderRadius: '10px',
//         overflow: 'hidden',
//         display: 'flex',
//         flexDirection: 'column',
//         boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
//         transition: '0.3s ease',
//       }}
//     >
//       {/* Header */}
//       <div
//         style={{
//           backgroundColor: '#025E4C',
//           color: '#FFF',
//           padding: '10px',
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           cursor: 'pointer',
//         }}
//         onClick={() => setIsChatOpen(!isChatOpen)}
//       >
//         <h3 style={{ margin: 0, fontSize: '1rem' }}>{projectName}</h3>
//         <span>{isChatOpen ? '▼' : '▲'}</span>
//       </div>

//       {/* Messages Area */}
//       {isChatOpen && (
//         <div
//           style={{
//             flex: 1,
//             padding: '10px',
//             overflowY: 'auto',
//             backgroundColor: '#002D2B',
//           }}
//         >
//           {messages.map((msg, index) => (
//             <div
//               key={index}
//               style={{
//                 display: 'flex',
//                 justifyContent: msg.senderId === userId ? 'flex-end' : 'flex-start',
//                 marginBottom: '10px',
//               }}
//             >
//               <div
//                 style={{
//                   maxWidth: '70%',
//                   padding: '10px',
//                   backgroundColor: msg.senderId === userId ? '#01796F' : '#013E3E',
//                   color: '#FFF',
//                   borderRadius: '10px',
//                 }}
//               >
//                 <p
//                   style={{
//                     margin: 0,
//                     fontSize: '0.8rem',
//                     opacity: 0.8,
//                   }}
//                 >
//                   {username}
//                 </p>
//                 <p style={{ margin: '5px 0' }}>{msg.message}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Input Area */}
//       {isChatOpen && (
//         <form
//           onSubmit={handleSendMessage}
//           style={{
//             display: 'flex',
//             padding: '10px',
//             backgroundColor: '#013E3E',
//             borderTop: '1px solid #025E4C',
//           }}
//         >
//           <input
//             type="text"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             placeholder="Type your message here..."
//             style={{
//               flex: 1,
//               padding: '10px',
//               border: 'none',
//               borderRadius: '5px',
//               marginRight: '10px',
//               outline: 'none',
//             }}
//           />
//           <button
//             type="submit"
//             style={{
//               padding: '10px',
//               backgroundColor: '#01796F',
//               border: 'none',
//               color: '#FFF',
//               borderRadius: '5px',
//               cursor: 'pointer',
//             }}
//           >
//             ➤
//           </button>
//         </form>
//       )}
//     </div>
//   );
// };

// export default Chat;
