import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minimize2 } from 'lucide-react';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hi! I\'m your medication management assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickReplies = [
    'How do I add medication?',
    'Set up reminders',
    'Request refill',
    'View medication history',
  ];

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        text: getBotResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const getBotResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('add') && lowerMessage.includes('medication')) {
      return 'To add a medication, go to your Dashboard and click the "Add Medication" button. Fill in the details like name, dosage, and frequency. Would you like me to guide you through it?';
    }
    if (lowerMessage.includes('reminder')) {
      return 'Reminders are set up automatically when you add a medication with a schedule. You can also configure notification settings in your Profile. Need help with notification settings?';
    }
    if (lowerMessage.includes('refill')) {
      return 'You can request a refill by clicking the "Request Refill" button on any medication card that shows low or no refills. The button appears when you have 2 or fewer refills remaining.';
    }
    if (lowerMessage.includes('history')) {
      return 'Your medication history can be viewed by clicking "History" in the navigation menu. It shows a timeline of all your medication events including when meds were taken, refilled, or dosages changed.';
    }
    if (lowerMessage.includes('schedule')) {
      return 'You can set up different schedules: Daily (1-4 times per day), Weekly (specific days), Every X days, or As Needed. Open any medication details to edit its schedule.';
    }
    if (lowerMessage.includes('dosage')) {
      return 'To adjust dosage, open the medication details and click "Adjust Dosage". You\'ll need to provide a reason and confirm it was approved by your healthcare provider.';
    }
    
    return 'I\'m here to help! You can ask me about adding medications, setting reminders, requesting refills, or viewing your history. What would you like to know more about?';
  };

  const handleQuickReply = (reply) => {
    setInputMessage(reply);
    handleSendMessage();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 group"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col z-50 animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-blue-600 text-white rounded-t-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">Support Assistant</h3>
                <p className="text-xs text-blue-100">Online • Typically replies instantly</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/10 p-2 rounded-lg transition-colors"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/10 p-2 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length <= 2 && (
            <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Quick replies:</p>
              <div className="flex flex-wrap gap-2">
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickReply(reply)}
                    className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={inputMessage.trim() === ''}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
