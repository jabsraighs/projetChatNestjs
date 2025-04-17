import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Rediriger vers la page de chat
    navigate('/chat');
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Chargement en cours...</h1>
        <p className="text-xl text-gray-600">Vous allez être redirigé vers le chat</p>
      </div>
    </div>
  );
};

export default Index;