import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyIcon, ShieldIcon } from "lucide-react";

interface PasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (password: string) => Promise<void>;
  type: 'access' | 'decrypt';
  isLoading: boolean;
  error?: string | null;
}

export default function PasswordDialog({ isOpen, onClose, onSubmit, type, isLoading, error }: PasswordDialogProps) {
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    await onSubmit(password);
  };

  const title = type === 'access' 
    ? "Password Protected Snippet" 
    : "Encrypted Content";
    
  const description = type === 'access'
    ? "This snippet is password protected. Please enter the password to view it."
    : "This snippet's content is encrypted. Please enter the decryption password.";

  const icon = type === 'access' ? <ShieldIcon className="h-5 w-5 text-amber-500" /> : <KeyIcon className="h-5 w-5 text-emerald-500" />;
  const buttonText = type === 'access' ? "Access Snippet" : "Decrypt Content";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {icon}
            {title}
          </DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Enter password"
              required
              autoFocus
            />
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading || !password.trim()}
          >
            {isLoading ? "Verifying..." : buttonText}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}


