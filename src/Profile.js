import React from "react";

function Profile() {
  const firstName = localStorage.getItem("firstName") || "Navya";
  const lastName = localStorage.getItem("lastName") || "Arora";
  const email = localStorage.getItem("email") || "test@gmail.com";
  const mobile = localStorage.getItem("mobile") || "98XXXXXXXX";
  const gender = localStorage.getItem("gender") || "Female";

  return (
    <div className="bg-white min-h-screen py-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-80 bg-white rounded shadow p-4 mb-6 md:mb-0">
          {/* User Info */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center text-3xl font-bold text-white">
              👤
            </div>
            <div>
              <div className="text-gray-500 text-sm">Hello,</div>
              <div className="font-semibold text-lg text-gray-800">
                {firstName} {lastName}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav>
            <div className="mb-4">
              <div className="flex items-center gap-2 text-blue-600 font-semibold mb-2">
                🏠 MY ORDERS
              </div>
            </div>

            <div className="mb-4">
              <div className="text-gray-400 font-semibold mb-2">
                ACCOUNT SETTINGS
              </div>
              <ul className="ml-2">
                <li className="text-blue-600 font-semibold bg-blue-50 rounded px-2 py-1 mb-1">
                  Profile Information
                </li>
                <li className="text-gray-700 px-2 py-1 mb-1 cursor-pointer hover:bg-gray-100 rounded">
                  Manage Addresses
                </li>
                <li className="text-gray-700 px-2 py-1 mb-1 cursor-pointer hover:bg-gray-100 rounded">
                  PAN Card Information
                </li>
              </ul>
            </div>

            <div className="mb-4">
              <div className="text-gray-400 font-semibold mb-2">PAYMENTS</div>
              <ul className="ml-2">
                <li className="text-gray-700 px-2 py-1 mb-1 cursor-pointer hover:bg-gray-100 rounded flex items-center justify-between">
                  Gift Cards{" "}
                  <span className="text-green-600 font-semibold">₹0</span>
                </li>
                <li className="text-gray-700 px-2 py-1 mb-1 cursor-pointer hover:bg-gray-100 rounded">
                  Saved UPI
                </li>
                <li className="text-gray-700 px-2 py-1 mb-1 cursor-pointer hover:bg-gray-100 rounded">
                  Saved Cards
                </li>
              </ul>
            </div>

            <div className="mb-4">
              <div className="text-gray-400 font-semibold mb-2">MY STUFF</div>
              <ul className="ml-2">
                <li className="text-gray-700 px-2 py-1 mb-1 cursor-pointer hover:bg-gray-100 rounded">
                  My Coupons
                </li>
              </ul>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white rounded shadow p-8">
          {/* Personal Information */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Personal Information</h2>
            <button className="text-blue-600 font-semibold text-sm" disabled>
              Edit
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              value={firstName}
              readOnly
              className="border rounded px-3 py-2 bg-gray-100"
            />
            <input
              type="text"
              value={lastName}
              readOnly
              className="border rounded px-3 py-2 bg-gray-100"
            />
          </div>

          <div className="mb-4">
            <div className="text-gray-700 mb-2">Your Gender</div>
            <label className="mr-6">
              <input
                type="radio"
                readOnly
                checked={gender === "Male"}
                className="mr-1"
              />{" "}
              Male
            </label>
            <label>
              <input
                type="radio"
                readOnly
                checked={gender === "Female"}
                className="mr-1"
              />{" "}
              Female
            </label>
          </div>

          {/* Email */}
          <div className="flex items-center justify-between mb-2 mt-8">
            <h3 className="text-lg font-semibold">Email Address</h3>
            <button className="text-blue-600 font-semibold text-sm" disabled>
              Edit
            </button>
          </div>
          <input
            type="text"
            value={email}
            readOnly
            className="border rounded px-3 py-2 bg-gray-100 w-full mb-4"
          />

          {/* Mobile */}
          <div className="flex items-center justify-between mb-2 mt-8">
            <h3 className="text-lg font-semibold">Mobile Number</h3>
            <button className="text-blue-600 font-semibold text-sm" disabled>
              Edit
            </button>
          </div>
          <input
            type="text"
            value={mobile}
            readOnly
            className="border rounded px-3 py-2 bg-gray-100 w-full mb-4"
          />

          {/* FAQs */}
          <div className="mt-10">
            <h3 className="text-lg font-semibold mb-2">FAQs</h3>
            <div className="text-gray-700 mb-1">
              What happens when I update my email address or mobile number?
            </div>
            <div className="text-gray-500 text-sm">
              Your login details will be updated everywhere on Flipkart.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
