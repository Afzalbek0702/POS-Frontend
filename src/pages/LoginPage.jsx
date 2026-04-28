import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { loginApi, saveToken } from "@/services/authService";

export default function LoginPage({ onLoginSuccess, onForgotPassword }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const data = await loginApi({ email, password });
      saveToken(data.token);
      onLoginSuccess?.();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#1a1a1a] flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <h1 className="text-4xl font-bold text-[#f9a8c9] tracking-widest uppercase mb-10 select-none">
        COSYPOS
      </h1>

      {/* Card */}
      <div className="w-full max-w-md bg-[#2a2a2a] rounded-2xl p-10 shadow-2xl">
        <h2 className="text-3xl font-semibold text-white text-center mb-2">Login</h2>
        <p className="text-sm text-gray-400 text-center mb-8">
          Please enter your credentials below to continue
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-white text-sm">
              Username
            </Label>
            <Input
              id="email"
              type="text"
              placeholder="Enter your username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-[#363636] border-transparent text-white placeholder:text-gray-500 focus-visible:ring-[#f9a8c9] focus-visible:ring-1 focus-visible:border-[#f9a8c9] h-12 rounded-lg"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-white text-sm">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-[#363636] border-transparent text-white placeholder:text-gray-500 focus-visible:ring-[#f9a8c9] focus-visible:ring-1 focus-visible:border-[#f9a8c9] h-12 rounded-lg pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 hover:cursor-pointer transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
          </div>

          {/* Remember me + Forgot password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(v) => setRememberMe(!!v)}
                className="border-gray-500 data-[state=checked]:bg-[#f9a8c9] data-[state=checked]:border-[#f9a8c9]"
              />
              <Label htmlFor="remember" className="text-gray-300 text-sm cursor-pointer">
                Remember me
              </Label>
            </div>
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm text-[#f9a8c9] hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          {/* Submit */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-[#f9a8c9] hover:bg-[#f783ac] text-black font-semibold rounded-xl text-base transition-colors disabled:opacity-60"
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
}
