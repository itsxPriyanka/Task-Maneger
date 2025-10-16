import { GoogleLogin } from "@react-oauth/google";
import React, { useContext, useState } from "react";
import { FaLock, FaUser } from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api";
import "./Register.css";
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
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from "lucide-react";
import { Checkbox } from "../../components/ui/checkbox";
import { UserContext } from "../Context/UserContext";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const { setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState(""); // State to store verification code
  const [isVerificationRequired, setIsVerificationRequired] = useState(false); // Track if verification is required
  const [errors, setErrors] = useState({});
  const Client_ID =
    "1030045454770-o702q1tv5t6s1p99m0vuqgbuf6cf1kcg.apps.googleusercontent.com";
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      toast.error("Email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email must be a valid email address";
      toast.error("Email must be a valid email address");
    }
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
      toast.error("Username is required");
    } else if (!/^[a-zA-Z]+$/.test(formData.username)) {
      newErrors.username = "Username must contain only letters";
      toast.error("Username must contain only letters");
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
      toast.error("Password is required");
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
      toast.error("Password must be at least 8 characters long");
    } else if (!/[!@#$%^&*]/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one special character";
      toast.error("Password must contain at least one special character");
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const loadingToast = toast.loading("Registering in...");

    try {
      const response = await api.post("/register", formData);
      toast.success(response.data.message);
      toast.dismiss(loadingToast);

      setIsVerificationRequired(true); // Prompt for verification after registration
    } catch (err) {
      setErrors({
        apiError: err.response?.data?.message || "Registration failed",
      });
      toast.error(err.response?.data?.message || "Registration failed");
      toast.dismiss(loadingToast); // Dismiss the loading toast
    }
  };

  // const handleGoogleLogin = async (credentialResponse) => {
  //   try {
  //     const response = await api.post("/login", {
  //       credential: credentialResponse.credential,
  //     });
  //     toast.success(response.data.message);
  //     navigate("/");
  //   } catch (error) {
  //     setErrors({
  //       apiError: error.response?.data?.message || "Google login failed",
  //     });
  //     toast.error(error.response?.data?.message || "Google login failed");
  //   }
  // };

  // Handle verification code submission

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      toast.error("Please enter the verification code.");
      return;
    }

    try {
      const response = await api.post("/verify-email", {
        email: formData.email,
        code: verificationCode,
      });

      toast.success(response.data.message);
      navigate("/login"); // Redirect to login or home after verification
    } catch (error) {
      setErrors({
        apiError: error.response?.data?.message || "Verification failed",
      });
      toast.error(error.response?.data?.message || "Verification failed");
    }
  };

  const handleGoogleLogin = async (response) => {
    const { credential } = response;

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

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <Toaster position="top-center" />

        {!isVerificationRequired ? (
          // ------------------------ Registration Form ------------------------
          <Card className="glass-card border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold pulse-glow">
                Create Account
              </CardTitle>
              <CardDescription className="text-lg">
                Join thousands of productive users today
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
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
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.username}
                      onChange={handleChange}
                      className="pl-10 glass-card border-glass-border"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
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

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
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

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="pl-10 pr-10 glass-card border-glass-border"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Agree Terms */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agreeTerms"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, agreeTerms: checked })
                    }
                  />
                  <Label htmlFor="agreeTerms" className="text-sm">
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className="text-primary hover:text-primary-glow transition-colors"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="text-primary hover:text-primary-glow transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </Label>
                </div>

                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
              <div className="text-center text-sm">
                <span className="text-muted-foreground">
                  Already have an account?{" "}
                </span>
                <Link
                  to="/login"
                  className="text-primary hover:text-primary-glow transition-colors font-medium"
                >
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          // ------------------------ Verification Code Form ------------------------
          <Card className="glass-card border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold pulse-glow">
                Email Verification
              </CardTitle>
              <CardDescription className="text-lg">
                Enter the verification code sent to your email
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="Verification Code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="glass-card border-glass-border"
                />
                <Button
                  onClick={handleVerifyCode}
                  variant="hero"
                  size="lg"
                  className="w-full"
                >
                  Verify
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <Toaster position="top-center" />
    </div>
  );
};

export default Register;
