import React from 'react'
import { useIntl } from 'react-intl'
import { useLazyQuery, useMutation } from '@apollo/client'
import { gql } from '@apollo/client'

import { Box, Icon, Text } from '@island.is/island-ui/core'
import { ApplicationAnswerFile } from '@island.is/application/types'
import { GET_ATTACHMENT_PRESIGNED_URL } from '@island.is/application/graphql'

import { encodeFilenames } from '../../lib/utils'
import * as styles from '../Shared.css'
import SummaryBlock from './SummaryBlock'
import { Routes } from '../../lib/constants'
import { summaryForm } from '../../lib/messages'

const CreateSignedUrlMutation = gql`
  mutation CreateMunicipalitiesFinancialAidSignedUrlMutation(
    $input: MunicipalitiesFinancialAidSignedUrlInput!
  ) {
    createMunicipalitiesFinancialAidSignedUrl(input: $input) {
      url
    }
  }
`

interface PersonalTaxReturnFile {
  name: string
}

interface Props {
  goToScreen?: (id: string) => void
  route: Routes
  personalTaxReturn?: PersonalTaxReturnFile | null
  taxFiles: ApplicationAnswerFile[]
  incomeFiles: ApplicationAnswerFile[]
  childrenFiles: ApplicationAnswerFile[]
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

  const [getPresignedUrl] = useLazyQuery(GET_ATTACHMENT_PRESIGNED_URL, {
    fetchPolicy: 'no-cache',
  })

  const [createSignedUrlMutation] = useMutation(CreateSignedUrlMutation)

  const handleOpenAttachment = async (file: ApplicationAnswerFile) => {
    const { data } = await getPresignedUrl({
      variables: {
        input: {
          id: applicationId,
          attachmentKey: file.key,
        },
      },
    })
    const url = data?.attachmentPresignedURL?.url
    if (url) {
      window.open(url)
    }
  }

  const handleOpenLegacyFile = (fileName: string) => {
    createSignedUrlMutation({
      variables: {
        input: {
          fileName: encodeFilenames(fileName),
          folder: applicationId,
        },
      },
    }).then((response) => {
      window.open(
        response.data?.createMunicipalitiesFinancialAidSignedUrl?.url,
      )
    })
  }

  const attachmentFiles = [...incomeFiles, ...taxFiles, ...childrenFiles]

  return (
    <SummaryBlock editAction={() => goToScreen?.(route)}>
      <Text fontWeight="semiBold" marginBottom={1}>
        {formatMessage(summaryForm.formInfo.filesTitle)}
      </Text>
      {attachmentFiles.map(
        (file: ApplicationAnswerFile, index: number) =>
          file && (
            <button
              onClick={() => handleOpenAttachment(file)}
              key={`file-${index}`}
              className={styles.filesButtons}
              aria-label={file.name}
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
            </button>
          ),
      )}
      {personalTaxReturn && (
        <button
          onClick={() => handleOpenLegacyFile(personalTaxReturn.name)}
          className={styles.filesButtons}
          aria-label={personalTaxReturn.name}
        >
          <Box display="flex" alignItems="center" marginBottom="smallGutter">
            <Box marginRight={1} display="flex" alignItems="center">
              <Icon
                color="blue400"
                icon="document"
                size="small"
                type="outline"
              />
            </Box>
            <Text>{personalTaxReturn.name}</Text>
          </Box>
        </button>
      )}
    </SummaryBlock>
  )
}

export default Files
