import { Breadcrumbs } from '@/components/Breadcrumbs'
import PageContainer from '@/components/layout/PageContainer'
import TextHeader from '@/components/PageHeaders/TextHeader';
import React from 'react'
import ShiftSchedulingCalender from './ShiftSchedulingCalender';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Shift Scheduling', link: '/dashboard/shift-scheduling' },
];


const MainShiftScheduling = () => {
  return (
    <PageContainer scrollable={true}>
      <div className='space-y-2'>
        <Breadcrumbs items={breadcrumbItems} />
        <TextHeader title='Shift Scheduling'
        description='Manage your employees shifts and schedules' />
        <ShiftSchedulingCalender />
      </div>
    </PageContainer>
  )
}

export default MainShiftScheduling