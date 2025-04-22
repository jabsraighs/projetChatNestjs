import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/chat" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6" />
            <span className="text-xl font-bold">NestChat</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link to="/register">
              <Button>Sign up</Button>
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <MessageSquare className="h-16 w-16 mb-6" />
        <h1 className="text-4xl font-bold mb-4">Welcome to NestChat</h1>
        <p className="text-xl text-muted-foreground max-w-md mb-8">
          Connect with other users in real-time, personalize your profile, and enjoy seamless conversations.
        </p>
        <div className="flex gap-4">
          <Link to="/register">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="lg">Sign In</Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Index;
