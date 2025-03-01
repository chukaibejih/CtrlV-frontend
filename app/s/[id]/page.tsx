
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle, Terminal, AlertTriangle } from "lucide-react";
import SnippetViewer from "@/components/ui/SnippetViewer";
import PasswordDialog from "@/components/ui/PasswordDialog";
import { useSnippet } from "@/hooks/use-snippet";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function SnippetPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { token?: string };
}) {
  const { id } = params;
  const token = searchParams.token || "";
  const router = useRouter();
  const { toast } = useToast();
  
  const { 
    snippet, 
    isLoading, 
    error,
    requiresPassword,
    needsDecryption,
    verifyPassword
  } = useSnippet(id);
  
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordType, setPasswordType] = useState<'access' | 'decrypt'>('access');

  useEffect(() => {
    if (requiresPassword) {
      setShowPasswordDialog(true);
      setPasswordType('access');
    } else if (needsDecryption) {
      setShowPasswordDialog(true);
      setPasswordType('decrypt');
    } else {
      setShowPasswordDialog(false);
    }
  }, [requiresPassword, needsDecryption]);

  const handlePasswordSubmit = async (password: string) => {
    const action = passwordType === 'access' ? 'check_password' : 'decrypt';
    
    try {
      const success = await verifyPassword(password, action);
      
      if (success) {
        setShowPasswordDialog(false);
        setPasswordError(null);
        toast({
          title: "Success",
          description: passwordType === 'access' 
            ? "Access granted" 
            : "Content decrypted successfully",
        });
      } else {
        setPasswordError("Invalid password");
      }
    } catch (err) {
      setPasswordError("Failed to verify password");
    }
  };

  const handleVersionChange = (versionId: string) => {
    if (token) {
      router.push(`/s/${versionId}?token=${token}`);
    }
  };

  // Show loading state
  if (isLoading) {
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

          {/* Loading Skeleton */}
          <div className="border border-zinc-700 rounded-lg overflow-hidden bg-zinc-900/50 backdrop-blur-sm p-4">
            <div className="space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-8 w-48 bg-zinc-800" />
                <Skeleton className="h-8 w-24 bg-zinc-800" />
              </div>
              <Skeleton className="h-[600px] w-full bg-zinc-800" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Show error state
  if (error || !snippet) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-zinc-100 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md p-8 bg-zinc-800/30 backdrop-blur-sm border border-zinc-700 rounded-lg">
          <div className="flex justify-center">
            <AlertTriangle className="h-16 w-16 text-amber-500" />
          </div>
          <h1 className="text-2xl font-bold text-red-400">
            {error || "Snippet not found or has expired"}
          </h1>
          <p className="text-zinc-400">
            This snippet might have expired, been deleted, or requires a password.
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
  }

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
          <SnippetViewer 
            snippet={snippet} 
            token={token}
            onVersionChange={handleVersionChange}
          />
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

      {/* Password Dialog */}
      <PasswordDialog 
        isOpen={showPasswordDialog}
        onClose={() => {
          // Since closing without entering password would lead to an unusable state,
          // redirect to home if the user cancels
          router.push("/");
        }}
        onSubmit={handlePasswordSubmit}
        type={passwordType}
        isLoading={isLoading}
        error={passwordError}
      />
    </main>
  );
}