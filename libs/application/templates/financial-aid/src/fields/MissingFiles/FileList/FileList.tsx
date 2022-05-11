import React from 'react'
import { useIntl } from 'react-intl'
import cn from 'classnames'
import { gql, useLazyQuery } from '@apollo/client'

import { Text, Box, UploadFile } from '@island.is/island-ui/core'

import {
  getFileSizeInKilo,
  getFileType,
} from '@island.is/financial-aid/shared/lib'
import * as styles from './FileList.css'
import { missingFiles } from '../../../lib/messages'

export const GetSignedUrlQuery = gql`
  query GetSignedUrlQuery($input: GetSignedUrlForIdInput!) {
    getSignedUrlForId(input: $input) {
      url
      key
    }
  }
`

interface Props {
  files?: UploadFile[]
}

const FileList = ({ files }: Props) => {
  if (files === undefined || files.length === 0) {
    return null
  }

  const { formatMessage } = useIntl()

  const [openFile] = useLazyQuery(GetSignedUrlQuery, {
    fetchPolicy: 'no-cache',
    onCompleted: (data: { getSignedUrlForId: { url: string } }) => {
      window.open(data.getSignedUrlForId.url, '_blank')
    },
  })

  return (
    <Box marginBottom={2}>
      {files.map((file, i) => {
        return (
          <button
            className={cn({
              [`${styles.filesLink}`]: true,
              [styles.hoverState]: file.id,
            })}
            key={'file-' + i}
            onClick={() => {
              if (file.id === undefined) {
                return
              }
              openFile({ variables: { input: { id: file.id } } })
            }}
          >
            <div className={styles.container}>
              <div className={styles.type}>
                <Text color="dark300" fontWeight="semiBold" variant="small">
                  {getFileType(file.name)}
                </Text>
              </div>
              <div className={styles.name}>
                <Text variant="small">{file.name}</Text>
              </div>
              <Text variant="small">{`${formatMessage(
                missingFiles.confirmation.file,
              )} • ${getFileSizeInKilo(file)} KB`}</Text>
            </div>
          </button>
        )
      })}
    </Box>
  )
}

export default FileList
