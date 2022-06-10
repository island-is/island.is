import React, { useCallback, useEffect, useState } from 'react'
import { defineMessage } from 'react-intl'
import {
  ActionCardLoader,
  ServicePortalModuleComponent,
  EmptyState,
} from '@island.is/service-portal/core'
import {
  Text,
  Box,
  Stack,
  GridRow,
  GridColumn,
  Input,
  Select,
  Option,
} from '@island.is/island-ui/core'
import { useApplications } from '@island.is/service-portal/graphql'
import { ApplicationList as List } from '@island.is/application/ui-components'
import { useLocale, useNamespaces } from '@island.is/localization'
import * as Sentry from '@sentry/react'

import { m } from '../../lib/messages'
import { ValueType } from 'react-select'
import { Application, getInstitutionMapper } from '@island.is/application/core'

const isLocalhost = window.location.origin.includes('localhost')
const isDev = window.location.origin.includes('beta.dev01.devland.is')
const isStaging = window.location.origin.includes('beta.staging01.devland.is')

const defaultInstitution = { label: 'Allar stofnanir', value: '' }

type FilterValues = {
  activeInstitution: Option
  searchQuery: string
}

const defaultFilterValues: FilterValues = {
  activeInstitution: defaultInstitution,
  searchQuery: '',
}

const baseUrlForm = isLocalhost
  ? 'http://localhost:4242/umsoknir'
  : isDev
  ? 'https://beta.dev01.devland.is/umsoknir'
  : isStaging
  ? 'https://beta.staging01.devland.is/umsoknir'
  : 'https://island.is/umsoknir'

const ApplicationList: ServicePortalModuleComponent = () => {
  useNamespaces('sp.applications')
  useNamespaces('application.system')

  Sentry.configureScope((scope) => scope.setTransactionName('Applications'))

  const { formatMessage } = useLocale()
  const { data: applications, loading, error, refetch } = useApplications()
  const [filteredApplications, setFilteredApplications] = useState<
    Application[]
  >(applications)
  const [institutions, setInstitutions] = useState<Option[]>([
    defaultInstitution,
  ])
  const [filterValue, setFilterValue] = useState<FilterValues>(
    defaultFilterValues,
  )

  useEffect(() => {
    setApplicationTypes()
    searchApplications()
  }, [filterValue])

  useEffect(() => {
    setApplicationTypes()
    setFilteredApplications(applications)
  }, [applications])

  // Set all types for institutions
  const setApplicationTypes = () => {
    const mapper = getInstitutionMapper(formatMessage)
    const apps: Application[] = applications
    let institutions: Option[] = []
    apps.map((elem, idx) => {
      const inst = mapper[elem.typeId] ?? 'INSTITUTION_MISSING'
      institutions.push({
        value: inst,
        label: inst,
      })
    })
    // Remove duplicates
    institutions = institutions.filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.value === value.value),
    )
    // Sort alphabetically
    institutions.sort((a, b) => a.label.localeCompare(b.label))
    setInstitutions([defaultInstitution, ...institutions])
  }

  // Search applications and add the results into filteredApplications
  const searchApplications = () => {
    const mapper = getInstitutionMapper(formatMessage)
    const searchQuery = filterValue.searchQuery
    const activeInstitution = filterValue.activeInstitution.value
    const filteredApps = applications.filter(
      (application: Application) =>
        // Search in name and description
        (application.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          application.actionCard?.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())) &&
        // Search in active institution, if value is empty then "Allar stofnanir" is selected so it does not filter.
        // otherwise it filters it.
        (activeInstitution !== ''
          ? mapper[application.typeId] === activeInstitution
          : true),
    )
    setFilteredApplications(filteredApps)
  }

  const handleSearchChange = useCallback((value: string) => {
    setFilterValue((oldFilter) => ({
      ...oldFilter,
      searchQuery: value,
    }))
  }, [])

  const handleInstitutionChange = useCallback(
    (newInstitution: ValueType<Option>) => {
      setFilterValue((oldFilter) => ({
        ...oldFilter,
        activeInstitution: newInstitution as Option,
      }))
    },
    [],
  )

  return (
    <>
      <Box marginBottom={5}>
        <GridRow>
          <GridColumn>
            <Stack space={2}>
              <Text variant="h3" as="h1">
                {formatMessage(m.heading)}
              </Text>

              <Text as="p" variant="default">
                {formatMessage(m.introCopy)}
              </Text>
            </Stack>
          </GridColumn>
        </GridRow>
      </Box>

      {loading && <ActionCardLoader repeat={3} />}

      {error && <EmptyState description={m.error} />}

      {!error && !loading && !applications && (
        <EmptyState
          description={defineMessage({
            id: 'sp.applications:no-applications-available',
            defaultMessage:
              'Engar umsóknir fundust hjá Ísland.is á þessari kennitölu',
          })}
        />
      )}

      {applications && (
        <>
          <Box paddingBottom={[3, 5]}>
            <GridRow alignItems="flexEnd">
              <GridColumn span={['1/1', '1/2']}>
                <Box height="full">
                  <Input
                    icon="search"
                    backgroundColor="blue"
                    size="xs"
                    value={filterValue.searchQuery}
                    onChange={(ev) => handleSearchChange(ev.target.value)}
                    name="umsoknir-leit"
                    label={formatMessage(m.searchLabel)}
                    placeholder={formatMessage(m.searchPlaceholder)}
                  />
                </Box>
              </GridColumn>
              <GridColumn paddingTop={[2, 0]} span={['1/1', '1/2']}>
                <Box height="full">
                  <Select
                    name="institutions"
                    backgroundColor="blue"
                    size="xs"
                    defaultValue={institutions[0]}
                    options={institutions}
                    value={filterValue.activeInstitution}
                    onChange={handleInstitutionChange}
                    label={formatMessage(m.searchInstitutiontLabel)}
                  />
                </Box>
              </GridColumn>
            </GridRow>
          </Box>
          <List
            applications={filteredApplications}
            onClick={(applicationUrl) =>
              window.open(`${baseUrlForm}/${applicationUrl}`)
            }
            refetch={refetch}
          />
        </>
      )}
    </>
  )
}

export default ApplicationList
