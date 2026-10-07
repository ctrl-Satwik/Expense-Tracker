import React from 'react'

const Modal = ({ children, isOpen, onClose, title }) => {
    if (!isOpen) return null;
    return (
        <div className='fixed inset-0 z-50 flex justify-center items-center p-4 bg-black/20'>
            {/* Modal content: never taller than the viewport; the body scrolls instead */}
            <div
                role='dialog'
                aria-modal='true'
                aria-label={title}
                className='relative flex flex-col w-full max-w-2xl max-h-full bg-white rounded-lg shadow-sm'
            >
                {/* Modal header */}

                <div className='flex shrink-0 items-center justify-between gap-3 p-4 md:p-5 border-b rounded-t border-gray-200'>
                    <h3 className='min-w-0 break-words text-lg font-medium text-gray-900'>
                        {title}
                    </h3>

                    <button
                        type="button"
                        aria-label='Close'
                        className='shrink-0 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center cursor-pointer'
                        onClick={onClose}
                    >
                        X
                    </button>
                </div>

                {/* Modal body */}
                <div className='p-4 md:p-5 space-y-4 overflow-y-auto'>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Modal
