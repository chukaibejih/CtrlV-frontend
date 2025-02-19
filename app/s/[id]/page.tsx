import { notFound } from 'next/navigation';
import { snippetsApi } from '@/lib/api-client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle, Terminal, AlertTriangle } from 'lucide-react';
import SnippetViewer from '@/components/ui/SnippetViewer';

export default async function SnippetPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { token?: string };
}) {
  const { id } = params;
  const token = searchParams.token;
  if (!token) return notFound();

  try {
    const snippet = await snippetsApi.getById(id, token);
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

          {/* Snippet Viewer Container */}
          <div className="border border-zinc-700 rounded-lg overflow-hidden bg-zinc-900/50 backdrop-blur-sm">
            <SnippetViewer snippet={snippet} />
          </div>

          {/* Action Button */}
          <div className="flex justify-center">
            <Link href="/">
              <Button className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 gap-2">
                <PlusCircle className="h-4 w-4 text-emerald-400" />
                Create New Snippet
              </Button>
            </Link>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-zinc-100 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md p-8 bg-zinc-800/30 backdrop-blur-sm border border-zinc-700 rounded-lg">
          <div className="flex justify-center">
            <AlertTriangle className="h-16 w-16 text-amber-500" />
          </div>
          <h1 className="text-2xl font-bold text-red-400">
            Snippet not found or has expired
          </h1>
          <p className="text-zinc-400">
            This snippet might have expired or been deleted.
          </p>
          <Link href="/">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white border-0 gap-2">
              <PlusCircle className="h-4 w-4" />
              Create New Snippet
            </Button>
          </Link>
        </div>
      </main>
    );
  }}