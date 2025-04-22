import { useChat } from "@/context/ChatContext";
import { useAuth } from "@/context/AuthContext";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const ChatContainer = () => {
  const { messages, currentReceiver, sendMessage, isLoading } = useChat();
  const { user } = useAuth();

  if (!currentReceiver) {
    return (
      <Card className="flex-1 flex flex-col h-full">
        <CardContent className="flex flex-col items-center justify-center h-full p-6">
          <div className="text-center">
            <h3 className="text-2xl font-medium text-gray-700 mb-2">No Conversation Selected</h3>
            <p className="text-muted-foreground">Choose a user from the sidebar to start chatting</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="flex-1 flex flex-col h-full">
      <CardHeader className="px-4 py-3 border-b flex flex-row items-center">
        <div className="flex items-center">
          <div 
            className="h-10 w-10 rounded-full mr-3 flex items-center justify-center text-white font-medium"
            style={{ backgroundColor: currentReceiver.color || '#333' }}
          >
            {currentReceiver.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <CardTitle className="text-lg">{currentReceiver.name}</CardTitle>
            <CardDescription className="text-xs">
              {currentReceiver.email}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <MessageList messages={messages} currentUser={user!} />
        )}
        
        <MessageInput 
          onSendMessage={(content) => 
            sendMessage({ 
              content, 
              receiverId: currentReceiver.id 
            })
          } 
        />
      </CardContent>
    </Card>
  );
};

export default ChatContainer;