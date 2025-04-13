import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { core_employees_list } from '@/apis/employee'

const categories = [
  "cashier", "developer", "designer", "analyst", "barista",
  "cleaner", "chef", "waiter", "salesman"
]

export default function MainCardPage() {
  const [employeeCounts, setEmployeeCounts] = useState({
    cashier: 3,
    developer: 5,
    designer: 2,
    analyst: 0,
    barista: 4,
    cleaner: 0,
    chef: 2,
    waiter: 6,
    salesman: 0
  })

  const fetchEmployeeCounts = async () => {
    try {
        const res = await core_employees_list()
        if (res.status === 200) {
            const employees = res.data
            const counts = {}
            categories.forEach(category => {
                counts[category] = employees.filter(employee => employee.position === category).length
            })
            setEmployeeCounts(counts)
        } else {
            console.error(res)
        }
    } catch (error) {
        console.error(error)
    }
  }

  useEffect(() => {
    fetchEmployeeCounts()
  }, [])

  const recommendations = categories.filter(category => employeeCounts[category] === 0)

  return (
    <div className="space-y-4">
      <p className="text-lg font-semibold p-0 mb-0">Employee Count</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map(category => (
          <Card key={category}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium capitalize">
                {category}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employeeCounts[category]}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Hiring Recommendations</h2>
        {recommendations.length > 0 ? (
          <ul className="list-disc pl-5 space-y-2">
            {recommendations.map(category => (
              <li key={category} className="capitalize">{category}</li>
            ))}
          </ul>
        ) : (
          <p>No hiring recommendations at this time.</p>
        )}
      </div>
    </div>
  )
}