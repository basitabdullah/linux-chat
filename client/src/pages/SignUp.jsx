import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from "lucide-react";
import { Link } from "react-router-dom";

import AuthImagePattern from "../components/AuthImagePattern";
import toast from "react-hot-toast";

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [avatar, setAvatar] = useState({
        file: null,
        url: "",
    });

    const { signup, isSigningUp } = useAuthStore();

    const validateForm = () => {
        if (!formData.username.trim()) return toast.error("Full name is required");
        if (!formData.email.trim()) return toast.error("Email is required");
        if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
        if (!formData.password) return toast.error("Password is required");

        return true;
    };

    const uploadToCloudinary = async (file) => {
        try {
            const cloudinaryFormData = new FormData();
            cloudinaryFormData.append("file", file);
            cloudinaryFormData.append("upload_preset", "myCloud");

            const response = await fetch(
                "https://api.cloudinary.com/v1_1/nexuschatapp/image/upload",
                {
                    method: "POST",
                    body: cloudinaryFormData,
                }
            );

            if (!response.ok) {
                throw new Error("Failed to upload image to Cloudinary");
            }

            const data = await response.json();
            return data.secure_url;
        } catch (error) {
            console.error("Cloudinary upload error:", error);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const success = validateForm();

        if (success === true) {
            try {
                const avatarUrl = await uploadToCloudinary(avatar.file);

                const userData = {
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    avatar: avatarUrl
                };

                const result = await signup(userData);
                console.log("Signup result:", result);

            } catch (error) {
                console.error("Full signup error:", error);
                toast.error(error.message || "Failed to create account");
            }
        }
    };

    const handleAvatar = (e) => {
        if (e.target.files[0]) {
            setAvatar({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0]),
            });
        }
    };

    return (
        <div className="h-screen grid lg:grid-cols-2 overflow-y-hidden">
            {/* left side */}
            <div className="flex flex-col justify-center items-center p-6 sm:p-12">
                <div className="w-full max-w-md space-y-3 mt-10">
                    {/* Logo Section */}
                    <div className="flex justify-center">
                        <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
                            group-hover:bg-primary/20 transition-colors">
                            <MessageSquare className="size-6 text-primary" />
                        </div>
                    </div>

                    {/* Header Section */}
                    <div className="text-center">
                        <h1 className="text-4xl font-bold">Create Account</h1>
                        <p className="text-base-content mt-2">Get started with your free account</p>
                    </div>

                    {/* Avatar Upload Section */}
                    <div className="flex flex-col items-center gap-2">
                        <label
                            className="cursor-pointer flex flex-col items-center justify-center gap-2"
                            htmlFor="file"
                        >
                            <img
                                src={avatar.url || "./avatar.png"}
                                alt="avatar"
                                className="h-20 w-20 rounded-full object-cover hover:opacity-80 transition-opacity"
                            />
                            <span className="text-base-content hover:underline">Upload an avatar</span>
                        </label>
                        <input
                            type="file"
                            id="file"
                            className="hidden"
                            onChange={handleAvatar}
                        />
                    </div>

                    {/* Form Section */}
                    <form onSubmit={handleSubmit} className="space-y-2">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Full Name</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="size-5 text-base-content/40" />
                                </div>
                                <input
                                    type="text"
                                    className="input input-bordered w-full pl-10"
                                    placeholder="John Doe"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Email</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="size-5 text-base-content/40" />
                                </div>
                                <input
                                    type="email"
                                    className="input input-bordered w-full pl-10"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Password</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="size-5 text-base-content/40" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="input input-bordered w-full pl-10"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="size-5 text-base-content/40" />
                                    ) : (
                                        <Eye className="size-5 text-base-content/40" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className="btn btn-primary w-full" 
                            disabled={isSigningUp}
                        >
                            {isSigningUp ? (
                                <>
                                    <Loader2 className="size-5 animate-spin" />
                                    Loading...
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </form>

                    <div className="text-center">
                        <p className="text-base-content/60">
                            Already have an account?{" "}
                            <Link to="/login" className="link link-primary">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* right side */}
            <AuthImagePattern
                title="Join our community"
                subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
            />
        </div>
    );
};

export default SignUp;