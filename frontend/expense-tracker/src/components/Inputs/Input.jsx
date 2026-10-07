import React, { useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';

const Input = ({ value, onChange, placeholder, label, type }) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div>
      <label className='text-[13px] text-slate-800'>{label}</label>

      <div className='input-box'>
        <input
          type={type == 'password' ? showPassword ? 'text' : 'password' : type}
          placeholder={placeholder}
          className='w-full min-w-0 bg-transparent outline-none'
          value={value}
          onChange={(e) => onChange(e)}
        />

        {type === 'password' && (
          <>
            {showPassword ? (
              <FaRegEye
                size={22}
                className='shrink-0 text-primary cursor-pointer'
                onClick={() => toggleShowPassword()}
              />
            ) : (
              <FaRegEyeSlash
                size={22}
                className='shrink-0 text-slate-400 cursor-pointer'
                onClick={() => toggleShowPassword()}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Input
