import React from 'react'
import {
    LuUtensils,
    LuTrendingUp,
    LuTrendingDown,
    LuTrash2,
} from 'react-icons/lu'

const TransactionInfoCard = ({
    title,
    icon,
    date,
    amount,
    type,
    hideDeleteBtn,
    onDelete,
}) => {
    const getAmountStyles = () =>
        type === "income" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500";

    return (
        <div className='group relative flex items-center gap-3 sm:gap-4 mt-2 p-2 sm:p-3 rounded-lg hover:bg-gray-100 transition-colors'>
            <div className='w-12 h-12 shrink-0 flex items-center justify-center text-xl text-gray-800 bg-gray-100 rounded-full'>
                {icon ? (
                    <img src={icon} alt={title} className='w-6 h-6' />
                ) : (
                    <LuUtensils />
                )}
            </div>

            {/* On narrow screens the amount wraps below the title instead of squeezing it */}
            <div className='flex-1 min-w-0 flex flex-wrap items-center justify-between gap-x-2 gap-y-1'>
                <div className='min-w-0 flex-1 basis-36'>
                    <p className='text-sm text-gray-700 font-medium break-words'>{title}</p>
                    <p className='text-xs text-gray-400 mt-1'>{date}</p>
                </div>

                <div className='flex shrink-0 items-center gap-2'>
                    {!hideDeleteBtn && (
                        // Always visible on touch screens (no hover); hover-to-reveal with a mouse
                        <button className='text-gray-400 hover:text-red-500 pointer-fine:opacity-0 pointer-fine:group-hover:opacity-100 focus-visible:opacity-100 transition-opacity cursor-pointer'
                            aria-label={`Delete ${title}`}
                            onClick={onDelete}>
                            <LuTrash2 size={19} />
                        </button>
                    )}

                    <div
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md whitespace-nowrap ${getAmountStyles()}`}
                    >
                        <h6 className='text-xs font-medium'>
                            {type === "income" ? "+" : "-"} ₹ {amount}
                        </h6>
                        {type === "income" ? <LuTrendingUp /> : <LuTrendingDown />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TransactionInfoCard