import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LockIcon, ClockIcon, EyeIcon, LayersIcon, KeyIcon } from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (options: ShareOptions) => Promise<void>;
  hasParentId?: string;
}

export interface ShareOptions {
  expirationMinutes: number;
  oneTimeView: boolean;
  isEncrypted: boolean;
  password: string;
  isNewVersion: boolean;
  parentId?: string;
}

const EXPIRATION_OPTIONS = [
  { value: 5, label: '5 minutes' },
  { value: 60, label: '1 hour' },
  { value: 360, label: '6 hours' },
  { value: 1440, label: '24 hours' },
  { value: 10080, label: '7 days' },
  { value: 43200, label: '30 days' },
];

export default function ShareModal({ isOpen, onClose, onShare, hasParentId }: ShareModalProps) {
  const [expirationMinutes, setExpirationMinutes] = useState(1440); // 24 hours default
  const [oneTimeView, setOneTimeView] = useState(false);
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [password, setPassword] = useState("");
  const [isNewVersion, setIsNewVersion] = useState(!!hasParentId);
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
    try {
      await onShare({
        expirationMinutes,
        oneTimeView,
        isEncrypted,
        password,
        isNewVersion,
        parentId: isNewVersion ? hasParentId : undefined
      });
    } finally {
      setIsSharing(false);
    }
  };

  const handleExpirationChange = (value: string) => {
    setExpirationMinutes(parseInt(value, 10));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Snippet</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ClockIcon className="h-4 w-4 text-zinc-400" />
              <Label htmlFor="expiration">Expiration</Label>
            </div>
            <Select value={expirationMinutes.toString()} onValueChange={handleExpirationChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select expiration" />
              </SelectTrigger>
              <SelectContent>
                {EXPIRATION_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value.toString()}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <EyeIcon className="h-4 w-4 text-zinc-400" />
                <span className="text-sm">One-Time View</span>
              </div>
              <Switch checked={oneTimeView} onCheckedChange={setOneTimeView} />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LockIcon className="h-4 w-4 text-zinc-400" />
                <span className="text-sm">Encrypt Content</span>
              </div>
              <Switch checked={isEncrypted} onCheckedChange={setIsEncrypted} />
            </div>
            
            {hasParentId && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LayersIcon className="h-4 w-4 text-zinc-400" />
                  <span className="text-sm">Create as New Version</span>
                </div>
                <Switch checked={isNewVersion} onCheckedChange={setIsNewVersion} />
              </div>
            )}
          </div>
          
          {(isEncrypted || oneTimeView) && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <KeyIcon className="h-4 w-4 text-zinc-400" />
                <Label htmlFor="password">Password {!isEncrypted && "(Optional)"}</Label>
              </div>
              <Input 
                id="password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder={isEncrypted ? "Required for encryption" : "Optional for additional security"}
                required={isEncrypted}
              />
              {isEncrypted && !password && (
                <p className="text-xs text-red-500">Password is required for encryption</p>
              )}
            </div>
          )}
          
          <Button 
            onClick={handleShare} 
            className="w-full mt-4"
            disabled={isSharing || (isEncrypted && !password)}
          >
            {isSharing ? "Sharing..." : "Share Snippet"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}


