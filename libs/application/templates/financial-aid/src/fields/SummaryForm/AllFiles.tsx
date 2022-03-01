import React from 'react'
import { UploadFile, Box, Icon, Text } from '@island.is/island-ui/core'

import { useMutation } from '@apollo/client'
import { CreateSignedUrlMutation } from '../../lib/useFileUpload'
import { encodeFilename } from '@island.is/financial-aid/shared/lib'

interface Props {
  taxFiles?: UploadFile[]
  incomeFiles?: UploadFile[]
  applicationId: string
}

const AllFiles = ({ taxFiles, incomeFiles, applicationId }: Props) => {
  const allFiles = taxFiles?.concat(incomeFiles ?? [])

  const [createSignedUrlMutation] = useMutation(CreateSignedUrlMutation)

  return (
    <>
      {allFiles &&
        allFiles.map((file: UploadFile, index: number) => {
          return (
            <a
              onClick={() => {
                createSignedUrlMutation({
                  variables: {
                    input: {
                      fileName: encodeFilename(file.name.normalize()),
                      folder: applicationId,
                    },
                  },
                }).then((response) => {
                  window.open(response.data?.getSignedUrl.url)
                })
              }}
              key={`file-` + index}
              target="_blank"
              download
              rel="noreferrer noopener"
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
        })}
    </>
  )
}

export default AllFiles
