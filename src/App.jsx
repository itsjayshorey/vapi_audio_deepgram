// // // import { useEffect, useRef, useState } from 'react';
// // // import './App.css';

// // // const DEEPGRAM_API_KEY = '8db50845e951f4d27e920901a1b20468d51d5407';
// // // const WAKE_WORDS = ['on', 'off'];
// // // const CONFIDENCE_THRESHOLD = 0.7;

// // // function App() {
// // //   const [input, setInput] = useState('');
// // //   const [callActive, setCallActive] = useState(false);
// // //   const [messages, setMessages] = useState([]);
// // //   const [transcript, setTranscript] = useState([]);
// // //   const [warning, setWarning] = useState('');
// // //   const iframeRef = useRef(null);
// // //   const scrollRef = useRef(null);

// // //   const socketRef = useRef(null);
// // //   const mediaRecorderRef = useRef(null);
// // //   const mediaStreamRef = useRef(null);

// // //   const iframeURL = "/vapi-frame.html"; // Serve this from public folder

// // //   // Send message to iframe
// // //   const postMessageToIframe = (message) => {
// // //     iframeRef.current?.contentWindow?.postMessage(message, '*');
// // //   };

// // //   // Handle incoming messages from iframe
// // //   useEffect(() => {
// // //     const listener = (event) => {
// // //       const { type, role, content } = event.data;
// // //       if (type === 'transcript') {
// // //         setMessages((prev) => [...prev, { role, text: content }]);
// // //       }
// // //     };
// // //     window.addEventListener('message', listener);
// // //     return () => window.removeEventListener('message', listener);
// // //   }, []);

// // //   // Deepgram integration
// // //   useEffect(() => {
// // //     const startTranscription = async () => {
// // //       try {
// // //         const socket = new WebSocket(
// // //           `wss://api.deepgram.com/v1/listen?punctuate=true&language=en&diarize=true`,
// // //           ['token', DEEPGRAM_API_KEY]
// // //         );
// // //         socketRef.current = socket;

// // //         socket.onopen = async () => {
// // //           const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
// // //           mediaStreamRef.current = stream;

// // //           const recorder = new MediaRecorder(stream, {
// // //             mimeType: 'audio/webm;codecs=opus',
// // //           });
// // //           mediaRecorderRef.current = recorder;

// // //           recorder.ondataavailable = (e) => {
// // //             if (socket.readyState === WebSocket.OPEN && e.data.size > 0) {
// // //               socket.send(e.data);
// // //             }
// // //           };

// // //           recorder.start(250);
// // //           console.log('🎤 Deepgram started');
// // //         };

// // //         socket.onmessage = ({ data }) => {
// // //           const alt = JSON.parse(data)?.channel?.alternatives?.[0];
// // //           const text = alt?.transcript;
// // //           const confidence = alt?.confidence;
// // //           const speaker = alt?.words?.[0]?.speaker;

// // //           if (text && confidence !== undefined) {
// // //             const speakerLabel = speaker !== undefined ? `Speaker ${speaker}` : 'Unknown Speaker';
// // //             const line = `${speakerLabel}: ${text} (confidence: ${(confidence * 100).toFixed(2)}%)`;
// // //             setTranscript((prev) => [...prev, line]);

// // //             if (confidence < CONFIDENCE_THRESHOLD) {
// // //               setWarning(`⚠️ Low confidence: ${(confidence * 100).toFixed(2)}%`);
// // //               return;
// // //             } else {
// // //               setWarning('');
// // //             }

// // //             const lowerText = text.toLowerCase();

// // //             if (lowerText.includes('on') && !callActive) {
// // //               console.log('🔔 Wake word "on" detected, starting call...');
// // //               postMessageToIframe({ type: 'start-call' });
// // //               setCallActive(true);
// // //               return;
// // //             }

// // //             if (lowerText.includes('off') && callActive) {
// // //               console.log('🔕 Wake word "off" detected, stopping call...');
// // //               postMessageToIframe({ type: 'stop-call' });
// // //               setCallActive(false);
// // //               return;
// // //             }

// // //             if (speaker === 0 && callActive) {
// // //               console.log(`🎙️ Sending to Vapi (Speaker 0): ${text}`);
// // //               postMessageToIframe({
// // //                 type: 'add-message',
// // //                 message: { role: 'user', content: text },
// // //               });
// // //               setMessages((prev) => [...prev, { role: 'You', text }]);
// // //             }
// // //           }
// // //         };

// // //         socket.onerror = (err) => console.error('WebSocket error:', err);
// // //         socket.onclose = () => console.log('🔌 Deepgram socket closed');
// // //       } catch (error) {
// // //         console.error('Deepgram init error:', error);
// // //       }
// // //     };

// // //     startTranscription();

// // //     return () => {
// // //       socketRef.current?.close();
// // //       if (mediaRecorderRef.current?.state === 'recording') {
// // //         mediaRecorderRef.current.stop();
// // //       }
// // //       mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
// // //     };
// // //   }, [callActive]);

// // //   useEffect(() => {
// // //     scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
// // //   }, [messages]);

// // //   const sendMessage = () => {
// // //     if (!input.trim()) return;
// // //     setMessages((prev) => [...prev, { role: 'You', text: input }]);
// // //     postMessageToIframe({
// // //       type: 'add-message',
// // //       message: { role: 'user', content: input },
// // //     });
// // //     setInput('');
// // //   };

// // //   const handleKeyDown = (e) => {
// // //     if (e.key === 'Enter') sendMessage();
// // //   };

// // //   return (
// // //     <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
// // //       <h1>🧠 VAPI + Deepgram Wake Word Assistant (Iframe)</h1>

// // //       {warning && <div style={{ color: 'red', marginBottom: '10px' }}>{warning}</div>}

// // //       <div
// // //         ref={scrollRef}
// // //         style={{
// // //           backgroundColor: '#f4f4f4',
// // //           padding: '1rem',
// // //           borderRadius: '8px',
// // //           height: '250px',
// // //           overflowY: 'auto',
// // //           border: '1px solid #ccc',
// // //           marginBottom: '10px',
// // //         }}
// // //       >
// // //         {messages.map((msg, idx) => (
// // //           <div key={idx} style={{ display: 'flex', justifyContent: msg.role === 'You' ? 'flex-end' : 'flex-start', marginBottom: '8px' }}>
// // //             <div style={{
// // //               backgroundColor: msg.role === 'You' ? '#dcedc8' : '#e3f2fd',
// // //               padding: '10px 15px',
// // //               borderRadius: '12px',
// // //               maxWidth: '70%',
// // //             }}>
// // //               <strong>{msg.role}</strong>
// // //               <div>{msg.text}</div>
// // //             </div>
// // //           </div>
// // //         ))}
// // //       </div>

// // //       <input
// // //         type="text"
// // //         value={input}
// // //         onChange={(e) => setInput(e.target.value)}
// // //         onKeyDown={handleKeyDown}
// // //         placeholder="Type your message..."
// // //         style={{
// // //           width: '100%',
// // //           padding: '10px',
// // //           fontSize: '16px',
// // //           border: '1px solid #ccc',
// // //           borderRadius: '6px',
// // //           marginBottom: '1rem',
// // //         }}
// // //       />

// // //       <h2>📝 Deepgram Transcript</h2>
// // //       <div style={{
// // //         background: '#f0f0f0',
// // //         padding: '1rem',
// // //         borderRadius: '8px',
// // //         height: '150px',
// // //         overflowY: 'auto',
// // //         whiteSpace: 'pre-wrap',
// // //       }}>
// // //         {transcript.length > 0
// // //           ? transcript.map((line, idx) => <div key={idx}>• {line}</div>)
// // //           : '🎙 Speak into your mic...'}
// // //       </div>

// // //       <h2>🖼️ VAPI Assistant</h2>
// // //       <iframe
// // //         ref={iframeRef}
// // //         src={iframeURL}
// // //         title="Vapi Assistant"
// // //         width="100%"
// // //         height="400"
// // //         style={{ border: '1px solid #ccc', borderRadius: '8px' }}
// // //         allow="clipboard-write"
// // //       />
// // //     </div>
// // //   );
// // // }

// // // export default App;




// // import { useEffect, useRef, useState } from 'react';
// // import './App.css';

// // const DEEPGRAM_API_KEY = '8db50845e951f4d27e920901a1b20468d51d5407';
// // const CONFIDENCE_THRESHOLD = 0.7;

// // export default function App() {
// //   const [transcript, setTranscript] = useState([]);
// //   const [warning, setWarning] = useState('');
// //   const iframeRef = useRef(null);

// //   useEffect(() => {
// //     const startDeepgram = async () => {
// //       try {
// //         const socket = new WebSocket(
// //           'wss://api.deepgram.com/v1/listen?punctuate=true&language=en&diarize=true',
// //           ['token', DEEPGRAM_API_KEY]
// //         );

// //         socket.onopen = async () => {
// //           const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

// //           const recorder = new MediaRecorder(stream, {
// //             mimeType: 'audio/webm;codecs=opus',
// //           });

// //           recorder.ondataavailable = (e) => {
// //             if (socket.readyState === WebSocket.OPEN && e.data.size > 0) {
// //               socket.send(e.data);
// //             }
// //           };

// //           recorder.start(250);
// //         };

// //         socket.onmessage = ({ data }) => {
// //           const alt = JSON.parse(data)?.channel?.alternatives?.[0];
// //           const text = alt?.transcript;
// //           const confidence = alt?.confidence;
// //           const speaker = alt?.words?.[0]?.speaker;

// //           if (text && confidence !== undefined) {
// //             const label = speaker !== undefined ? `Speaker ${speaker}` : 'Unknown Speaker';
// //             const line = `${label}: ${text} (confidence: ${(confidence * 100).toFixed(2)}%)`;
// //             setTranscript((prev) => [...prev, line]);

// //             if (confidence < CONFIDENCE_THRESHOLD) {
// //               setWarning(`⚠️ Low confidence: ${(confidence * 100).toFixed(2)}%`);
// //               return;
// //             } else {
// //               setWarning('');
// //             }

// //             // 🔁 Send only Speaker 0 text to Vapi iframe
// //             if (speaker === 0 && iframeRef.current) {
// //               iframeRef.current.contentWindow.postMessage(
// //                 {
// //                   type: 'user-message',
// //                   payload: text,
// //                 },
// //                 '*'
// //               );
// //             }
// //           }
// //         };

// //         socket.onerror = (err) => console.error('WebSocket error:', err);
// //         socket.onclose = () => console.log('🔌 Deepgram closed');
// //       } catch (error) {
// //         console.error('Deepgram error:', error);
// //       }
// //     };

// //     startDeepgram();
// //   }, []);

// //   return (
// //     <div style={{ padding: '2rem' }}>
// //       <h2>🧠 Deepgram → Vapi (iframe) Assistant</h2>

// //       {warning && <p style={{ color: 'red' }}>{warning}</p>}

// //       <iframe
// //         ref={iframeRef}
// //         src="https://app.vapi.ai/chat?assistant=1de9b062-dd42-49a4-81a3-62056cb9f056&mode=embedded"
// //         title="Vapi Assistant"
// //         style={{
// //           width: '100%',
// //           height: '400px',
// //           border: '1px solid #ccc',
// //           borderRadius: '8px',
// //           marginBottom: '1rem',
// //         }}
// //       ></iframe>

// //       <h3>📝 Transcript Log</h3>
// //       <div style={{ maxHeight: 200, overflowY: 'auto', background: '#f9f9f9', padding: '1rem', borderRadius: 8 }}>
// //         {transcript.length > 0
// //           ? transcript.map((line, idx) => <div key={idx}>• {line}</div>)
// //           : '🎙 Speak into your mic...'}
// //       </div>
// //     </div>
// //   );
// // }




// // DeepgramVapiPage.jsx
// import { useEffect, useRef, useState } from 'react';

// const DEEPGRAM_API_KEY = '8db50845e951f4d27e920901a1b20468d51d5407';
// const ASSISTANT_ID = '1de9b062-dd42-49a4-81a3-62056cb9f056';
// const PUBLIC_KEY   = 'f1d348a4-ead8-4f35-a3dc-210de6cdc7c5';   // only used inside the iframe UI
// const CONFIDENCE_THRESHOLD = 0.7;

// export default function DeepgramVapiPage() {
//   const [transcript, setTranscript] = useState([]);
//   const [warning, setWarning] = useState('');
//   const iframeRef = useRef(null);

//   /** ───────────────────────────────
//    *  1.  Deepgram live transcription
//    *  ─────────────────────────────── */
//   useEffect(() => {
//     let socket, recorder, stream;

//     async function startDeepgram() {
//       try {
//         socket = new WebSocket(
//           'wss://api.deepgram.com/v1/listen?punctuate=true&language=en&diarize=true',
//           ['token', DEEPGRAM_API_KEY]
//         );

//         socket.onopen = async () => {
//           stream = await navigator.mediaDevices.getUserMedia({ audio: true });

//           recorder = new MediaRecorder(stream, {
//             mimeType: 'audio/webm;codecs=opus',
//           });

//           recorder.ondataavailable = e => {
//             if (socket.readyState === WebSocket.OPEN && e.data.size) socket.send(e.data);
//           };
//           recorder.start(250);
//         };

//         socket.onmessage = ({ data }) => {
//           const alt        = JSON.parse(data)?.channel?.alternatives?.[0];
//           const text       = alt?.transcript;
//           const confidence = alt?.confidence;
//           const speaker    = alt?.words?.[0]?.speaker;

//           if (!text || confidence === undefined) return;

//           // 1‑line log
//           setTranscript(prev => [
//             ...prev,
//             `Spk ${speaker ?? '?' }: ${text} (${(confidence*100).toFixed(1)}%)`,
//           ]);

//           // warn on low confidence
//           setWarning(confidence < CONFIDENCE_THRESHOLD
//             ? `⚠️ Low confidence: ${(confidence*100).toFixed(1)} %`
//             : '');

//           // 2. forward Speaker 0 only
//           if (speaker === 0 && confidence >= CONFIDENCE_THRESHOLD && iframeRef.current) {
//             iframeRef.current.contentWindow.postMessage(
//               { type: 'user-message', payload: text },
//               '*'                         // same‑origin not enforced inside embed
//             );
//           }
//         };

//         socket.onerror = err => console.error('Deepgram WS error', err);
//         socket.onclose = ()  => console.log('Deepgram connection closed');
//       } catch (err) {
//         console.error('Deepgram setup failed:', err);
//       }
//     }

//     startDeepgram();

//     /** cleanup */
//     return () => {
//       socket?.close?.();
//       recorder?.state === 'recording' && recorder.stop();
//       stream?.getTracks().forEach(t => t.stop());
//     };
//   }, []);

//   /** ───────────────────────────────
//    *  2.  UI
//    *  ─────────────────────────────── */
//   return (
//     <div style={{ padding: '2rem', fontFamily: 'system-ui, Arial' }}>
//       <h1>Deepgram → Vapi (iframe) Assistant</h1>

//       {/* warning banner */}
//       {!!warning && (
//         <div style={{ color: '#d32f2f', marginBottom: 12 }}>{warning}</div>
//       )}

//       {/* Vapi iframe  */}
//       <iframe
//         ref={iframeRef}
//         src={`https://app.vapi.ai/chat?assistant=${ASSISTANT_ID}&mode=embedded&publicKey=${PUBLIC_KEY}`}
//         title="Vapi assistant"
//         style={{
//           width: '100%',
//           height: 450,
//           border: '1px solid #ccc',
//           borderRadius: 8,
//           marginBottom: 16,
//         }}
//         allow="clipboard-write; clipboard-read"  // lets you copy / paste in chat
//       />

//       {/* transcript log */}
//       <h3>Live Transcript (all speakers)</h3>
//       <div
//         style={{
//           maxHeight: 200,
//           overflowY: 'auto',
//           background: '#fafafa',
//           border: '1px solid #eee',
//           borderRadius: 6,
//           padding: 12,
//           whiteSpace: 'pre-wrap',
//         }}
//       >
//         {transcript.length
//           ? transcript.map((l, i) => <div key={i}>• {l}</div>)
//           : '🎤 Speak into your mic…'}
//       </div>
//     </div>
//   );
// }



// import { useEffect, useRef, useState } from 'react';

// const DEEPGRAM_API_KEY = '8db50845e951f4d27e920901a1b20468d51d5407';

// export default function App() {
//   const [transcripts, setTranscripts] = useState([]);
//   const [warning, setWarning] = useState('');
//   const socketRef = useRef(null);
//   const mediaStreamRef = useRef(null);
//   const mediaRecorderRef = useRef(null);

//   useEffect(() => {
//     const connectToDeepgram = async () => {
//       try {
//         const socket = new WebSocket(
//           `wss://api.deepgram.com/v1/listen?punctuate=true&language=en&diarize=true`,
//           ['token', DEEPGRAM_API_KEY]
//         );
//         socketRef.current = socket;

//         socket.onopen = async () => {
//           const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//           mediaStreamRef.current = stream;

//           const recorder = new MediaRecorder(stream, {
//             mimeType: 'audio/webm;codecs=opus',
//           });
//           mediaRecorderRef.current = recorder;

//           recorder.ondataavailable = (event) => {
//             if (socket.readyState === WebSocket.OPEN && event.data.size > 0) {
//               socket.send(event.data);
//             }
//           };

//           recorder.start(250);
//           console.log('🎤 Recording started');
//         };

//         socket.onmessage = ({ data }) => {
//           const alt = JSON.parse(data)?.channel?.alternatives?.[0];
//           const text = alt?.transcript;
//           const confidence = alt?.confidence;
//           const speaker = alt?.words?.[0]?.speaker;

//           if (text) {
//             const label = speaker !== undefined ? `Speaker ${speaker}` : 'Unknown Speaker';
//             setTranscripts((prev) => [...prev, `${label}: ${text}`]);

//             if (confidence !== undefined && confidence < 0.7) {
//               setWarning(`⚠️ Low confidence: ${(confidence * 100).toFixed(2)}%`);
//             } else {
//               setWarning('');
//             }
//           }
//         };

//         socket.onerror = (err) => console.error('WebSocket error:', err);
//         socket.onclose = () => console.log('Deepgram socket closed');
//       } catch (err) {
//         console.error('Error initializing Deepgram:', err);
//       }
//     };

//     connectToDeepgram();

//     return () => {
//       socketRef.current?.close();
//       mediaRecorderRef.current?.stop();
//       mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
//     };
//   }, []);

//   return (
//     <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
//       <h1>🎧 Deepgram Live Transcription</h1>

//       {warning && <p style={{ color: 'red' }}>{warning}</p>}

//       <div
//         style={{
//           backgroundColor: '#f4f4f4',
//           border: '1px solid #ccc',
//           borderRadius: '8px',
//           padding: '1rem',
//           height: '300px',
//           overflowY: 'scroll',
//           whiteSpace: 'pre-wrap',
//         }}
//       >
//         {transcripts.length === 0 ? (
//           '🎙 Speak to see transcript...'
//         ) : (
//           transcripts.map((line, idx) => <div key={idx}>• {line}</div>)
//         )}
//       </div>
//     </div>
    
//   );
// }












// import { useEffect, useRef, useState } from 'react';

// const DEEPGRAM_API_KEY = '8db50845e951f4d27e920901a1b20468d51d5407';

// export default function App() {
//   const [transcripts, setTranscripts] = useState([]);
//   const [warning, setWarning] = useState('');
//   const socketRef = useRef(null);
//   const mediaStreamRef = useRef(null);
//   const mediaRecorderRef = useRef(null);

//   useEffect(() => {
//     const connectToDeepgram = async () => {
//       try {
//         const socket = new WebSocket(
//           `wss://api.deepgram.com/v1/listen?punctuate=true&language=en&diarize=true`,
//           ['token', DEEPGRAM_API_KEY]
//         );
//         socketRef.current = socket;

//         socket.onopen = async () => {
//           const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//           mediaStreamRef.current = stream;

//           const recorder = new MediaRecorder(stream, {
//             mimeType: 'audio/webm;codecs=opus',
//           });
//           mediaRecorderRef.current = recorder;

//           recorder.ondataavailable = (event) => {
//             if (socket.readyState === WebSocket.OPEN && event.data.size > 0) {
//               socket.send(event.data);
//             }
//           };

//           recorder.start(250);
//           console.log('🎤 Recording started');
//         };

//         socket.onmessage = ({ data }) => {
//           const alt = JSON.parse(data)?.channel?.alternatives?.[0];
//           const text = alt?.transcript;
//           const confidence = alt?.confidence;
//           const speaker = alt?.words?.[0]?.speaker;

//           if (text) {
//             const label = speaker !== undefined ? `Speaker ${speaker}` : 'Unknown Speaker';
//             setTranscripts((prev) => [...prev, `${label}: ${text}`]);

//             if (confidence !== undefined && confidence < 0.7) {
//               setWarning(`⚠️ Low confidence: ${(confidence * 100).toFixed(2)}%`);
//             } else {
//               setWarning('');
//             }
//           }
//         };

//         socket.onerror = (err) => console.error('WebSocket error:', err);
//         socket.onclose = () => console.log('Deepgram socket closed');
//       } catch (err) {
//         console.error('Error initializing Deepgram:', err);
//       }
//     };

//     connectToDeepgram();

//     return () => {
//       socketRef.current?.close();
//       mediaRecorderRef.current?.stop();
//       mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
//     };
//   }, []);

//   return (
//     <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
//       <h1>🎧 Deepgram Live Transcription</h1>

//       {warning && <p style={{ color: 'red' }}>{warning}</p>}

//       <div
//         style={{
//           backgroundColor: '#f4f4f4',
//           border: '1px solid #ccc',
//           borderRadius: '8px',
//           padding: '1rem',
//           height: '300px',
//           overflowY: 'scroll',
//           whiteSpace: 'pre-wrap',
//         }}
//       >
//         {transcripts.length === 0 ? (
//           '🎙 Speak to see transcript...'
//         ) : (
//           transcripts.map((line, idx) => <div key={idx}>• {line}</div>)
//         )}
//       </div>

//       {/* Vapi Assistant Iframe Section */}
//       <h2 style={{ marginTop: '2rem' }}>🤖 Vapi Assistant</h2>
//       <iframe
//         src="/vapi"
//         width="100%"
//         height="600px"
//         sandbox="allow-scripts allow-same-origin"
//         allow=""
//         style={{
//           border: '1px solid black',
//           borderRadius: '10px',
//           marginTop: '1rem',
//         }}
//         title="Vapi Assistant"
//       />
//     </div>
//   );
// }






















// App.jsx (Deepgram Transcription + Sends Speaker 0 to iframe)
// import { useEffect, useRef, useState } from 'react';

// const DEEPGRAM_API_KEY = '8db50845e951f4d27e920901a1b20468d51d5407';

// export default function App() {
//   const [transcripts, setTranscripts] = useState([]);
//   const [warning, setWarning] = useState('');
//   const socketRef = useRef(null);
//   const mediaStreamRef = useRef(null);
//   const mediaRecorderRef = useRef(null);

//   useEffect(() => {
//     const connectToDeepgram = async () => {
//       try {
//         const socket = new WebSocket(
//           `wss://api.deepgram.com/v1/listen?punctuate=true&language=en&diarize=true`,
//           ['token', DEEPGRAM_API_KEY]
//         );
//         socketRef.current = socket;

//         socket.onopen = async () => {
//           const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//           mediaStreamRef.current = stream;

//           const recorder = new MediaRecorder(stream, {
//             mimeType: 'audio/webm;codecs=opus',
//           });
//           mediaRecorderRef.current = recorder;

//           recorder.ondataavailable = (event) => {
//             if (socket.readyState === WebSocket.OPEN && event.data.size > 0) {
//               socket.send(event.data);
//             }
//           };

//           recorder.start(250);
//           console.log('🎤 Recording started');
//         };

//         socket.onmessage = ({ data }) => {
//           const alt = JSON.parse(data)?.channel?.alternatives?.[0];
//           const text = alt?.transcript;
//           const confidence = alt?.confidence;
//           const speaker = alt?.words?.[0]?.speaker;

//           if (text) {
//             const label = speaker !== undefined ? `Speaker ${speaker}` : 'Unknown Speaker';
//             const message = `${label}: ${text}`;
//             setTranscripts((prev) => [...prev, message]);

//             // 🔗 Send Speaker 0 to iframe
//             // if (speaker === 0) {
//             //   const iframe = document.querySelector('iframe');
//             //   iframe?.contentWindow?.postMessage({ speaker, text }, '*');
//             // }
//           if (speaker === 0) {
//              const iframe = document.querySelector('iframe');
//              const modifiedText = `Speaker 0: ${text}`;
//              iframe?.contentWindow?.postMessage({ speaker, text: modifiedText }, '*');
//         }


//             if (confidence !== undefined && confidence < 0.7) {
//               setWarning(`⚠️ Low confidence: ${(confidence * 100).toFixed(2)}%`);
//             } else {
//               setWarning('');
//             }
//           }
//         };

//         socket.onerror = (err) => console.error('WebSocket error:', err);
//         socket.onclose = () => console.log('Deepgram socket closed');
//       } catch (err) {
//         console.error('Error initializing Deepgram:', err);
//       }
//     };

//     connectToDeepgram();

//     return () => {
//       socketRef.current?.close();
//       mediaRecorderRef.current?.stop();
//       mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
//     };
//   }, []);

//   return (
//     <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
//       <h1>🎧 Deepgram Live Transcription</h1>

//       {warning && <p style={{ color: 'red' }}>{warning}</p>}

//       <div
//         style={{
//           backgroundColor: '#f4f4f4',
//           border: '1px solid #ccc',
//           borderRadius: '8px',
//           padding: '1rem',
//           height: '300px',
//           overflowY: 'scroll',
//           whiteSpace: 'pre-wrap',
//         }}
//       >
//         {transcripts.length === 0 ? (
//           '🎙 Speak to see transcript...'
//         ) : (
//           transcripts.map((line, idx) => <div key={idx}>• {line}</div>)
//         )}
//       </div>

//       {/* Vapi Assistant Iframe Section */}
//       <h2 style={{ marginTop: '2rem' }}>🤖 Vapi Assistant</h2>
//       <iframe
//         src="/vapi"
//         width="100%"
//         height="600px"
//         sandbox="allow-scripts allow-same-origin"
//         allow=""
//         style={{
//           border: '1px solid black',
//           borderRadius: '10px',
//           marginTop: '1rem',
//         }}
//         title="Vapi Assistant"
//       />
//     </div>
//   );
// }


































































































































// import { useEffect, useRef, useState } from 'react';

// const DEEPGRAM_API_KEY = '8db50845e951f4d27e920901a1b20468d51d5407';

// export default function App() {
//   const [transcripts, setTranscripts] = useState([]);
//   const [warning, setWarning] = useState('');
//   const [confidenceDisplay, setConfidenceDisplay] = useState(null); // ✅ UI display
//   const socketRef = useRef(null);
//   const mediaStreamRef = useRef(null);
//   const mediaRecorderRef = useRef(null);
//   const audioRef = useRef(null); // 🔊 For playing warning

//   useEffect(() => {
//     const connectToDeepgram = async () => {
//       try {
//         const socket = new WebSocket(
//           `wss://api.deepgram.com/v1/listen?punctuate=true&language=en&diarize=true`,
//           ['token', DEEPGRAM_API_KEY]
//         );
//         socketRef.current = socket;

//         socket.onopen = async () => {
//           const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//           mediaStreamRef.current = stream;

//           const recorder = new MediaRecorder(stream, {
//             mimeType: 'audio/webm;codecs=opus',
//           });
//           mediaRecorderRef.current = recorder;

//           recorder.ondataavailable = (event) => {
//             if (socket.readyState === WebSocket.OPEN && event.data.size > 0) {
//               socket.send(event.data);
//             }
//           };

//           recorder.start(250);
//           console.log('🎤 Recording started');
//         };

//         socket.onmessage = ({ data }) => {
//           const alt = JSON.parse(data)?.channel?.alternatives?.[0];
//           const text = alt?.transcript;
//           const confidence = alt?.confidence;
//           const speaker = alt?.words?.[0]?.speaker;

//           if (text) {
//             const label = speaker !== undefined ? `Speaker ${speaker}` : 'Unknown Speaker';
//             const message = `${label}: ${text}`;
//             setTranscripts((prev) => [...prev, message]);

//             if (speaker === 0) {
//               const iframe = document.querySelector('iframe');
//               const modifiedText = `Speaker 0: ${text}`;
//               iframe?.contentWindow?.postMessage({ speaker, text: modifiedText }, '*');
//             }

//             // Display confidence on screen
//             if (confidence !== undefined) {
//               const scorePercent = (confidence * 100).toFixed(2);
//               setConfidenceDisplay(`🧠 Confidence Score: ${scorePercent}%`);

//               if (confidence < 0.7) {
//                 setWarning(`⚠️ Low confidence: ${scorePercent}%`);

//                 if (audioRef.current) {
//                   audioRef.current.currentTime = 0;
//                   audioRef.current.play().catch((e) =>
//                     console.error('Audio playback error:', e)
//                   );
//                 }
//               } else {
//                 setWarning('');
//               }
//             }
//           }
//         };

//         socket.onerror = (err) => console.error('WebSocket error:', err);
//         socket.onclose = () => console.log('Deepgram socket closed');
//       } catch (err) {
//         console.error('Error initializing Deepgram:', err);
//       }
//     };

//     connectToDeepgram();

//     return () => {
//       socketRef.current?.close();
//       mediaRecorderRef.current?.stop();
//       mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
//     };
//   }, []);

//   return (
//     <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
//       <h1>🎧 Deepgram Live Transcription</h1>

//       {confidenceDisplay && (
//         <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#333' }}>
//           {confidenceDisplay}
//         </p>
//       )}

//       {warning && <p style={{ color: 'red', fontWeight: 'bold' }}>{warning}</p>}

//       <div
//         style={{
//           backgroundColor: '#f4f4f4',
//           border: '1px solid #ccc',
//           borderRadius: '8px',
//           padding: '1rem',
//           height: '300px',
//           overflowY: 'scroll',
//           whiteSpace: 'pre-wrap',
//         }}
//       >
//         {transcripts.length === 0 ? (
//           '🎙 Speak to see transcript...'
//         ) : (
//           transcripts.map((line, idx) => <div key={idx}>• {line}</div>)
//         )}
//       </div>

//       {/* 🔊 Audio warning file */}
//       <audio ref={audioRef} src="/output.mp3" preload="auto" />

//       {/* 🤖 Vapi Assistant Iframe */}
//       <h2 style={{ marginTop: '2rem' }}>🤖 Vapi Assistant</h2>
//       <iframe
//         src="/vapi"
//         width="100%"
//         height="600px"
//         sandbox="allow-scripts allow-same-origin"
//         allow=""
//         style={{
//           border: '1px solid black',
//           borderRadius: '10px',
//           marginTop: '1rem',
//         }}
//         title="Vapi Assistant"
//       />
//     </div>
//   );
// }








































































// import { useEffect, useRef, useState } from 'react';

// const DEEPGRAM_API_KEY = '8db50845e951f4d27e920901a1b20468d51d5407';

// export default function App() {
//   const [transcripts, setTranscripts] = useState([]);
//   const [warning, setWarning] = useState('');
//   const [confidenceDisplay, setConfidenceDisplay] = useState(null);
//   const socketRef = useRef(null);
//   const mediaStreamRef = useRef(null);
//   const mediaRecorderRef = useRef(null);
//   const audioRef = useRef(null);

//   useEffect(() => {
//     const connectToDeepgram = async () => {
//       try {
//         const socket = new WebSocket(
//           `wss://api.deepgram.com/v1/listen?punctuate=true&language=en&diarize=true`,
//           ['token', DEEPGRAM_API_KEY]
//         );
//         socketRef.current = socket;

//         socket.onopen = async () => {
//           const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//           mediaStreamRef.current = stream;

//           const recorder = new MediaRecorder(stream, {
//             mimeType: 'audio/webm;codecs=opus',
//           });
//           mediaRecorderRef.current = recorder;

//           recorder.ondataavailable = (event) => {
//             if (socket.readyState === WebSocket.OPEN && event.data.size > 0) {
//               socket.send(event.data);
//             }
//           };

//           recorder.start(250);
//           console.log('🎤 Recording started');
//         };

//         socket.onmessage = ({ data }) => {
//           const alt = JSON.parse(data)?.channel?.alternatives?.[0];
//           const text = alt?.transcript;
//           const confidence = alt?.confidence;
//           const speaker = alt?.words?.[0]?.speaker;

//           if (text) {
//             const label = speaker !== undefined ? `Speaker ${speaker}` : 'Unknown Speaker';
//             const message = `${label}: ${text}`;
//             setTranscripts((prev) => [...prev, message]);

//             if (confidence !== undefined) {
//               const scorePercent = (confidence * 100).toFixed(2);
//               setConfidenceDisplay(`🧠 Confidence Score: ${scorePercent}%`);

//               if (confidence < 0.7) {
//                 setWarning(`⚠️ Low confidence: ${scorePercent}%`);

//                 if (audioRef.current) {
//                   audioRef.current.currentTime = 0;
//                   audioRef.current.play().catch((e) =>
//                     console.error('Audio playback error:', e)
//                   );
//                 }
//               } else {
//                 setWarning('');

//                 // ✅ Only send to iframe if confidence is high
//                 if (speaker === 0) {
//                   const iframe = document.querySelector('iframe');
//                   const modifiedText = `Speaker 0: ${text}`;
//                   iframe?.contentWindow?.postMessage({ speaker, text: modifiedText }, '*');
//                 }
//               }
//             }
//           }
//         };

//         socket.onerror = (err) => console.error('WebSocket error:', err);
//         socket.onclose = () => console.log('Deepgram socket closed');
//       } catch (err) {
//         console.error('Error initializing Deepgram:', err);
//       }
//     };

//     connectToDeepgram();

//     return () => {
//       socketRef.current?.close();
//       mediaRecorderRef.current?.stop();
//       mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
//     };
//   }, []);

//   return (
//     <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
//       <h1>🎧 Deepgram Live Transcription</h1>

//       {confidenceDisplay && (
//         <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#333' }}>
//           {confidenceDisplay}
//         </p>
//       )}

//       {warning && <p style={{ color: 'red', fontWeight: 'bold' }}>{warning}</p>}

//       <div
//         style={{
//           backgroundColor: '#f4f4f4',
//           border: '1px solid #ccc',
//           borderRadius: '8px',
//           padding: '1rem',
//           height: '300px',
//           overflowY: 'scroll',
//           whiteSpace: 'pre-wrap',
//         }}
//       >
//         {transcripts.length === 0 ? (
//           '🎙 Speak to see transcript...'
//         ) : (
//           transcripts.map((line, idx) => <div key={idx}>• {line}</div>)
//         )}
//       </div>

//       {/* 🔊 Audio warning file */}
//       <audio ref={audioRef} src="/output.mp3" preload="auto" />

//       {/* 🤖 Vapi Assistant Iframe */}
//       <h2 style={{ marginTop: '2rem' }}>🤖 Vapi Assistant</h2>
//       <iframe
//         src="/vapi"
//         width="100%"
//         height="600px"
//         sandbox="allow-scripts allow-same-origin"
//         allow=""
//         style={{
//           border: '1px solid black',
//           borderRadius: '10px',
//           marginTop: '1rem',
//         }}
//         title="Vapi Assistant"
//       />
//     </div>
//   );
// }


































import { useEffect, useRef, useState } from 'react';

const DEEPGRAM_API_KEY = '8db50845e951f4d27e920901a1b20468d51d5407';

export default function App() {
  const [transcripts, setTranscripts] = useState([]);
  const [warning, setWarning] = useState('');
  const [confidenceDisplay, setConfidenceDisplay] = useState(null);
  const socketRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const connectToDeepgram = async () => {
      try {
        const socket = new WebSocket(
          `wss://api.deepgram.com/v1/listen?punctuate=true&language=en&diarize=true`,
          ['token', DEEPGRAM_API_KEY]
        );
        socketRef.current = socket;

        socket.onopen = async () => {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          mediaStreamRef.current = stream;

          const recorder = new MediaRecorder(stream, {
            mimeType: 'audio/webm;codecs=opus',
          });
          mediaRecorderRef.current = recorder;

          recorder.ondataavailable = (event) => {
            if (socket.readyState === WebSocket.OPEN && event.data.size > 0) {
              socket.send(event.data);
            }
          };

          recorder.start(250);
          console.log('🎤 Recording started');
        };

        socket.onmessage = ({ data }) => {
          const alt = JSON.parse(data)?.channel?.alternatives?.[0];
          const text = alt?.transcript;
          const confidence = alt?.confidence;
          const speaker = alt?.words?.[0]?.speaker;

          if (text) {
            const label = speaker !== undefined ? `Speaker ${speaker}` : 'Unknown Speaker';
            const message = `${label}: ${text}`;
            setTranscripts((prev) => [...prev, message]);

            if (confidence !== undefined) {
              const scorePercent = (confidence * 100).toFixed(2);
              setConfidenceDisplay(`🧠 Confidence Score: ${scorePercent}%`);

              if (confidence < 0.85) {
                setWarning(`⚠️ Low confidence: ${scorePercent}%`);

                if (audioRef.current) {
                  audioRef.current.currentTime = 0;
                  audioRef.current.play().catch((e) =>
                    console.error('Audio playback error:', e)
                  );
                }
              } else {
                setWarning('');

                // ✅ Only send to iframe if confidence is high
                if (speaker === 0) {
                  const iframe = document.querySelector('iframe');
                  const modifiedText = `Speaker 0: ${text}`;
                  iframe?.contentWindow?.postMessage({ speaker, text: modifiedText }, '*');
                }
              }
            }
          }
        };

        socket.onerror = (err) => console.error('WebSocket error:', err);
        socket.onclose = () => console.log('Deepgram socket closed');
      } catch (err) {
        console.error('Error initializing Deepgram:', err);
      }
    };

    connectToDeepgram();

    return () => {
      socketRef.current?.close();
      mediaRecorderRef.current?.stop();
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>🎧 Deepgram Live Transcription</h1>

      {confidenceDisplay && (
        <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#333' }}>
          {confidenceDisplay}
        </p>
      )}

      {warning && <p style={{ color: 'red', fontWeight: 'bold' }}>{warning}</p>}

      <div
        style={{
          backgroundColor: '#f4f4f4',
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '1rem',
          height: '300px',
          overflowY: 'scroll',
          whiteSpace: 'pre-wrap',
        }}
      >
        {transcripts.length === 0 ? (
          '🎙 Speak to see transcript...'
        ) : (
          transcripts.map((line, idx) => <div key={idx}>• {line}</div>)
        )}
      </div>

      {/* 🔊 Audio warning file */}
      <audio ref={audioRef} src="/output.mp3" preload="auto" />

      {/* 🤖 Vapi Assistant Iframe */}
      <h2 style={{ marginTop: '2rem' }}>🤖 Vapi Assistant</h2>
      <iframe
        src="/vapi"
        width="100%"
        height="600px"
        sandbox="allow-scripts allow-same-origin"
        allow=""
        style={{
          border: '1px solid black',
          borderRadius: '10px',
          marginTop: '1rem',
        }}
        title="Vapi Assistant"
      />
    </div>
  );
}
