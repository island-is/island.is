import { FieldBaseProps } from '@island.is/application/types'
import { Box, Button, Text, Link } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import useGeneratePdfUrl from '../../hooks/useGeneratePdfUrl'
import { confirmation } from '../../lib/messages/confirmation'
import { SubmittedApplicationData } from '../../shared'
import { CompanyIllustration } from '../Illustrations/CompanyIllustration'
import * as styles from './ComplaintConfirmation.css'

export const ComplaintConfirmation: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const st = application.externalData
  console.log({ st })
  const submitData = application.externalData
    .sendApplication as SubmittedApplicationData

  const { getPdfUrl } = useGeneratePdfUrl(
    application.id,
    submitData.data?.applicationPdfKey ?? '',
  )

  return (
    <Box marginTop={3}>
      <Text>
        {formatMessage(confirmation.labels.description, {
          link: (
            <Link href={formatMessage(confirmation.labels.link)} newTab>
              <span className={styles.link}>
                {formatMessage(confirmation.labels.linkName)}
              </span>
            </Link>
          ),
        })}
      </Text>
      <Box marginTop={5}>
        <Button
          colorScheme="default"
          icon="open"
          iconType="outline"
          onClick={getPdfUrl}
          preTextIconType="filled"
          size="default"
          type="button"
          variant="ghost"
        >
          {formatMessage(confirmation.labels.pdfLink)}
        </Button>
      </Box>
      <Box marginTop={[3, 5, 12]}>
        <CompanyIllustration />
      </Box>
    </Box>
  )
}
