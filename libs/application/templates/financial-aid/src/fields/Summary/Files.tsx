import React from 'react'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'

import {
  UploadFileDeprecated,
  Box,
  Icon,
  Text,
} from '@island.is/island-ui/core'
import { encodeFilenames } from '../../lib/utils'
import { CreateSignedUrlMutation } from '../../lib/hooks/useFileUpload'
import * as styles from '../Shared.css'
import SummaryBlock from './SummaryBlock'
import { Routes } from '../../lib/constants'
import { summaryForm } from '../../lib/messages'

interface Props {
  goToScreen?: (id: string) => void
  route: Routes
  personalTaxReturn?: UploadFileDeprecated | null
  taxFiles: UploadFileDeprecated[]
  incomeFiles: UploadFileDeprecated[]
  childrenFiles: UploadFileDeprecated[]
  applicationId: string
}

const Files = ({
  route,
  goToScreen,
  personalTaxReturn,
  taxFiles,
  incomeFiles,
  childrenFiles,
  applicationId,
}: Props) => {
  const { formatMessage } = useIntl()
  const [createSignedUrlMutation] = useMutation(CreateSignedUrlMutation)

  const allFiles = [
    ...incomeFiles,
    ...taxFiles,
    ...childrenFiles,
    ...(personalTaxReturn ? [personalTaxReturn] : []),
  ]

  return (
    <SummaryBlock editAction={() => goToScreen?.(route)}>
      <Text fontWeight="semiBold" marginBottom={1}>
        {formatMessage(summaryForm.formInfo.filesTitle)}
      </Text>
      {allFiles &&
        allFiles.map((file: UploadFileDeprecated, index: number) => {
          if (file) {
            return (
              <a
                onClick={() => {
                  createSignedUrlMutation({
                    variables: {
                      input: {
                        fileName: encodeFilenames(file.name),
                        folder: applicationId,
                      },
                    },
                  }).then((response) => {
                    window.open(
                      response.data?.createMunicipalitiesFinancialAidSignedUrl
                        .url,
                    )
                  })
                }}
                key={`file-` + index}
                target="_blank"
                download
                rel="noreferrer noopener"
                className={styles.filesButtons}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  marginBottom="smallGutter"
                >
                  <Box marginRight={1} display="flex" alignItems="center">
                    <Icon
                      color="blue400"
                      icon="document"
                      size="small"
                      type="outline"
                    />
                  </Box>

                  <Text>{file.name}</Text>
                </Box>
              </a>
            )
          }
        })}
    </SummaryBlock>
  )
}

export default Files
