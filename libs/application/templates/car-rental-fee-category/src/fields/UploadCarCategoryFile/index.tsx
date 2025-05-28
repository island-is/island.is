import { fileExtensionWhitelist } from '@island.is/island-ui/core/types'
import {
    InputFileUploadDeprecated,
    Box,
    Text,
    fileToObjectDeprecated,
    AlertMessage,
    Stack,
    InputFileUpload,
  } from '@island.is/island-ui/core'
import { useState } from 'react'
import { FileRejection } from 'react-dropzone'
import XLSX from 'xlsx'
import { parse } from 'csv-parse'

const extensionToType = {
  [fileExtensionWhitelist['.csv']]: 'csv',
  [fileExtensionWhitelist['.xlsx']]: 'xlsx',
} as const

interface CarCategoryRecord {
  vehicleId: string
  mileage: number
}

interface CarCategoryError {
  code: 1 | 2
  message: string
}

const vehicleIndexTitle = [
  'permno',
  'vehicleid',
  'bilnumer',
  'okutaeki',
  'fastanumer',
]
const mileageIndexTitle = ['kilometrastada', 'mileage', 'odometer']

const errorMap: Record<number, string> = {
  1: `Invalid vehicle column header. Must be one of the following: ${vehicleIndexTitle.join(
    ', ',
  )}`,
  2: `Invalid mileage column header. Must be one of the following: ${mileageIndexTitle.join(
    ', ',
  )}`,
}

const sanitizeNumber = (n: string) => n.replace(new RegExp(/[.,]/g), '')

const parseFileToCarCategory = async (
  file: File,
  type: 'csv' | 'xlsx',
): Promise<Array<CarCategoryRecord> | CarCategoryError> => {
  const parsedLines: Array<Array<string>> = await (type === 'csv'
    ? parseCsv(file)
    : parseXlsx(file))

    console.log('parsed: ', parsedLines)

    return []

  // const [header, ...values] = parsedLines
  // const vehicleIndex = header.findIndex((l) =>
  //   vehicleIndexTitle.includes(l.toLowerCase()),
  // )

  // if (vehicleIndex < 0) {
  //   return {
  //     code: 1,
  //     message: errorMap[1],
  //   }
  // }

  // const mileageIndex = header.findIndex((l) =>
  //   mileageIndexTitle.includes(l.toLowerCase()),
  // )

  // if (mileageIndex < 0) {
  //   return {
  //     code: 2,
  //     message: errorMap[2],
  //   }
  // }

  // const uploadedOdometerStatuses: Array<CarCategoryRecord> = values
  //   .map((row) => {
  //     const mileage = Number(sanitizeNumber(row[mileageIndex]))
  //     if (Number.isNaN(mileage)) {
  //       return undefined
  //     }
  //     return {
  //       vehicleId: row[vehicleIndex],
  //       mileage,
  //     }
  //   })
  //   .filter((x) => x !== null && x !== undefined)
  // return uploadedOdometerStatuses
}

const parseCsv = async (file: File) => {
  const reader = file.stream().getReader()
  const decoder = new TextDecoder('utf-8')

  let accumulatedChunk = ''
  let done = false

  while (!done) {
    const res = await reader.read()
    done = res.done
    if (!done) {
      accumulatedChunk += decoder.decode(res.value)
    }
  }
  return parseCsvString(accumulatedChunk)
}

const parseXlsx = async (file: File) => {
  try {
    //FIRST SHEET ONLY
    const buffer = await file.arrayBuffer()
    const parsedFile = XLSX.read(buffer, { type: 'buffer' })

    const jsonData = XLSX.utils.sheet_to_csv(
      parsedFile.Sheets[parsedFile.SheetNames[0]],
      {
        blankrows: false,
      },
    )

    return parseCsvString(jsonData)
  } catch (e) {
    throw new Error('Failed to parse XLSX file: ' + e.message)
  }
}

const parseCsvString = (chunk: string): Promise<string[][]> => {
  return new Promise((resolve, reject) => {
    const records: string[][] = []

    const parser = parse({
      delimiter: [';', ','],
      skipRecordsWithEmptyValues: true,
      trim: true,
    })

    parser.on('readable', () => {
      let record: Array<string>
      while ((record = parser.read()) !== null) {
        records.push(record)
      }
    })

    parser.on('error', (err) => {
      reject(err)
    })

    parser.on('end', () => {
      resolve(records)
    })

    parser.write(chunk)
    parser.end()
  })
}
  
export const UploadCarCategoryFile = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>()
  const [uploadErrorMessage, setUploadErrorMessage] = useState<string | null>(
    null,
  )

  const postCarCategories = async (file: File, type: 'xlsx' | 'csv') => {
    const records = await parseFileToCarCategory(file, type)

    if (!Array.isArray(records)) {
      if (records.code === 1) {
        setUploadErrorMessage('invalidPermNoColumn')
      } else if (records.code === 2) {
        setUploadErrorMessage(
          'invalidMileageColumn',
        )
      } else {
        setUploadErrorMessage('uploadFailed')
      }
      return
    }

    if (!records.length) {
      setUploadErrorMessage('noDataInUploadedFile')
      return
    }
    
    // Send request to skatturinn with car data
  }

  const handleOnInputFileUploadError = (files: FileRejection[]) => {
    if (files[0].errors[0].code === 'file-invalid-type') {
      setUploadErrorMessage('invalidFileType')
    } else {
      setUploadErrorMessage(files[0].errors[0].message)
    }
  }

  const handleOnInputFileUploadRemove = () => setUploadedFile(null)

  const handleOnInputFileUploadChange = (files: File[]) => {
    const file = fileToObjectDeprecated(files[0])

    if (file.status === 'done' && file.originalFileObj instanceof File) {
      //use value of file extension as key

      const type = file.type ? extensionToType[file.type] : undefined

      if (!type) {
        setUploadErrorMessage('wrongFileType')
        return
      }

      postCarCategories(file.originalFileObj, type)
    }
  }


  return (
      <InputFileUpload
        files={uploadedFile ? [uploadedFile] : []}
        title={'dragFileToUpload'}
        name={'inputFileUploadName'}
        description={'fileUploadAcceptedTypes'}
        disabled={!!uploadErrorMessage}
        buttonLabel={'selectFileToUpload'}
        accept={['.csv', '.xlsx']}
        multiple={false}
        onRemove={handleOnInputFileUploadRemove}
        onChange={handleOnInputFileUploadChange}
        onUploadRejection={handleOnInputFileUploadError}
        errorMessage={uploadErrorMessage ?? undefined}
      />
  )
}
