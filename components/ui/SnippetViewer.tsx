"use client";

import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { draculaInit } from '@uiw/codemirror-theme-dracula';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

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
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Shared Snippet</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Language:{' '}
              {languages[snippet.language as keyof typeof languages]?.name ||
                snippet.language}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <CopyButton content={snippet.content} />
            <Link href="/">
              <Button variant="default" className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Create New Snippet
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="border rounded-lg overflow-hidden">
          <CodeMirror
            value={snippet.content}
            height="600px"
            theme={draculaInit({
              settings: {
                fontFamily: 'monospace',
                background: '#282a36',
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
        
        <p className="text-sm text-muted-foreground text-center">
        CtrlV – Code sharing at the speed of paste.
        </p>
      </div>
    </main>
  );
}