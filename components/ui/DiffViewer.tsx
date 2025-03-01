
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { snippetsApi, DiffResponse } from '@/lib/api-client';
import { FileDiffIcon } from 'lucide-react';

// For syntax highlighting
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { draculaInit } from '@uiw/codemirror-theme-dracula';

interface DiffViewerProps {
  isOpen: boolean;
  onClose: () => void;
  sourceId: string;
  targetId: string;
  sourceVersion: number;
  targetVersion: number;
}

export default function DiffViewer({ 
  isOpen, 
  onClose, 
  sourceId, 
  targetId,
  sourceVersion,
  targetVersion
}: DiffViewerProps) {
  const [diffData, setDiffData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDiff = async () => {
      if (!isOpen || !sourceId || !targetId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await snippetsApi.getDiff(sourceId, targetId);
        setDiffData(response.diff_content);
      } catch (error) {
        console.error('Failed to fetch diff:', error);
        setError('Failed to load diff data');
        toast({
          title: 'Error',
          description: 'Failed to load diff between versions',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiff();
  }, [isOpen, sourceId, targetId, toast]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileDiffIcon className="h-5 w-5 text-blue-400" />
            Changes Between Versions
          </DialogTitle>
          <DialogDescription>
            Comparing v{sourceVersion} and v{targetVersion}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-full bg-zinc-800" />
              <Skeleton className="h-8 w-2/3 bg-zinc-800" />
              <Skeleton className="h-8 w-3/4 bg-zinc-800" />
              <Skeleton className="h-8 w-1/2 bg-zinc-800" />
              <Skeleton className="h-8 w-2/3 bg-zinc-800" />
            </div>
          ) : error ? (
            <div className="p-4 text-center text-red-400">
              <p>{error}</p>
              <Button 
                onClick={onClose}
                className="mt-4"
                variant="outline"
              >
                Close
              </Button>
            </div>
          ) : (
            <div className="border border-zinc-700 rounded-lg overflow-hidden">
              <CodeMirror
                value={diffData || ''}
                height="500px"
                theme={draculaInit()}
                extensions={[javascript()]} // Simple highlighting for diff
                editable={false}
                className="bg-zinc-900"
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}1