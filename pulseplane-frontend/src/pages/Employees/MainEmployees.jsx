import { Breadcrumbs } from '@/components/Breadcrumbs'
import PageContainer from '@/components/layout/PageContainer'
import TextHeader from '@/components/PageHeaders/TextHeader';
import React from 'react'
import AllEmployes from './components/AllEmployes';
import HeaderWithButton from '@/components/PageHeaders/HeaderWithButton';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const breadcrumbItems = [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Employees', link: '/dashboard/employees' },
];

const MainEmployees = () => {
  const navigation =  useNavigate();
  return (
    <PageContainer scrollable={true}>
      <div className='space-y-2'>
        <Breadcrumbs items={breadcrumbItems} />
        <HeaderWithButton
            title='Employees'
            description='Manage your employees'
            buttonText='Add Employee'
            onClick={() => 
              navigation('/dashboard/employee/create')
            }
            icon={<Plus size={16} />}
        />
        <AllEmployes
          data={[]}
          totalData={0}
        />
      </div>
    </PageContainer>
  )
}

export default MainEmployees