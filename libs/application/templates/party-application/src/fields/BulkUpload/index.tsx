import React, { FC, useState } from 'react'
import { Box, Text, Button, LoadingIcon } from '@island.is/island-ui/core'
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
  const [usePapers, setUsePapers] = useState(false)
  const [bulkUploading, setBulkUploading] = useState(false)
  const [bulkUploadDone, setBulkUploadDone] = useState(false)
  const { formatMessage } = useLocale()
  const hiddenFileInput = React.createRef<HTMLInputElement>()
  const [createBulkEndorsements, { loading: submitLoad }] = useMutation(
    BulkEndorse,
  )

  const onBulkUpload = async (array: string[]) => {
    setBulkUploading(true)
    const success = await createBulkEndorsements({
      variables: {
        input: {
          listId: (application.externalData?.createEndorsementList.data as any)
            .id,
          nationalIds: array,
        },
      },
    })
    if (success) {
      setBulkUploading(false)
      setBulkUploadDone(true)
      onSuccess()
    }
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

        console.log(mapArray)
        onBulkUpload(mapArray)
      } catch (e) {
        console.log('Upload failed!')
      }
    }
    fileReader.readAsBinaryString(files[0])
  }

  return (
    <Box>
      <CheckboxController
        id="papers"
        name="includePapers"
        defaultValue={[]}
        onSelect={() => setUsePapers(!usePapers)}
        options={[
          {
            value: 'agree',
            label: formatMessage(m.collectEndorsements.includePapers),
          },
        ]}
      />
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
            {'Bæta við pappírsmeðmælum'}
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
            {'Tekið er við skjölum með endingu: .xlsx'}
          </Text>
          <Box marginTop={4}>
            {bulkUploading && (
              <LoadingIcon animate size={35} />
            )}
            {bulkUploadDone && (
              <Text variant="h4">
                {'Pappírsmeðmælin hlaðin upp!'}
              </Text>
            )}
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default BulkUpload
