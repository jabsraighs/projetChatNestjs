import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Settings } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import UserAvatar from '../components/chat/UserAvatar';

const COLORS = [
  '#3498db', // Default blue
  '#2ecc71', // Green
  '#e74c3c', // Red
  '#f39c12', // Orange
  '#9b59b6', // Purple
  '#1abc9c', // Teal
  '#34495e', // Dark blue
  '#7f8c8d', // Gray
];

const ProfileSettings = () => {
  const { user, updateProfileColor } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedColor, setSelectedColor] = useState(user?.profileColor || '#3498db');
  const [customColor, setCustomColor] = useState('');
  
  if (!user) return null;
  
  const handleSelectColor = (color: string) => {
    setSelectedColor(color);
    setCustomColor('');
  };
  
  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomColor(e.target.value);
    setSelectedColor(e.target.value);
  };
  
  const handleSaveChanges = async () => {
    if (!selectedColor) return;
    
    setIsSubmitting(true);
    try {
      await updateProfileColor(selectedColor);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Profile Settings</SheetTitle>
          <SheetDescription>
            Customize your profile appearance
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-6">
          <div className="flex justify-center mb-6">
            <UserAvatar 
              name={user.name} 
              color={selectedColor}
              size="lg"
              showStatus={false}
            />
          </div>
          
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input 
                value={user.name} 
                disabled 
                className="bg-muted"
              />
            </div>
            
            <div>
              <Label>Email</Label>
              <Input 
                value={user.email} 
                disabled 
                className="bg-muted"
              />
            </div>
            
            <div>
              <Label>Profile Color</Label>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {COLORS.map(color => (
                  <button
                    key={color}
                    className={`w-full h-10 rounded-md transition-all ${
                      selectedColor === color ? 'ring-2 ring-primary ring-offset-2' : ''
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleSelectColor(color)}
                    type="button"
                  />
                ))}
              </div>
            </div>
            
            <div>
              <Label htmlFor="customColor">Custom Color</Label>
              <div className="flex gap-2">
                <Input
                  id="customColor"
                  type="color"
                  value={customColor}
                  onChange={handleCustomColorChange}
                  className="w-16 h-10 p-1"
                />
                <Input
                  type="text"
                  value={customColor || selectedColor}
                  onChange={handleCustomColorChange}
                  placeholder="#HEX"
                  className="flex-1"
                />
              </div>
            </div>
          </div>
          
          <Button 
            className="w-full mt-6" 
            onClick={handleSaveChanges}
            disabled={isSubmitting || selectedColor === user.profileColor}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ProfileSettings;