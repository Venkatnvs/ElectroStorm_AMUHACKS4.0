import { Breadcrumbs } from '@/components/Breadcrumbs'
import PageContainer from '@/components/layout/PageContainer'
import TextHeader from '@/components/PageHeaders/TextHeader'
import React from 'react'
import CreateEmployeeForm from './components/CreateEmployeeForm';

const breadcrumbItems = [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Employees', link: '/dashboard/employee' },
    { title: 'Create Employee', link: '/dashboard/employee/create' },
];

const CreateEmployee = () => {
  return (
    <PageContainer scrollable={true}>
      <div className='space-y-2'>
        <Breadcrumbs items={breadcrumbItems} />
        <TextHeader title='Create Employee'
        description='Add a new employee to your organization' />
        <CreateEmployeeForm />
      </div>
    </PageContainer>
  )
}

export default CreateEmployee