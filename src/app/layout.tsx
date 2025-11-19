// src/app/layout.tsx
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "~/components/ui/toaster";
import type { Metadata } from "next";
import "~/styles/globals.css";

export const metadata: Metadata = {
  title: "Barbershop",
  description: "Sistema de agendamentos da barbearia",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="pt-BR">
        <body>
          {/* Header direto no layout */}
          <header className="flex h-16 items-center justify-end gap-4 bg-gradient-to-br from-zinc-900 to-zinc-800 p-4 text-white">
            <SignedOut>
              <SignInButton />
              <SignUpButton>
                <button className="h-10 rounded-full bg-[#6c47ff] px-4 text-sm font-medium text-white sm:h-12 sm:px-5 sm:text-base">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>

          {/* Conteúdo envolvido pelo TRPCReactProvider */}
          <TRPCReactProvider>{children}</TRPCReactProvider>

          {/* Toast global */}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
