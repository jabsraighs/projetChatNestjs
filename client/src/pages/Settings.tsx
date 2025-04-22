import Header from "@/components/layout/Header";
import ColorPicker from "@/components/profile/ColorPicker";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

const Settings = () => {
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
      <main className="flex-1 container max-w-screen-xl mx-auto p-6">
        <div className="flex justify-center items-center h-full">
          <ColorPicker />
        </div>
      </main>
    </div>
  );
};

export default Settings;
