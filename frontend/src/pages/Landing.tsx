import { Link } from "react-router-dom";
import "../styles.css";

export default function Landing() {
  return (
    <div className="min-h-screen flex items-center justify-center landing-bg text-gray-900 px-6">
      <div className="flex flex-col md:flex-row items-center gap-10 max-w-6xl w-full py-20 px-4">
        
        {/* Robot Image */}
        <div className="flex-shrink-0">
          <img
            src="/robo.png" // 👈 make sure robo.png is inside /public
            alt="AI Assistant"
            className="w-48 md:w-80 drop-shadow-lg"
            style={{pointerEvents: 'none'}}
          />
        </div>

        {/* Text + Buttons */}
        <div className="text-center md:text-left max-w-lg z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent">
            Welcome to Hammad GPT
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Your AI-powered chatbot for intelligent conversations and seamless
            assistance — built with modern design and a human touch.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mt-2">
            <Link
              to="/login"
              className="w-full sm:w-auto text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300 transform hover:scale-105"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="w-full sm:w-auto text-center bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300 transform hover:scale-105"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-6 text-gray-500 text-sm">
        © {new Date().getFullYear()} Hammad GPT. All rights reserved.
      </footer>
    </div>
  );
}
