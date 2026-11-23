import { FC } from 'react'
import { getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, Tag, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { conclusion as m } from '../../lib/messages'
import { MAILBOX_PATH, SUBMIT_RESULT_ID } from '../../utils/constants'
import { formatDate } from '../../utils/formatDate'
import { getSubmitData } from '../../utils/submitResult'

export const CertificateLink: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const { answers, externalData } = application

  const documentId = getSubmitData(externalData)?.documentId
  const href = documentId
    ? `${MAILBOX_PATH}/${encodeURIComponent(documentId)}`
    : MAILBOX_PATH
  const title = formatMessage(m.certificateLink, {
    name:
      getValueViaPath<string>(externalData, 'nationalRegistry.data.fullName') ??
      getValueViaPath<string>(answers, 'applicant.name') ??
      '',
    date: formatDate(
      getValueViaPath<string>(externalData, `${SUBMIT_RESULT_ID}.date`),
    ),
  })

  return (
    <Box
      marginTop={2}
      paddingX={3}
      paddingY={2}
      borderRadius="large"
      background="blue100"
      display="flex"
      alignItems="center"
      justifyContent="spaceBetween"
      columnGap={2}
    >
      <a href={href}>
        <Text variant="h5" as="span" color="blue400">
          {title}
        </Text>
      </a>
      <Tag variant="blue" outlined disabled>
        {formatMessage(m.pdfTag)}
      </Tag>
    </Box>
  )
}
