import {
  GenericLicenseDataField,
  GenericLicenseDataFieldType,
  GenericUserLicenseDataFieldTagColor,
  GenericUserLicenseDataFieldTagType,
  GenericUserLicenseMetaLinksType,
} from '@island.is/api/schema'
import {
  Box,
  Divider,
  Icon,
  Text,
  Table as T,
  Pagination,
} from '@island.is/island-ui/core'
import { InfoLine, UserInfoLine } from '@island.is/portals/my-pages/core'
import { useMemo, useState } from 'react'
import ExpandableLine from '../ExpandableLine/ExpandableLine'
import copyToClipboard from 'copy-to-clipboard'

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
export const LicenseDataFields = ({
  fields,
  licenseType,
}: {
  fields: GenericLicenseDataField[]
  licenseType?: string
}) => {
  const [page, setPage] = useState(1)
  const pageSize = 15

  const mappedFields = useMemo(() => {
    return fields.map((field, i) => {
      if (field.hideFromServicePortal) return undefined

      return (
        <Box key={`data-field-${i}`}>
          {field.type === GenericLicenseDataFieldType.Value && (
            <>
              <InfoLine
                label={field.label ?? ''}
                button={
                  field.link?.type ===
                    GenericUserLicenseMetaLinksType.External &&
                  field.link?.value
                    ? {
                        type: 'link',
                        icon: 'link',
                        label: field.link.label ?? undefined,
                        to: field.link.value,
                      }
                    : field.link?.type ===
                        GenericUserLicenseMetaLinksType.Download &&
                      field.link.value
                    ? {
                        type: 'link',
                        icon: 'download',
                        label: field.link.label ?? undefined,
                        to: field.link.value,
                      }
                    : /*: field.link?.type ===
                        GenericUserLicenseMetaLinksType.Copy &&
                      field.link?.value
                    ? {
                        type: 'action',
                        icon: 'copy',
                        label: field.link.label ?? undefined,
                        action: () => copyToClipboard(field.link?.value ?? ''),
                        variant: 'utility',
                      } */
                      undefined
                }
                renderContent={
                  field.value
                    ? () => (
                        <Box display="flex" alignItems="center">
                          <Text whiteSpace="preLine">{field.value}</Text>
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
          {field.type === GenericLicenseDataFieldType.Category && (
            <ExpandableLine
              title={field.name ?? ''}
              data={field.fields ?? []}
              description={field.label ?? undefined}
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

              <LicenseDataFields
                fields={field.fields ?? []}
                licenseType={licenseType}
              />
            </>
          )}
          {field.type === GenericLicenseDataFieldType.Table && (
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
    })
  }, [fields, licenseType, page])

  return mappedFields
}
