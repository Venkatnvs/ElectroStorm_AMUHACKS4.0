import { Breadcrumbs } from '@/components/Breadcrumbs'
import PageContainer from '@/components/layout/PageContainer'
import TextHeader from '@/components/PageHeaders/TextHeader'
import React from 'react'
import EmployeeCalendar from './components/EmployeeCalendar';

const breadcrumbItems = [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Calendar', link: '/dashboard/calendar' },
];

const MainCalender = () => {
  return (
    <PageContainer scrollable={true}>
      <div className='space-y-2'>
        <Breadcrumbs items={breadcrumbItems} />
        <TextHeader
          title='Calendar'
          description='View and edit your calendar'
        />
        <EmployeeCalendar />
      </div>
    </PageContainer>
  )
}

export default MainCalender