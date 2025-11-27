import React, { useCallback, useState } from 'react'
import {
  Box,
  Pagination,
  Stack,
  ToastContainer,
} from '@island.is/island-ui/core'
import {
  ApplicationCard as ApplicationCardType,
  InstitutionTypes,
} from '@island.is/application/types'
import { getOrganizationLogoUrl } from '@island.is/shared/utils'
import { Organization } from '@island.is/shared/types'
import { ApplicationCard } from '../ApplicationCard/ApplicationCard'

const pageSize = 5

type ApplicationFields = Pick<
  ApplicationCardType,
  | 'actionCard'
  | 'id'
  | 'typeId'
  | 'status'
  | 'modified'
  | 'name'
  | 'progress'
  | 'org'
>

interface Props {
  applications: ApplicationFields[]
  organizations?: Organization[]
  onClick?: (id: string) => void
  refetch?: (() => void) | undefined
  focus?: boolean
}

const ApplicationList = ({
  organizations,
  applications,
  onClick,
  refetch,
  focus = false,
}: Props) => {
  const [page, setPage] = useState<number>(1)
  const handlePageChange = useCallback((page: number) => setPage(page), [])

  const pagedDocuments = {
    from: (page - 1) * pageSize,
    to: pageSize * page,
    totalPages: Math.ceil(applications.length / pageSize),
  }

  const getLogo = (application: ApplicationFields): string => {
    if (!organizations) {
      return ''
    }
    const institutionSlug = application.org as InstitutionTypes
    const institution = organizations.find((x) => x.slug === institutionSlug)
    return getOrganizationLogoUrl(
      institution?.title ?? 'stafraent-island',
      organizations,
    )
  }

  const onApplicationDelete = () => {
    if ((applications.length - 1) % pageSize === 0 && page > 1) {
      setPage(page - 1)
    }
    if (refetch) {
      refetch()
    }
  }

  return (
    <>
      <Stack space={2}>
        {applications
          .slice(pagedDocuments.from, pagedDocuments.to)
          .map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              focused={focus}
              logo={getLogo(application)}
              onDelete={onApplicationDelete}
              onClick={onClick}
            />
          ))}
      </Stack>
      {applications.length > pageSize ? (
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

export default ApplicationList
