import React from "react";

export default function FrontPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      {/* Header */}
      <div className="w-full max-w-4xl bg-orange-700 text-white p-4 rounded-t-lg">
        <h1 className="text-lg font-semibold">Email for Create an Account</h1>
        <p className="text-sm opacity-90">
          create an account with email, clicked email, invalid email case
        </p>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md bg-white shadow-lg rounded-b-lg p-6">
        <p className="text-gray-400 text-sm mb-2">Create: PreClicked</p>

        <h2 className="text-2xl font-bold text-center mb-2">
          Welcome to Longhorn Journey
        </h2>

        <p className="text-center text-gray-500 mb-6">The UT platform to...</p>

        {/* Flow Section */}
        <div className="relative flex flex-col items-center space-y-8 mb-8">
          {/* Box 1 */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-300 rounded"></div>
            <p className="text-sm text-gray-700">Find Events & Organizations</p>
          </div>

          {/* Arrow */}
          <div className="text-gray-400">↓</div>

          {/* Box 2 */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-300 rounded"></div>
            <p className="text-sm text-gray-700">Make Connections</p>
          </div>

          {/* Arrow */}
          <div className="text-gray-400">↓</div>

          {/* Box 3 */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-300 rounded"></div>
            <p className="text-sm text-gray-700">Join A Community</p>
          </div>

          {/* Arrow */}
          <div className="text-gray-400">↓</div>

          {/* Box 4 */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-300 rounded"></div>
            <p className="text-sm text-gray-700">Grow as a Longhorn!</p>
          </div>
        </div>

        {/* Buttons */}
        <button className="w-full bg-orange-700 text-white py-3 rounded-lg font-semibold hover:bg-orange-800 transition mb-3">
          Get Started
        </button>

        <button className="w-full border border-gray-300 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition">
          Already Have an Account
        </button>
      </div>
    </div>
  );
}
