import { Navigate, useParams } from 'react-router-dom'

export const RedirectWithId = ({ to }: { to: string }) => {
  const { id = '' } = useParams()
  return <Navigate to={to.replace(':id', encodeURIComponent(id))} replace />
}
