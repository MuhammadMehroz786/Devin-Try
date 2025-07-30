import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ChatRoom } from './ChatRoom';
import { ChatSidebar } from './ChatSidebar';
import { Alert, AlertDescription } from '../ui/alert';
import { MessageCircle, Hash, Users } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender_id: string;
  room: string;
  message: string;
  timestamp: string;
  sender?: {
    full_name: string;
    email: string;
  };
}

interface ChatRoom {
  id: string;
  name: string;
  type: 'public' | 'private';
  description?: string;
}

export const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [currentRoom, setCurrentRoom] = useState<string>('#general');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { token, user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  useEffect(() => {
    initializeChat();
  }, []);

  useEffect(() => {
    if (currentRoom) {
      fetchMessages(currentRoom);
      const interval = setInterval(() => {
        fetchMessages(currentRoom);
      }, 2000); // Poll every 2 seconds for real-time effect

      return () => clearInterval(interval);
    }
  }, [currentRoom]);

  const initializeChat = () => {
    const defaultRooms: ChatRoom[] = [
      {
        id: '#general',
        name: 'General',
        type: 'public',
        description: 'General discussion for all community members'
      },
      {
        id: '#internships',
        name: 'Internships',
        type: 'public',
        description: 'Discuss internship opportunities and experiences'
      },
      {
        id: '#hackathons',
        name: 'Hackathons',
        type: 'public',
        description: 'Share hackathon updates and team formation'
      },
      {
        id: '#mentorship',
        name: 'Mentorship',
        type: 'public',
        description: 'Connect with mentors and share career advice'
      }
    ];

    setRooms(defaultRooms);
    setLoading(false);
  };

  const fetchMessages = async (room: string) => {
    try {
      const response = await fetch(`${API_URL}/chat/messages/${encodeURIComponent(room)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        console.error('Failed to fetch messages');
      }
    } catch (err) {
      console.error('Error loading messages:', err);
    }
  };

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    try {
      const response = await fetch(`${API_URL}/chat/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          room: currentRoom,
          message: messageText.trim()
        }),
      });

      if (response.ok) {
        fetchMessages(currentRoom);
      } else {
        setError('Failed to send message');
      }
    } catch (err) {
      setError('Error sending message');
    }
  };

  const handleRoomChange = (roomId: string) => {
    setCurrentRoom(roomId);
    setError('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  const currentRoomInfo = rooms.find(room => room.id === currentRoom);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <MessageCircle className="h-8 w-8 mr-3 text-blue-600" />
              Community Chat
            </h1>
            <p className="text-gray-600 mt-2">
              Connect with the community in real-time
            </p>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: '600px' }}>
          <div className="flex h-full">
            {/* Sidebar */}
            <ChatSidebar
              rooms={rooms}
              currentRoom={currentRoom}
              onRoomChange={handleRoomChange}
            />

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
              {/* Chat Header */}
              <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center">
                  {currentRoomInfo?.type === 'public' ? (
                    <Hash className="h-5 w-5 text-gray-500 mr-2" />
                  ) : (
                    <Users className="h-5 w-5 text-gray-500 mr-2" />
                  )}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {currentRoomInfo?.name || currentRoom}
                    </h2>
                    {currentRoomInfo?.description && (
                      <p className="text-sm text-gray-500">
                        {currentRoomInfo.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Chat Room */}
              <ChatRoom
                messages={messages}
                currentUser={user}
                onSendMessage={sendMessage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
