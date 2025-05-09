import React, { useEffect, useRef } from 'react'
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';
import ChatSkeleton from './skeletons/ChatSkeleton';
import { formatMessageTime } from '../lib/utils';

const ChatContainer = () => {
  const { chats, getChats, isChatsLoading, selectedUser, unsubscribeFromChats, subscribeToChats } = useChatStore();
  const { authUser } = useAuthStore();
  const chatEndRef = useRef(null);

  useEffect(() => {
    getChats(selectedUser._id);

    subscribeToChats();

    return () => unsubscribeFromChats();

  }, [selectedUser._id, getChats, subscribeToChats, unsubscribeFromChats]);

  useEffect(() => {
    if (chatEndRef.current && chats) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chats]);

  if (isChatsLoading) {
    return (
      <div className='flex-1 flex flex-col overflow-auto'>
        <ChatHeader />
        <ChatSkeleton />
        <ChatInput />
      </div>
    )
  }
  return (
    <div className='flex-1 flex flex-col overflow-auto'>
      <ChatHeader />

      <div className='flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-base-300'>
        {chats.map((chat) => (
          <div
            key={chat._id}
            className={`chat ${chat.senderId === authUser._id ? 'chat-end' : 'chat-start'}`}
            ref={chatEndRef}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    chat.senderId === authUser._id
                      ? authUser.avatar || "/avatar.png"
                      : selectedUser.avatar || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>

            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(chat.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {chat.image && (
                <img
                  src={chat.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {chat.text && <p>{chat.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <ChatInput />
    </div>
  )
}

export default ChatContainer