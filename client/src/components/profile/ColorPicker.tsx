import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { HexColorPicker } from "react-colorful";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const ColorPicker = () => {
  const { user, updateUserColor, isLoading } = useAuth();
  const [color, setColor] = useState(user?.color || "#000000");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserColor(color);
  };
  
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>Update your profile color</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-center">
              <div className="mb-4">
                <HexColorPicker color={color} onChange={setColor} />
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-4">
              <div
                className={cn(
                  "h-16 w-16 rounded-full border-2 transition-all",
                  isLoading ? "opacity-50" : ""
                )}
                style={{ backgroundColor: color }}
              />
              <div>
                <p className="text-sm font-medium">Current Color</p>
                <p className="text-xs text-muted-foreground">{color}</p>
              </div>
            </div>
          </div>
          
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || color === user?.color}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ColorPicker;
