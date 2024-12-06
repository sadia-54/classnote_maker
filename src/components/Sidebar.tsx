import React from "react";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-black text-red-400 p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold mt-3">ClassNote Maker</h1>
      </div>
      <nav>
        <ul>
          <li className="mb-2 mt-10">
            <a href="/dashboard" className="flex items-center space-x-2">
              <span>🏠</span>
              <span>Dashboard</span>
            </a>
          </li>
          <li>
            <a href="/settings" className="flex items-center space-x-2">
              <span>⚙️</span>
              <span>Settings</span>
            </a>
          </li>
        </ul>
      </nav>
      <div className="mt-20">
        <button className="bg-red-400 text-white w-full py-2 rounded">
          ✨ Upgrade to Premium
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
