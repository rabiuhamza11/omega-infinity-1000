import './globals.css';

export const metadata = {
  title: 'OMEGA INFINITY 1000 — Enterprise AI Platform',
  description: 'Create, manage, deploy, and operate software projects from natural-language prompts',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-omega-dark text-white antialiased">{children}</body>
    </html>
  );
}
