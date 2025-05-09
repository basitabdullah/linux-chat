import { useState, useEffect } from "react";
import { useAuthStore } from '../store/useAuthStore';
import { Camera, Mail, User, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const Profile = () => {
  const { authUser, isUpdatingProfile, updateProfile, checkAuth } = useAuthStore();
  const [avatar, setAvatar] = useState({
    file: null,
    url: authUser?.avatar || "/avatar.png",
    isLoading: false  // Changed to false by default
  });

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (authUser?.avatar) {
      setAvatar(prev => ({
        ...prev,
        url: authUser.avatar
      }));
    }
  }, [authUser]);

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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      return toast.error('Please upload an image file');
    }

    if (file.size > 5 * 1024 * 1024) {
      return toast.error('Image size should be less than 5MB');
    }

    try {
      setAvatar({
        file: file,
        url: URL.createObjectURL(file),
        isLoading: true  // Set to true only when uploading a new image
      });

      const avatarUrl = await uploadToCloudinary(file);
      await updateProfile({ avatar: avatarUrl });
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error.message || 'Failed to update profile picture');

      setAvatar({
        file: null,
        url: authUser?.avatar || "/avatar.png",
        isLoading: false  // Set back to false if there's an error
      });
    }
  };

  const handleImageLoad = () => {
    setAvatar(prev => ({
      ...prev,
      isLoading: false
    }));
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-base-300 rounded-xl p-6 space-y-4">
          <div className="text-center">
            <h1 className="text-4xl font-semibold">Profile</h1>
            <p className="mt-2 text-lg">Your profile information</p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="size-24 rounded-full border-4 relative overflow-hidden">
                {avatar.isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-base-200">
                    <Loader2 className="w-8 h-8 animate-spin" />
                  </div>
                )}
                <img
                  src={avatar.url}
                  alt="Profile"
                  className="size-full object-cover transition-opacity duration-300"
                  onLoad={handleImageLoad}
                />
              </div>
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 font-semibold flex items-center gap-2">
                <User className="w-4 h-4" strokeWidth={3} />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-xl border">
                {authUser?.username}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 font-semibold flex items-center gap-2">
                <Mail className="w-4 h-4" strokeWidth={3} />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-xl border">{authUser?.email}</p>
            </div>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-3 px-6">
            <h2 className="text-lg font-semibold mb-2">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser?.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;