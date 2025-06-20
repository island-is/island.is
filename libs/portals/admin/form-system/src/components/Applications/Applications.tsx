import { useContext } from 'react'
import { FormsContext } from '../../context/FormsContext'
import { ApplicationsHeader } from './components/ApplicationsHeader/ApplicationsHeader'
import { ApplicationsTableRow } from './components/ApplicationsTableRow'

export const Applications = () => {
  const { applications } = useContext(FormsContext)

  return (
    <>
      <ApplicationsHeader />
      {applications?.map((application) => (
        <ApplicationsTableRow
          key={application.id}
          submittedAt={application.submittedAt}
          status={application.status}
        />
      ))}
    </>
  )
}
