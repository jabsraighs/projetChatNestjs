import { useAuth } from "@/context/AuthContext";
import { ChatProvider, useChat } from "@/context/ChatContext";
import { Navigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import UsersList from "@/components/chat/UsersList";
import ChatContainer from "@/components/chat/ChatContainer";
import { Separator } from "@/components/ui/separator";

const ChatContent = () => {
  const { users, currentReceiver, setCurrentReceiver } = useChat();

  return (
    <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-64px)] gap-4 p-4">
      <div className="w-full md:w-64 flex flex-col border rounded-lg overflow-hidden bg-card">
        <div className="p-3 font-medium text-sm">
          Users
        </div>
        <Separator />
        <UsersList 
          users={users}
          currentReceiver={currentReceiver}
          onSelectUser={setCurrentReceiver}
        />
      </div>
      
      <div className="flex-1 flex flex-col h-full">
        <ChatContainer />
      </div>
    </div>
  );
};

const Chat = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <ChatProvider>
        <ChatContent />
      </ChatProvider>
    </div>
  );
};

export default Chat;
