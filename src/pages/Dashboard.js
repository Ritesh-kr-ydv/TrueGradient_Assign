import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { IoIosNotificationsOutline } from 'react-icons/io';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [message, setMessage] = useState('');
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [currentMessages, setCurrentMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Welcome!",
      content: "Welcome to AI Chat. You have 1,250 credits to start with.",
      timestamp: "44m ago",
      isUnread: true,
      type: "welcome"
    },
    {
      id: 2,
      title: "Feature Update",
      content: "New conversation export feature is now available.",
      timestamp: "2h ago",
      isUnread: false,
      type: "feature"
    }
  ]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const toggleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown);
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isUnread: false }))
    );
  };

  const unreadCount = notifications.filter(n => n.isUnread).length;
  const notificationRef = useRef(null);
  const userDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };

    if (showNotifications || showUserDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications, showUserDropdown]);

  const suggestionBoxes = [
    "Explain quantum computing in simple terms",
    "Write a Python function to sort a list",
    "What are the benefits of meditation?",
    "Help me plan a weekend trip to Paris"
  ];

  // Hardcoded LLM responses
  const getLLMResponse = (userMessage) => {
    const responses = {
      "explain quantum computing in simple terms": "Quantum computing is like having a computer that can be in multiple states at once, unlike regular computers that are either 0 or 1. It uses quantum bits (qubits) that can exist in superposition, allowing for incredibly fast calculations for certain problems like cryptography and optimization.",
      "write a python function to sort a list": "Here's a simple Python function to sort a list:\n\n```python\ndef sort_list(lst):\n    return sorted(lst)\n\n# Example usage:\nnumbers = [3, 1, 4, 1, 5, 9, 2, 6]\nprint(sort_list(numbers))  # [1, 1, 2, 3, 4, 5, 6, 9]\n```",
      "what are the benefits of meditation?": "Meditation offers numerous benefits including reduced stress and anxiety, improved focus and concentration, better emotional regulation, enhanced self-awareness, improved sleep quality, and increased feelings of calm and well-being. Regular practice can also boost immune function and reduce blood pressure.",
      "help me plan a weekend trip to paris": "Here's a great weekend itinerary for Paris:\n\n**Day 1:**\n- Morning: Visit the Eiffel Tower and Trocadéro\n- Afternoon: Explore the Louvre Museum\n- Evening: Walk along the Seine and have dinner in Montmartre\n\n**Day 2:**\n- Morning: Visit Notre-Dame and Île de la Cité\n- Afternoon: Stroll through the Latin Quarter\n- Evening: Enjoy a Seine river cruise\n\nDon't forget to try croissants, visit local cafés, and take in the beautiful architecture!"
    };

    const lowerMessage = userMessage.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
      if (lowerMessage.includes(key)) {
        return response;
      }
    }

    // Default response for any other message
    return "That's an interesting question! I'm an AI assistant designed to help with various topics? I can help with programming, science, travel planning, and many other subjects.";
  };

  const createNewConversation = () => {
    const newConversation = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      createdAt: new Date()
    };
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(newConversation.id);
    setCurrentMessages([]);
    return newConversation.id;
  };

  const handleSendMessage = async () => {
    if (message.trim()) {
      const userMessage = {
        id: Date.now().toString(),
        type: 'user',
        content: message.trim(),
        timestamp: new Date()
      };

      let conversationId = currentConversationId;
      
      // Create new conversation if none exists
      if (!conversationId) {
        conversationId = createNewConversation();
      }

      // Add user message immediately
      const messagesWithUser = [...currentMessages, userMessage];
      setCurrentMessages(messagesWithUser);

      // Show loading state
      setIsLoading(true);

      // Simulate AI response delay
      setTimeout(() => {
        const llmResponse = getLLMResponse(message.trim());
        const aiMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: llmResponse,
          timestamp: new Date()
        };

        const newMessages = [...messagesWithUser, aiMessage];
        setCurrentMessages(newMessages);

        // Update conversations
        setConversations(prev => 
          prev.map(conv => 
            conv.id === conversationId 
              ? { 
                  ...conv, 
                  messages: newMessages,
                  title: conv.title === "New Chat" ? message.trim().substring(0, 30) + (message.trim().length > 30 ? "..." : "") : conv.title
                }
              : conv
          )
        );

        setIsLoading(false);
      }, 1500); // 1.5 second delay to show loading

      setMessage('');
    }
  };

  const loadConversation = (conversationId) => {
    const conversation = conversations.find(conv => conv.id === conversationId);
    if (conversation) {
      setCurrentConversationId(conversationId);
      setCurrentMessages(conversation.messages);
    }
  };

  const startNewChat = () => {
    setCurrentConversationId(null);
    setCurrentMessages([]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-80'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <h2 className="text-lg font-bold text-gray-900">Conversations</h2>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          {sidebarCollapsed ? (
            <button 
              onClick={startNewChat}
              className="w-full bg-blue-600 text-white py-2 px-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          ) : (
            <button 
              onClick={startNewChat}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Chat
            </button>
          )}
        </div>

        {/* Separator Line */}
        <div className="px-4 pb-4">
          <div className="border-t border-gray-200 shadow-sm"></div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 p-4 overflow-y-auto">
          {!sidebarCollapsed && (
            <div className="space-y-2">
              {conversations.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p className="text-sm">No conversations yet</p>
                </div>
              ) : (
                conversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => loadConversation(conversation.id)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-200 group ${
                      currentConversationId === conversation.id
                        ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-900 border border-blue-200 shadow-sm'
                        : 'hover:bg-gray-50 text-gray-700 hover:shadow-sm border border-transparent hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                        currentConversationId === conversation.id
                          ? 'bg-blue-200 text-blue-700'
                          : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                      }`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-medium truncate ${
                            currentConversationId === conversation.id ? 'text-blue-900' : 'text-gray-900'
                          }`}>
                            {conversation.title}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            currentConversationId === conversation.id
                              ? 'bg-blue-200 text-blue-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}>
                            {conversation.messages.length}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className={`text-xs ${
                            currentConversationId === conversation.id ? 'text-blue-600' : 'text-gray-500'
                          }`}>
                            {conversation.messages.length > 0 
                              ? conversation.messages[conversation.messages.length - 1].timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                              : 'Just now'
                            }
                          </span>
                          <div className={`w-2 h-2 rounded-full ${
                            currentConversationId === conversation.id ? 'bg-blue-500' : 'bg-gray-300'
                          }`}></div>
                        </div>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">AI Chat</h1>
            <div className="flex items-center space-x-4">
              {/* Credits with Blue Background */}
              <div className="flex items-center space-x-2 bg-blue-100 px-3 py-2 rounded-lg">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span className="text-sm font-bold text-blue-700">1,249</span>
              </div>

              {/* Notifications */}
              <div className="relative" ref={notificationRef}>
                <button 
                  onClick={toggleNotifications}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
                >
                  <IoIosNotificationsOutline className="w-5 h-5 text-gray-600" style={{strokeWidth: '2.5'}} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-blue-50">
                      <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
                      <button 
                        onClick={markAllAsRead}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Mark all read
                      </button>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div 
                          key={notification.id}
                          className="flex items-start px-5 py-4 hover:bg-gray-50 border-b border-gray-50 last:border-b-0"
                        >
                          {/* Status Dot */}
                          <div className={`flex-shrink-0 w-3 h-3 rounded-full mt-1.5 ${
                            notification.type === 'welcome' ? 'bg-green-500' : 'bg-blue-500'
                          }`}></div>
                          
                          {/* Notification Content */}
                          <div className="flex-1 ml-3 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="text-sm font-semibold text-gray-900 text-left">
                                    {notification.title}
                                  </h4>
                                  <span className="text-xs text-gray-500 text-right">
                                    {notification.timestamp}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-2 leading-relaxed text-left">
                                  {notification.content}
                                </p>
                              </div>
                              
                              {/* Unread Indicator */}
                              {notification.isUnread && (
                                <div className="flex-shrink-0 ml-3 mt-1">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile */}
              <div className="relative" ref={userDropdownRef}>
                <button 
                  onClick={toggleUserDropdown}
                  className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user?.username}</span>
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* User Dropdown */}
                {showUserDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
                    {/* Username with faint text */}
                    <div className="px-4 py-3 text-left">
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <div className="text-sm font-medium text-gray-400">{user?.username}</div>
                      </div>
                    </div>
                    
                    {/* Settings */}
                    <button className="w-full text-left px-4 py-3 hover:bg-blue-50 text-sm text-gray-700 hover:text-blue-600 flex items-center space-x-2 group">
                      <svg className="w-4 h-4 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Settings</span>
                    </button>
                    
                    {/* Logout */}
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 hover:bg-blue-50 text-sm text-gray-700 hover:text-blue-600 flex items-center space-x-2 rounded-b-xl group"
                    >
                      <svg className="w-4 h-4 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {currentMessages.length > 0 ? (
            /* Messages Area */
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                {currentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.type === 'ai' && (
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <div className="text-sm font-medium text-gray-900">AI Assistant</div>
                            <div className="text-xs text-gray-500">
                              {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                          </div>
                          <div className="bg-white border border-gray-200 rounded-2xl p-4 max-w-2xl">
                            <div className="whitespace-pre-wrap text-sm text-gray-900 text-left">{msg.content}</div>
                          </div>
                        </div>
                      </div>
                    )}
                    {msg.type === 'user' && (
                      <div className="flex items-start space-x-3 justify-end">
                        <div className="flex-1 max-w-2xl">
                          <div className="flex items-center space-x-2 mb-1 justify-end">
                            <div className="text-sm font-medium text-gray-900">You</div>
                            <div className="text-xs text-gray-500">
                              {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                          </div>
                          <div className="bg-white border border-gray-200 rounded-2xl p-4 ml-auto">
                            <div className="whitespace-pre-wrap text-sm text-gray-900">{msg.content}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <div className="text-sm font-medium text-gray-900">AI Assistant</div>
                          <div className="text-xs text-gray-500">
                            {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-2xl p-4 max-w-2xl">
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            </div>
                            <span className="text-sm text-gray-500">AI is thinking...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Welcome Screen */
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              {/* Logo */}
              <div className="mb-8">
                <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>

              {/* Welcome Message */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Welcome to AI Chat</h2>
                <p className="text-gray-600 text-base max-w-2xl">
                  Start a conversation with our AI assistant. Ask questions, get help with tasks, or explore ideas together.
                </p>
              </div>

              {/* Suggestion Boxes */}
              <div className="grid grid-cols-2 gap-3 max-w-3xl w-full">
                {suggestionBoxes.map((suggestion, index) => (
                  <button
                    key={index}
                    className="p-3 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors bg-white shadow-sm flex items-start space-x-2"
                    onClick={() => setMessage(suggestion)}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <span className="text-gray-800 text-sm font-medium flex-1">{suggestion}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Separator Line */}
          <div className="border-t border-gray-200"></div>

          {/* Chat Input Area - Fixed at Bottom */}
          <div className="p-6 bg-white">
            <div className="max-w-3xl mx-auto">
              <div className="relative bg-white rounded-2xl shadow-sm border border-gray-200">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  className="w-full p-2.5 pr-16 border-0 rounded-2xl resize-none focus:outline-none focus:ring-0 bg-transparent text-sm"
                  rows={1}
                  maxLength={2000}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="absolute right-2 bottom-1.5 bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
              <div className="flex justify-between items-center mt-1 text-xs text-gray-500">
                <span>Press Enter to send, Shift+Enter for new line</span>
                <span>{message.length}/2000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
