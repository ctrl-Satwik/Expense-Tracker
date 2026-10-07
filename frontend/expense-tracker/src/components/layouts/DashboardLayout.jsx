import React, { useContext } from 'react'
import { UserContext } from '../../context/UserContext';
import Navbar from './Navbar';
import SideMenu from './SideMenu';

const DashboardLayout = ({ children, activeMenu }) => {
    const { user } = useContext(UserContext);
    return (
        <div className=''>
            <Navbar activeMenu={activeMenu} />

            {user ? (
                <div className='flex'>
                    {/* Same breakpoint as the Navbar menu button, so one of them is always visible */}
                    <div className='max-lg:hidden'>
                        <SideMenu activeMenu={activeMenu} />
                    </div>

                    {/* min-w-0 lets the content (and its charts) shrink below their intrinsic width */}
                    <div className='grow min-w-0 mx-4 sm:mx-5'>{children}</div>
                </div>
            ) : (
                // Shown while useUserAuth restores the user after a refresh
                <div className='flex items-center justify-center h-[calc(100dvh-61px)]'>
                    <div className='w-8 h-8 border-4 border-purple-200 border-t-primary rounded-full animate-spin' />
                </div>
            )}
        </div>
    );
}

export default DashboardLayout
