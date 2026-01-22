import React from 'react';

export default function Sidebar({ activeItem, onNavigate, channelName, isCollapsed }) {
  const displayName = (channelName || "").trim() || "Tony's Channel";
  const channelInitial = displayName.charAt(0).toUpperCase() || "T";
  const menuItems = [
    { id: "dashboard", icon: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z", label: "Dashboard" },
    { id: "content", icon: "M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z", label: "Content" },
    { id: "analytics", icon: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z", label: "Analytics" },
    { id: "community", icon: "M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z", label: "Community" },
    { id: "subtitles", icon: "M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H5V8h14v10z", label: "Subtitles" },
    { id: "earn", icon: "M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z", label: "Earn" },
    { id: "customization", icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z", label: "Customization" },
    { id: "audio-library", icon: "M12 3v9.28c-.47-.17-.97-.28-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V6h4V3h-7z", label: "Audio Library" },
    { id: "settings", icon: "M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.5.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.64-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z", label: "Settings" },
  ];

  const secondaryMenuItems = [
    { id: "send-feedback", icon: "M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z", label: "Send feedback" },
  ];

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-64'} bg-white border-r border-[#e5e5e5] fixed top-16 bottom-0 left-0 overflow-y-auto z-40 transition-all duration-300`}>
      <div className="flex flex-col py-2">
        {!isCollapsed && (
          <div className="px-6 py-6 flex flex-col items-center border-b border-[#e5e5e5] mb-2">
            <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-3">
              {channelInitial}
            </div>
            <h3 className="text-[#0d0d0d] font-medium">Your Channel</h3>
            <p className="text-[#606060] text-sm">{displayName}</p>
          </div>
        )}

        {isCollapsed && (
          <div className="px-2 py-4 flex flex-col items-center border-b border-[#e5e5e5] mb-2">
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
              {channelInitial}
            </div>
          </div>
        )}

        {menuItems.map((item) => {
          const isActive = activeItem === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center ${isCollapsed ? 'justify-center px-2' : 'gap-4 px-6'} py-3 hover:bg-[#f2f2f2] ${isActive ? 'border-l-4 border-[#ff4e45] bg-[#f9f9f9] text-[#ff4e45]' : 'text-[#0d0d0d] border-l-4 border-transparent'}`}
              title={isCollapsed ? item.label : ''}
            >
              <svg viewBox="0 0 24 24" className={`w-6 h-6 ${isActive ? 'fill-[#ff4e45]' : 'fill-[#909090]'}`}>
                <path d={item.icon}></path>
              </svg>
              {!isCollapsed && (
                <span className={`text-sm font-medium ${isActive ? 'text-[#ff4e45]' : 'text-[#0d0d0d]'}`}>{item.label}</span>
              )}
            </button>
          );
        })}

        {/* Divider */}
        <div className="border-t border-[#e5e5e5] my-2"></div>

        {/* Secondary Menu Items */}
        {secondaryMenuItems.map((item) => {
          const isActive = activeItem === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center ${isCollapsed ? 'justify-center px-2' : 'gap-4 px-6'} py-3 hover:bg-[#f2f2f2] ${isActive ? 'border-l-4 border-[#ff4e45] bg-[#f9f9f9] text-[#ff4e45]' : 'text-[#0d0d0d] border-l-4 border-transparent'}`}
              title={isCollapsed ? item.label : ''}
            >
              <svg viewBox="0 0 24 24" className={`w-6 h-6 ${isActive ? 'fill-[#ff4e45]' : 'fill-[#909090]'}`}>
                <path d={item.icon}></path>
              </svg>
              {!isCollapsed && (
                <span className={`text-sm font-medium ${isActive ? 'text-[#ff4e45]' : 'text-[#0d0d0d]'}`}>{item.label}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
