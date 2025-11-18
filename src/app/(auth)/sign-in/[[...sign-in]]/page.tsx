"use client";

import { SignIn, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignInPage() {
  const { isSignedIn, isLoaded, user } = useUser();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (isLoaded && isSignedIn && user && !isRedirecting) {
      setIsRedirecting(true);

      // Lê o role do publicMetadata do Clerk
      const role = user.publicMetadata?.role as string | undefined;

      // Redireciona baseado no role
      if (role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/servicos");
      }
    }
  }, [isSignedIn, isLoaded, user, router, isRedirecting]);

  // Mostra loading enquanto redireciona
  if (isSignedIn && isRedirecting) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-900">
        <div className="text-white">Redirecionando...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-900">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-zinc-800 text-white",
          },
        }}
        routing="path"
        path="/sign-in"
      />
    </div>
  );
}
