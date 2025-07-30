import React from 'react';
import { Button } from '../ui/button';
import { Hash, Users, Plus } from 'lucide-react';

interface ChatRoom {
  id: string;
  name: string;
  type: 'public' | 'private';
  description?: string;
}

interface ChatSidebarProps {
  rooms: ChatRoom[];
  currentRoom: string;
  onRoomChange: (roomId: string) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  rooms,
  currentRoom,
  onRoomChange,
}) => {
  const publicRooms = rooms.filter(room => room.type === 'public');
  const privateRooms = rooms.filter(room => room.type === 'private');

  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold">Community Chat</h3>
      </div>

      {/* Public Channels */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-300 uppercase tracking-wide">
              Channels
            </h4>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-gray-400 hover:text-white"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-1">
            {publicRooms.map((room) => (
              <button
                key={room.id}
                onClick={() => onRoomChange(room.id)}
                className={`w-full flex items-center px-2 py-1.5 text-sm rounded hover:bg-gray-700 transition-colors ${
                  currentRoom === room.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <Hash className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">{room.name.toLowerCase()}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Direct Messages */}
        {privateRooms.length > 0 && (
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-300 uppercase tracking-wide">
                Direct Messages
              </h4>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-gray-400 hover:text-white"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-1">
              {privateRooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => onRoomChange(room.id)}
                  className={`w-full flex items-center px-2 py-1.5 text-sm rounded hover:bg-gray-700 transition-colors ${
                    currentRoom === room.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{room.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* User Info */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium">U</span>
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              You
            </p>
            <p className="text-xs text-gray-400 truncate">
              Online
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
