'use client';

import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from '@clerk/nextjs';
import { Toaster } from '~/components/ui/toaster';
import { TRPCReactProvider } from '~/trpc/react';

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <header className="flex justify-end bg-gradient-to-br from-zinc-900 to-zinc-800 p-4 text-white">
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
      <TRPCReactProvider>{children}</TRPCReactProvider>
      <Toaster />
    </ClerkProvider>
  );
}
