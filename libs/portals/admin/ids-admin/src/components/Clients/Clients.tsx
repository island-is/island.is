import React, { useState } from 'react'
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
import * as styles from './Clients.css'
import { AuthClients } from './Clients.loader'

const Clients = () => {
  const originalClients = useLoaderData() as AuthClients
  const { tenant } = useParams()
  const { formatMessage } = useLocale()
  const navigate = useNavigate()

  const [clients, setClients] = useState<AuthClients>(originalClients)
  const [inputSearchValue, setInputSearchValue] = useState<string>('')

  const handleSearch = (value: string) => {
    setInputSearchValue(value)

    if (value.length > 0) {
      const filteredList = originalClients.filter((client) => {
        return (
          client?.defaultEnvironment.displayName[0].value
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          client.clientId.toLowerCase().includes(value.toLowerCase())
        )
      })

      setClients(filteredList)
    } else {
      setClients(originalClients)
    }
  }

  const openCreateClientModal = () => {
    navigate(
      replaceParams({
        href: IDSAdminPaths.IDSAdminClientCreate,
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
            <Text variant={'h2'}>{formatMessage(m.clients)}</Text>
            <Text variant={'default'}>
              {formatMessage(m.clientsDescription)}
            </Text>
          </Stack>
          {withCreateButton && (
            <Box>
              <Button size={'small'} onClick={openCreateClientModal}>
                {formatMessage(m.createClient)}
              </Button>
            </Box>
          )}
        </Box>
      </GridRow>
    )
  }

  return originalClients.length === 0 ? (
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
            {formatMessage(m.noClientsDescription)}
          </Text>
          <Box marginTop={6}>
            <Button size="small" onClick={openCreateClientModal}>
              {formatMessage(m.createClient)}
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
            <FilterInput
              placeholder={formatMessage(m.searchPlaceholder)}
              name="session-nationalId-input"
              value={inputSearchValue}
              onChange={handleSearch}
              backgroundColor="blue"
            />
          </GridRow>
          {clients.map((item) => (
            <GridRow key={`clients-${item.clientId}`}>
              <Link
                className={styles.fill}
                to={replaceParams({
                  href: IDSAdminPaths.IDSAdminClient,
                  params: {
                    tenant,
                    client: item.clientId,
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
                            {item.clientType}
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
                            key={`clients-${tag}`}
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
                          {item.defaultEnvironment.clientId}
                        </Text>
                      </Box>
                      <Button
                        title={formatMessage(m.change)}
                        icon="pencil"
                        variant="utility"
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

export default Clients
