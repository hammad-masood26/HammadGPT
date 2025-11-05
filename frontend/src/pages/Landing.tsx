import { Link } from "react-router-dom";
import "../styles.css";

export default function Landing() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-100 text-gray-900 px-6" style={{backgroundImage:'url("./bg.jpg")'}}>
      <div className="flex flex-col md:flex-row items-center gap-16 max-w-6xl">
        
        {/* Robot Image */}
        <div className="flex-shrink-0">
          <img
            src="/robo.png" // 👈 make sure robo.png is inside /public
            alt="AI Assistant"
            className="w-64 md:w-80 drop-shadow-lg"
          />
        </div>

        {/* Text + Buttons */}
        <div className="text-center md:text-left max-w-lg">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent">
            Welcome to Hammad GPT
          </h1>
          <p className="text-lg text-white mb-8">
            Your AI-powered chatbot for intelligent conversations and seamless
            assistance — built with modern design and a human touch.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300 transform hover:scale-105"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300 transform hover:scale-105"
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
