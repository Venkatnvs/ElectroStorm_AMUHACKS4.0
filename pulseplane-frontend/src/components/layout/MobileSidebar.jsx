import React, { useState } from 'react'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { MenuIcon } from 'lucide-react';
import DashBoardNav from './DashBoardNav';
import { navItems } from '@/constants/SidebarLinks';
import { useSelector } from 'react-redux';
import { navItems2 } from '@/constants/SidebarLinks_emp';

const MobileSidebar = () => {
  const { is_superuser } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <MenuIcon />
        </SheetTrigger>
        <SheetContent side="left" className="!px-0">
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                Overview
              </h2>
              <div className="space-y-1">
                <DashBoardNav
                  items={is_superuser ? navItems : navItems2}
                  isMobileNav={true}
                  setOpen={setOpen}
                />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

export default MobileSidebar