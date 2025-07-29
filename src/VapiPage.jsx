//version 3

// import { useEffect, useRef, useState } from 'react';
// import Vapi from '@vapi-ai/web';

// export default function VapiPage() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [callActive, setCallActive] = useState(false);
//   const vapiRef = useRef(null);

//   useEffect(() => {
//     const vapi = new Vapi('f1d348a4-ead8-4f35-a3dc-210de6cdc7c5');
//     vapiRef.current = vapi;

//     vapi.on('call-start', () => {
//       setCallActive(true);
//       console.log('✅ VAPI Call started');
//     });

//     vapi.on('call-end', () => {
//       setCallActive(false);
//       console.log('📞 VAPI Call ended');
//     });

//     vapi.on('message', (msg) => {
//       if (msg.type === 'transcript') {
//         const role = msg.role === 'user' ? 'You' : 'Assistant';
//         setMessages((prev) => [...prev, { role, text: msg.transcript }]);
//       }
//     });

//     return () => vapi.stop();
//   }, []);

//   const startCall = () => vapiRef.current?.start('1de9b062-dd42-49a4-81a3-62056cb9f056');
//   const stopCall = () => vapiRef.current?.stop();

//   const sendMessage = () => {
//     if (!input.trim()) return;

//     vapiRef.current?.send({
//       type: 'add-message',
//       message: { role: 'user', content: input },
//     });

//     setMessages((prev) => [...prev, { role: 'You', text: input }]);
//     setInput('');
//   };

//   return (
//     <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
//       <h1>🧠 Vapi Voice Assistant</h1>

//       <button
//         onClick={callActive ? stopCall : startCall}
//         style={{
//           padding: '10px 20px',
//           background: callActive ? '#d32f2f' : '#388e3c',
//           color: 'white',
//           border: 'none',
//           borderRadius: '6px',
//           marginBottom: '20px',
//           cursor: 'pointer',
//         }}
//       >
//         {callActive ? 'End Call' : 'Start Call'}
//       </button>

//       <div
//         style={{
//           background: '#f0f0f0',
//           padding: '1rem',
//           borderRadius: '8px',
//           height: '250px',
//           overflowY: 'auto',
//         }}
//       >
//         {messages.map((m, idx) => (
//           <div key={idx}>
//             <strong>{m.role}:</strong> {m.text}
//           </div>
//         ))}
//       </div>

//       <input
//         type="text"
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//         placeholder="Type a message..."
//         onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
//         style={{
//           marginTop: '1rem',
//           width: '100%',
//           padding: '10px',
//           fontSize: '16px',
//           borderRadius: '6px',
//           border: '1px solid #ccc',
//         }}
//       />
//     </div>
//   );
// }




// import { useEffect, useRef, useState } from 'react';
// import Vapi from '@vapi-ai/web';

// export default function VapiPage() {
//   const [messages, setMessages] = useState([]);
//   const [callActive, setCallActive] = useState(false);
//   const vapiRef = useRef(null);

//   useEffect(() => {
//     const vapi = new Vapi('f1d348a4-ead8-4f35-a3dc-210de6cdc7c5');
//     vapiRef.current = vapi;

//     // Handle messages from Vapi Assistant
//     vapi.on('message', (msg) => {
//       if (msg.type === 'transcript') {
//         const role = msg.role === 'user' ? 'You' : 'Assistant';
//         setMessages((prev) => [...prev, { role, text: msg.transcript }]);
//       }
//     });

//     // Handle call lifecycle
//     vapi.on('call-start', () => {
//       setCallActive(true);
//       console.log('✅ VAPI Call started');
//     });

//     vapi.on('call-end', () => {
//       setCallActive(false);
//       console.log('📞 VAPI Call ended');
//     });

//     // Receive speaker-0 text from parent
//     const handleMessage = (event) => {
//       const { type, text } = event.data || {};
//       if (type === 'speaker-0' && text && callActive) {
//         vapi.send({
//           type: 'add-message',
//           message: { role: 'user', content: text },
//         });

//         setMessages((prev) => [...prev, { role: 'You', text }]);
//       }
//     };

//     window.addEventListener('message', handleMessage);

//     return () => {
//       vapi.stop();
//       window.removeEventListener('message', handleMessage);
//     };
//   }, [callActive]);

//   const startCall = () => {
//     vapiRef.current?.start('1de9b062-dd42-49a4-81a3-62056cb9f056');
//   };

//   const stopCall = () => {
//     vapiRef.current?.stop();
//   };

//   return (
//     <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
//       <h1>🧠 Vapi Voice Assistant</h1>

//       <button
//         onClick={callActive ? stopCall : startCall}
//         style={{
//           padding: '10px 20px',
//           background: callActive ? '#d32f2f' : '#388e3c',
//           color: 'white',
//           border: 'none',
//           borderRadius: '6px',
//           marginBottom: '20px',
//           cursor: 'pointer',
//         }}
//       >
//         {callActive ? 'Stop Call' : 'Start Call'}
//       </button>

//       <div
//         style={{
//           background: '#f0f0f0',
//           padding: '1rem',
//           borderRadius: '8px',
//           height: '300px',
//           overflowY: 'auto',
//         }}
//       >
//         {messages.length === 0 ? (
//           <p>👂 Waiting for messages from Deepgram...</p>
//         ) : (
//           messages.map((m, idx) => (
//             <div key={idx}>
//               <strong>{m.role}:</strong> {m.text}
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }


// import { useEffect, useRef, useState } from 'react';
// import Vapi from '@vapi-ai/web';

// export default function VapiPage() {
//   const [messages, setMessages] = useState([]);
//   const [callActive, setCallActive] = useState(false);
//   const vapiRef = useRef(null);

//   useEffect(() => {
//     const vapi = new Vapi('f1d348a4-ead8-4f35-a3dc-210de6cdc7c5');
//     vapiRef.current = vapi;

//     vapi.on('message', (msg) => {
//       if (msg.type === 'transcript') {
//         const role = msg.role === 'user' ? 'You' : 'Assistant';
//         setMessages((prev) => [...prev, { role, text: msg.transcript }]);
//       }
//     });

//     // Receive messages from parent window (Deepgram speaker 0)
//     const handleMessage = (event) => {
//       const { type, text } = event.data || {};
//       if (type === 'speaker-0' && text && callActive) {
//         vapi.send({
//           type: 'add-message',
//           message: { role: 'user', content: text },
//         });
//         setMessages((prev) => [...prev, { role: 'You', text }]);
//       }
//     };

//     window.addEventListener('message', handleMessage);

//     return () => {
//       vapi.stop();
//       window.removeEventListener('message', handleMessage);
//     };
//   }, [callActive]);

//   const handleStart = () => {
//     setCallActive(true);
//     vapiRef.current.start({ mic: false }); // Start without mic
//   };

//   const handleStop = () => {
//     setCallActive(false);
//     vapiRef.current.stop();
//   };

//   return (
//     <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
//       <h1>🧠 Vapi Assistant</h1>

//       <div style={{ marginBottom: '1rem' }}>
//         <button
//           onClick={handleStart}
//           style={{
//             marginRight: '1rem',
//             padding: '0.5rem 1rem',
//             backgroundColor: '#4CAF50',
//             color: 'white',
//             border: 'none',
//             borderRadius: '5px',
//             cursor: 'pointer',
//           }}
//           disabled={callActive}
//         >
//           ▶️ Start
//         </button>
//         <button
//           onClick={handleStop}
//           style={{
//             padding: '0.5rem 1rem',
//             backgroundColor: '#f44336',
//             color: 'white',
//             border: 'none',
//             borderRadius: '5px',
//             cursor: 'pointer',
//           }}
//           disabled={!callActive}
//         >
//           ⏹ Stop
//         </button>
//       </div>

//       <div
//         style={{
//           background: '#f0f0f0',
//           padding: '1rem',
//           borderRadius: '8px',
//           height: '300px',
//           overflowY: 'auto',
//         }}
//       >
//         {messages.length === 0 ? (
//           <p>👂 Waiting for messages from Deepgram...</p>
//         ) : (
//           messages.map((m, idx) => (
//             <div key={idx}>
//               <strong>{m.role}:</strong> {m.text}
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }



// import { useEffect, useRef, useState } from 'react';
// import Vapi from '@vapi-ai/web';

// export default function VapiPage() {
//   const [messages, setMessages] = useState([]);
//   const [isStarted, setIsStarted] = useState(false);
//   const vapiRef = useRef(null);
//   const scrollRef = useRef(null);

//   useEffect(() => {
//     const vapi = new Vapi('f1d348a4-ead8-4f35-a3dc-210de6cdc7c5');
//     vapiRef.current = vapi;

//     vapi.on('message', (msg) => {
//       if (msg.type === 'transcript') {
//         const role = msg.role === 'user' ? 'You' : 'Assistant';
//         setMessages((prev) => [...prev, { role, text: msg.transcript }]);
//       }
//     });

//     // Listen for speaker-0 messages from parent window
//     window.addEventListener('message', (event) => {
//       const { type, text } = event.data || {};
//       if (type === 'speaker-0' && text) {
//         vapi.send({
//           type: 'add-message',
//           message: { role: 'user', content: text },
//         });
//         setMessages((prev) => [...prev, { role: 'You', text }]);
//       }
//     });

//     return () => {
//       vapi.stop();
//       window.removeEventListener('message', () => {});
//     };
//   }, []);

//   useEffect(() => {
//     scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const toggleVapi = async () => {
//     const vapi = vapiRef.current;
//     if (!vapi) return;

//     if (isStarted) {
//       await vapi.stop();
//       setIsStarted(false);
//     } else {
//       await vapi.start(); // mic access allowed
//       setIsStarted(true);
//     }
//   };

//   return (
//     <div style={{ fontFamily: 'Arial', padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
//       <h1>🧠 Vapi Voice Assistant</h1>

//       <button
//         onClick={toggleVapi}
//         style={{
//           padding: '0.7rem 1.5rem',
//           fontSize: '1rem',
//           borderRadius: '8px',
//           border: 'none',
//           backgroundColor: isStarted ? '#ff4d4f' : '#4caf50',
//           color: '#fff',
//           cursor: 'pointer',
//           marginBottom: '1rem',
//         }}
//       >
//         {isStarted ? 'Stop Assistant' : 'Start Assistant'}
//       </button>

//       <div
//         style={{
//           background: '#f9f9f9',
//           border: '1px solid #ddd',
//           borderRadius: '10px',
//           padding: '1rem',
//           height: '300px',
//           overflowY: 'auto',
//         }}
//       >
//         {messages.map((m, idx) => (
//           <div key={idx} style={{ marginBottom: '0.6rem' }}>
//             <strong>{m.role}:</strong> {m.text}
//           </div>
//         ))}
//         <div ref={scrollRef}></div>
//       </div>
//     </div>
//   );
// }


// production level code

// import { useEffect, useRef, useState } from 'react';
// import Vapi from '@vapi-ai/web';
// import './App.css';

// function VapiPage() {
//   const [input, setInput] = useState('');
//   const [callActive, setCallActive] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const vapiRef = useRef(null);
//   const scrollRef = useRef(null);

//   useEffect(() => {
//     const vapi = new Vapi('0a6efe0b-b48a-4ed8-bce7-4c78b1f08868'); // ✅ Your Public Key
//     vapiRef.current = vapi;

//     vapi.on('call-start', () => {
//       setCallActive(true);
//       console.log('✅ Call started');
//     });

//     vapi.on('call-end', () => {
//       setCallActive(false);
//       console.log('📞 Call ended');
//     });

//     vapi.on('message', (message) => {
//       if (message.type === 'transcript') {
//         const role = message.role === 'user' ? 'You' : 'Assistant';
//         setMessages(prev => [...prev, { role, text: message.transcript }]);
//         console.log(`${role}: ${message.transcript}`);
//       }
//     });

//     return () => {
//       vapiRef.current?.stop();
//     };
//   }, []);

//   const toggleCall = () => {
//     if (callActive) {
//       vapiRef.current.stop();
//     } else {
//       vapiRef.current.start('f8718dba-7311-49f7-a0c2-056bed097580'); // ✅ Your Assistant ID
//     }
//   };

//   const sendMessage = () => {
//     if (!input.trim()) return;

//     console.log(`You: ${input}`);
//     setMessages(prev => [...prev, { role: 'You', text: input }]);

//     vapiRef.current?.send({
//       type: 'add-message',
//       message: {
//         role: 'user',
//         content: input,
//       },
//     });

//     setInput('');
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter') sendMessage();
//   };

//   useEffect(() => {
//     scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
//   }, [messages]);

//   return (
//     <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
//       <h1>🗣️ Voice + 💬 Text Chatbot</h1>

//       <button
//         onClick={toggleCall}
//         style={{
//           padding: '12px 24px',
//           fontSize: '16px',
//           backgroundColor: callActive ? '#d32f2f' : '#388e3c',
//           color: 'white',
//           border: 'none',
//           borderRadius: '6px',
//           marginBottom: '20px',
//           cursor: 'pointer',
//         }}
//       >
//         {callActive ? 'End Call' : 'Start Call'}
//       </button>

//       <div
//         ref={scrollRef}
//         style={{
//           backgroundColor: '#f4f4f4',
//           padding: '1rem',
//           borderRadius: '8px',
//           height: '300px',
//           overflowY: 'auto',
//           border: '1px solid #ccc',
//           marginBottom: '10px',
//         }}
//       >
//         {messages.map((msg, idx) => (
//           <div
//             key={idx}
//             style={{
//               display: 'flex',
//               justifyContent: msg.role === 'You' ? 'flex-end' : 'flex-start',
//               marginBottom: '8px',
//             }}
//           >
//             <div
//               style={{
//                 backgroundColor: msg.role === 'You' ? '#dcedc8' : '#e3f2fd',
//                 padding: '10px 15px',
//                 borderRadius: '12px',
//                 maxWidth: '70%',
//               }}
//             >
//               <strong>{msg.role}</strong>
//               <div>{msg.text}</div>
//             </div>
//           </div>
//         ))}
//       </div>

//       <input
//         type="text"
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//         onKeyDown={handleKeyDown}
//         placeholder="Type your message..."
//         style={{
//           width: '100%',
//           padding: '10px',
//           fontSize: '16px',
//           border: '1px solid #ccc',
//           borderRadius: '6px',
//         }}
//       />
//     </div>
//   );
// }

// export default VapiPage;




















// VapiPage.jsx

// import { useEffect, useRef, useState } from 'react';
// import Vapi from '@vapi-ai/web';
// import './App.css';

// function VapiPage() {
//   const [input, setInput] = useState('');
//   const [callActive, setCallActive] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const vapiRef = useRef(null);
//   const scrollRef = useRef(null);

//   useEffect(() => {
//     const vapi = new Vapi('f1d348a4-ead8-4f35-a3dc-210de6cdc7c5');//'0a6efe0b-b48a-4ed8-bce7-4c78b1f08868'); // Your Public Key
//     vapiRef.current = vapi;

//     vapi.on('call-start', () => {
//       setCallActive(true);
//       console.log('✅ Call started');
//     });

//     vapi.on('call-end', () => {
//       setCallActive(false);
//       console.log('📞 Call ended');
//     });

//     vapi.on('message', (message) => {
//       if (message.type === 'transcript') {
//         const role = message.role === 'user' ? 'You' : 'Assistant';
//         setMessages(prev => [...prev, { role, text: message.transcript }]);
//         console.log(`${role}: ${message.transcript}`);
//       }
//     });

//     // 🔗 Receive messages from Deepgram
//     window.addEventListener('message', (event) => {
//       const { speaker, text } = event.data || {};
//       if (speaker === 0 && text) {
//         setMessages(prev => [...prev, { role: 'You', text }]);
//         vapi.send({
//           type: 'add-message',
//           message: {
//             role: 'user',
//             content: text,
//           },
//         });
//         console.log(`Forwarded speaker 0 to Vapi: ${text}`);
//       }
//     });

//     return () => {
//       vapiRef.current?.stop();
//     };
//   }, []);

//   const toggleCall = () => {
//     if (callActive) {
//       vapiRef.current.stop();
//     } else {
//       vapiRef.current.start('1de9b062-dd42-49a4-81a3-62056cb9f056');//'f8718dba-7311-49f7-a0c2-056bed097580'); // Your Assistant ID
//     }
//   };

//   const sendMessage = () => {
//     if (!input.trim()) return;

//     setMessages(prev => [...prev, { role: 'You', text: input }]);

//     vapiRef.current?.send({
//       type: 'add-message',
//       message: {
//         role: 'user',
//         content: input,
//       },
//     });

//     setInput('');
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter') sendMessage();
//   };

//   useEffect(() => {
//     scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
//   }, [messages]);

//   return (
//     <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
//       <h1>🗣️ Voice + 💬 Text Chatbot</h1>

//       <button
//         onClick={toggleCall}
//         style={{
//           padding: '12px 24px',
//           fontSize: '16px',
//           backgroundColor: callActive ? '#d32f2f' : '#388e3c',
//           color: 'white',
//           border: 'none',
//           borderRadius: '6px',
//           marginBottom: '20px',
//           cursor: 'pointer',
//         }}
//       >
//         {callActive ? 'End Call' : 'Start Call'}
//       </button>

//       <div
//         ref={scrollRef}
//         style={{
//           backgroundColor: '#f4f4f4',
//           padding: '1rem',
//           borderRadius: '8px',
//           height: '300px',
//           overflowY: 'auto',
//           border: '1px solid #ccc',
//           marginBottom: '10px',
//         }}
//       >
//         {messages.map((msg, idx) => (
//           <div
//             key={idx}
//             style={{
//               display: 'flex',
//               justifyContent: msg.role === 'You' ? 'flex-end' : 'flex-start',
//               marginBottom: '8px',
//             }}
//           >
//             <div
//               style={{
//                 backgroundColor: msg.role === 'You' ? '#dcedc8' : '#e3f2fd',
//                 padding: '10px 15px',
//                 borderRadius: '12px',
//                 maxWidth: '70%',
//               }}
//             >
//               <strong>{msg.role}</strong>
//               <div>{msg.text}</div>
//             </div>
//           </div>
//         ))}
//       </div>

//       <input
//         type="text"
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//         onKeyDown={handleKeyDown}
//         placeholder="Type your message..."
//         style={{
//           width: '100%',
//           padding: '10px',
//           fontSize: '16px',
//           border: '1px solid #ccc',
//           borderRadius: '6px',
//         }}
//       />
//     </div>
//   );
// }

// export default VapiPage;













import { useEffect, useRef, useState } from 'react';
import Vapi from '@vapi-ai/web';
import './App.css';

function VapiPage() {
  const [input, setInput] = useState('');
  const [callActive, setCallActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const vapiRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    // ✅ Override mic with silent stream
    navigator.mediaDevices.getUserMedia = async (constraints) => {
      if (constraints.audio) {
        const ctx = new AudioContext();
        const dest = ctx.createMediaStreamDestination();

        const silence = ctx.createScriptProcessor(4096, 1, 1);
        silence.onaudioprocess = (e) => {
          const output = e.outputBuffer.getChannelData(0);
          output.fill(0); // fill with silence
        };

        silence.connect(dest);
        return dest.stream;
      }
      return Promise.reject('Only audio requested is supported.');
    };

    // ✅ Initialize Vapi
    const vapi = new Vapi('f1d348a4-ead8-4f35-a3dc-210de6cdc7c5'); // Your Public Key
    vapiRef.current = vapi;

    vapi.on('call-start', () => {
      setCallActive(true);
      console.log('✅ Call started');
    });

    vapi.on('call-end', () => {
      setCallActive(false);
      console.log('📞 Call ended');
    });

    vapi.on('message', (message) => {
      if (message.type === 'transcript') {
        const role = message.role === 'user' ? 'You' : 'Assistant';
        setMessages(prev => [...prev, { role, text: message.transcript }]);
        console.log(`${role}: ${message.transcript}`);
      }
    });

    // ✅ Receive messages from Deepgram
    window.addEventListener('message', (event) => {
      const { speaker, text } = event.data || {};
      if (speaker === 0 && text) {
        setMessages(prev => [...prev, { role: 'You', text }]);
        vapi.send({
          type: 'add-message',
          message: {
            role: 'user',
            content: text,
          },
        });
        console.log(`Forwarded speaker 0 to Vapi: ${text}`);
      }
    });

    return () => {
      vapiRef.current?.stop();
    };
  }, []);

  const toggleCall = () => {
    if (callActive) {
      vapiRef.current.stop();
    } else {
      vapiRef.current.start('1de9b062-dd42-49a4-81a3-62056cb9f056'); // Your Assistant ID
    }
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { role: 'You', text: input }]);

    vapiRef.current?.send({
      type: 'add-message',
      message: {
        role: 'user',
        content: input,
      },
    });

    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>🗣️ Voice + 💬 Text Chatbot</h1>

      <button
        onClick={toggleCall}
        style={{
          padding: '12px 24px',
          fontSize: '16px',
          backgroundColor: callActive ? '#d32f2f' : '#388e3c',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          marginBottom: '20px',
          cursor: 'pointer',
        }}
      >
        {callActive ? 'End Call' : 'Start Call'}
      </button>

      <div
        ref={scrollRef}
        style={{
          backgroundColor: '#f4f4f4',
          padding: '1rem',
          borderRadius: '8px',
          height: '300px',
          overflowY: 'auto',
          border: '1px solid #ccc',
          marginBottom: '10px',
        }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'You' ? 'flex-end' : 'flex-start',
              marginBottom: '8px',
            }}
          >
            <div
              style={{
                backgroundColor: msg.role === 'You' ? '#dcedc8' : '#e3f2fd',
                padding: '10px 15px',
                borderRadius: '12px',
                maxWidth: '70%',
              }}
            >
              <strong>{msg.role}</strong>
              <div>{msg.text}</div>
            </div>
          </div>
        ))}
      </div>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        style={{
          width: '100%',
          padding: '10px',
          fontSize: '16px',
          border: '1px solid #ccc',
          borderRadius: '6px',
        }}
      />
    </div>
  );
}

export default VapiPage;
