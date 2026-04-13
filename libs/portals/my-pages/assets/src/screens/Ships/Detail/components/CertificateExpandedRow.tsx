import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  formatDate,
  NestedFullTable,
  useIsMobile,
} from '@island.is/portals/my-pages/core'
import { shipsMessages } from '../../../../lib/messages'

interface Props {
  issueDate?: string | null
  extensionDate?: string | null
}

export const CertificateExpandedRow = ({ issueDate, extensionDate }: Props) => {
  const { formatMessage } = useLocale()
  const { isMobile } = useIsMobile()

  const issueDateFormatted = issueDate ? formatDate(new Date(issueDate)) : '-'
  const extensionDateFormatted = extensionDate
    ? formatDate(new Date(extensionDate))
    : '-'

  const pairs = [
    {
      label: formatMessage(shipsMessages.certificatesIssueDate),
      value: issueDateFormatted,
    },
    {
      label: formatMessage(shipsMessages.certificatesExtendedTo),
      value: extensionDateFormatted,
    },
  ]

  if (isMobile) {
    return (
      <NestedFullTable
        flush
        headerArray={pairs.map((p) => p.label)}
        data={[pairs.map((p) => p.value)]}
      />
    )
  }

  return (
    <Box
      display="flex"
      flexDirection="row"
      paddingX={3}
      paddingY={2}
      background="backgroundBrandMinimal"
      columnGap={2}
    >
      {pairs.map(({ label, value }, index) => (
        <Box
          key={index}
          display="flex"
          justifyContent="spaceAround"
          width="full"
          flexDirection="row"
          paddingY={2}
          paddingX={2}
          alignItems="flexStart"
          background="white"
        >
          <Box width="half">
            <Text variant="small" fontWeight="semiBold">
              {label}
            </Text>
          </Box>
          <Box width="half">
            <Text variant="small">{value}</Text>
          </Box>
        </Box>
      ))}
    </Box>
  )
}
