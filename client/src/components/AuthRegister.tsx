import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { login, register } from '@/lib/auth';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

export const AuthRegister = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { setUserInfo } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let response;
    
        response = await register(email, name, password);
        toast({
          title: 'Inscription réussie',
          description: `Bienvenue, ${email}!`,
        });
        navigate("/chat")
      setUserInfo(response.user);
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description:'Erreur lors de S\'inscrire. Vérifiez l\'email le mot de passe et le nom.'
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          { 'Connexion'  }
        </CardTitle>
        <CardDescription className="text-center">
          { 'Connectez-vous pour accéder au chat' }
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              email d'utilisateur
            </label>
            <Input
              id="email"
              placeholder="Entrez votre nom d'utilisateur"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Nom d'utilisateur
            </label>
            <Input
              id="name"
              placeholder="Entrez votre nom d'utilisateur"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Mot de passe
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Entrez votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? 'Chargement...' :  'S\'inscrire'}
          </Button>
          <p className="text-sm text-center ">
            { 'Déjà un compte ?' }
            <Button 
              variant="link" 
              type="button"
              onClick={()=>navigate("/login")}
              className= 'className="text-sm text-center hover:text-blue-900'
            >
              {'Se connecter' }
            </Button>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
};