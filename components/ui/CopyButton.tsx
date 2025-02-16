'use client';

import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';

interface CopyButtonProps {
  content: string;
}

export default function CopyButton({ content }: CopyButtonProps) {
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied to clipboard",
        description: "The code has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button variant="outline" size="icon" onClick={handleCopy}>
      <Copy className="h-4 w-4" />
    </Button>
  );
}
