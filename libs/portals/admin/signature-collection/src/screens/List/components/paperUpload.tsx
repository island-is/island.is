import {
  Accordion,
  Box,
  Checkbox,
  InputFileUpload,
  Text,
  AccordionItem,
  UploadFile,
  Button,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../../lib/messages'
import { useState } from 'react'
import XLSX from 'xlsx'
import { format as formatNationalId } from 'kennitala'
import { downloadFile } from '../../../lib/utils'

const PaperUpload = () => {
  const { formatMessage } = useLocale()
  const [withPaperUpload, setWithPaperUpload] = useState(false)
  const [fileList, setFileList] = useState<Array<UploadFile>>([])
  const [uploadResults, setUploadResults] = useState([])

  const readFile = async (newFile: File[]) => {
    setFileList(newFile)
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

    console.log(data)
    setUploadResults(data)
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
            <InputFileUpload
              fileList={fileList}
              header={formatMessage(m.uploadHeader)}
              description={formatMessage(m.uploadText)}
              buttonLabel={formatMessage(m.uploadButton)}
              onChange={(files) => readFile(files)}
              onRemove={() => setFileList([])}
              accept=".xlsx"
            />
            {uploadResults.length > 0 && (
              <Box marginTop={10} marginBottom={5}>
                <Text variant="h4" marginBottom={1}>
                  {formatMessage(m.uploadResultsHeader)}
                </Text>
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
                        <Text key={index}>
                          {formatNationalId(res.Kennitala)}
                        </Text>
                      )
                    })}
                  </AccordionItem>
                  {/*<AccordionItem
                    id="uploadError"
                    labelVariant="default"
                    labelColor="red600"
                    label={formatMessage(m.nationalIdsError)}
                  >
                    <Text>{formatMessage(m.tempMessage)}</Text>
                  </AccordionItem>*/}
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
