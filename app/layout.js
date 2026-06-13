import "./globals.css";

export const metadata = {
  title: "FullStack BrandKit",
  description: "Trouve les couleurs et polices de ta boutique en 30 secondes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,300,0..1,0"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
