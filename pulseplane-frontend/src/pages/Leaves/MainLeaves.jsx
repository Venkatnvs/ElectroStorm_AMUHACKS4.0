import { Breadcrumbs } from '@/components/Breadcrumbs'
import PageContainer from '@/components/layout/PageContainer'
import TextHeader from '@/components/PageHeaders/TextHeader'
import React from 'react'
import LeaveFormApprovel from './components/LeaveFormApprovel'

const breadcrumbItems = [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Leaves', link: '/dashboard/leaves' },
]

const MainLeaves = () => {
  return (
    <PageContainer scrollable={true}>
      <div className='space-y-2'>
        <Breadcrumbs items={breadcrumbItems} />
        <TextHeader
          title='Leaves'
          description='View and manage your leaves'
        />
        <LeaveFormApprovel />
      </div>
    </PageContainer>
  )
}

export default MainLeaves