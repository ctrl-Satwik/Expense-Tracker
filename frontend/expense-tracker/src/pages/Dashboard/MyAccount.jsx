import React, { useState, useEffect, useContext } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { UserContext } from '../../context/UserContext';
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosInstance';
import CharAvatar from '../../components/Cards/CharAvatar';
import { LuUpload } from 'react-icons/lu';
import toast from 'react-hot-toast';

const MyAccount = () => {
    const { user, updateUser } = useContext(UserContext);

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [profileImageUrl, setProfileImageUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFullName(user.fullName);
            setEmail(user.email);
            setProfileImageUrl(user.profileImageUrl);
        }
    }, [user]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if (response.data && response.data.imageUrl) {
                setProfileImageUrl(response.data.imageUrl);
            }
        } catch (error) {
            console.error("Image upload failed", error);
            toast.error("Failed to upload image");
        }
    };

    const handleUpdateProfile = async () => {
        if (!fullName.trim()) {
            toast.error("Full Name is required");
            return;
        }

        setLoading(true);

        try {
            const response = await axiosInstance.put(API_PATHS.AUTH.UPDATE_USER, {
                fullName,
                profileImageUrl,
            });

            if (response.data && response.data.user) {
                toast.success("Profile updated successfully");
                updateUser(response.data.user);
            }
        } catch (error) {
            console.error("Profile update failed", error);
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout activeMenu="My Account">
            <div className='my-5 mx-auto w-full max-w-xl'>
                <div className='bg-white p-8 rounded-2xl shadow-md border border-gray-200/50'>
                    <h2 className='text-xl font-medium text-black mb-6'>My Account</h2>

                    <div className='flex flex-col gap-6'>
                        {/* Profile Image Section */}
                        <div className='flex flex-col items-center justify-center'>
                            <div className='relative w-28 h-28 rounded-full overflow-hidden bg-slate-100 border border-gray-200'>
                                {profileImageUrl ? (
                                    <img src={profileImageUrl} alt="Profile" className='w-full h-full object-cover' />
                                ) : (
                                    <CharAvatar fullName={fullName} width="w-full" height="h-full" style="text-4xl" />
                                )}

                                <label htmlFor='profileImage' className='absolute bottom-0 w-full h-8 bg-black/50 flex items-center justify-center text-white cursor-pointer hover:bg-black/60 transition-colors'>
                                    <LuUpload className='text-sm' />
                                    <input type="file" id="profileImage" className='hidden' accept="image/*" onChange={handleImageUpload} />
                                </label>
                            </div>
                            <p className='text-xs text-gray-400 mt-3'>Click icon to update profile picture</p>
                        </div>

                        {/* Form Fields */}
                        <div className='flex flex-col gap-4'>
                            <div className='flex flex-col gap-1'>
                                <label className='text-sm font-medium text-gray-700'>Full Name</label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className='w-full p-3 bg-slate-50 border border-gray-200 rounded-lg outline-none focus:border-primary transition-colors text-sm'
                                    placeholder='Enter your full name'
                                />
                            </div>

                            <div className='flex flex-col gap-1'>
                                <label className='text-sm font-medium text-gray-700'>Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    disabled
                                    className='w-full p-3 bg-slate-100 border border-gray-200 rounded-lg outline-none text-gray-500 cursor-not-allowed text-sm'
                                />
                                <p className='text-xs text-gray-400'>Email address cannot be changed</p>
                            </div>
                        </div>

                        <button
                            onClick={handleUpdateProfile}
                            disabled={loading}
                            className={`w-full py-3 rounded-lg text-white font-medium text-sm mt-4 bg-primary hover:bg-primary/90 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Updating...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default MyAccount;
