import LoginForm from '@/components/auth/LoginForm';

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Nest Chat Connect</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Login to continue chatting
          </p>
        </div>
        
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
