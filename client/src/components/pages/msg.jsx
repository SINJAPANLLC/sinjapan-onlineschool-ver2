import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Send, 
  ArrowLeft, 
  Plus, 
  X, 
  Users, 
  MessageCircle,
  BookOpen,
  GraduationCap,
  Clock
} from 'lucide-react';
import BottomNavigationWithCreator from '../BottomNavigationWithCreator';
import { useAuth } from '../../context/AuthContext';
import { useUnreadMessages } from '../../context/UnreadMessagesContext';
import { rtdb, db } from '../../firebase';
import { ref, push, onValue, off, set } from 'firebase/database';
import { collection, getDocs } from 'firebase/firestore';

const MessagesUI = () => {
  const { currentUser } = useAuth();
  const { markChatAsRead, lastReadTimes } = useUnreadMessages();
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showUserSelect, setShowUserSelect] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const messagesEndRef = useRef(null);
  const [allUsers, setAllUsers] = useState([]);
  const [userSelectTab, setUserSelectTab] = useState('instructors');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!currentUser) return;

    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, 'users');
        const usersSnapshot = await getDocs(usersRef);
        
        const usersData = usersSnapshot.docs
          .map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              name: data.displayName || data.name || data.email || 'Unknown',
              avatar: data.photoURL || data.avatar || '',
              username: data.username || data.email || '',
              isCreator: data.isCreator || false,
              isOnline: data.isOnline || false
            };
          })
          .filter(user => user.id !== currentUser.uid);

        setAllUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;

    const conversationsRef = ref(rtdb, `userConversations/${currentUser.uid}`);
    
    const unsubscribe = onValue(conversationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const convArray = Object.entries(data).map(([id, conv]) => ({
          id,
          ...conv
        }));
        convArray.sort((a, b) => (b.lastMessageTime || 0) - (a.lastMessageTime || 0));
        setConversations(convArray);
      } else {
        setConversations([]);
      }
    });

    return () => off(conversationsRef);
  }, [currentUser]);

  useEffect(() => {
    if (!activeChat || !currentUser) return;

    const chatId = activeChat.id;
    const messagesRef = ref(rtdb, `messages/${chatId}`);
    
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messagesArray = Object.entries(data).map(([id, msg]) => ({
          id,
          ...msg
        }));
        messagesArray.sort((a, b) => a.timestamp - b.timestamp);
        setMessages(messagesArray);
      } else {
        setMessages([]);
      }
    });

    return () => off(messagesRef);
  }, [activeChat, currentUser]);

  const hasUnreadMessages = (conversation) => {
    if (!currentUser || !conversation) return false;
    const lastRead = lastReadTimes[conversation.id];
    return !lastRead || (conversation.lastMessageTime && conversation.lastMessageTime > lastRead);
  };

  const handleChatSelect = (conversation) => {
    setActiveChat(conversation);
    if (currentUser) {
      markChatAsRead(conversation.id);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeChat || !currentUser) return;

    setIsLoading(true);
    
    try {
      const chatId = activeChat.id;
      const messagesRef = ref(rtdb, `messages/${chatId}`);
      const newMessageRef = push(messagesRef);

      const messageData = {
        text: newMessage,
        senderId: currentUser.uid,
        senderName: currentUser.displayName || currentUser.email || 'Anonymous',
        timestamp: Date.now()
      };

      await set(newMessageRef, messageData);

      const currentUserConvRef = ref(rtdb, `userConversations/${currentUser.uid}/${chatId}`);
      
      const now = Date.now();
      await set(currentUserConvRef, {
        ...activeChat,
        lastMessage: newMessage,
        lastMessageTime: now
      });

      setNewMessage('');
      
    } catch (error) {
      console.error('Error sending message:', error);
      alert(`メッセージの送信に失敗しました: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewChat = async (user) => {
    if (!currentUser) return;

    try {
      const chatId = [currentUser.uid, user.id].sort().join('_');

      const conversationData = {
        userId: user.id,
        userName: user.name || user.displayName || 'Unknown',
        userAvatar: user.avatar || user.photoURL || '',
        isCreator: user.isCreator || false,
        lastMessage: '',
        lastMessageTime: Date.now()
      };

      const currentUserConvRef = ref(rtdb, `userConversations/${currentUser.uid}/${chatId}`);
      await set(currentUserConvRef, conversationData);

      setActiveChat({
        id: chatId,
        ...conversationData
      });

      markChatAsRead(chatId);
      setShowUserSelect(false);
      
    } catch (error) {
      console.error('Error creating chat:', error);
      alert(`チャットの作成に失敗しました: ${error.message}`);
    }
  };

  const handleNewChatClick = () => {
    setShowUserSelect(true);
  };

  const filteredConversations = conversations.filter(conv => {
    if (activeFilter === 'unread' && !hasUnreadMessages(conv)) return false;
    if (searchQuery && !conv.userName?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const filteredUsers = allUsers.filter(user => {
    if (userSelectTab === 'instructors' && !user.isCreator) return false;
    if (userSelectTab === 'students' && user.isCreator) return false;
    if (searchQuery && !user.name?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return '今';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分前`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}時間前`;
    return `${Math.floor(diff / 86400000)}日前`;
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">メッセージ</h1>
            <p className="text-xs text-blue-100">学生・講師コミュニケーション</p>
          </div>
        </div>
        <button
          onClick={handleNewChatClick}
          className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/30 transition-all"
          data-testid="button-new-chat"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Conversations List */}
        <div className={`${activeChat ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-96 bg-white border-r border-gray-200`}>
          {/* Search and Filter */}
          <div className="p-4 border-b border-gray-200 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                data-testid="input-search-chat"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setActiveFilter('all')}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  activeFilter === 'all'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                data-testid="filter-all"
              >
                すべて
              </button>
              <button
                onClick={() => setActiveFilter('unread')}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  activeFilter === 'unread'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                data-testid="filter-unread"
              >
                未読
              </button>
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <MessageCircle className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium">メッセージがありません</p>
                <p className="text-sm text-gray-400 mt-2">新しいチャットを始めましょう</p>
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <motion.div
                  key={conv.id}
                  onClick={() => handleChatSelect(conv)}
                  className={`p-4 border-b border-gray-100 cursor-pointer transition-all ${
                    activeChat?.id === conv.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  whileTap={{ scale: 0.98 }}
                  data-testid={`chat-${conv.id}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                        {conv.userAvatar ? (
                          <img src={conv.userAvatar} alt="" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          conv.userName?.charAt(0).toUpperCase()
                        )}
                      </div>
                      {hasUnreadMessages(conv) && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-800 truncate">
                            {conv.userName || 'Unknown'}
                          </h3>
                          {conv.isCreator && (
                            <GraduationCap className="w-4 h-4 text-blue-600" />
                          )}
                        </div>
                        <span className="text-xs text-gray-500 flex-shrink-0">
                          {formatTime(conv.lastMessageTime)}
                        </span>
                      </div>
                      <p className={`text-sm truncate ${hasUnreadMessages(conv) ? 'text-gray-800 font-semibold' : 'text-gray-500'}`}>
                        {conv.lastMessage || 'メッセージがありません'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        {activeChat ? (
          <div className="flex-1 flex flex-col bg-white">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center gap-3">
              <button
                onClick={() => setActiveChat(null)}
                className="md:hidden w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-all"
                data-testid="button-back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                {activeChat.userAvatar ? (
                  <img src={activeChat.userAvatar} alt="" className="w-full h-full rounded-full object-cover" />
                ) : (
                  activeChat.userName?.charAt(0).toUpperCase()
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-gray-800">{activeChat.userName}</h2>
                  {activeChat.isCreator && (
                    <div className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full flex items-center gap-1">
                      <GraduationCap className="w-3 h-3" />
                      講師
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-br from-gray-50 to-blue-50/30">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <MessageCircle className="w-16 h-16 text-gray-300 mb-4" />
                  <p className="text-gray-500 font-medium">メッセージを送信して会話を始めましょう</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isOwn = msg.senderId === currentUser?.uid;
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
                        <div
                          className={`px-4 py-2 rounded-2xl ${
                            isOwn
                              ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-br-sm'
                              : 'bg-white text-gray-800 shadow-sm rounded-bl-sm'
                          }`}
                        >
                          <p className="break-words">{msg.text}</p>
                        </div>
                        <p className={`text-xs text-gray-500 mt-1 ${isOwn ? 'text-right' : 'text-left'}`}>
                          {formatTime(msg.timestamp)}
                        </p>
                      </div>
                    </motion.div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="メッセージを入力..."
                  className="flex-1 px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                  data-testid="input-message"
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || isLoading}
                  className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl flex items-center justify-center hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="button-send"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50/30">
            <MessageCircle className="w-24 h-24 text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">メッセージを選択</h2>
            <p className="text-gray-500">左側から会話を選択してください</p>
          </div>
        )}
      </div>

      {/* User Select Modal */}
      {showUserSelect && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] flex flex-col"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">新しいチャット</h2>
                <button
                  onClick={() => setShowUserSelect(false)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-all"
                  data-testid="button-close-modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="ユーザーを検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  data-testid="input-search-user"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setUserSelectTab('instructors')}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    userSelectTab === 'instructors'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  data-testid="tab-instructors"
                >
                  講師
                </button>
                <button
                  onClick={() => setUserSelectTab('students')}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    userSelectTab === 'students'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  data-testid="tab-students"
                >
                  学生
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <Users className="w-16 h-16 text-gray-300 mb-4" />
                  <p className="text-gray-500 font-medium">ユーザーが見つかりません</p>
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <motion.div
                    key={user.id}
                    onClick={() => createNewChat(user)}
                    className="p-4 border-b border-gray-100 cursor-pointer hover:bg-blue-50 transition-all"
                    whileTap={{ scale: 0.98 }}
                    data-testid={`user-${user.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                        {user.avatar ? (
                          <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          user.name?.charAt(0).toUpperCase()
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-800">{user.name}</h3>
                          {user.isCreator && (
                            <GraduationCap className="w-4 h-4 text-blue-600" />
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{user.username}</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}

      <BottomNavigationWithCreator active="messages" />
    </div>
  );
};

export default MessagesUI;
