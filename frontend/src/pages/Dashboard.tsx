import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '@/api/axios'
import { useAuth } from '@/context/AuthContext'
import { Application } from '@/types'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import AddApplicationModal from '@/components/AddApplicationModal'

type Stats = {
  total: number
  by_status: Record<string, number>
}

const statusColours: Record<string, string> = {
  applied: 'bg-blue-100 text-blue-800',
  interview: 'bg-yellow-100 text-yellow-800',
  offer: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
}

function Dashboard() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const [applications, setApplications] = useState<Application[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      setLoading(true)
      setError(null)

      const [appsResponse, statsResponse] = await Promise.all([
        api.get('/applications'),
        api.get('/dashboard/stats'),
      ])

      setApplications(appsResponse.data)
      setStats(statsResponse.data)
    } catch (err) {
      setError('Failed to load data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusChange(id: number, newStatus: string) {
    try {
      await api.patch(`/applications/${id}`, { status: newStatus })
      fetchData()
    } catch (err) {
      alert('Failed to update status. Please try again.')
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this application?')) return
    try {
      await api.delete(`/applications/${id}`)
      fetchData()
    } catch (err) {
      alert('Failed to delete application. Please try again.')
    }
  }

  function handleLogout() {
    logout()
    navigate('/login')
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  const statCards = [
    { label: 'Total', value: stats?.total ?? 0 },
    { label: 'Applied', value: stats?.by_status['applied'] ?? 0 },
    { label: 'Interview', value: stats?.by_status['interview'] ?? 0 },
    { label: 'Offer', value: stats?.by_status['offer'] ?? 0 },
    { label: 'Rejected', value: stats?.by_status['rejected'] ?? 0 },
  ]

  return (
    <div className="p-6 space-y-6">

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Job Application Tracker</h1>
        <div className="flex items-center gap-3">
          <AddApplicationModal onSuccess={fetchData} />
          <button
            onClick={handleLogout}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {statCards.map((card) => (
          <Card key={card.label}>
            <CardHeader className="pb-1">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Applied Date</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No applications yet. Add your first one!
                </TableCell>
              </TableRow>
            ) : (
              applications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">{app.company}</TableCell>
                  <TableCell>{app.role}</TableCell>
                  <TableCell>
                    <Badge className={statusColours[app.status] ?? 'bg-gray-100 text-gray-800'}>
                      {app.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(app.applied_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {app.notes ?? '—'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        className="border rounded px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="applied">Applied</option>
                        <option value="interview">Interview</option>
                        <option value="offer">Offer</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      <button
                        onClick={() => handleDelete(app.id)}
                        className="text-sm text-destructive hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

    </div>
  )
}

export default Dashboard