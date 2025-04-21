import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { login, register } from '@/lib/auth';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

export const AuthForm = () => {
  const [email, setEmail] = useState('');
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
      
     
        response = await login(email, password);
        toast({
          title: 'Connexion réussie',
          description: `Bienvenue, ${email}!`,
        });
      setUserInfo(response.user);
      navigate("/chat")
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 
           'Erreur lors de la connexion. Vérifiez vos identifiants.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
        {'Connexion' }
        </CardTitle>
        <CardDescription className="text-center">
          {   'Connectez-vous pour accéder au chat'  }
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
              placeholder="Entrez votre email d'utilisateur"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            {isLoading ? 'Chargement...' : 'Se connecter'}
          </Button>
          <p className="text-sm text-center">
            {'Pas encore de compte ?'}
            <Button 
              variant="link" 
              type="button" 
              onClick={()=>navigate("/register")} 
              className="p-0 ml-1 h-auto font-normal"
            >
              { 'S\'inscrire' }
            </Button>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
};