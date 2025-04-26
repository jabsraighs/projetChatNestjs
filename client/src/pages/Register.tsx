import RegisterForm from '@/components/auth/RegisterForm';

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Nest Chat Connect</h1>
          <p className="text-muted-foreground mt-2">
            Create a new account to start chatting
          </p>
        </div>
        
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;