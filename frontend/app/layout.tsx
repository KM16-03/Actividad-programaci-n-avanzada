import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Habitos App",
  description: "Aplicacion de habitos"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}