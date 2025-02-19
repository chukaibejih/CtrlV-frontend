"use client";

import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { draculaInit } from '@uiw/codemirror-theme-dracula';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle, Terminal, Code } from 'lucide-react';

const CopyButton = dynamic(() => import('@/components/ui/CopyButton'), { ssr: false });

const languages = {
  javascript: { name: "JavaScript", extension: "js", setup: javascript },
  python: { name: "Python", extension: "py", setup: python },
};

interface Snippet {
  language: string;
  content: string;
}

interface SnippetViewerProps {
  snippet: Snippet;
}

export default function SnippetViewer({ snippet }: SnippetViewerProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-800/50 p-4 rounded-lg backdrop-blur-sm border border-zinc-700">
        <div className="flex items-center gap-2">
          <Code className="h-5 w-5 text-emerald-400" />
          <div>
            <h2 className="text-xl font-semibold text-zinc-100">Shared Snippet</h2>
            <p className="text-sm text-zinc-400 mt-1">
              Language:{' '}
              <span className="text-emerald-400">
                {languages[snippet.language as keyof typeof languages]?.name ||
                  snippet.language}
              </span>
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <CopyButton content={snippet.content} />
          <Link href="/">
            <Button 
              className="bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 gap-2"
            >
              <PlusCircle className="h-4 w-4 text-emerald-400" />
              Create New
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="border border-zinc-700 rounded-lg overflow-hidden">
        <CodeMirror
          value={snippet.content}
          height="600px"
          theme={draculaInit({
            settings: {
              fontFamily: 'monospace',
              background: '#1e1e2e', // Slightly darker background to match theme
            },
          })}
          extensions={[
            languages[snippet.language as keyof typeof languages]?.setup() ||
              javascript(),
          ]}
          editable={false}
          className="text-base"
        />
      </div>
    </div>
  );
}