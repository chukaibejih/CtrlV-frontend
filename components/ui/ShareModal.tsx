import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (expiration: string, oneTimeView: boolean) => Promise<void>;
}

export default function ShareModal({ isOpen, onClose, onShare }: ShareModalProps) {
  const [expiration, setExpiration] = useState("24h");
  const [oneTimeView, setOneTimeView] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
    try {
      await onShare(expiration, oneTimeView);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Snippet</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Expiration</label>
            <Select value={expiration} onValueChange={setExpiration}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select expiration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">1 Hour</SelectItem>
                <SelectItem value="24h">24 Hours</SelectItem>
                <SelectItem value="7d">7 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">One-Time View</span>
            <Switch checked={oneTimeView} onCheckedChange={setOneTimeView} />
          </div>
          <Button 
            onClick={handleShare} 
            className="w-full"
            disabled={isSharing}
          >
            {isSharing ? "Sharing..." : "Share Snippet"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}