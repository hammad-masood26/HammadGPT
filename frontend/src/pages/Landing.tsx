import { Link } from "react-router-dom";
import "../styles.css";

export default function Landing() {
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100 text-gray-900 px-6 relative"
      style={{backgroundImage:'url("./bg.jpg")', backgroundSize: 'cover', backgroundPosition: 'center'}}
    >
      {/* Dark overlay for text visibility */}
      <div className="absolute inset-0 bg-black/30"></div>
      
      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 max-w-6xl mb-20 mt-12 sm:mt-16 md:mt-20 relative z-10">
        
        {/* Robot Image */}
        <div className="flex flex-shrink-0 order-1 md:order-1">
          <img
            src="/robo.png"
            alt="AI Assistant"
            className="w-40 sm:w-48 md:w-80 drop-shadow-lg"
          />
        </div>

        {/* Text + Buttons */}
        <div className="text-center md:text-left max-w-lg order-2 md:order-2 flex flex-col w-full md:w-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-400 to-emerald-300 bg-clip-text text-transparent drop-shadow-lg">
            Welcome to Hammad GPT
          </h1>
          <p className="text-base sm:text-lg text-white mb-6 drop-shadow-md">
            Your AI-powered chatbot for intelligent conversations and seamless
            assistance — built with modern design and a human touch.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 sm:py-3 px-6 sm:px-8 rounded-lg shadow-md transition duration-300 transform hover:scale-105 text-sm sm:text-base"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 sm:py-3 px-6 sm:px-8 rounded-lg shadow-md transition duration-300 transform hover:scale-105 text-sm sm:text-base"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-white text-xs sm:text-sm mt-auto pb-4 relative z-10">
        © {new Date().getFullYear()} Hammad GPT. All rights reserved.
      </footer>
    </div>
  );
}
