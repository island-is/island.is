import React, { FC, useState } from 'react'
import { Box, Text, Button, LoadingIcon, Checkbox } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { BulkEndorse } from '../../graphql/mutations'
import * as XLSX from 'xlsx'
import { useMutation } from '@apollo/client'
import FileUploadDisclaimer from '../FileUploadDisclaimer'
import { CheckboxController } from '@island.is/shared/form-fields'
import { Application } from '@island.is/application/core'

interface BulkUploadProps {
  application: Application
  onSuccess: () => void
}

const BulkUpload: FC<BulkUploadProps> = ({ application, onSuccess }) => {
  const { formatMessage } = useLocale()
  const [usePapers, setUsePapers] = useState(false)
  const [bulkUploading, setBulkUploading] = useState(false)
  const [bulkUploadDone, setBulkUploadDone] = useState(false)
  const [bulkUploadFailed, setBulkUploadFailed] = useState(false)
  const hiddenFileInput = React.createRef<HTMLInputElement>()
  const [createBulkEndorsements, { loading: submitLoad }] = useMutation(
    BulkEndorse,
  )

  const onBulkUpload = async (array: string[]) => {
    setBulkUploadDone(false)
    setBulkUploadFailed(false)
    setBulkUploading(true)
    const success = await createBulkEndorsements({
      variables: {
        input: {
          listId: (application.externalData?.createEndorsementList.data as any)
            .id,
          nationalIds: array,
        },
      },
    }).catch(() => {
      setBulkUploadFailed(true)
    })

    if (success) {
      setBulkUploadDone(true)
      onSuccess()
    }
    setBulkUploading(false)
  }

  const onImportExcel = (file: any) => {
    const { files } = file.target
    const fileReader: FileReader = new FileReader()
    fileReader.onload = () => {
      try {
        const workbook = XLSX.read(fileReader.result, { type: 'binary' })
        let data = [] as any
        for (const sheet in workbook.Sheets) {
          if (workbook.Sheets.hasOwnProperty(sheet)) {
            data = data.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]))
          }
        }

        var mapArray: string[] = []
        data.map((d: any) => {
          mapArray.push(d.nationalIds)
        })

        onBulkUpload(mapArray)
      } catch (e) {
        setBulkUploadFailed(true)
      }
    }
    fileReader.readAsBinaryString(files[0])
  }

  return (
    <Box>
      <Box marginY={3}>
        <Checkbox
          label={formatMessage(m.collectEndorsements.includePapers)}
          checked={usePapers}
          onChange={() => {
            setUsePapers(!usePapers)
          }}
        />
      </Box>
      <FileUploadDisclaimer />
      {usePapers && (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          borderRadius="standard"
          textAlign="center"
          padding={4}
        >
          <Button
            variant="ghost"
            icon="attach"
            onClick={() => hiddenFileInput?.current?.click()}
          >
            {formatMessage(m.bulkUpload.uploadButton)}
          </Button>
          <input
            ref={hiddenFileInput}
            type="file"
            id="selectedFile"
            style={{ display: 'none' }}
            accept=".xlsx"
            onChange={onImportExcel}
          />
          <Text marginTop={2} variant="small">
            {formatMessage(m.bulkUpload.fileFormatText)}
          </Text>
          <Box marginTop={4}>
            {bulkUploading && <LoadingIcon animate size={35} />}
            {bulkUploadDone && (
              <Text variant="h4">
                {formatMessage(m.bulkUpload.uploadSuccess)}
              </Text>
            )}
            {bulkUploadFailed && (
              <Text variant="h4" color="red400">
                {formatMessage(m.bulkUpload.uploadFail)}
              </Text>
            )}
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default BulkUpload
