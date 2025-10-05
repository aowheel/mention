"use client";

import { useState } from "react";
import { MentionTextarea } from "@/components/MentionTextarea";

export default function Home() {
  const [displayText, setDisplayText] = useState("");
  const [dataText, setDataText] = useState("");
  const [submittedData, setSubmittedData] = useState<string | null>(null);

  const handleTextChange = (newDisplayText: string, newDataText: string) => {
    setDisplayText(newDisplayText);
    setDataText(newDataText);
  };

  const handleSubmit = (finalDataText: string) => {
    setSubmittedData(finalDataText);
  };

  const handleClear = () => {
    setDisplayText("");
    setDataText("");
    setSubmittedData(null);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Mention Feature Demo</h1>

      <div className="space-y-6">
        {/* Main mention textarea */}
        <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Compose Message</h2>
          <MentionTextarea
            onChange={handleTextChange}
            onSubmit={handleSubmit}
          />

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={() => handleSubmit(dataText)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Submit Message
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Real-time preview */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-gray-700">
              Display Text (What User Sees)
            </h3>
            <pre className="text-sm bg-white p-3 rounded border overflow-auto">
              {displayText || "(empty)"}
            </pre>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-gray-700">
              Data Text (Internal Format)
            </h3>
            <pre className="text-sm bg-white p-3 rounded border overflow-auto">
              {dataText || "(empty)"}
            </pre>
          </div>
        </div>

        {/* Submission result */}
        {submittedData && (
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-green-800">
              Submitted Data
            </h3>
            <pre className="text-sm bg-white p-3 rounded border overflow-auto">
              {submittedData}
            </pre>
            <p className="text-sm text-green-600 mt-2">
              This is the data that would be sent to your backend API.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
