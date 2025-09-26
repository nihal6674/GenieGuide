import React, { useState } from "react";

const AudioRecorder = () => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [backendReceived, setBackendReceived] = useState(""); // NEW
  const [language, setLanguage] = useState("ja-JP");

  let recog = null;

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Your browser does not support Speech Recognition");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recog = new SpeechRecognition();

    recog.continuous = false;
    recog.lang = language;
    recog.interimResults = true;
    recog.maxAlternatives = 1;

    let finalTranscript = "";

    recog.onresult = (event) => {
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + " ";
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setTranscript(finalTranscript + interimTranscript);
    };

    recog.onend = () => {
      setListening(false);
      if (finalTranscript.trim() !== "") {
        // Display received text temporarily
        setBackendReceived(finalTranscript.trim());
        sendToAI(finalTranscript.trim());
      }
    };

    recog.start();
    setListening(true);
  };

  const sendToAI = async (text) => {
    try {
      const response = await fetch("http://localhost:5000/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      setAiResponse(data.result);
    } catch (err) {
      console.error("Failed to get AI response:", err);
      setAiResponse("Error: Could not get response from AI.");
    }
  };

  return (
    <div className="p-4 text-center">
      <h2 className="text-xl font-bold mb-4">🎤 Speech-to-Text + AI</h2>

      <div className="mb-4">
        <label className="mr-2 font-semibold">Select Language:</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="ja-JP">Japanese</option>
          <option value="en-US">English</option>
          <option value="ko-KR">Korean</option>
          <option value="zh-CN">Chinese</option>
          <option value="es-ES">Spanish</option>
        </select>
      </div>

      <button
        onClick={startListening}
        className={`px-4 py-2 rounded ${listening ? "bg-red-500" : "bg-green-500"} text-white`}
        disabled={listening}
      >
        {listening ? "Listening..." : "Start Listening"}
      </button>

      {transcript && (
        <div className="mt-4 p-2 border rounded bg-gray-100">
          <p><strong>Transcript:</strong></p>
          <p>{transcript}</p>
        </div>
      )}

      {backendReceived && (
        <div className="mt-4 p-2 border rounded bg-yellow-100">
          <p><strong>Text sent to backend:</strong></p>
          <p>{backendReceived}</p>
        </div>
      )}

      {aiResponse && (
        <div className="mt-4 p-2 border rounded bg-blue-100">
          <p><strong>AI Response:</strong></p>
          <p>{aiResponse}</p>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
