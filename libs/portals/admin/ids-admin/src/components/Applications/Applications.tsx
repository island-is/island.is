import React, { useEffect, useState } from 'react'
import {
  Link,
  useNavigate,
  useParams,
  useLoaderData,
  Outlet,
} from 'react-router-dom'
import {
  Box,
  Button,
  Filter,
  FilterInput,
  GridContainer,
  GridRow,
  Stack,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { replaceParams } from '@island.is/react-spa/shared'
import { IDSAdminPaths } from '../../lib/paths'
import * as styles from './Applications.css'
import { AuthApplicationsList } from './Applications.loader'
import { useTenant } from '../../screens/Tenant/Tenant'

const Applications = () => {
  const originalApplications = useLoaderData() as AuthApplicationsList
  const { tenant } = useParams()
  const { formatMessage } = useLocale()
  const { setNavTitle } = useTenant()
  const navigate = useNavigate()

  const [applications, setApplications] = useState<AuthApplicationsList>(
    originalApplications,
  )
  const [inputSearchValue, setInputSearchValue] = useState<string>('')

  useEffect(() => {
    setNavTitle(tenant ? tenant : formatMessage(m.tenants))
  })

  const handleSearch = (value: string) => {
    setInputSearchValue(value)

    if (value.length > 0) {
      const filteredList = applications.filter((application: any) => {
        return (
          application?.defaultEnvironment.displayName[0].value
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          application.applicationId.toLowerCase().includes(value.toLowerCase())
        )
      })

      setApplications(filteredList)
    } else {
      setApplications(originalApplications)
    }
  }

  const openCreateApplicationModal = () => {
    navigate(
      replaceParams({
        href: IDSAdminPaths.IDSAdminApplicationCreate,
        params: { tenant },
      }),
    )
  }

  const getHeader = (withCreateButton = true) => {
    return (
      <GridRow rowGap={3} marginBottom={'containerGutter'}>
        <Box
          width={'full'}
          display={'flex'}
          justifyContent={'spaceBetween'}
          columnGap={'gutter'}
          alignItems={'center'}
        >
          <Stack space={2}>
            <Text variant={'h2'}>{formatMessage(m.applications)}</Text>
            <Text variant={'default'}>
              {formatMessage(m.applicationsDescription)}
            </Text>
          </Stack>
          {withCreateButton && (
            <Box>
              <Button size={'small'} onClick={openCreateApplicationModal}>
                {formatMessage(m.createApplication)}
              </Button>
            </Box>
          )}
        </Box>
      </GridRow>
    )
  }

  return applications.length === 0 ? (
    <GridContainer>
      {getHeader(false)}
      <GridRow>
        <Box
          width="full"
          display="flex"
          flexDirection="column"
          border="standard"
          borderRadius="large"
          justifyContent="center"
          alignItems="center"
          padding={10}
        >
          <Text variant="h3">{formatMessage(m.noApplications)}</Text>
          <Text paddingTop="gutter">
            {formatMessage(m.noApplicationsDescription)}
          </Text>
          <Box marginTop={6}>
            <Button size="small" onClick={openCreateApplicationModal}>
              {formatMessage(m.createApplication)}
            </Button>
          </Box>
          <Box marginTop="gutter">
            <Button variant={'text'}>{formatMessage(m.learnMore)}</Button>
          </Box>
        </Box>
      </GridRow>
      <Outlet />
    </GridContainer>
  ) : (
    <GridContainer className={styles.relative}>
      {getHeader()}
      <Box paddingTop="gutter">
        <Stack space={[1, 1, 2, 2]}>
          <GridRow>
            <Filter
              variant="popover"
              align="left"
              reverse
              labelClear={formatMessage(m.clearFilter)}
              labelClearAll={formatMessage(m.clearAllFilters)}
              labelOpen={formatMessage(m.openFilter)}
              labelClose={formatMessage(m.closeFilter)}
              resultCount={0}
              filterInput={
                <FilterInput
                  placeholder={formatMessage(m.searchPlaceholder)}
                  name="session-nationalId-input"
                  value={inputSearchValue}
                  onChange={handleSearch}
                  backgroundColor="blue"
                />
              }
              onFilterClear={() => {
                setInputSearchValue('')
              }}
            ></Filter>
          </GridRow>
          {applications.map((item) => (
            <GridRow key={`applications-${item.applicationId}`}>
              <Link
                className={styles.fill}
                to={replaceParams({
                  href: IDSAdminPaths.IDSAdminApplication,
                  params: {
                    tenant,
                    application: item.applicationId,
                  },
                })}
              >
                <Box
                  className={styles.linkContainer}
                  borderRadius="large"
                  border="standard"
                  width="full"
                  paddingX={4}
                  paddingY={3}
                >
                  <GridRow className={styles.fill}>
                    <Box
                      display="flex"
                      justifyContent="spaceBetween"
                      width="full"
                      marginBottom="gutter"
                    >
                      <Box
                        display="flex"
                        alignItems="flexStart"
                        flexDirection={[
                          'column',
                          'column',
                          'row',
                          'row',
                          'row',
                        ]}
                      >
                        <Box marginRight={1} marginBottom={1}>
                          <Tag variant="blue" outlined>
                            {item.applicationType}
                          </Tag>
                        </Box>
                      </Box>
                      <Box
                        display="flex"
                        alignItems="flexEnd"
                        flexDirection={[
                          'column',
                          'column',
                          'row',
                          'row',
                          'row',
                        ]}
                      >
                        {item.availableEnvironments.map((tag) => (
                          <Box
                            key={`applications-${tag}`}
                            marginLeft={1}
                            marginBottom={1}
                          >
                            <Tag variant="purple" outlined>
                              {tag}
                            </Tag>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </GridRow>
                  <GridRow className={styles.fill}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="spaceBetween"
                      width="full"
                    >
                      <Box>
                        <Text variant="h3">
                          {item.defaultEnvironment.displayName[0].value}
                        </Text>
                        <Text variant="default">
                          {item.defaultEnvironment.name}
                        </Text>
                      </Box>
                      <Button
                        title={formatMessage(m.change)}
                        icon="pencil"
                        variant="utility"
                        onClick={(e) => {
                          e.preventDefault()
                        }}
                      >
                        <Text variant="eyebrow">{formatMessage(m.change)}</Text>
                      </Button>
                    </Box>
                  </GridRow>
                </Box>
              </Link>
            </GridRow>
          ))}
        </Stack>
      </Box>
      <Outlet />
    </GridContainer>
  )
}

export default Applications
