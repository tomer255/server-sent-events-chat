import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [messages, setMessage] = useState([]);
  const refId = useRef(null);

  const events = useMemo(
    () => ({
      message: ({ sender, message }) =>
        setMessage((prev) => [...prev, { sender, message }]),
      connect: ({ id }) => (refId.current = id),
    }),
    []
  );

  const handleTabClose = (event) => {
    event.preventDefault();
    axios.post("/api/events/disconnect", { id: refId.current });
  };

  useEffect(() => {
    const source = new EventSource("/api/events/connect");
    source.addEventListener("message", (messageEvent) => {
      const { event, data } = JSON.parse(messageEvent.data);
      events[event](data);
    });

    window.addEventListener("beforeunload", handleTabClose);
    return () => {
      window.removeEventListener("beforeunload", handleTabClose);
      source.close();
    };
  }, [events]);

  const send = (e) => {
    e.preventDefault();
    const message = e.target.message.value;
    axios.post("/api/events/sendAll", { message, sender: refId.current });
    e.target.message.value = "";
  };

  return (
    <dev>
      <div style={{ height: "50vh", overflow: "auto" }}>
        {messages.map(({ sender, message }, i) => (
          <p key={i}>
            {sender} : {message}
          </p>
        ))}
      </div>
      <form onSubmit={send}>
        <input name="message" />
        <button>send</button>
      </form>
    </dev>
  );
}

export default App;
