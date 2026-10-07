import React, { useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { Link } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await axiosInstance.post(API_PATHS.AUTH.FORGOT_PASSWORD, { email }, { timeout: 30000 });
      setSubmitted(true);
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
      <div className="lg:w-[70%] min-h-[75dvh] md:min-h-0 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Forgot Password</h3>

        {submitted ? (
          <>
            <p className='text-sm text-slate-700 mt-3 mb-6'>
              If an account exists for this email, you will receive a password reset link.
              The link expires in 10 minutes.
            </p>
            <Link to='/login' className='btn-primary text-center'>
              BACK TO LOGIN
            </Link>
          </>
        ) : (
          <>
            <p className="text-xs text-slate-700 mt-[5px] mb-6">
              Enter your email and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit}>
              <Input
                value={email}
                onChange={({ target }) => setEmail(target.value)}
                label="Email Address"
                placeholder='john@example.com'
                type='text'
              />

              {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

              <button type="submit" className="btn-primary disabled:opacity-70" disabled={loading}>
                {loading ? "SENDING..." : "SEND RESET LINK"}
              </button>

              <p className='text-[13px] text-slate-800 mt-3'>
                Remembered it?{" "}
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

export default ForgotPassword
