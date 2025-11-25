import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/signup", { name, email, password });
      login(data.token, data.user);
      navigate("/chat");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100 px-4 py-8 text-gray-900">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-200">
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-gray-800">
          Welcome to <span className="text-blue-600">Hammad GPT!</span>
        </h1>
        <p className="text-sm sm:text-base text-gray-600 text-center mb-6">
          Create your account to start chatting
        </p>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-3 sm:space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 sm:py-3 rounded-lg bg-gray-50 text-sm sm:text-base text-gray-900 border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 sm:py-3 rounded-lg bg-gray-50 text-sm sm:text-base text-gray-900 border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 sm:py-3 rounded-lg bg-gray-50 text-sm sm:text-base text-gray-900 border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />

          {error && <div className="text-red-500 text-xs sm:text-sm text-center">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 sm:py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-semibold transition duration-300 shadow-md"
          >
            {loading ? "Creating…" : "Sign Up"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-xs sm:text-sm text-gray-600 text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Sign in
          </Link>
        </p>

        <div className="text-center text-xs text-gray-500 mt-4">
          <Link to="/terms" className="hover:underline">
            {/* Terms of Service */}
          </Link>{" "}
          ·{" "}
          <Link to="/privacy" className="hover:underline">
            {/* Privacy Policy */}
          </Link>
        </div>
      </div>
    </div>
  );
}
