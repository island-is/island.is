import { useCallback, useState } from 'react'
import {
  Box,
  Pagination,
  Stack,
  ToastContainer,
} from '@island.is/island-ui/core'
import { ApplicationCard } from '../ApplicationCard/ApplicationCard'
import { FormSystemApplication } from '@island.is/api/schema'

const pageSize = 5

interface Props {
  applications: FormSystemApplication[]
  onClick?: (id: string) => void
  refetch?: (() => void) | undefined
  focus?: boolean
  onDelete: (id: string) => void
}

export const ApplicationList = ({
  applications,
  refetch,
  onDelete: deleteApplication,
  focus = false,
}: Props) => {
  const [page, setPage] = useState<number>(1)
  const handlePageChange = useCallback((page: number) => setPage(page), [])
  const sortedApplications = [...applications].sort((a, b) => {
    return new Date(b.modified).getTime() - new Date(a.modified).getTime()
  })

  const pagedDocuments = {
    from: (page - 1) * pageSize,
    to: pageSize * page,
    totalPages: Math.ceil(applications.length / pageSize),
  }

  const onApplicationDelete = async (id: string) => {
    if ((applications.length - 1) % pageSize === 0 && page > 1) {
      setPage(page - 1)
    }
    if (id && deleteApplication) {
      deleteApplication(id)
    }
    if (refetch) {
      refetch()
    }
  }

  return (
    <>
      <Stack space={2}>
        {sortedApplications
          .slice(pagedDocuments.from, pagedDocuments.to)
          .map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              focused={focus}
              onDelete={() => onApplicationDelete(application.id)}
            />
          ))}
      </Stack>
      {sortedApplications.length > pageSize ? (
        <Box marginTop={4}>
          <Pagination
            page={page}
            totalPages={pagedDocuments.totalPages}
            renderLink={(page, className, children) => (
              <button
                className={className}
                onClick={() => {
                  handlePageChange(page)
                }}
              >
                {children}
              </button>
            )}
          />
        </Box>
      ) : null}
      <ToastContainer hideProgressBar closeButton useKeyframeStyles={false} />
    </>
  )
}
