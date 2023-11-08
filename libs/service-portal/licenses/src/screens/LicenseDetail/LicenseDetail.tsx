import React, { useState } from 'react'
import { useUserProfile } from '@island.is/service-portal/graphql'

import { useLocale, useNamespaces } from '@island.is/localization'
import {
  Box,
  Divider,
  GridColumn,
  GridRow,
  Stack,
  Text,
  Button,
  Icon,
  Table as T,
  Pagination,
} from '@island.is/island-ui/core'
import {
  UserInfoLine,
  CardLoader,
  ErrorScreen,
  m as coreMessages,
} from '@island.is/service-portal/core'
import ExpandableLine from './ExpandableLine'
import { m } from '../../lib/messages'
import { gql, useQuery } from '@apollo/client'
import { useLocation, useParams } from 'react-router-dom'
import format from 'date-fns/format'
import { dateFormat } from '@island.is/shared/constants'
import { GenericLicenseDataField, Query } from '@island.is/api/schema'
import { PkPass } from '../../components/QRCodeModal/PkPass'
import {
  getLicenseDetailHeading,
  getTypeFromPath,
} from '../../utils/dataMapper'
import { isExpired } from '../../utils/dateUtils'
import isValid from 'date-fns/isValid'

const dataFragment = gql`
  fragment genericLicenseDataFieldFragment on GenericLicenseDataField {
    type
    name
    label
    value
    link {
      __typename
      label
      value
    }
    hideFromServicePortal
    fields {
      type
      name
      label
      value
      description
      hideFromServicePortal
      fields {
        type
        name
        label
        value
        description
        hideFromServicePortal
      }
    }
  }
`
const GenericLicenseQuery = gql`
  query GenericLicenseDetailQuery(
    $input: GetGenericLicenseInput!
    $locale: String
  ) {
    genericLicense(input: $input, locale: $locale) {
      nationalId
      license {
        type
        provider {
          id
        }
        pkpass
        pkpassStatus
        timeout
        status
      }
      fetch {
        status
        updated
      }
      payload {
        data {
          ...genericLicenseDataFieldFragment
        }
        rawData
        metadata {
          licenseNumber
          expired
          links {
            label
            value
          }
        }
      }
    }
  }
  ${dataFragment}
`

const checkLicenseExpired = (date?: string) => {
  if (!date) return false

  return isExpired(new Date(), new Date(date))
}

const DataFields = ({
  fields,
  licenseType,
}: {
  fields: GenericLicenseDataField[]
  licenseType?: string
}) => {
  const { formatMessage } = useLocale()
  const [page, setPage] = useState(1)
  const pageSize = 15

  if (!fields || fields.length === 0) {
    return null
  }

  const isJSONDate = (str: string) =>
    str && !!str.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)

  return (
    <>
      {fields.map((field, i) => {
        if (field.hideFromServicePortal) return undefined
        return (
          <React.Fragment key={i}>
            {field.type === 'Value' && (
              <>
                <UserInfoLine
                  title={field.name ?? ''}
                  label={field.label ?? ''}
                  editLink={
                    field.link
                      ? {
                          url: field.link.value,
                          title: field.link.label ?? undefined,
                        }
                      : undefined
                  }
                  renderContent={
                    field.value &&
                    (field.label?.toLowerCase().includes('gildir til') ||
                      field.label?.toLowerCase().includes('gildistími') ||
                      field.label?.toLowerCase().includes('valid to')) &&
                    isValid(new Date(field.value))
                      ? () => (
                          <Box display="flex" alignItems="center">
                            <Text>
                              {field.value && isJSONDate(field.value)
                                ? format(
                                    +new Date(field.value).getTime(),
                                    dateFormat.is,
                                  )
                                : field.value}
                            </Text>
                            <Box
                              marginLeft={2}
                              display="flex"
                              flexDirection="row"
                              alignItems="center"
                              textAlign="center"
                            >
                              <Box
                                marginRight={1}
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                textAlign="center"
                              >
                                <Icon
                                  icon={
                                    checkLicenseExpired(
                                      field.value ?? undefined,
                                    )
                                      ? 'closeCircle'
                                      : 'checkmarkCircle'
                                  }
                                  color={
                                    checkLicenseExpired(
                                      field.value ?? undefined,
                                    )
                                      ? 'red600'
                                      : 'mint600'
                                  }
                                  type="filled"
                                />
                              </Box>
                              <Text variant="eyebrow">
                                {checkLicenseExpired(field.value ?? undefined)
                                  ? formatMessage(m.isExpired)
                                  : formatMessage(m.isValid)}
                              </Text>
                            </Box>
                          </Box>
                        )
                      : undefined
                  }
                  content={String(field.value ?? '')
                    .split(' ')
                    .map((part) =>
                      isJSONDate(part)
                        ? format(+new Date(part).getTime(), dateFormat.is)
                        : part,
                    )
                    .join(' ')}
                  paddingY={3}
                />
                <Divider />
              </>
            )}
            {field.type === 'Category' && (
              <ExpandableLine
                title={
                  field.description
                    ? field.name ?? ''
                    : [field.name, field.label].filter(Boolean).join(' ')
                }
                data={field.fields ?? []}
                description={field.description ?? undefined}
                type={licenseType}
              />
            )}
            {field.type === 'Group' && (
              <>
                <Text
                  variant="eyebrow"
                  color="purple400"
                  paddingBottom={2}
                  paddingTop={7}
                >
                  {field.label}
                </Text>

                <DataFields
                  fields={field.fields ?? []}
                  licenseType={licenseType}
                />
              </>
            )}
            {field.type === 'Table' && (
              <>
                <Text
                  variant="eyebrow"
                  color="purple400"
                  paddingBottom={2}
                  paddingTop={7}
                >
                  {field.label}
                </Text>
                <T.Table>
                  <T.Head>
                    <T.Row>
                      {/* Double mapping needed to get to nested header and values */}
                      {field.fields?.map((x, xIndex) => {
                        return x?.fields?.map((y, yIndex) => {
                          return (
                            xIndex === 0 && (
                              <T.HeadData
                                key={`license-table-head-item-${xIndex}-${yIndex}`}
                              >
                                {y.label}
                              </T.HeadData>
                            )
                          )
                        })
                      })}
                    </T.Row>
                  </T.Head>
                  <T.Body>
                    {field.fields
                      ?.slice((page - 1) * pageSize, page * pageSize)
                      .map((x, xIndex) => {
                        return (
                          <T.Row key={`license-table-item-row-${xIndex}`}>
                            {x.fields?.map((y, yIndex) => {
                              return (
                                <T.Data
                                  key={`license-table-item-${xIndex}-${yIndex}`}
                                >
                                  {y.value}
                                </T.Data>
                              )
                            })}
                          </T.Row>
                        )
                      })}
                  </T.Body>
                </T.Table>
                {field.fields && field.fields.length > pageSize && (
                  <Box marginY={3}>
                    <Pagination
                      totalItems={field.fields.length}
                      itemsPerPage={pageSize}
                      page={page}
                      renderLink={(page, className, children) => (
                        <Box
                          cursor="pointer"
                          className={className}
                          onClick={() => setPage(page)}
                          component="button"
                        >
                          {children}
                        </Box>
                      )}
                    />
                  </Box>
                )}
              </>
            )}
          </React.Fragment>
        )
      })}
    </>
  )
}

type UseParams = {
  type: string | undefined
  provider: string
}

const LicenseDetail = () => {
  useNamespaces('sp.license')
  const { formatMessage } = useLocale()
  const { data: userProfile } = useUserProfile()
  const { pathname } = useLocation()
  const locale = userProfile?.locale ?? 'is'
  const { type } = useParams() as UseParams
  const licenseType = type ? getTypeFromPath(type) : undefined

  const {
    data,
    loading: queryLoading,
    error,
  } = useQuery<Query>(GenericLicenseQuery, {
    variables: {
      locale,
      input: {
        licenseType: licenseType,
      },
    },
  })

  const { genericLicense = null } = data ?? {}

  const heading = getLicenseDetailHeading(licenseType ?? '')

  if (error && !queryLoading) {
    return (
      <ErrorScreen
        figure="./assets/images/hourglass.svg"
        tagVariant="red"
        tag={formatMessage(coreMessages.errorTitle)}
        title={formatMessage(coreMessages.somethingWrong)}
        children={formatMessage(coreMessages.errorFetchModule, {
          module: formatMessage(coreMessages.licenses).toLowerCase(),
        })}
      />
    )
  }

  const expired = genericLicense?.payload?.metadata.expired
  return (
    <>
      <Box marginBottom={5}>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '6/8', '6/8']}>
            <Stack space={1}>
              <Text variant="h3" as="h1" paddingTop={0}>
                {formatMessage(heading.title)}
              </Text>
              <Text as="p" variant="default">
                {formatMessage(heading.text)}
              </Text>
            </Stack>
          </GridColumn>
        </GridRow>
      </Box>
      {queryLoading && <CardLoader />}

      {!error && !queryLoading && (
        <>
          <Box
            display="flex"
            flexDirection={['column', 'row']}
            alignItems={['flexStart', 'center']}
            marginBottom={2}
          >
            {!expired &&
              genericLicense?.license.pkpass &&
              genericLicense?.license.pkpassStatus === 'Available' &&
              licenseType && (
                <>
                  <PkPass licenseType={licenseType} />
                  <Box marginX={[0, 1]} marginY={[1, 0]} />
                </>
              )}
            {genericLicense?.payload?.metadata?.links?.map((link, index) => {
              return (
                <a
                  href={link.value}
                  target="_blank"
                  rel="noreferrer"
                  key={licenseType + '_link_' + index}
                >
                  <Button
                    variant="utility"
                    size="small"
                    icon="open"
                    iconType="outline"
                  >
                    {link.label}
                  </Button>
                </a>
              )
            })}
          </Box>

          <DataFields
            fields={genericLicense?.payload?.data ?? []}
            licenseType={licenseType}
          />
        </>
      )}
    </>
  )
}

export default LicenseDetail
