import {
  Accordion,
  Box,
  Checkbox,
  InputFileUpload,
  Text,
  AccordionItem,
  UploadFile,
  Button,
  fileToObject,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../../lib/messages'
import { useState } from 'react'
import XLSX from 'xlsx'
import { format as formatNationalId } from 'kennitala'
import { downloadFile } from '../../../lib/utils'
import { uuid } from 'uuidv4'

export const PaperUpload = () => {
  const { formatMessage } = useLocale()
  const [withPaperUpload, setWithPaperUpload] = useState(false)
  const [fileList, setFileList] = useState<Array<UploadFile>>([])
  const [uploadResults, setUploadResults] = useState([])

  const createFileList = (files: File[]) => {
    const uploadFiles = files.map((file) => fileToObject(file))
    const uploadFilesWithKey = uploadFiles.map((f) => ({
      ...f,
      key: uuid(),
    }))
    const newFileList = [...fileList, ...uploadFilesWithKey]
    setFileList(newFileList)
  }

  const onChange = async (newFile: File[]) => {
    createFileList(newFile)

    const buffer = await newFile[0].arrayBuffer()
    const file = XLSX.read(buffer, { type: 'buffer' })

    const data = [] as any
    const sheets = file.SheetNames

    for (let i = 0; i < sheets.length; i++) {
      const temp = XLSX.utils.sheet_to_json(file.Sheets[file.SheetNames[i]])
      temp.forEach((res) => {
        data.push(res)
      })
    }

    setUploadResults(data)
  }

  return (
    <Box marginTop={7}>
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
          cursor="pointer"
          onClick={() => setWithPaperUpload(!withPaperUpload)}
        >
          <Box display="flex" justifyContent="spaceBetween" alignItems="center">
            <Checkbox
              label={formatMessage(m.uploadFile)}
              checked={withPaperUpload}
              onChange={() => setWithPaperUpload(!withPaperUpload)}
            />
            {withPaperUpload && (
              <Button
                variant="utility"
                icon="document"
                onClick={() => downloadFile()}
              >
                Sækja template
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
              />
            </Box>
            {uploadResults.length > 0 && (
              <Box marginTop={7} marginBottom={3}>
                <Text variant="h4">{formatMessage(m.uploadResultsHeader)}</Text>
                <Accordion dividerOnTop={false}>
                  <AccordionItem
                    id="uploadSuccess"
                    labelVariant="default"
                    label={
                      formatMessage(m.nationalIdsSuccess) +
                      ' (' +
                      uploadResults.length +
                      ')'
                    }
                  >
                    {uploadResults.map((res: any, index: number) => {
                      return (
                        <Text key={index} marginBottom={1}>
                          {formatNationalId(res.Kennitala)}
                        </Text>
                      )
                    })}
                  </AccordionItem>
                  <AccordionItem
                    id="uploadError"
                    labelVariant="default"
                    labelColor="red600"
                    label={formatMessage(m.nationalIdsError)}
                  >
                    {/* Temp harðkóðuð uppsetning */}
                    <Box
                      display="flex"
                      justifyContent="spaceBetween"
                      marginBottom={1}
                    >
                      <Text>010130-3019</Text>
                      <Text>á röngu formatti</Text>
                    </Box>
                    <Box display="flex" justifyContent="spaceBetween">
                      <Text>010130-2399</Text>
                      <Text>ekki í réttu kjördæmi</Text>
                    </Box>
                  </AccordionItem>
                </Accordion>
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  )
}

export default PaperUpload
