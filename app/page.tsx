"use client";

import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { draculaInit } from "@uiw/codemirror-theme-dracula";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Share2 } from "lucide-react";
import { useCreateSnippet } from "@/hooks/use-create-snippet";
import { useToast } from "@/hooks/use-toast";
import ShareModal from "@/components/ui/ShareModal"; 

const languages = {
  javascript: { name: "JavaScript", extension: "js", setup: javascript },
  python: { name: "Python", extension: "py", setup: python },
};

export default function Home() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const { createSnippet, isLoading } = useCreateSnippet();
  const { toast } = useToast();
  const [isModalOpen, setModalOpen] = useState(false);
  const [sharingUrl, setSharingUrl] = useState("");

  const copyToClipboard = async (text: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        toast({
          title: "Copied to clipboard",
          description: "The link has been copied successfully.",
        });
      } else {
        // Fallback for browsers without clipboard API
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";  // Avoid scrolling to bottom
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        
        try {
          document.execCommand("copy");
          toast({
            title: "Copied to clipboard",
            description: "The link has been copied successfully.",
          });
        } catch (err) {
          toast({
            title: "Failed to copy",
            description: "Please copy the link manually.",
            variant: "destructive",
          });
        } finally {
          document.body.removeChild(textarea);
        }
      }
    } catch (error) {
      console.error("Copy failed:", error);
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually.",
        variant: "destructive",
      });
    }
  };

  const handleCopy = () => {
    if (!code.trim()) {
      toast({ title: "Nothing to copy", description: "Please enter some code first.", variant: "destructive" });
      return;
    }
    navigator.clipboard.writeText(code);
    toast({ title: "Copied to clipboard" });
  };

  const openShareModal = () => {
    if (!code.trim()) {
      toast({ title: "Empty code", description: "Enter some code first.", variant: "destructive" });
      return;
    }
    setModalOpen(true);
  };
  
  const handleShare = async (expiration: string, oneTimeView: boolean) => {
    try {
      console.log('Starting share process...');
      const response = await createSnippet({ 
        content: code, 
        language, 
        expiration, 
        one_time_view: oneTimeView 
      });
      
      console.log('API Response:', response);
      
      if (response?.sharing_url) {
        console.log('Setting sharing URL:', response.sharing_url);
        setSharingUrl(response.sharing_url);
        
        // Don't try to access sharingUrl state immediately
        // Instead, use the response.sharing_url directly
        try {
          await copyToClipboard(response.sharing_url);
        } catch (error) {
          console.error('Clipboard error:', error);
          // Toast is already handled in copyToClipboard
        }
      } else {
        console.error('No sharing_url in response:', response);
        toast({ 
          title: "Error", 
          description: "Failed to generate sharing URL.", 
          variant: "destructive" 
        });
      }
    } catch (error) {
      console.error("Error sharing snippet:", error);
      toast({ 
        title: "Error", 
        description: "Failed to share snippet.", 
        variant: "destructive" 
      });
    } finally {
      setModalOpen(false);
    }
  };
  
  // Update the sharing URL display section
  return (
    <main className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold">CtrlV</h1>
  
        <div className="flex items-center gap-4">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={handleCopy}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button 
            onClick={openShareModal} 
            disabled={isLoading || !code.trim()} 
            className="w-auto"
          >
            <Share2 className="mr-2 h-4 w-4" /> Share
          </Button>
        </div>
  
        {sharingUrl && (
          <div className="mt-4 p-4 bg-secondary/50 border rounded-lg shadow-sm">
            <p className="text-sm font-medium mb-2">Shareable Link:</p>
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                value={sharingUrl} 
                readOnly 
                className="flex-1 p-2 bg-background border rounded text-sm font-mono"
              />
              <Button 
                onClick={() => copyToClipboard(sharingUrl)}
                variant="secondary"
                className="flex-shrink-0"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
          </div>
        )}
  
        <CodeMirror 
          value={code} 
          height="600px" 
          theme={draculaInit()} 
          extensions={[languages[language].setup()]} 
          onChange={setCode} 
        />
  
        <ShareModal 
          isOpen={isModalOpen} 
          onClose={() => setModalOpen(false)} 
          onShare={handleShare} 
        />
      </div>
    </main>
  )};