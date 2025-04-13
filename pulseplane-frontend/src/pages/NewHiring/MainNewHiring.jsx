import { Breadcrumbs } from '@/components/Breadcrumbs'
import PageContainer from '@/components/layout/PageContainer'
import TextHeader from '@/components/PageHeaders/TextHeader';
import React from 'react'
import MainCardPage from './MainCardPage';

const breadcrumbItems = [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Hiring', link: '/dashboard/new-hire' },
];

const MainNewHiring = () => {
  return (
    <PageContainer scrollable={true}>
      <div className='space-y-2'>
        <Breadcrumbs items={breadcrumbItems} />
        <TextHeader
          title='Hiring'
          description='View and edit your hiring information'
        />
        <MainCardPage />
      </div>
    </PageContainer>
  )
}

export default MainNewHiring