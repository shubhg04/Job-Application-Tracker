import { Navigate } from 'react-router-dom'
import { ReactNode } from 'react'
import { useAuth } from '@/context/AuthContext'

type ProtectedRouteProps = {
    children: ReactNode
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { token } = useAuth()

    if (!token) {
        return <Navigate to="/login" replace />
    }

    return <>{children}</>
}

export default ProtectedRoute