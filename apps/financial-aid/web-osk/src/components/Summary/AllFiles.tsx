import React, { useContext } from 'react'
import { Box, Button, Icon, Text } from '@island.is/island-ui/core'
import { useRouter } from 'next/router'

import * as styles from './summary.css'

import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'
import { encodeFilename, Routes } from '@island.is/financial-aid/shared/lib'
import { useMutation } from '@apollo/client'
import { CreateSignedUrlMutation } from '@island.is/financial-aid-web/osk/graphql'

const AllFiles = () => {
  const router = useRouter()

  const { form } = useContext(FormContext)

  const [createSignedUrlMutation] = useMutation(CreateSignedUrlMutation)

  const allFiles = form.incomeFiles
    .concat(form.taxReturnFiles)
    .concat(form.otherFiles)
    .concat(form.taxReturnFromRskFile)

  return (
    <Box
      display="flex"
      justifyContent="spaceBetween"
      alignItems="flexStart"
      paddingY={[4, 4, 5]}
      marginBottom={[2, 2, 5]}
    >
      <Box marginRight={3}>
        <Text fontWeight="semiBold">Gögn</Text>
        <Box>
          {allFiles.map((file, index) => {
            if (file) {
              return (
                <a
                  onClick={() =>
                    createSignedUrlMutation({
                      variables: {
                        input: {
                          fileName: encodeFilename(file.name),
                          folder: form.fileFolderId,
                        },
                      },
                    }).then((response) => {
                      window.open(response.data?.getSignedUrl.url)
                    })
                  }
                  key={`file-` + index}
                  className={styles.filesButtons}
                  target="_blank"
                  download
                  rel="noreferrer noopener"
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
                </a>
              )
            }
          })}
        </Box>
      </Box>

      <Button
        icon="pencil"
        iconType="filled"
        variant="utility"
        onClick={() => {
          router.push(Routes.filesPage(form?.hasIncome))
        }}
      >
        Breyta
      </Button>
    </Box>
  )
}

export default AllFiles
