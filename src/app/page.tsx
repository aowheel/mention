"use client";

import { MentionTextarea } from "@/components/MentionTextarea";

export default function Home() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Interactive Mention System Demo
      </h1>
      <p className="text-gray-600 mb-8 text-lg">
        Type @ followed by a name to see the user mention functionality in
        action. This demo showcases real-time user search, mention formatting,
        and data conversion.
      </p>
      <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Compose Your Message</h2>
        <p className="text-sm text-gray-600 mb-4">
          Start typing @ to mention users. Click on a suggestion or press
          Tab/Enter to insert the mention.
        </p>
        <MentionTextarea />
      </div>
    </div>
  );
}
