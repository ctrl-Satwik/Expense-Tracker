import React, { useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { Link, useParams } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const ResetPassword = () => {
  // Token comes from the email link only - never persisted
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [linkProblem, setLinkProblem] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await axiosInstance.post(API_PATHS.AUTH.RESET_PASSWORD(token), { password });
      setSuccess(true);
    } catch (error) {
      const data = error.response?.data;
      if (data?.code === "TOKEN_EXPIRED" || data?.code === "TOKEN_INVALID") {
        setLinkProblem(true);
        setError(data.message);
      } else if (data?.message) {
        setError(data.message);
      } else {
        setError("Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[70%] min-h-[75dvh] md:min-h-0 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Reset Password</h3>

        {success ? (
          <>
            <p className='text-sm text-slate-700 mt-3 mb-6'>
              Your password has been reset. You can now log in with your new password.
            </p>
            <Link to='/login' className='btn-primary text-center'>
              GO TO LOGIN
            </Link>
          </>
        ) : linkProblem ? (
          <>
            <p className='text-sm text-red-500 mt-3 mb-6'>{error}</p>
            <Link to='/forgot-password' className='btn-primary text-center'>
              REQUEST A NEW LINK
            </Link>
          </>
        ) : (
          <>
            <p className="text-xs text-slate-700 mt-[5px] mb-6">
              Choose a new password for your account.
            </p>

            <form onSubmit={handleSubmit}>
              <Input
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                label="New Password"
                placeholder='Min 8 Characters'
                type='password'
              />

              <Input
                value={confirmPassword}
                onChange={({ target }) => setConfirmPassword(target.value)}
                label="Confirm Password"
                placeholder='Re-enter your new password'
                type='password'
              />

              {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

              <button type="submit" className="btn-primary disabled:opacity-70" disabled={loading}>
                {loading ? "RESETTING..." : "RESET PASSWORD"}
              </button>

              <p className='text-[13px] text-slate-800 mt-3'>
                <Link to='/login' className='font-medium text-primary underline'>
                  Back to Login
                </Link>
              </p>
            </form>
          </>
        )}
      </div>
    </AuthLayout>
  )
}

export default ResetPassword
