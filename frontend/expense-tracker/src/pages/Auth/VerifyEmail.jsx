import React, { useEffect, useRef, useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { Link, useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const VerifyEmail = () => {
  const { token } = useParams();

  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");

  // Tokens are single-use: StrictMode runs effects twice in development,
  // so make sure the request is only sent once
  const requested = useRef(false);

  useEffect(() => {
    if (requested.current) return;
    requested.current = true;

    const verify = async () => {
      try {
        const response = await axiosInstance.post(API_PATHS.AUTH.VERIFY_EMAIL(token));
        setMessage(response.data.message);
        setStatus("success");
      } catch (error) {
        setMessage(error.response?.data?.message || "Something went wrong. Please try again later.");
        setStatus("error");
      }
    };

    verify();
  }, [token]);

  return (
    <AuthLayout>
      <div className="lg:w-[70%] min-h-[75dvh] md:min-h-0 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Email Verification</h3>

        {status === "loading" && (
          <div className='flex items-center gap-3 mt-6'>
            <div className='w-6 h-6 border-4 border-purple-200 border-t-primary rounded-full animate-spin' />
            <p className='text-sm text-slate-700'>Verifying your email...</p>
          </div>
        )}

        {status === "success" && (
          <>
            <p className='text-sm text-slate-700 mt-3 mb-6'>{message}</p>
            <Link to='/login' className='btn-primary text-center'>
              GO TO LOGIN
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <p className='text-sm text-red-500 mt-3 mb-6'>{message}</p>
            <p className='text-[13px] text-slate-800'>
              You can request a new verification link from the{" "}
              <Link to='/login' className='font-medium text-primary underline'>
                Login
              </Link>{" "}
              page.
            </p>
          </>
        )}
      </div>
    </AuthLayout>
  )
}

export default VerifyEmail
