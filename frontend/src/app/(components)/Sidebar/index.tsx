"use client"

import { useAppDispatch, useAppSelector} from '@/app/redux'
import { setIsSidebarCollapsed } from '@/state'
import { Archive,  CircleDollarSign, Clipboard, Layout, LucideIcon, Menu, SlidersHorizontal, Users } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'


interface SidebarLinkProps {
    href: string;
    label: string;
    icon: LucideIcon;
    isCollapsed: boolean;
}
const SidebarLink = ({
    href,
    label,
    icon : Icon,
    isCollapsed
} : SidebarLinkProps) => {
    const pathname = usePathname();
    const isActive = pathname === href || (pathname === "/" && href === "/dashboard");
    return (
        <Link href={href}>
            <div className={`cursor-pointer flex items-center ${
                isCollapsed ? "justify-center py-4" : "justify-start py-4 px-8"} 
                hover:text-blue-500 hover:bg-blue-100 gap-3 transition-colors ${
                    isActive ? "text-blue-500 bg-blue-100" : ""
                }
                `}>
                <Icon className='w-6 h-6 !text-gray-700' />
                <span className={`${isCollapsed ? "hidden" : "block"}`}>{label}</span>
            </div>
        </Link>
    )
}

const Sidebar = () => {
    const dispatch = useAppDispatch();
    const isSidebarCollapsed = useAppSelector(
        (state) => state.global.isSidebarCollapsed
    );

    const toggleSidebar = () => {
        dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
    };

    const sidebarClassNames = `fixed flex flex-col ${
        isSidebarCollapsed ? "w-0 md:w-16" : "w-72 md:w-64"
    } bg-white h-full transition-all duration-300 overflow-hidden h-full shadow-md z-40`;

    // Get fullyear
    const currentYear = new Date().getFullYear()
  return (
    <div className={sidebarClassNames}>
        {/* TOP LOGO */}
        <div className={`flex gap-3 justify-between md:justify-normal items-center pt-8 ${
            isSidebarCollapsed ? "px-5" : "px-8"
        }`}>
            <div>logo</div>
            <h1 className={`${
                isSidebarCollapsed ? "hidden" : "block"
            } font-extrabold text-2xl`}>INSTOCKS</h1>
        
        <button className='md:hidden px-3 py-3 bg-gray-100 rounded-full hover:bg-blue-100 hover:cursor-pointer'
        onClick={toggleSidebar} //to open sidebar in mob}
        >
            <Menu className='w-4 h-4' />
        </button>
    </div>
    {/* LINKS */}
    <div className='flex-grow mt-8'>
        <SidebarLink href='/dashboard' label='Dashboard' icon={Layout} isCollapsed={isSidebarCollapsed} />
        <SidebarLink href='/inventory' label='Inventory' icon={Archive} isCollapsed={isSidebarCollapsed} />
        <SidebarLink href='/products' label='Products' icon={Clipboard} isCollapsed={isSidebarCollapsed} />
        <SidebarLink href='/users' label='Users' icon={Users} isCollapsed={isSidebarCollapsed} />
        <SidebarLink href='/settings' label='Settings' icon={SlidersHorizontal} isCollapsed={isSidebarCollapsed} />
        <SidebarLink href='/expenses' label='Expenses' icon={CircleDollarSign} isCollapsed={isSidebarCollapsed} />

    </div>
    {/* FOOTER */}
    <div className={`${isSidebarCollapsed ? "hidden" : "block"} mb-10`}>
            <p className='text-center text-xs text-gray-500'>&copy; {currentYear} INSTOCKS</p>
    </div>
    </div>
  )
}

export default Sidebar