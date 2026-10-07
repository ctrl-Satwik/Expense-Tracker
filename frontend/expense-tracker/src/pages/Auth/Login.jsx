import React, { useContext, useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/UserContext';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [resending, setResending] = useState(false);

  const { updateUser } = useContext(UserContext);

  const navigate = useNavigate();

  //handle login form submit
  const handleLogin = async (e) => {
    e.preventDefault();

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
    setNeedsVerification(false);
    setResendMessage("");

    //Login API call
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });
      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response?.data?.code === "EMAIL_NOT_VERIFIED") {
        setNeedsVerification(true);
      }
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again later.");
      }
    }
  }

  //Resend the verification email for an unverified account
  const handleResendVerification = async () => {
    setResending(true);
    try {
      const response = await axiosInstance.post(
        API_PATHS.AUTH.RESEND_VERIFICATION,
        { email },
        { timeout: 30000 }
      );
      setResendMessage(response.data.message);
    } catch (error) {
      setResendMessage(error.response?.data?.message || "Something went wrong. Please try again later.");
    } finally {
      setResending(false);
    }
  };
  return (
    <AuthLayout>
      <div className="lg:w-[70%] min-h-[75dvh] md:min-h-0 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Please enter your credentials to login.
        </p>

        <form onSubmit={handleLogin}>
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder='john@example.com'
            type='text'
          />

          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder='Min 8 Characters'
            type='password'
          />

          <div className='flex justify-end -mt-2 mb-3'>
            <Link to='/forgot-password' className='text-[13px] font-medium text-primary underline'>
              Forgot Password?
            </Link>
          </div>

          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

          {needsVerification && (
            <div className='pb-2.5'>
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={resending}
                className='text-xs font-medium text-primary underline cursor-pointer disabled:opacity-70'
              >
                {resending ? "Sending..." : "Resend verification email"}
              </button>
              {resendMessage && <p className='text-xs text-slate-700 mt-1'>{resendMessage}</p>}
            </div>
          )}

          <button type="submit" className="btn-primary">
            LOGIN
          </button>

          <p className='text-[13px] text-slate-800 mt-3'>
            Don't have an account?{" "}
            <Link to='/signUp' className='font-medium text-primary underline'>
              SignUp
            </Link>
          </p>

        </form>
      </div>
    </AuthLayout>
  )
}

export default Login
