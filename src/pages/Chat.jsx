import { useState, useEffect, useRef } from "react";
import { FiSend, FiTrash2, FiArrowLeft, FiRefreshCw } from "react-icons/fi";

export default function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [chatStarted, setChatStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [apiResponse, setApiResponse] = useState(null);
  const messagesEndRef = useRef(null);

  const employeeId = localStorage.getItem("employeeId") || "";
  const classId = localStorage.getItem("classId") || "";
  const sectionId = localStorage.getItem("sectionId") || "";
  const authToken = localStorage.getItem("token1") || "YOUR_AUTH_TOKEN";

  // Fetch messages when chat starts and poll every 10 seconds
  useEffect(() => {
    if (chatStarted) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 10000); // Poll every 10 seconds
      return () => clearInterval(interval);
    }
  }, [chatStarted]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Format date for display
  const formatDate = (dateStr) => {
    const date = parseCustomDate(dateStr);
    return date.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const parseCustomDate = (dateStr) => {
    if (!dateStr) return new Date(); // Fallback to current date if dateStr is missing
  
    // Example: "Mar 21 2025  4:57:57:577AM"
    const parts = dateStr.split(/[\s:]+/); // Split by spaces and colons
    if (parts.length < 7) return new Date(); // Fallback if the format is invalid
  
    const [month, day, year, hour, minute, second, millisecond, period] = parts;
  
    // Convert month to a number (0-11)
    const monthMap = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
    };
    const monthNumber = monthMap[month];
  
    // Convert 12-hour time to 24-hour time
    let hour24 = parseInt(hour, 10);
    if (period === "PM" && hour24 !== 12) hour24 += 12;
    if (period === "AM" && hour24 === 12) hour24 = 0;
  
    // Create a valid Date object
    return new Date(
      parseInt(year, 10),
      monthNumber,
      parseInt(day, 10),
      hour24,
      parseInt(minute, 10),
      parseInt(second, 10),
      parseInt(millisecond, 10)
    );
  };

  // Fetch messages from the API
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const payload = {
        empId: employeeId,
        classId,
        sectionId,
      };
      if (recipientId) {
        payload.recipientId = recipientId;
      }
      const response = await fetch(
        "https://arizshad-002-site5.ktempurl.com/api/Chats/GetMessages",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${authToken}`,
          },
          body: JSON.stringify(payload),
        }
      );
      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
        setApiResponse(data);
        console.log("API Response:", data); // Log the API response
      } catch (e) {
        console.error("Failed to parse response as JSON:", e);
        setError("Invalid response format from server");
        return;
      }
      if (!response.ok) {
        throw new Error(`Server error: ${response.status} - ${responseText}`);
      }
  
      // Combine sent and received messages into a single array
      const allMessages = [
        ...(data.sentMessages || []).map((msg) => ({ ...msg, isSent: true })),
        ...(data.receivedMessages || []).map((msg) => ({ ...msg, isSent: false })),
      ];
  
      // Log the combined messages before sorting
      console.log("Combined Messages (Before Sorting):", allMessages);
  
      // Sort messages by timestamp (sentDate)
      allMessages.sort((a, b) => {
        const timeA = parseCustomDate(a.sentDate);
        const timeB = parseCustomDate(b.sentDate);
        return timeA - timeB; // Sort in ascending order
      });
  
      // Log the sorted messages
      console.log("Sorted Messages (After Sorting):", allMessages);
  
      // Update messages state
      setMessages(allMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setError(`Failed to load messages: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  

  // Send a new message
  const sendMessage = async () => {
    if (input.trim() === "" || recipientId.trim() === "") return;

    const tempId = `temp-${Date.now()}`;
    const newMessage = {
      messageId: tempId,
      isSent: true, // This is sent by the user
      messageText: input,
      sentDate: new Date().toISOString(),
      senderName: "You",
      temp: true,
    };

    // Instantly add the message to the UI
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    try {
      const payload = {
        senderId: employeeId,
        recipientId,
        classId,
        sectionId,
        messageText: input,
      };
      const response = await fetch(
        "https://arizshad-002-site5.ktempurl.com/api/Chats/SendMessageFromParents",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${authToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const responseText = await response.text();
      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.status}`);
      }

      // Update temp message to sent status
      setMessages((prev) =>
        prev.map((msg) =>
          msg.messageId === tempId ? { ...msg, temp: false, sent: true } : msg
        )
      );

      // Fetch updated messages after a short delay
      setTimeout(fetchMessages, 1000);
    } catch (error) {
      console.error("Error sending message:", error);
      // Mark message as failed
      setMessages((prev) =>
        prev.map((msg) =>
          msg.messageId === tempId ? { ...msg, failed: true } : msg
        )
      );
    }
  };

  // Handle Enter key for sending messages
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Exit the chat
  const exitChat = () => {
    setChatStarted(false);
    setMessages([]);
    setApiResponse(null);
  };

  // Manually refresh messages
  const manualRefresh = () => {
    fetchMessages();
  };

  // Delete a message
  const deleteMessage = async (index, message) => {
    setMessages((prev) => prev.filter((_, i) => i !== index));

    if (message.temp) return; // Skip API call for unsent messages

    try {
      const response = await fetch(
        "https://arizshad-002-site5.ktempurl.com/api/Chats/DeleteMessage",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${authToken}`,
          },
          body: JSON.stringify({
            messageId: message.messageId,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to delete message");

      fetchMessages(); // Refresh messages after deleting
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="w-full max-w-md h-full max-h-[600px] flex flex-col bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {!chatStarted ? (
          <div className="p-6 bg-gray-700 flex flex-col space-y-4">
            <h2 className="text-xl font-semibold text-center mb-4">Start a New Chat</h2>
            <input
              type="text"
              className="w-full p-3 bg-gray-600 text-white rounded-lg outline-none"
              placeholder="Enter teacher's employee ID..."
              value={recipientId}
              onChange={(e) => setRecipientId(e.target.value)}
              autoFocus
            />
            <button
              onClick={() => {
                if (recipientId.trim()) {
                  setChatStarted(true);
                  fetchMessages();
                }
              }}
              className="w-full p-3 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Start Chat
            </button>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 bg-gray-700 border-b border-gray-600">
              <div className="flex items-center">
                <button
                  onClick={exitChat}
                  className="p-2 mr-2 rounded-full hover:bg-gray-600"
                  aria-label="Go back"
                >
                  <FiArrowLeft />
                </button>
                <div>
                  <h3 className="font-medium">Chat with Teacher</h3>
                  <p className="text-sm text-gray-400">ID: {recipientId}</p>
                </div>
              </div>
              <button
                onClick={manualRefresh}
                className="p-2 rounded-full hover:bg-gray-600"
                aria-label="Refresh messages"
              >
                <FiRefreshCw className={loading ? "animate-spin" : ""} />
              </button>
            </div>

            {/* Messages Display */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {loading && messages.length === 0 && (
                <div className="flex justify-center py-4">
                  <div className="animate-pulse text-gray-400">Loading messages...</div>
                </div>
              )}

              {messages.length > 0 ? (
                messages.map((msg, index) => (
                  <div
                    key={`${msg.messageId}-${index}`}
                    className={`flex flex-col ${
                      msg.isSent ? "items-end" : "items-start"
                    }`}
                  >
                    <div className="flex items-start max-w-xs lg:max-w-md">
                      <div
                        className={`p-3 rounded-lg ${
                          msg.isSent
                            ? "bg-blue-600 text-white"
                            : "bg-gray-700 text-gray-200"
                        } ${msg.failed ? "opacity-50" : ""}`}
                      >
                        <p>{msg.messageText || "No text"}</p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 px-1 flex items-center">
                      <span>{msg.senderName || (msg.isSent ? "You" : "Teacher")}</span>
                      {msg.failed && <span className="text-red-400 ml-1">Failed to send</span>}
                      {msg.temp && !msg.failed && <span className="text-blue-400 ml-1">Sending...</span>}
                      {(msg.sentDate || msg.receivedDate) && (
                        <span className="ml-2">
                          {formatDate(msg.sentDate || msg.receivedDate)}
                        </span>
                      )}
                      <button
                        onClick={() => deleteMessage(index, msg)}
                        className="ml-2 text-red-400 hover:text-red-600"
                        title="Delete message"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div>
                  <p className="text-gray-400 text-center py-6">
                    No messages yet. Start the conversation!
                  </p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="flex items-center p-3 bg-gray-700 border-t border-gray-600">
              <input
                type="text"
                className="flex-1 p-3 bg-gray-600 text-white rounded-lg outline-none"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                className="ml-2 p-3 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiSend className="text-white" size={18} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}