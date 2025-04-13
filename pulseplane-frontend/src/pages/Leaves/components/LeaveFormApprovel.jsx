import { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { core_emp_leaves_detailed_list, core_emp_leaves_detailed_partial_update } from '@/apis/leaves/detailed'
import { useToast } from '@/hooks/use-toast'

export default function LeaveFormApprovel() {
  const [leaveRequests, setLeaveRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const {toast } = useToast()

  useEffect(() => {
    fetchLeaveRequests()
  }, [])

  const fetchLeaveRequests = async () => {
    try {
      setLoading(true)
      const response = await core_emp_leaves_detailed_list()
      console.log(response.data)
      setLeaveRequests(response.data)
      setLoading(false)
    } catch (err) {
      setError('Failed to fetch leave requests')
      setLoading(false)
    }
  }

  const handleApprove = async (id) => {
    try {
      const res = await core_emp_leaves_detailed_partial_update(id, { approved: true })
      if (res.status === 200){
        toast({
            title: 'Leave request approved',
            description: 'The leave request has been approved successfully',
        })
        fetchLeaveRequests()
      }
    } catch (err) {
      setError('Failed to approve leave request')
    }
  }

  if (loading) return <div className="text-center p-4">Loading...</div>
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>

  return (
    <Card className="w-full mx-auto">
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee Name</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaveRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.user.full_name}</TableCell>
                <TableCell>{request.reason}</TableCell>
                <TableCell>{new Date(request.date).toLocaleDateString()}</TableCell>
                <TableCell>{request.approved ? (
                    <span className="text-green-500">Approved</span>
                    ) : (
                    <span className="text-red-500">Pending</span>
                )}</TableCell>
                <TableCell>
                  {!request.approved && (
                    <Button onClick={() => handleApprove(request.id)} size='sm'>
                      Approve
                    </Button>
                  )
                }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}