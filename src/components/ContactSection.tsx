import React, { useState } from 'react';
import { Send } from 'lucide-react';

export default function ContactSection() {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `mailto:visuallyindiedev@gmail.com?subject=Grid Plotting App Feedback&body=${encodeURIComponent(message)}`;
    setMessage('');
    setStatus('success');
    setTimeout(() => setStatus('idle'), 3000);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold mb-4">Send Feedback</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Your Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full min-h-[100px] p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Share your thoughts, suggestions, or report issues..."
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center gap-2 transition-colors"
          >
            <Send size={16} />
            Send Feedback
          </button>
          {status === 'success' && (
            <span className="text-green-600 text-sm">
              Email client opened! Thank you for your feedback.
            </span>
          )}
        </div>
      </form>
    </div>
  );
}