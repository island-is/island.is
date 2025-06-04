import { fileExtensionWhitelist } from '@island.is/island-ui/core/types'
import {
  fileToObjectDeprecated,
  InputFileUpload,
} from '@island.is/island-ui/core'
import { useState } from 'react'
import { FileRejection } from 'react-dropzone'
import XLSX from 'xlsx'
import { parse } from 'csv-parse'
import { FieldBaseProps } from '@island.is/application/types'
import { CarCategoryError, CarCategoryRecord } from '../../utils/types'
import { CategorySelection, RateCategory } from '../../utils/constants'

const extensionToType = {
  [fileExtensionWhitelist['.csv']]: 'csv',
  [fileExtensionWhitelist['.xlsx']]: 'xlsx',
} as const

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
  rateToChangeTo: CategorySelection
): Promise<Array<CarCategoryRecord> | Array<CarCategoryError>> => {
  const parsedLines: Array<Array<string>> = await (type === 'csv'
    ? parseCsv(file)
    : parseXlsx(file))

  console.log('parsed: ', parsedLines)

  const carNumberIndex = 0
  const prevMilageIndex = 2
  const currMilageIndex = 3
  const rateCategoryIndex = 4

  const [_, ...values] = parsedLines

  const data: Array<CarCategoryRecord | CarCategoryError | undefined> =
    values.map((row) => {
      const carNr = row[carNumberIndex]
      const prevMile = Number(sanitizeNumber(row[prevMilageIndex]))
      const currMile = Number(sanitizeNumber(row[currMilageIndex]))

      // Dont care about rows where either of these are not there
      if (Number.isNaN(prevMile) || Number.isNaN(currMile)) return undefined

      if (prevMile > currMile) {
        return {
          code: 1,
          message: 'New milage cannot be less than old milage!',
          carNr,
        }
      }

      const category = row[rateCategoryIndex]
      if (!category) return undefined
      // need to check if the category is the same thing as what we should pass into this function
      if (
        category.toLowerCase() !== RateCategory.DAYRATE.toString().toLowerCase() ||
        category.toLowerCase() !== RateCategory.KMRATE.toString().toLowerCase()
      ) {
        return {
          code: 1,
          message: 'Rate category is not valid, please maintain the correct spelling',
          carNr,
        }
      }

      // no change to the rate for this line, so we dont care about it
      // maybe we should do this filter in the actual request to skatturinn
      // so that this line stays in in the error generated file
      if(category.toLowerCase() === rateToChangeTo.toString().toLowerCase())
        return undefined

      return {
        vehicleId: carNr,
        mileage: currMile,
        rateCategory: category,
      }
    })

  // Filter out undefined values first
  const filteredData = data.filter(
    (x): x is CarCategoryRecord | CarCategoryError => x !== undefined,
  )

  // Check if there are any errors
  const hasErrors = filteredData.some(
    (item): item is CarCategoryError => 'code' in item,
  )

  if (hasErrors) {
    // Return only the error items
    return filteredData.filter(
      (item): item is CarCategoryError => 'code' in item,
    )
  }

  // If no errors, return only the CarCategoryRecords
  return filteredData.filter(
    (item): item is CarCategoryRecord => 'vehicleId' in item,
  )
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

interface Props {
  field: {
    props: {
      postParseAction: (records: CarCategoryRecord[]) => boolean
      rateCategory: CategorySelection
    }
  }
}

export const UploadCarCategoryFile = ({ field }: Props & FieldBaseProps) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>()
  const [uploadErrorMessage, setUploadErrorMessage] = useState<string | null>(
    null,
  )

  const postCarCategories = async (file: File, type: 'xlsx' | 'csv') => {
    const records = await parseFileToCarCategory(file, type, field.props.rateCategory)

    if (records.length > 0 && 'code' in records[0]) {
      // We have errors, concatenate all error messages
      const errorMessages = (records as CarCategoryError[])
        .map((error) => error.message)
        .join('. \n')
      setUploadErrorMessage(errorMessages)
      return
    }

    if (!records.length) {
      setUploadErrorMessage('noDataInUploadedFile')
      return
    }

    // At this point records is guaranteed to be CarCategoryRecord[]
    const success = field.props.postParseAction(records as CarCategoryRecord[])
    console.log('does it work', success)

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
      title={'Dragðu skjöl hingað til að hlaða upp'}
      name={'inputFileUploadName'}
      description={'Tekið er við skjölum með endingum: .csv, .xlsx'}
      buttonLabel={'Hlaða upp skjali'}
      accept={['.csv', '.xlsx']}
      multiple={false}
      onRemove={handleOnInputFileUploadRemove}
      onChange={handleOnInputFileUploadChange}
      onUploadRejection={handleOnInputFileUploadError}
      errorMessage={uploadErrorMessage ?? undefined}
    />
  )
}
