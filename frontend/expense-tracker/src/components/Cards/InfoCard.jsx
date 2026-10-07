import React from 'react'

const InfoCard = ({ icon, label, value, color }) => {
  return (
    <div className='flex items-center gap-4 sm:gap-6 bg-white p-4 sm:p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50'>
      <div className={`w-14 h-14 shrink-0 flex items-center justify-center text-[26px] text-white ${color} rounded-full drop-shadow-xl`}>
        {icon}
      </div>
      <div className='min-w-0'>
        <h6 className='text-sm text-gray-500 mb-1'>{label}</h6>
        <span className='block text-xl sm:text-[22px] break-words'>₹ {value}</span>
      </div>
    </div>
  )
}

export default InfoCard
