import {
  Accordion,
  Box,
  Checkbox,
  InputFileUpload,
  Text,
  AccordionItem,
  UploadFile,
  Button,
  toast,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../../../lib/messages'
import { useState } from 'react'
import { format as formatNationalId } from 'kennitala'
import {
  createFileList,
  downloadFile,
  getFileData,
} from '../../../../lib/utils'
import { useBulkUploadMutation } from './paperUpload.generated'
import { useRevalidator } from 'react-router-dom'

const PaperUpload = ({ listId }: { listId: string }) => {
  const { formatMessage } = useLocale()
  const [withPaperUpload, setWithPaperUpload] = useState(false)
  const [fileList, setFileList] = useState<Array<UploadFile>>([])
  const [uploadResults, setUploadResults] = useState<any>()
  const [uploadMutation] = useBulkUploadMutation()
  const { revalidate } = useRevalidator()

  const paperUpload = async (
    data: Array<{ nationalId: string; pageNumber: number }>,
  ) => {
    try {
      const res = await uploadMutation({
        variables: {
          input: {
            listId: listId,
            upload: data,
          },
        },
      })

      if (res.data) {
        setUploadResults(res.data?.signatureCollectionBulkUploadSignatures)
        revalidate()
      }
    } catch (e) {
      toast.error(e.message)
    }
  }

  const onChange = async (newFile: File[]) => {
    setFileList(createFileList(newFile, fileList))
    let data = await getFileData(newFile)

    data = data.map((d: { Kennitala: any; Bls: number }) => {
      return {
        nationalId: String(d.Kennitala),
        pageNumber: d.Bls,
      }
    })

    paperUpload(data)
  }

  return (
    <Box marginTop={10}>
      <Box
        background={withPaperUpload ? 'purple100' : 'white'}
        padding={withPaperUpload ? 5 : 0}
        paddingTop={withPaperUpload ? 3 : 0}
        borderRadius="large"
      >
        <Box
          border={withPaperUpload ? undefined : 'standard'}
          paddingX={withPaperUpload ? 0 : 5}
          paddingY={withPaperUpload ? 0 : 3}
          borderRadius="large"
        >
          <Box display="flex" justifyContent="spaceBetween" alignItems="center">
            <Box onClick={() => setWithPaperUpload(!withPaperUpload)}>
              <Checkbox
                label={formatMessage(m.uploadFile)}
                checked={withPaperUpload}
                onChange={() => setWithPaperUpload(!withPaperUpload)}
              />
            </Box>
            {withPaperUpload && (
              <Button
                variant="utility"
                icon="document"
                onClick={() => downloadFile()}
              >
                {formatMessage(m.downloadTemplate)}
              </Button>
            )}
          </Box>
        </Box>
        {withPaperUpload && (
          <>
            <Box marginY={5}>
              <Text>{formatMessage(m.uploadFileDescription)}</Text>
            </Box>
            <Box marginBottom={3}>
              <InputFileUpload
                fileList={fileList}
                header={formatMessage(m.uploadHeader)}
                description={formatMessage(m.uploadText)}
                buttonLabel={formatMessage(m.uploadButton)}
                onChange={onChange}
                onRemove={() => setFileList([])}
                accept=".xlsx"
                multiple={false}
              />
            </Box>
            {fileList.length > 0 && (
              <Box marginTop={7} marginBottom={3}>
                <Text variant="h4">{formatMessage(m.uploadResultsHeader)}</Text>
                {uploadResults && Object.keys(uploadResults).length > 0 && (
                  <Accordion dividerOnTop={false}>
                    <AccordionItem
                      id="uploadSuccess"
                      labelVariant="default"
                      label={
                        formatMessage(m.nationalIdsSuccess) +
                        ' (' +
                        uploadResults.success.length +
                        ')'
                      }
                    >
                      {uploadResults.success.map((res: any, index: number) => {
                        return (
                          <Text key={index} marginBottom={1}>
                            {formatNationalId(res.signee.nationalId)}
                          </Text>
                        )
                      })}
                    </AccordionItem>
                    <AccordionItem
                      id="uploadFailed"
                      labelVariant="default"
                      labelColor="red600"
                      label={
                        formatMessage(m.nationalIdsError) +
                        ' (' +
                        uploadResults.failed.length +
                        ')'
                      }
                    >
                      {uploadResults.failed.map((res: any, index: number) => {
                        return (
                          <Box
                            key={index}
                            display="flex"
                            justifyContent="spaceBetween"
                            marginBottom={1}
                          >
                            <Text marginBottom={1}>
                              {formatNationalId(res.nationalId)}
                            </Text>
                            <Text marginBottom={1}>{res.reason}</Text>
                          </Box>
                        )
                      })}
                    </AccordionItem>
                  </Accordion>
                )}
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  )
}

export default PaperUpload
