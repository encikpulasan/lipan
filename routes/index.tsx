import { Head } from "$fresh/runtime.ts";
import Header from "../components/Header.tsx";
import Hero from "../components/Hero.tsx";
import About from "../components/About.tsx";
import Configurator from "../islands/Configurator.tsx";
import Footer from "../components/Footer.tsx";

export default function Home() {
  return (
    <>
      <Head>
        <title>Barrier Solutions - Custom Barrier Gate Systems</title>
        <meta name="description" content="Configure and customize your barrier gate system for residential, commercial, or industrial properties. Get instant quotations and professional installation." />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </Head>
      <div class="min-h-screen flex flex-col">
        <Header />
        <main class="flex-grow">
          <Hero />
          <Configurator />
          <About />
        </main>
        <Footer />
      </div>
    </>
  );
}
