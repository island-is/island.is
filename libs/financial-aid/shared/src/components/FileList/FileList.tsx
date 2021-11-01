import React from 'react'
import { Text, Box, UploadFile } from '@island.is/island-ui/core'
import * as styles from './FileList.css'
import cn from 'classnames'
import {
  ApplicationFile,
  getFileSizeInKilo,
  getFileType,
} from '@island.is/financial-aid/shared/lib'

import { gql, useLazyQuery } from '@apollo/client'

export const GetSignedUrlQuery = gql`
  query GetSignedUrlQuery($input: GetSignedUrlForIdInput!) {
    getSignedUrlForId(input: $input) {
      url
      key
    }
  }
`

interface Props {
  className?: string
  files?: UploadFile[] | ApplicationFile[]
}

const FileList = ({ className, files }: Props) => {
  if (files === undefined || files.length === 0) {
    return null
  }

  const [openFile] = useLazyQuery(GetSignedUrlQuery, {
    fetchPolicy: 'no-cache',
    onCompleted: (data: { getSignedUrlForId: { url: string } }) => {
      window.open(data.getSignedUrlForId.url, '_blank')
    },
    onError: (error) => {
      // TODO: What should happen here?
      console.log(error)
    },
  })

  return (
    <Box className={cn({ [`${className}`]: true })} marginBottom={2}>
      <>
        {files.map((item, index) => {
          return (
            <button
              className={cn({
                [styles.filesLink]: true,
                [styles.hoverState]: item.id,
              })}
              key={'file-' + index}
              onClick={() => {
                if (item.id === undefined) {
                  return
                }
                openFile({ variables: { input: { id: item.id } } })
              }}
            >
              <div className={styles.container}>
                <div className={styles.type}>
                  <Text color="dark300" fontWeight="semiBold" variant="small">
                    {getFileType(item.name)}
                  </Text>
                </div>
                <div className={styles.name}>
                  <Text variant="small">{item.name}</Text>
                </div>
                <Text variant="small">{`Skjal • ${getFileSizeInKilo(
                  item,
                )} KB`}</Text>
                {'created' in item && (
                  <Text variant="small"> {`${item.created}`}</Text>
                )}
              </div>
            </button>
          )
        })}
      </>
    </Box>
  )
}

export default FileList
