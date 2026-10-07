import React, { useState } from 'react'
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import SideMenu from './SideMenu';

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);

  return (
    <div className='flex justify-between items-center gap-5 bg-white border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-4 sm:px-7 sticky top-0 z-30'>
      <div className='flex items-center gap-5'>
        <button
          className='block lg:hidden text-black'
          aria-label={openSideMenu ? 'Close menu' : 'Open menu'}
          onClick={() => {
            setOpenSideMenu(!openSideMenu);
          }}>
          {openSideMenu ? (
            <HiOutlineX className='text-2xl' />
          ) : (
            <HiOutlineMenu className='text-2xl' />
          )}
        </button>

        <h2 className='text-lg font-medium text-black'>Expense Tracker</h2>
      </div>

      {openSideMenu && (
        <>
          {/* Backdrop: tap outside the drawer to close it */}
          <div
            className='lg:hidden fixed inset-x-0 top-[61px] bottom-0 bg-black/20 z-40'
            onClick={() => setOpenSideMenu(false)}
          />
          <div className='lg:hidden fixed left-0 top-[61px] bg-white z-50'>
            <SideMenu activeMenu={activeMenu} />
          </div>
        </>
      )}
    </div>
  )
}

export default Navbar
