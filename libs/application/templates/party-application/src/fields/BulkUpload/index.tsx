import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text, Button } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { BulkEndorse } from '../../graphql/mutations'
import * as XLSX from 'xlsx'
import { useMutation } from '@apollo/client'

const BulkUpload: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const hiddenFileInput = React.createRef<HTMLInputElement>()
  const [createBulkEndorsements, { loading: submitLoad }] = useMutation(
    BulkEndorse,
  )

  const onBulkEndorse = async (array: string[]) => {
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
      console.log('yay success')
    }
  }

  const onImportExcel = (file: any) => {
    console.log(file)
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
        console.log('Upload succeeded!')
        console.log(data)

        var mapArray: string[] = []
        data.map((d: any) => {
          mapArray.push(d.nationalIds)
        })

        console.log(mapArray)
        onBulkEndorse(mapArray)
      } catch (e) {
        console.log('Upload failed!')
      }
    }
    fileReader.readAsBinaryString(files[0])
  }

  return (
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
    </Box>
  )
}

export default BulkUpload
