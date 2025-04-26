import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/chat");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-primary/20 to-background">
      <div className="text-center max-w-2xl mx-auto">
        <div className="mb-6 flex justify-center">
          <div className="h-20 w-20 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground">
            <MessageCircle size={50} />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-4">Welcome to Nest Chat Connect</h1>
        <p className="text-xl text-muted-foreground mb-8">
          A real-time chat application built with NestJS and React
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="px-8"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
          <Button 
            size="lg"
            variant="outline" 
            className="px-8"
            onClick={() => navigate("/register")}
          >
            Sign Up
          </Button>
        </div>
      </div>
      
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-semibold mb-6">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="p-6 bg-card rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-2">Real-time Messaging</h3>
            <p className="text-muted-foreground">
              Exchange messages instantly with other users using WebSockets
            </p>
          </div>
          <div className="p-6 bg-card rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-2">User Presence</h3>
            <p className="text-muted-foreground">
              See who's online and ready to chat in real-time
            </p>
          </div>
          <div className="p-6 bg-card rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-2">Custom Profiles</h3>
            <p className="text-muted-foreground">
              Personalize your profile with custom colors
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;