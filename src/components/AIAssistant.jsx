import { useState } from 'react';
import { MessageSquare, Send, Sparkles, X } from 'lucide-react';
import Button from './Button';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi! I\'m your AI medication assistant. I can help you with:\n\n• Medication information and side effects\n• Drug interaction warnings\n• Adherence tips and reminders\n• General health questions\n\nHow can I assist you today?'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const suggestedQuestions = [
    'What are common side effects of my medications?',
    'Can I take all my medications together?',
    'What should I do if I miss a dose?',
    'How can I improve my medication adherence?',
  ];

  const getAIResponse = async (userMessage) => {
    // Simulate AI response - In production, integrate with OpenAI, Anthropic, or medical API
    setIsTyping(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let response = '';
    
    // Simple keyword-based responses (replace with actual AI API)
    if (userMessage.toLowerCase().includes('side effect')) {
      response = 'Common side effects vary by medication. Based on your current medications:\n\n• **Lisinopril**: May cause dizziness, dry cough, or fatigue. Take it consistently at the same time.\n• **Metformin**: Can cause nausea or stomach upset. Taking it with food helps.\n• **Atorvastatin**: May cause muscle pain or headaches. Report severe muscle pain to your doctor.\n\nAlways consult your healthcare provider if side effects persist or worsen.';
    } else if (userMessage.toLowerCase().includes('interact')) {
      response = 'Your current medications (Lisinopril, Metformin, and Atorvastatin) are generally safe to take together. However:\n\n⚠️ **Important**: Avoid grapefruit juice with Atorvastatin as it can increase side effects.\n\n✅ **Safe**: These medications don\'t have major interactions with each other.\n\nAlways inform your doctor about all medications, supplements, and vitamins you take.';
    } else if (userMessage.toLowerCase().includes('miss') && userMessage.toLowerCase().includes('dose')) {
      response = 'If you miss a dose:\n\n1. **Within a few hours**: Take it as soon as you remember\n2. **Close to next dose**: Skip the missed dose, never double up\n3. **Not sure?**: Contact your pharmacist or doctor\n\n💡 **Tip**: Set up reminders in this app to avoid missing doses!';
    } else if (userMessage.toLowerCase().includes('adherence') || userMessage.toLowerCase().includes('remember')) {
      response = 'Here are proven strategies to improve medication adherence:\n\n🔔 **Use Reminders**: Enable notifications in this app\n📅 **Link to Routine**: Take meds with daily activities (breakfast, brushing teeth)\n💊 **Pill Organizer**: Use a weekly pill box\n📝 **Keep a Log**: Track your doses in this app\n👥 **Get Support**: Ask family members to remind you\n\nYour current adherence rate is good! Keep up the great work.';
    } else if (userMessage.toLowerCase().includes('food') || userMessage.toLowerCase().includes('eat')) {
      response = 'Food recommendations for your medications:\n\n• **Lisinopril**: Can be taken with or without food\n• **Metformin**: Best taken WITH meals to reduce stomach upset\n• **Atorvastatin**: Can be taken any time, with or without food\n\nMaintain a consistent schedule for best results.';
    } else {
      response = 'I can help you with medication information, side effects, drug interactions, and adherence tips. Could you be more specific about what you\'d like to know?\n\nYou can also try asking:\n• About side effects\n• About drug interactions\n• What to do if you miss a dose\n• Tips for remembering medications';
    }
    
    setIsTyping(false);
    return response;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    
    // Get AI response
    const aiResponse = await getAIResponse(userMessage);
    
    // Add AI response
    setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
  };

  const handleSuggestedQuestion = (question) => {
    setInputValue(question);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all hover:scale-110 z-40"
        aria-label="Open AI Assistant"
      >
        <Sparkles className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 bg-white rounded-lg shadow-2xl z-40 flex flex-col max-h-[600px]">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5" />
          <h3 className="font-semibold">AI Medication Assistant</h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:bg-white/20 rounded p-1 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[400px]">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm whitespace-pre-line">{message.content}</p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Questions */}
      {messages.length === 1 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleSuggestedQuestion(question)}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-full transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about your medications..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="px-3"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          ⚠️ This is AI-generated advice. Always consult your healthcare provider.
        </p>
      </div>
    </div>
  );
};

export default AIAssistant;
