import { Text, Pagination, Box } from '@island.is/island-ui/core'
import { ApplicationList as List } from '@island.is/application/ui-components'
import { ApplicationCard } from '@island.is/application/types'
import { FC, useCallback, useState } from 'react'

const pageSize = 3

interface Props {
  applications: ApplicationCard[]
  label: string
  organizations: any[]
  refetch: () => void
  focus?: boolean
}

export const ApplicationGroup: FC<React.PropsWithChildren<Props>> = ({
  applications,
  label,
  organizations,
  refetch,
  focus = false,
}) => {
  const [page, setPage] = useState<number>(1)
  const handlePageChange = useCallback((page: number) => setPage(page), [])
  const pagedDocuments = {
    from: (page - 1) * pageSize,
    to: pageSize * page,
    totalPages: Math.ceil(applications.length / pageSize),
  }

  return (
    <Box>
      <Text paddingTop={4} paddingBottom={3} variant="eyebrow">
        {label}
      </Text>
      <List
        organizations={organizations}
        applications={applications.slice(
          pagedDocuments.from,
          pagedDocuments.to,
        )}
        refetch={refetch}
        focus={focus}
      />
      {applications.length > pageSize && (
        <Box marginX={[0, 4]} marginTop={[1, 4]}>
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
      )}
    </Box>
  )
}
