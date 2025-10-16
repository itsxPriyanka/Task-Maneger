import React, { useContext, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { FaLock, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react";
import api from "../../api";
import { UserContext } from "../Context/UserContext";
import "./Login.css";
import { NoAccounts } from "@mui/icons-material";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "", // Field for either username or email
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const Client_ID =
    "1030045454770-o702q1tv5t6s1p99m0vuqgbuf6cf1kcg.apps.googleusercontent.com";
  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [e.target.name]: "",
    }));
  };

  // Validation logic for username and password
  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      // newErrors.email = 'Email is required';
      toast.error("Email is required"); // Show toast error for email validation
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      // newErrors.email = 'Please enter a valid email';
      toast.error("Please enter a valid email"); // Show toast error for invalid email format
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  // Handle form submission (for username/password login)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      for (let error in validationErrors) {
        toast.error(validationErrors[error]);
      }
      return;
    }

    const loadingToast = toast.loading("Logging in...");

    setLoading(true);

    const loginData = {
      email: formData.email, // Only sending email
      password: formData.password,
    };

    try {
      const response = await api.post("/login", loginData);

      const { token, userId, username, email } = response.data;

      if (!userId) {
        console.error("userId is undefined!"); // Log error if userId is missing
      }

      setUser({ userId, token, username, email });
      toast.success("Login successful"); // Show success message via Toastify

      navigate("/todo");
    } catch (err) {
      const status = err.response?.status;
      let apiError = "Login failed. Please try again.";

      if (status === 401) {
        apiError = "Please log in using Google."; // This is the custom error for Google signups
      } else if (status === 403) {
        apiError = "Invalid password. Please check your credentials."; // Invalid password error
      } else if (status === 500) {
        apiError = "Server error. Please try again later.";
      } else if (status === 404) {
        apiError = "User not found.";
      } else if (err.message === "Network Error") {
        apiError = "Network error. Please check your internet connection.";
      }

      setErrors({ apiError });
      toast.error(apiError); // Show API error via Toastify
    } finally {
      setLoading(false);
      toast.dismiss(loadingToast); // Dismiss the loading toast
    }
  };

  // Handle Google OAuth login

  const handleGoogleLogin = async (response) => {
    const { credential } = response;
    console.log("Google credential:", credential);

    if (!credential) {
      console.error("No Google credential received");
      return;
    }
    const loadingToast = toast.loading("Logging in with Google...");

    setLoading(true);

    try {
      const googleResponse = await api.post("/login", { credential });
      const { token, userId, username, email } = googleResponse.data;

      setUser({ userId, token, username, email });
      navigate("/todo");
    } catch (err) {
      setErrors({ apiError: "Google login failed. Please try again." });
    } finally {
      setLoading(false);
      toast.dismiss(loadingToast); // Dismiss the loading toast
    }
  };

  const handleGoogleFailure = (error) => {
    console.error("Google login error", error);
    setErrors({ apiError: "Google login failed. Please try again." });
  };

  const handlenavigate = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6 relative">
        <div
          onClick={handlenavigate}
          className="flex items-center cursor-pointer text-muted-foreground hover:text-foreground transition-colors absolute -top-8 left-0 z-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </div>

        {/* Login Card */}
        <Card className="glass-card border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold pulse-glow">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-lg">
              Sign in to continue your productivity journey
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Google Login Button */}
            <div className="flex justify-center">
              <GoogleLogin
                clientId={Client_ID}
                buttonText="Login with Google"
                onSuccess={handleGoogleLogin}
                onFailure={handleGoogleFailure}
                cookiePolicy="single_host_origin"
                size="large"
                shape="square"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-glass-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-glass-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 glass-card border-glass-border"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 pr-10 glass-card border-glass-border"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <Link
                  to="/forgot-password"
                  className="text-primary hover:text-primary-glow transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                Don't have an account?{" "}
              </span>
              <Link
                to="/signup"
                className="text-primary hover:text-primary-glow transition-colors font-medium"
              >
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      <Toaster position="top-center" />
    </div>
  );
};

export default Login;
