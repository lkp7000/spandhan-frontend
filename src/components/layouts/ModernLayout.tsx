import Header from '@/components/template/Header'
import SidePanel from '@/components/template/SidePanel'
import UserDropdown from '@/components/template/UserDropdown'
import SideNavToggle from '@/components/template/SideNavToggle'
import MobileNav from '@/components/template/MobileNav'
import SideNav from '@/components/template/SideNav'
import View from '@/views'
import React, { useEffect } from 'react'

const HeaderActionsStart = () => {
    return (
        <>
            <MobileNav />
            <SideNavToggle />
        </>
    )
}

const HeaderActionsEnd = () => {
    return (
        <>
            {/* <SidePanel /> */}
            <UserDropdown hoverable={false} />
        </>
    )
}

const ModernLayout = () => {
    useEffect(() => {
        const handleBeforePrint = () => {
            // Hide or modify elements before printing starts
            document
                .querySelector('.header-action-start')
                ?.classList.add('hide-on-print')
            document
                .querySelector('.header-action-end')
                ?.classList.add('hide-on-print')
            document.querySelector('.side-nav')?.classList.add('hide-on-print')
        }

        const handleAfterPrint = () => {
            // Restore elements after printing is done
            document
                .querySelector('.header-action-start')
                ?.classList.remove('hide-on-print')
            document
                .querySelector('.header-action-end')
                ?.classList.remove('hide-on-print')
            document
                .querySelector('.side-nav')
                ?.classList.remove('hide-on-print')
        }

        window.addEventListener('beforeprint', handleBeforePrint)
        window.addEventListener('afterprint', handleAfterPrint)

        return () => {
            window.removeEventListener('beforeprint', handleBeforePrint)
            window.removeEventListener('afterprint', handleAfterPrint)
        }
    }, [])

    return (
        <div className="app-layout-modern flex flex-auto flex-col bg-[#4e73df] ">
            <div className="flex flex-auto min-w-0 ">
                <SideNav />
                <div className="flex flex-col flex-auto min-h-screen min-w-0 relative w-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 bg-[]">
                    <Header
                        className="border-b border-gray-200 dark:border-gray-700 bg-[white]"
                        headerEnd={<HeaderActionsEnd />}
                        headerStart={<HeaderActionsStart />}
                    />
                    <View />
                </div>
            </div>
        </div>
    )
}

export default ModernLayout
