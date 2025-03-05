// "use client";

// import { useState } from "react";
// import CodeMirror from "@uiw/react-codemirror";
// import { javascript } from "@codemirror/lang-javascript";
// import { python } from "@codemirror/lang-python";
// import { java } from "@codemirror/lang-java";
// import { cpp } from "@codemirror/lang-cpp";
// import { php } from "@codemirror/lang-php";
// import { rust } from "@codemirror/lang-rust";
// import { sql } from "@codemirror/lang-sql";
// import { html } from "@codemirror/lang-html";
// import { css } from "@codemirror/lang-css";
// import { markdown } from "@codemirror/lang-markdown";
// import { json } from "@codemirror/lang-json";
// import { draculaInit } from "@uiw/codemirror-theme-dracula";
// import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Copy, Share2, Terminal } from "lucide-react";
// import { useCreateSnippet } from "@/hooks/use-create-snippet";
// import { useToast } from "@/hooks/use-toast";
// import ShareModal from "@/components/ui/ShareModal";
// import { Extension } from '@codemirror/state';

// type Language = {
//   name: string;
//   extension: string;
//   setup: () => Extension;
// };

// const languages: Record<string, Language> = {
//   javascript: { 
//     name: "JavaScript", 
//     extension: "js", 
//     setup: () => javascript() 
//   },
//   typescript: {
//     name: "TypeScript",
//     extension: "ts",
//     setup: () => javascript({ typescript: true })
//   },
//   python: { 
//     name: "Python", 
//     extension: "py", 
//     setup: () => python() 
//   },
//   java: {
//     name: "Java",
//     extension: "java",
//     setup: () => java()
//   },
//   cpp: {
//     name: "C++",
//     extension: "cpp",
//     setup: () => cpp()
//   },
//   php: {
//     name: "PHP",
//     extension: "php",
//     setup: () => php()
//   },
//   rust: {
//     name: "Rust",
//     extension: "rs",
//     setup: () => rust()
//   },
//   sql: {
//     name: "SQL",
//     extension: "sql",
//     setup: () => sql()
//   },
//   html: {
//     name: "HTML",
//     extension: "html",
//     setup: () => html()
//   },
//   css: {
//     name: "CSS",
//     extension: "css",
//     setup: () => css()
//   },
//   markdown: {
//     name: "Markdown",
//     extension: "md",
//     setup: () => markdown()
//   },
//   json: {
//     name: "JSON",
//     extension: "json",
//     setup: () => json()
//   }
// };

// export default function Home() {
//   const [code, setCode] = useState("");
//   const [language, setLanguage] = useState<keyof typeof languages>("javascript");
//   const { createSnippet, isLoading } = useCreateSnippet();
//   const { toast } = useToast();
//   const [isModalOpen, setModalOpen] = useState(false);
//   const [sharingUrl, setSharingUrl] = useState("");

//   const copyToClipboard = async (text: string) => {
//     try {
//       if (navigator?.clipboard?.writeText) {
//         await navigator.clipboard.writeText(text);
//         toast({
//           title: "Copied to clipboard",
//           description: "The link has been copied successfully.",
//         });
//       } else {
//         // Fallback for browsers without clipboard API
//         const textarea = document.createElement("textarea");
//         textarea.value = text;
//         textarea.style.position = "fixed";  // Avoid scrolling to bottom
//         document.body.appendChild(textarea);
//         textarea.focus();
//         textarea.select();
        
//         try {
//           document.execCommand("copy");
//           toast({
//             title: "Copied to clipboard",
//             description: "The link has been copied successfully.",
//           });
//         } catch (err) {
//           toast({
//             title: "Failed to copy",
//             description: "Please copy the link manually.",
//             variant: "destructive",
//           });
//         } finally {
//           document.body.removeChild(textarea);
//         }
//       }
//     } catch (error) {
//       console.error("Copy failed:", error);
//       toast({
//         title: "Failed to copy",
//         description: "Please copy the link manually.",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleCopy = () => {
//     if (!code.trim()) {
//       toast({ title: "Nothing to copy", description: "Please enter some code first.", variant: "destructive" });
//       return;
//     }
//     navigator.clipboard.writeText(code);
//     toast({ title: "Copied to clipboard" });
//   };

//   const openShareModal = () => {
//     if (!code.trim()) {
//       toast({ title: "Empty code", description: "Enter some code first.", variant: "destructive" });
//       return;
//     }
//     setModalOpen(true);
//   };
  
//   const handleShare = async (expiration: string, oneTimeView: boolean) => {
//     try {
//       console.log('Starting share process...');
//       const response = await createSnippet({ 
//         content: code, 
//         language, 
//         expiration, 
//         one_time_view: oneTimeView 
//       });
      
//       console.log('API Response:', response);
      
//       if (response?.sharing_url) {
//         console.log('Setting sharing URL:', response.sharing_url);
//         setSharingUrl(response.sharing_url);
        
//         // Don't try to access sharingUrl state immediately
//         // Instead, use the response.sharing_url directly
//         try {
//           await copyToClipboard(response.sharing_url);
//         } catch (error) {
//           console.error('Clipboard error:', error);
//           // Toast is already handled in copyToClipboard
//         }
//       } else {
//         console.error('No sharing_url in response:', response);
//         toast({ 
//           title: "Error", 
//           description: "Failed to generate sharing URL.", 
//           variant: "destructive" 
//         });
//       }
//     } catch (error) {
//       console.error("Error sharing snippet:", error);
//       toast({ 
//         title: "Error", 
//         description: "Failed to share snippet.", 
//         variant: "destructive" 
//       });
//     } finally {
//       setModalOpen(false);
//     }
//   };
  
//   // Update the sharing URL display section
//   return (
//     <main className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-zinc-100">
//       <div className="max-w-6xl mx-auto p-6 space-y-8">
//         {/* Header Section */}
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <Terminal className="h-8 w-8 text-emerald-500" />
//             <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
//               CtrlV
//             </h1>
//           </div>
//           <p className="text-zinc-400 text-sm">Code sharing at the speed of paste</p>
//         </div>

//         {/* Controls Section */}
//         <div className="flex items-center gap-4 bg-zinc-800/50 p-4 rounded-lg backdrop-blur-sm border border-zinc-700">
//           <Select value={language} onValueChange={(value: keyof typeof languages) => setLanguage(value)}>
//             <SelectTrigger className="w-40 bg-zinc-900 border-zinc-700">
//               <SelectValue placeholder="Select language" />
//             </SelectTrigger>
//             <SelectContent className="bg-zinc-900 border-zinc-700 max-h-60 overflow-y-auto">
//               {Object.entries(languages).map(([key, lang]) => (
//                 <SelectItem key={key} value={key} className="hover:bg-zinc-800">
//                   {lang.name}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
          
//           <Button 
//             variant="outline" 
//             size="icon" 
//             onClick={handleCopy}
//             className="bg-zinc-900 border-zinc-700 hover:bg-zinc-800"
//           >
//             <Copy className="h-4 w-4" />
//           </Button>
          
//           <Button 
//             onClick={openShareModal} 
//             disabled={isLoading || !code.trim()} 
//             className="bg-emerald-600 hover:bg-emerald-700 text-white border-0"
//           >
//             <Share2 className="mr-2 h-4 w-4" /> Share
//           </Button>
//         </div>

//         {/* Sharing URL Section */}
//         {sharingUrl && (
//           <div className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg backdrop-blur-sm">
//             <p className="text-sm font-medium mb-2 text-zinc-300">Shareable Link:</p>
//             <div className="flex items-center gap-2">
//               <input 
//                 type="text" 
//                 value={sharingUrl} 
//                 readOnly 
//                 className="flex-1 p-2 bg-zinc-900 border border-zinc-700 rounded text-sm font-mono text-zinc-300"
//               />
//               <Button 
//                 onClick={() => copyToClipboard(sharingUrl)}
//                 className="bg-zinc-900 hover:bg-zinc-800 border-zinc-700"
//               >
//                 <Copy className="h-4 w-4 mr-2" />
//                 Copy
//               </Button>
//             </div>
//           </div>
//         )}

//         {/* Code Editor Section */}
//         <div className="border border-zinc-700 rounded-lg overflow-hidden">
//           <CodeMirror 
//             value={code} 
//             height="600px" 
//             theme={draculaInit()} 
//             extensions={[languages[language].setup()]} 
//             onChange={setCode}
//             className="bg-zinc-900"
//           />
//         </div>

//         {/* Add placeholder text when editor is empty */}
//         {!code.trim() && (
//           <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-zinc-500 text-center pointer-events-none">
//             <p className="text-lg mb-2">Paste your code here, or start typing</p>
//             <p className="text-sm">Select a language and hit Share when you're ready</p>
//           </div>
//         )}

//         <ShareModal 
//           isOpen={isModalOpen} 
//           onClose={() => setModalOpen(false)} 
//           onShare={handleShare} 
//         />
//       </div>
//     </main>
//   );
// }










"use client";

import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { php } from "@codemirror/lang-php";
import { rust } from "@codemirror/lang-rust";
import { sql } from "@codemirror/lang-sql";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { markdown } from "@codemirror/lang-markdown";
import { json } from "@codemirror/lang-json";
import { draculaInit } from "@uiw/codemirror-theme-dracula";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Share2, Terminal } from "lucide-react";
import { useCreateSnippet } from "@/hooks/use-create-snippet";
import { useToast } from "@/hooks/use-toast";
import ShareModal from "@/components/ui/ShareModal";
import CountdownTimer from "@/components/ui/CountdownTimer";
import { Extension } from '@codemirror/state';

type Language = {
  name: string;
  extension: string;
  setup: () => Extension;
};

const languages: Record<string, Language> = {
  javascript: { 
    name: "JavaScript", 
    extension: "js", 
    setup: () => javascript() 
  },
  typescript: {
    name: "TypeScript",
    extension: "ts",
    setup: () => javascript({ typescript: true })
  },
  python: { 
    name: "Python", 
    extension: "py", 
    setup: () => python() 
  },
  java: {
    name: "Java",
    extension: "java",
    setup: () => java()
  },
  cpp: {
    name: "C++",
    extension: "cpp",
    setup: () => cpp()
  },
  php: {
    name: "PHP",
    extension: "php",
    setup: () => php()
  },
  rust: {
    name: "Rust",
    extension: "rs",
    setup: () => rust()
  },
  sql: {
    name: "SQL",
    extension: "sql",
    setup: () => sql()
  },
  html: {
    name: "HTML",
    extension: "html",
    setup: () => html()
  },
  css: {
    name: "CSS",
    extension: "css",
    setup: () => css()
  },
  markdown: {
    name: "Markdown",
    extension: "md",
    setup: () => markdown()
  },
  json: {
    name: "JSON",
    extension: "json",
    setup: () => json()
  }
};

export default function Home() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState<keyof typeof languages>("javascript");
  const { createSnippet, isLoading } = useCreateSnippet();
  const { toast } = useToast();
  const [isModalOpen, setModalOpen] = useState(false);
  const [sharingUrl, setSharingUrl] = useState("");
  
  // Check if site is in pre-launch mode
  const launchDate = new Date('2025-03-06T00:00:00');
  const currentDate = new Date();
  const isPreLaunch = currentDate < launchDate;

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
    <main className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-zinc-100">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="h-8 w-8 text-emerald-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
              CtrlV
            </h1>
          </div>
          <p className="text-zinc-400 text-sm">Code sharing at the speed of paste</p>
        </div>

        {isPreLaunch ? (
          // Pre-launch countdown display
          <>
            <div className="py-10 text-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent mb-4">
                Coming Soon
              </h2>
              <p className="text-zinc-300 max-w-2xl mx-auto mb-8">
                We're building a streamlined code sharing tool designed to remove friction from developer communication.
                Experience code sharing at the speed of paste.
              </p>
              <CountdownTimer />
            </div>
            
            {/* Teaser features section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
              <div className="bg-zinc-800/50 p-6 rounded-lg border border-zinc-700 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-emerald-400 mb-2">No Signup Required</h3>
                <p className="text-zinc-300">Share code instantly without accounts or logins. Just paste and share.</p>
              </div>
              <div className="bg-zinc-800/50 p-6 rounded-lg border border-zinc-700 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-emerald-400 mb-2">Perfect Syntax Highlighting</h3>
                <p className="text-zinc-300">Code appears exactly as it should, with proper formatting for all major languages.</p>
              </div>
              <div className="bg-zinc-800/50 p-6 rounded-lg border border-zinc-700 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-emerald-400 mb-2">Built for Developers</h3>
                <p className="text-zinc-300">Self-destructing snippets, automatic expiration, and a clean, professional interface.</p>
              </div>
            </div>
          </>
        ) : (
          // Normal application code after launch
          <>
            {/* Controls Section */}
            <div className="flex items-center gap-4 bg-zinc-800/50 p-4 rounded-lg backdrop-blur-sm border border-zinc-700">
              <Select value={language} onValueChange={(value: keyof typeof languages) => setLanguage(value)}>
                <SelectTrigger className="w-40 bg-zinc-900 border-zinc-700">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-700 max-h-60 overflow-y-auto">
                  {Object.entries(languages).map(([key, lang]) => (
                    <SelectItem key={key} value={key} className="hover:bg-zinc-800">
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleCopy}
                className="bg-zinc-900 border-zinc-700 hover:bg-zinc-800"
              >
                <Copy className="h-4 w-4" />
              </Button>
              
              <Button 
                onClick={openShareModal} 
                disabled={isLoading || !code.trim()} 
                className="bg-emerald-600 hover:bg-emerald-700 text-white border-0"
              >
                <Share2 className="mr-2 h-4 w-4" /> Share
              </Button>
            </div>

            {/* Sharing URL Section */}
            {sharingUrl && (
              <div className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg backdrop-blur-sm">
                <p className="text-sm font-medium mb-2 text-zinc-300">Shareable Link:</p>
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    value={sharingUrl} 
                    readOnly 
                    className="flex-1 p-2 bg-zinc-900 border border-zinc-700 rounded text-sm font-mono text-zinc-300"
                  />
                  <Button 
                    onClick={() => copyToClipboard(sharingUrl)}
                    className="bg-zinc-900 hover:bg-zinc-800 border-zinc-700"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
              </div>
            )}

            {/* Code Editor Section */}
            <div className="border border-zinc-700 rounded-lg overflow-hidden">
              <CodeMirror 
                value={code} 
                height="600px" 
                theme={draculaInit()} 
                extensions={[languages[language].setup()]} 
                onChange={setCode}
                className="bg-zinc-900"
              />
            </div>

            {/* Add placeholder text when editor is empty */}
            {!code.trim() && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-zinc-500 text-center pointer-events-none">
                <p className="text-lg mb-2">Paste your code here, or start typing</p>
                <p className="text-sm">Select a language and hit Share when you're ready</p>
              </div>
            )}

            <ShareModal 
              isOpen={isModalOpen} 
              onClose={() => setModalOpen(false)} 
              onShare={handleShare} 
            />
          </>
        )}
      </div>
    </main>
  );
}