
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { useAuth } from '@/context/AuthContext';
import { updateUserColor } from '@/lib/auth';
import { useToast } from '@/components/ui/use-toast';

const PRESET_COLORS = [
  '#6366f1', // Indigo
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#ef4444', // Red
  '#f97316', // Orange
  '#eab308', // Yellow
  '#22c55e', // Green
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
];

interface UserSettingsProps {
  onClose: () => void;
}

export const UserSettings: React.FC<UserSettingsProps> = ({ onClose }) => {
  const { user, setUserInfo } = useAuth();
  const [selectedColor, setSelectedColor] = useState(user?.color || '#6366f1');
  const [customColor, setCustomColor] = useState(user?.color || '#6366f1');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleColorChange = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Utiliser soit la couleur personnalisée, soit la couleur pré-sélectionnée
      const finalColor = customColor;
      const updatedUser = await updateUserColor(finalColor);
      
      setUserInfo(updatedUser);
      toast({
        title: 'Couleur mise à jour',
        description: 'Votre couleur de profil a été mise à jour avec succès.',
      });
      
      onClose();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la couleur:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de mettre à jour la couleur du profil.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectPresetColor = (color: string) => {
    setSelectedColor(color);
    setCustomColor(color);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Paramètres du profil</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <h3 className="text-sm font-medium mb-3">Choisissez votre couleur</h3>
          
          {/* Couleurs prédéfinies */}
          <div className="grid grid-cols-5 gap-2 mb-4">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                className={`w-8 h-8 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  selectedColor === color ? 'ring-2 ring-offset-2 ring-black dark:ring-white' : ''
                }`}
                style={{ backgroundColor: color }}
                onClick={() => selectPresetColor(color)}
                type="button"
              />
            ))}
          </div>
          
          {/* Sélecteur de couleur personnalisé */}
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              className="w-10 h-10 rounded-md overflow-hidden"
            />
            <div className="text-sm flex-1">
              <label htmlFor="custom-color" className="block font-medium mb-1">
                Couleur personnalisée
              </label>
              <div className="flex gap-2">
                <input
                  id="custom-color"
                  type="text"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                />
                <div 
                  className="w-9 h-9 rounded-md border border-input" 
                  style={{ backgroundColor: customColor }}
                />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <span className="text-sm text-muted-foreground">
              Cette couleur sera visible par tous les utilisateurs du chat.
            </span>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button 
            onClick={handleColorChange} 
            disabled={isLoading}
          >
            {isLoading ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};