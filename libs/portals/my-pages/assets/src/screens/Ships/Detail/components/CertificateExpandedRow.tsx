import { useLocale } from '@island.is/localization'
import { formatDate, NestedFullTable } from '@island.is/portals/my-pages/core'
import { shipsMessages } from '../../../../lib/messages'

interface Props {
  issueDate?: string | null
  extensionDate?: string | null
}

export const CertificateExpandedRow = ({ issueDate, extensionDate }: Props) => {
  const { formatMessage } = useLocale()

  return (
    <NestedFullTable
      headerArray={[
        formatMessage(shipsMessages.certificatesIssueDate),
        formatMessage(shipsMessages.certificatesExtendedTo),
      ]}
      data={[
        [
          issueDate ? formatDate(new Date(issueDate)) : '-',
          extensionDate ? formatDate(new Date(extensionDate)) : '-',
        ],
      ]}
    />
  )
}
