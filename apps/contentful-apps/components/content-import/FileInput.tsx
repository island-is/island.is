import { ChangeEvent, useState } from 'react'
import XLSX from 'xlsx'
import { PageExtensionSDK } from '@contentful/app-sdk'
import { Flex } from '@contentful/f36-core'
import { Spinner } from '@contentful/f36-spinner'
import { useSDK } from '@contentful/react-apps-toolkit'

import { FileData } from './utils'

interface FileInputProps {
  setFileData: (fileData: FileData) => void
}

export const FileInput = ({ setFileData }: FileInputProps) => {
  const sdk = useSDK<PageExtensionSDK>()
  const [loading, setLoading] = useState(false)

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0]
    if (!file) {
      return
    }

    const reader = new FileReader()

    reader.onload = (e) => {
      const workbook = XLSX.read(e.target.result, { type: 'binary' })

      // In case there are multiple tabs in the excel file we ask which one to open
      if (workbook.SheetNames.length > 1) {
        console.log(workbook.SheetNames)

        sdk.dialogs
          .openPrompt({
            title: 'Select tab',
            message: 'Enter tab name',
          })
          .then((value) => {
            let sheet = workbook.Sheets[workbook.SheetNames[0]]

            if (
              typeof value === 'string' &&
              workbook.SheetNames.includes(value)
            ) {
              sheet = workbook.Sheets[value]
            }

            const jsonData = XLSX.utils.sheet_to_json(sheet, {
              header: 1,
              blankrows: false,
            })
            setFileData(jsonData as FileData)
            setLoading(false)
          })
      } else {
        const sheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 })
        setFileData(jsonData as FileData)
        setLoading(false)
      }
    }

    reader.onerror = () => {
      setLoading(false)
    }

    reader.readAsBinaryString(file)

    setLoading(true)
  }

  return (
    <Flex>
      <input type="file" accept=".xlsx" onChange={onFileChange} />
      {loading && <Spinner />}
    </Flex>
  )
}
