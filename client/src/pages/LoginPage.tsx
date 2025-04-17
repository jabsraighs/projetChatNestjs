
import React from 'react';
import { AuthForm } from '@/components/AuthForm';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-violet-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-700">Chat Websocket</h1>
          <p className="text-slate-600 mt-2">Connectez-vous pour rejoindre la conversation</p>
        </div>
        
        <AuthForm />
      </div>
    </div>
  );
};

export default LoginPage;