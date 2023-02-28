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
import { Link, useOutletContext, useParams } from 'react-router-dom'
import MockApplications from '../../lib/MockApplications'
import React, { useEffect, useState } from 'react'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import * as styles from './Applications.css'
import { AuthAdminTenant } from '@island.is/api/schema'

const Applications = () => {
  const { tenant } = useParams()
  const { formatMessage } = useLocale()
  const { setNavTitle } = useOutletContext<{
    setNavTitle: (value: string) => void
  }>()

  const [applications, setApplications] = useState(MockApplications)
  const [inputSearchValue, setInputSearchValue] = useState<string>('')

  useEffect(() => {
    // TODO: Get application by id from backend
    setNavTitle(tenant ? tenant : formatMessage(m.tenants))
  })

  const handleSearch = (value: string) => {
    setInputSearchValue(value)

    // TODO: filter applications by search value once its connected to api
  }

  const getHeader = ({ withCreateButton = true }) => {
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
              <Button size={'small'}>Create Application</Button>
            </Box>
          )}
        </Box>
      </GridRow>
    )
  }

  return applications.length === 0 ? (
    <GridContainer>
      {getHeader({ withCreateButton: false })}
      <GridRow>
        <Filter
          variant={'popover'}
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
        />
      </GridRow>
      <GridRow>
        <Box
          display={'flex'}
          flexDirection={'column'}
          border={'standard'}
          borderRadius={'large'}
          justifyContent={'center'}
          alignItems={'center'}
          padding={10}
        >
          <Text variant={'h3'}>No application created</Text>
          <Text paddingTop={'gutter'}>
            Lorem ipsum dolor sit amet consectetur. A non ut nulla vitae mauris
            accumsan at tellus facilisi.
          </Text>
          <Box marginTop={6}>
            <Button size={'small'}>Create Application</Button>
          </Box>
          <Box marginTop={'gutter'}>
            <Button variant={'text'}>Learn more</Button>
          </Box>
        </Box>
      </GridRow>
    </GridContainer>
  ) : (
    <GridContainer className={styles.relative}>
      {getHeader({})}
      <Box paddingTop={'gutter'}>
        <Stack space={[1, 1, 2, 2]}>
          {applications.map((item) => (
            <GridRow key={item.id}>
              <Link
                className={styles.fill}
                to={`/innskraningarkerfi/${tenant}/forrit/${item.id}/`}
              >
                <Box
                  className={styles.linkContainer}
                  borderRadius={'large'}
                  border={'standard'}
                  width={'full'}
                  paddingX={4}
                  paddingY={3}
                >
                  <GridRow className={styles.fill}>
                    <Box
                      display={'flex'}
                      justifyContent={'spaceBetween'}
                      width={'full'}
                      marginBottom={'gutter'}
                    >
                      <Box
                        display={'flex'}
                        alignItems={'flexStart'}
                        flexDirection={[
                          'column',
                          'column',
                          'row',
                          'row',
                          'row',
                        ]}
                      >
                        {item.tag.map((tag) => {
                          return (
                            <Box key={tag} marginRight={1} marginBottom={1}>
                              <Tag variant="blue" outlined>
                                {tag}
                              </Tag>
                            </Box>
                          )
                        })}
                      </Box>
                      <Box
                        display={'flex'}
                        alignItems={'flexEnd'}
                        flexDirection={[
                          'column',
                          'column',
                          'row',
                          'row',
                          'row',
                        ]}
                      >
                        {item.environmentTags.map((tag) => (
                          <Box key={tag} marginLeft={1} marginBottom={1}>
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
                      display={'flex'}
                      alignItems={'center'}
                      justifyContent={'spaceBetween'}
                      width={'full'}
                    >
                      <Box>
                        <Text variant={'h3'}>{item.name}</Text>
                        <Text variant={'default'}>{item.tenant}</Text>
                      </Box>
                      <Button
                        title={'Breyta'}
                        icon={'pencil'}
                        variant={'utility'}
                        onClick={(e) => {
                          e.preventDefault()
                        }}
                      >
                        <Text variant={'eyebrow'}>
                          {formatMessage(m.change)}
                        </Text>
                      </Button>
                    </Box>
                  </GridRow>
                </Box>
              </Link>
            </GridRow>
          ))}
        </Stack>
      </Box>
    </GridContainer>
  )
}

export default Applications
