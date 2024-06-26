import {
  GenericLicenseDataField,
  GenericLicenseType,
  GenericUserLicenseDataFieldTagColor,
  GenericUserLicenseDataFieldTagType,
  GenericUserLicenseMetaLinksType,
  GenericUserLicensePkPassStatus,
} from '@island.is/api/schema'
import {
  Box,
  Divider,
  Icon,
  Inline,
  Pagination,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Problem } from '@island.is/react-spa/shared'
import {
  CardLoader,
  IntroHeader,
  LinkButton,
  UserInfoLine,
  m as coreMessages,
} from '@island.is/service-portal/core'
import { useUserProfile } from '@island.is/service-portal/graphql'
import { isDefined } from '@island.is/shared/utils'
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getTypeFromPath, isLicenseTypePath } from '../../utils/mapPaths'
import ExpandableLine from './ExpandableLine'
import { useGenericLicenseLazyQuery } from './LicenseDetailV2.generated'
import { PkPass } from '../../components/QRCodeModal/PkPass'

const getTagColor = (
  color: GenericUserLicenseDataFieldTagColor,
): 'red600' | 'yellow600' | 'mint600' | undefined => {
  switch (color) {
    case 'red':
      return 'red600'
    case 'yellow':
      return 'yellow600'
    case 'green':
      return 'mint600'
    default:
      return
  }
}

const DataFields = ({
  fields,
  licenseType,
}: {
  fields: GenericLicenseDataField[]
  licenseType?: string
}) => {
  const [page, setPage] = useState(1)
  const pageSize = 15

  if (!fields || fields.length === 0) {
    return null
  }

  return (
    <>
      {fields.map((field, i) => {
        if (field.hideFromServicePortal) return undefined
        return (
          <Box key={`data-field-${i}`}>
            {field.type === 'Value' && (
              <>
                <UserInfoLine
                  title={field.name ?? ''}
                  label={field.label ?? ''}
                  editLink={
                    field.link
                      ? {
                          url: field.link.value ?? '',
                          title: field.link.label ?? undefined,
                        }
                      : undefined
                  }
                  renderContent={
                    field.value
                      ? () => (
                          <Box display="flex" alignItems="center">
                            <Text>{field.value}</Text>
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
                                {field.tag?.icon && field.tag?.iconColor && (
                                  <Icon
                                    icon={
                                      field.tag.icon ===
                                      GenericUserLicenseDataFieldTagType.closeCircle
                                        ? 'closeCircle'
                                        : 'checkmarkCircle'
                                    }
                                    color={getTagColor(field.tag.iconColor)}
                                    type="filled"
                                  />
                                )}
                              </Box>
                              {field.tag?.text && (
                                <Text variant="eyebrow">
                                  {field.tag.iconText}
                                </Text>
                              )}
                            </Box>
                          </Box>
                        )
                      : undefined
                  }
                  paddingY={3}
                />
                <Divider />
              </>
            )}
            {field.type === 'Category' && (
              <ExpandableLine
                title={
                  field.value
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
          </Box>
        )
      })}
    </>
  )
}

type UseParams = {
  type: string | undefined
  provider: string
  id: string
}

const LicenseDetail = () => {
  useNamespaces('sp.license')
  const { formatMessage } = useLocale()
  const { data: userProfile } = useUserProfile()
  const locale = userProfile?.locale ?? 'is'
  const { type, id } = useParams() as UseParams

  const [genericLicenseQuery, { data, loading, error }] =
    useGenericLicenseLazyQuery()

  const licenseType: GenericLicenseType | undefined = useMemo(() => {
    if (type && isLicenseTypePath(type)) {
      return getTypeFromPath(type)
    }
    return
  }, [type])

  useEffect(() => {
    if (licenseType) {
      genericLicenseQuery({
        variables: {
          locale,
          input: {
            licenseId: id,
            licenseType,
          },
        },
      })
    }
  }, [genericLicenseQuery, id, locale, licenseType])

  const { genericLicense = null } = data ?? {}

  return (
    <>
      <IntroHeader
        title={
          data?.genericLicense?.payload?.metadata?.title ??
          formatMessage(coreMessages.licenseNavTitle)
        }
        introComponent={
          data?.genericLicense?.payload?.metadata?.description &&
          data?.genericLicense?.payload?.metadata?.description
            .map((message, index) => {
              if (!message.linkInText) {
                return (
                  <>
                    {message.text}
                    <br />
                  </>
                )
              }
              if (message.linkInText && message.linkIconType) {
                return (
                  <LinkButton
                    key={`intro-header-button-${index}`}
                    variant="text"
                    to={message.linkInText}
                    text={message.text}
                  />
                )
              }
              return null
            })
            .filter(isDefined)
        }
        marginBottom={4}
      >
        {genericLicense?.payload?.metadata?.links ? (
          <Box paddingTop={3}>
            <Inline space={1}>
              {!genericLicense.payload.metadata.expired &&
                genericLicense.license.pkpassStatus ===
                  GenericUserLicensePkPassStatus.Available &&
                licenseType && <PkPass licenseType={licenseType} />}
              {genericLicense.payload.metadata.links
                .map((link, index) => {
                  if (link.label && link.value && link.type) {
                    return (
                      <LinkButton
                        variant="button"
                        key={`${type}-license-button-${index}`}
                        to={link.value}
                        text={link.label}
                        icon={
                          link.type === GenericUserLicenseMetaLinksType.Download
                            ? 'download'
                            : 'open'
                        }
                      />
                    )
                  }
                  return null
                })
                .filter(isDefined)}
            </Inline>
          </Box>
        ) : undefined}
      </IntroHeader>
      {error && !loading && <Problem error={error} noBorder={false} />}{' '}
      {!error && !loading && !data?.genericLicense && (
        <Problem
          type="no_data"
          title={formatMessage(coreMessages.noDataFound)}
          message={formatMessage(coreMessages.noDataFoundDetail)}
          imgSrc="./assets/images/coffee.svg"
          titleSize="h3"
          noBorder={false}
        />
      )}
      {!error && loading && <CardLoader />}
      <DataFields
        fields={genericLicense?.payload?.data ?? []}
        licenseType={licenseType}
      />
    </>
  )
}

export default LicenseDetail
