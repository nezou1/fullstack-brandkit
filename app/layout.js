import "./globals.css";

export const metadata = {
  title: "FullStack BrandKit",
  description:
    "Trouve les couleurs et polices de ta boutique en 30 secondes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
