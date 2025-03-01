
"use client";
import { useState } from "react";
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { php } from "@codemirror/lang-php";
import { rust } from "@codemirror/lang-rust";
import { sql } from "@codemirror/lang-sql";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { markdown } from "@codemirror/lang-markdown";
import { json } from "@codemirror/lang-json";
import { draculaInit } from '@uiw/codemirror-theme-dracula';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  PlusCircle, 
  Code, 
  Clock, 
  Eye, 
  Lock, 
  LinkIcon, 
  History, 
  FileDiff 
} from 'lucide-react';
import { Snippet, SnippetVersion } from '@/lib/api-client';
import { formatDistanceToNow } from 'date-fns';
import { Extension } from '@codemirror/state';
import { useToast } from '@/hooks/use-toast';
import { useCreateSnippet } from '@/hooks/use-create-snippet';
import { ShareOptions } from '@/components/ui/ShareModal';
import ShareModal from '@/components/ui/ShareModal';

const CopyButton = dynamic(() => import('@/components/ui/CopyButton'), { ssr: false });

// Extended language support
const languages: Record<string, { name: string; extension: string; setup: () => Extension }> = {
  javascript: { name: "JavaScript", extension: "js", setup: () => javascript() },
  typescript: { name: "TypeScript", extension: "ts", setup: () => javascript({ typescript: true }) },
  python: { name: "Python", extension: "py", setup: () => python() },
  java: { name: "Java", extension: "java", setup: () => java() },
  cpp: { name: "C++", extension: "cpp", setup: () => cpp() },
  php: { name: "PHP", extension: "php", setup: () => php() },
  rust: { name: "Rust", extension: "rs", setup: () => rust() },
  sql: { name: "SQL", extension: "sql", setup: () => sql() },
  html: { name: "HTML", extension: "html", setup: () => html() },
  css: { name: "CSS", extension: "css", setup: () => css() },
  markdown: { name: "Markdown", extension: "md", setup: () => markdown() },
  json: { name: "JSON", extension: "json", setup: () => json() },
  // Fallback to JavaScript for unsupported languages
  default: { name: "Plain Text", extension: "txt", setup: () => javascript() }
};

interface SnippetViewerProps {
  snippet: Snippet;
  token: string;
  onVersionChange?: (versionId: string) => void;
}

export default function SnippetViewer({ snippet, token, onVersionChange }: SnippetViewerProps) {
  const { toast } = useToast();
  const { createSnippet, isLoading } = useCreateSnippet();
  const [isModalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("code");
  const [sharingUrl, setSharingUrl] = useState<string>("");

  const languageSetup = snippet.language in languages 
    ? languages[snippet.language as keyof typeof languages].setup()
    : languages.default.setup();

  const languageName = snippet.language in languages
    ? languages[snippet.language as keyof typeof languages].name
    : snippet.language;

  const getExpirationText = () => {
    try {
      const expiresAt = new Date(snippet.expires_at);
      return `Expires ${formatDistanceToNow(expiresAt, { addSuffix: true })}`;
    } catch (e) {
      return "Expires soon";
    }
  };

  const hasVersions = snippet.versions && snippet.versions.length > 1;

  const selectVersion = (versionId: string) => {
    if (onVersionChange) {
      onVersionChange(versionId);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: "The link has been copied successfully.",
      });
    } catch (error) {
      console.error("Copy failed:", error);
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually.",
        variant: "destructive",
      });
    }
  };

  const handleCreateNewVersion = () => {
    setModalOpen(true);
  };

  const handleShare = async (options: ShareOptions) => {
    try {
      const response = await createSnippet(snippet.content, snippet.language, options);
      
      if (response?.sharing_url) {
        setSharingUrl(response.sharing_url);
        await copyToClipboard(response.sharing_url);
      } else {
        toast({ 
          title: "Error", 
          description: "Failed to generate sharing URL.", 
          variant: "destructive" 
        });
      }
    } catch (error) {
      console.error("Error creating new version:", error);
    } finally {
      setModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-800/50 p-4 rounded-lg backdrop-blur-sm border border-zinc-700">
        <div className="flex items-center gap-2">
          <Code className="h-5 w-5 text-emerald-400" />
          <div>
            <h2 className="text-xl font-semibold text-zinc-100">Shared Snippet</h2>
            <p className="text-sm text-zinc-400 mt-1">
              Language:{' '}
              <span className="text-emerald-400">{languageName}</span>
              {snippet.version > 1 && (
                <span className="ml-2">• Version: <span className="text-amber-400">{snippet.version}</span></span>
              )}
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {!isModalOpen && (
            <>
              <CopyButton content={snippet.content} />
              
              {snippet.id && (
                <Button 
                  onClick={handleCreateNewVersion}
                  className="bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 gap-1"
                  size="sm"
                >
                  <History className="h-4 w-4 text-amber-400" />
                  New Version
                </Button>
              )}
              
              <Link href="/">
                <Button 
                  className="bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 gap-1"
                  size="sm"
                >
                  <PlusCircle className="h-4 w-4 text-emerald-400" />
                  Create New
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
      
      {sharingUrl && (
        <div className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg backdrop-blur-sm">
          <p className="text-sm font-medium mb-2 text-zinc-300">New Version Created:</p>
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
              size="sm"
            >
              <LinkIcon className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </div>
        </div>
      )}
      
      <div className="border border-zinc-700 rounded-lg overflow-hidden">
        {hasVersions ? (
          <Tabs defaultValue="code" value={activeTab} onValueChange={setActiveTab}>
            <div className="bg-zinc-800 border-b border-zinc-700 px-3 pt-2">
              <TabsList className="bg-zinc-900">
                <TabsTrigger value="code">Code</TabsTrigger>
                <TabsTrigger value="versions">Versions ({snippet.versions?.length})</TabsTrigger>
              </TabsList>
              <div className="flex mt-2 gap-2 flex-wrap pb-2">
                <Badge variant="outline" className="bg-zinc-900 text-zinc-300 gap-1">
                  <Clock className="h-3 w-3 text-blue-400" />
                  {getExpirationText()}
                </Badge>
                
                {snippet.one_time_view && (
                  <Badge variant="outline" className="bg-zinc-900 text-zinc-300 gap-1">
                    <Eye className="h-3 w-3 text-amber-400" />
                    One-time view
                  </Badge>
                )}
                
                {snippet.is_encrypted && (
                  <Badge variant="outline" className="bg-zinc-900 text-zinc-300 gap-1">
                    <Lock className="h-3 w-3 text-emerald-400" />
                    Encrypted
                  </Badge>
                )}
              </div>
            </div>
            <TabsContent value="code" className="p-0 m-0">
              <CodeMirror
                value={snippet.content}
                height="600px"
                theme={draculaInit()} 
                extensions={[languageSetup]}
                editable={false}
                className="bg-zinc-900" 
              />
            </TabsContent>
            <TabsContent value="versions" className="bg-zinc-900 p-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-zinc-200">Version History</h3>
                <div className="space-y-2">
                  {snippet.versions?.map((version: SnippetVersion) => (
                    <div 
                      key={version.id}
                      className={`p-3 border ${version.id === snippet.id ? 'border-emerald-500 bg-zinc-800' : 'border-zinc-700 bg-zinc-900'} rounded-md flex justify-between items-center`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-zinc-800 text-emerald-400">v{version.version}</Badge>
                          <span className="text-sm text-zinc-300">
                            {new Date(version.created_at).toLocaleString()}
                          </span>
                        </div>
                        <div className="text-xs text-zinc-400 mt-1">
                          Language: {languages[version.language as keyof typeof languages]?.name || version.language}
                        </div>
                      </div>
                      
                      {version.id !== snippet.id && (
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => selectVersion(version.id)}
                            variant="outline"
                            size="sm"
                            className="text-zinc-300 border-zinc-700 bg-zinc-800"
                          >
                            View
                          </Button>
                          {/* Only show diff button when there are at least 2 versions */}
                          {snippet.versions && snippet.versions.length > 1 && (
                            <Button 
                              variant="outline"
                              size="sm"
                              className="text-zinc-300 border-zinc-700 bg-zinc-800"
                              onClick={() => {
                                // Set state to view diff between current and this version
                                // This would need additional implementation
                              }}
                            >
                              <FileDiff className="h-4 w-4 mr-1" />
                              Diff
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          // Simple view for snippets without versions
          <div>
            <div className="bg-zinc-800 border-b border-zinc-700 p-2 flex gap-2 flex-wrap">
              <Badge variant="outline" className="bg-zinc-900 text-zinc-300 gap-1">
                <Clock className="h-3 w-3 text-blue-400" />
                {getExpirationText()}
              </Badge>
              
              {snippet.one_time_view && (
                <Badge variant="outline" className="bg-zinc-900 text-zinc-300 gap-1">
                  <Eye className="h-3 w-3 text-amber-400" />
                  One-time view
                </Badge>
              )}
              
              {snippet.is_encrypted && (
                <Badge variant="outline" className="bg-zinc-900 text-zinc-300 gap-1">
                  <Lock className="h-3 w-3 text-emerald-400" />
                  Encrypted
                </Badge>
              )}
            </div>
            <CodeMirror
              value={snippet.content}
              height="600px"
              theme={draculaInit()} 
              extensions={[languageSetup]}
              editable={false}
              className="bg-zinc-900" 
            />
          </div>
        )}
      </div>
      
      <ShareModal 
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)} 
        onShare={handleShare}
        hasParentId={snippet.id} 
      />
    </div>
  );
}