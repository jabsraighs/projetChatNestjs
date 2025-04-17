import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { login, register } from '@/lib/auth';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

type AuthMode = 'login' | 'register';

export const AuthForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<AuthMode>('login');
  const { setUserInfo } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let response;
      
      if (mode === 'login') {
        response = await login(username, password);
        toast({
          title: 'Connexion réussie',
          description: `Bienvenue, ${username}!`,
        });
      } else {
        response = await register(username, password);
        toast({
          title: 'Inscription réussie',
          description: `Bienvenue, ${username}!`,
        });
      }

      setUserInfo(response.user);
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: mode === 'login' 
          ? 'Erreur lors de la connexion. Vérifiez vos identifiants.' 
          : 'Erreur lors de l\'inscription. Essayez un autre nom d\'utilisateur.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          {mode === 'login' ? 'Connexion' : 'Inscription'}
        </CardTitle>
        <CardDescription className="text-center">
          {mode === 'login' 
            ? 'Connectez-vous pour accéder au chat' 
            : 'Créez un compte pour rejoindre le chat'}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Nom d'utilisateur
            </label>
            <Input
              id="username"
              placeholder="Entrez votre nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
            {isLoading ? 'Chargement...' : mode === 'login' ? 'Se connecter' : 'S\'inscrire'}
          </Button>
          <p className="text-sm text-center">
            {mode === 'login' ? 'Pas encore de compte ?' : 'Déjà un compte ?'}
            <Button 
              variant="link" 
              type="button" 
              onClick={toggleMode} 
              className="p-0 ml-1 h-auto font-normal"
            >
              {mode === 'login' ? 'S\'inscrire' : 'Se connecter'}
            </Button>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
};
