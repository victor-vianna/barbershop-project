import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { ClientWrapper } from "~/components/ClientWrapper";

export const metadata = {
  title: "Igor Barber",
  description: "Sistema de Agendamento",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={GeistSans.variable}>
      <body>
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
