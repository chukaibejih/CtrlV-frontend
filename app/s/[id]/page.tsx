import { notFound } from 'next/navigation';
import { snippetsApi } from '@/lib/api-client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
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
      <div className="min-h-screen p-4">
        <div className="max-w-6xl mx-auto space-y-6">
          <SnippetViewer snippet={snippet} />
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-destructive">
            Snippet not found or has expired
          </h1>
          <p className="text-muted-foreground">
            This snippet might have expired or been deleted.
          </p>
          <Link href="/">
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Create New Snippet
            </Button>
          </Link>
        </div>
      </div>
    );
  }
}