import { type PageProps } from "$fresh/server.ts";

export default function App({ Component }: PageProps) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Barrier Solutions</title>
        <link rel="stylesheet" href="/styles.css" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Configure and customize your barrier gate system for residential, commercial, or industrial properties. Get instant quotations and professional installation." />
      </head>
      <body className="font-sans antialiased text-gray-800">
        <Component />
      </body>
    </html>
  );
}
