import {
  GenericLicenseDataField,
  GenericLicenseDataFieldType,
  GenericUserLicenseDataFieldTagColor,
  GenericUserLicenseDataFieldTagType,
  GenericUserLicenseMetaLinksType,
} from '@island.is/api/schema'
import { Box, Divider, Icon, Text, Pagination } from '@island.is/island-ui/core'
import {
  createColumnHelper,
  InfoLine,
  PortalTable,
} from '@island.is/portals/my-pages/core'
import { useMemo, useState } from 'react'
import ExpandableLine from '../ExpandableLine/ExpandableLine'

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
const tableColumnHelper = createColumnHelper<GenericLicenseDataField>()
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
              <PortalTable
                columns={(field.fields?.[0]?.fields ?? []).map(
                  (column, index) =>
                    tableColumnHelper.display({
                      id: `column-${index}`,
                      header: column.label ?? '',
                      cell: ({ row }) =>
                        row.original.fields?.[index]?.value ?? '',
                      enableSorting: false,
                    }),
                )}
                data={
                  field.fields?.slice((page - 1) * pageSize, page * pageSize) ??
                  []
                }
                emptyMessage=""
                mobileTitleKey="column-0"
              />
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
