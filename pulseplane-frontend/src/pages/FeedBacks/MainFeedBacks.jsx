import { Breadcrumbs } from '@/components/Breadcrumbs'
import PageContainer from '@/components/layout/PageContainer'
import TextHeader from '@/components/PageHeaders/TextHeader'
import React from 'react'
import ListOfFeedbacks from './ListOfFeedbacks'

const breadcrumbItems = [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Feedback', link: '/dashboard/feedback' },
]

const MainFeedBacks = () => {
  return (
    <PageContainer scrollable={true}>
      <div className='space-y-2'>
        <Breadcrumbs items={breadcrumbItems} />
        <TextHeader
          title='Feedback For Today'
          description='Employees feedbacks and reviews'
        />
        <ListOfFeedbacks /> 
      </div>
    </PageContainer>
  )
}

export default MainFeedBacks