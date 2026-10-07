import React, { useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { Link } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!fullName) {
      setError("Please enter your name");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setError("Please enter the password");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setError("");
    setLoading(true);

    // SignUp API call - the optional profile photo is sent in the same request
    try {
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("email", email);
      formData.append("password", password);
      if (profilePic) {
        formData.append("image", profilePic);
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000,
      });

      // No token yet - the user has to verify their email first
      setSuccessMessage(response.data.message);
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false);
    }

  };
  return (
    <AuthLayout>
      <div className='lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Create an Account</h3>
        {successMessage ? (
          <>
            <p className='text-sm text-slate-700 mt-3 mb-6'>{successMessage}</p>
            <Link to='/login' className='btn-primary text-center'>
              GO TO LOGIN
            </Link>
          </>
        ) : (
        <>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>
          Join us today by entering your details below.
        </p>

        <form onSubmit={handleSignUp}>

          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <Input
                value={fullName}
                onChange={({ target }) => setFullName(target.value)}
                label="Full Name"
                placeholder="John Doe"
                type="text"
              />

              <Input 
                value={email}
                onChange={({ target }) => setEmail(target.value)}
                label="Email Address"
                placeholder='john@example.com'
                type='text'
              />

            <div className='md:col-span-2'>
              <Input 
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                label="Password"
                placeholder='Min 8 Characters'
                type='password'
              />
            </div>
          </div>

          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
          
            <button type="submit" className="btn-primary disabled:opacity-70" disabled={loading}>
                {loading ? "CREATING ACCOUNT..." : "SIGN UP"}
            </button>
          
            <p className='text-[13px] text-slate-800 mt-3'>
                Already have an account?{" "}
                <Link to='/login' className='font-medium text-primary underline'>
                    Login 
                </Link>
            </p>
        </form>
        </>
        )}
      </div>
    </AuthLayout>
  )
}

export default SignUp
