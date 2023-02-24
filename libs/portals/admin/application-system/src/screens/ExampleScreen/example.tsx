import React, { useState } from 'react'
import { SubmitHandler } from 'react-hook-form'
import {
  Box,
  SkeletonLoader,
  Text,
  Breadcrumbs,
} from '@island.is/island-ui/core'
import { useGetApplicationsQuery } from '../../queries/overview.generated'
import { Table as T } from '@island.is/island-ui/core'
import { Filters } from '../../components/Filters/Filters'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { ApplicationsTable } from '../../components/ApplicationsTable/ApplicationsTable'

const TODAY = new Date()

export type ApplicationFilters = {
  nationalId?: string
  period: {
    from?: Date
    to?: Date
  }
  institution?: string
}

const defaultFilters = {
  nationalId: '',
  institution: '',
  period: {
    from: new Date(TODAY.getFullYear(), TODAY.getMonth(), 1, 0, 0, 0, 0),
    to: new Date(
      TODAY.getFullYear(),
      TODAY.getMonth(),
      TODAY.getDate(),
      23,
      59,
      59,
      999,
    ),
  },
}

const Overview = () => {
  const { formatMessage } = useLocale()
  const [filters, setFilters] = useState<ApplicationFilters>(defaultFilters)

  const { data, loading: queryLoading, refetch } = useGetApplicationsQuery({
    ssr: false,
    fetchPolicy: 'network-only',
    variables: {
      input: {
        nationalId: filters.nationalId || '',
      },
    },
  })

  const { applicationApplicationsAdmin: applicationAdminList = [] } = data ?? {}

  const applyFilters: SubmitHandler<ApplicationFilters> = (
    data: ApplicationFilters,
  ) => {
    setFilters(data)
    refetch()
  }

  const clearFilters = () => {
    setFilters(defaultFilters)
  }

  return (
    <Box>
      <Breadcrumbs
        items={[
          { title: 'Ísland.is', href: '/stjornbord' },
          { title: formatMessage(m.applicationSystem) },
        ]}
      />
      <Text variant="h3" marginBottom={[3, 3, 6]} marginTop={3}>
        {formatMessage(m.applicationSystemApplications)}
      </Text>
      <Filters
        onFilterChange={applyFilters}
        onFilterClear={clearFilters}
        numberOfDocuments={applicationAdminList?.length}
      />
      {queryLoading ? (
        <SkeletonLoader height={500} />
      ) : (
        <ApplicationsTable applications={applicationAdminList ?? []} />
      )}
    </Box>
  )
}

export default Overview
