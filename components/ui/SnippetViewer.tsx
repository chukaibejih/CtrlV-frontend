"use client";
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
import { PlusCircle, Code } from 'lucide-react';
import { Extension } from '@codemirror/state';

const CopyButton = dynamic(() => import('@/components/ui/CopyButton'), { ssr: false });

// Make sure this matches the languages object in app/page.tsx
const languages: Record<string, { name: string; extension: string; setup: () => Extension }> = {
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
          theme={draculaInit()} // Use the default theme without overrides
          extensions={[
            languages[snippet.language as keyof typeof languages]?.setup() ||
              javascript()
          ]}
          editable={false}
          className="bg-zinc-900" // Match the className used in the editor
        />
      </div>
    </div>
  );
}