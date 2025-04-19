import { JSX } from "preact";

export default function Header(): JSX.Element {
  return (
    <header className="bg-white shadow-md fixed w-full z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img 
            src="/logo.svg" 
            alt="Barrier Solutions Logo" 
            className="h-10 w-auto"
          />
          <div>
            <h1 className="text-2xl font-bold text-blue-800">Barrier Solutions</h1>
            <p className="text-sm text-gray-600">Securing Your Premises</p>
          </div>
        </div>
        
        <nav className="hidden md:flex space-x-8">
          <a href="#home" className="text-gray-800 hover:text-blue-600 transition">Home</a>
          <a href="#configurator" className="text-gray-800 hover:text-blue-600 transition">Configurator</a>
          <a href="#about" className="text-gray-800 hover:text-blue-600 transition">About</a>
          <a href="#contact" className="text-gray-800 hover:text-blue-600 transition">Contact</a>
        </nav>
        
        <div className="md:hidden">
          <button className="text-gray-800 hover:text-blue-600 transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
} 