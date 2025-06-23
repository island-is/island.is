import { fileExtensionWhitelist } from '@island.is/island-ui/core/types'
import {
  Box,
  Button,
  fileToObjectDeprecated,
  InputFileUpload,
} from '@island.is/island-ui/core'
import { useState } from 'react'
import { FileRejection } from 'react-dropzone'
import XLSX from 'xlsx'
import { parse } from 'csv-parse'
import { FieldBaseProps } from '@island.is/application/types'
import {
  CarCategoryError,
  CarCategoryRecord,
  CurrentVehicleWithMilage,
  CarMap,
} from '../../utils/types'
import { RateCategory } from '../../utils/constants'
import { getValueViaPath } from '@island.is/application/core'
import { EntryModel } from '@island.is/clients-rental-day-rate'
import {
  isDayRateEntryActive,
  is30DaysOrMoreFromDate,
} from '../../utils/dayRateUtils'
import { useFormContext } from 'react-hook-form'

const extensionToType = {
  [fileExtensionWhitelist['.csv']]: 'csv',
  [fileExtensionWhitelist['.xlsx']]: 'xlsx',
} as const

const sanitizeNumber = (n: string) => n.replace(new RegExp(/[.,]/g), '')

const parseFileToCarCategory = async (
  file: File,
  type: 'csv' | 'xlsx',
  rateToChangeTo: RateCategory,
  currentCarData: CarMap,
): Promise<Array<CarCategoryRecord> | Array<CarCategoryError>> => {
  const parsedLines: Array<Array<string>> = await (type === 'csv'
    ? parseCsv(file)
    : parseXlsx(file))

  const carNumberIndex = 0
  const prevMilageIndex = 2
  const currMilageIndex = 3
  const rateCategoryIndex = 4

  const [_, ...values] = parsedLines

  const data: Array<CarCategoryRecord | CarCategoryError | undefined> =
    values.map((row) => {
      const carNr = row[carNumberIndex]
      const prevMileStr = row[prevMilageIndex]?.trim()
      const currMileStr = row[currMilageIndex]?.trim()
      if (!currentCarData[carNr]) {
        return {
          code: 1,
          message: 'Þessi bíll fannst ekki í lista af þínum bílum!',
          carNr,
        }
      }

      // Changing from Dayrate
      if (rateToChangeTo === RateCategory.KMRATE) {
        const validFromDate = currentCarData[carNr].activeDayRate?.validFrom
        if (validFromDate) {
          const is30orMoreDays = is30DaysOrMoreFromDate(validFromDate)

          if (!is30orMoreDays) {
            return {
              code: 1,
              message:
                'Bílar þurfa að vera skráið á daggjald í amk 30 daga áður en hægt er að breyta til baka!',
              carNr,
            }
          }
        }
      }

      if (!prevMileStr && currMileStr) {
        return {
          code: 1,
          message: 'Síðasta staða bíls þarf að vera til staðar!',
          carNr,
        }
      }

      // Skip rows where either mileage value is empty or undefined
      if (!prevMileStr || !currMileStr) return undefined

      const prevMile = Number(sanitizeNumber(prevMileStr))
      const currMile = Number(sanitizeNumber(currMileStr))

      // Skip rows where either mileage value is not a valid number
      if (Number.isNaN(prevMile) || Number.isNaN(currMile)) return undefined

      if (prevMile > currMile) {
        return {
          code: 1,
          message: 'Nýja staða má ekki vera lægri en síðasta staða!',
          carNr,
        }
      }

      const category = row[rateCategoryIndex]
      if (!category) return undefined
      // need to check if the category is the same thing as what we should pass into this function
      if (
        category.toLowerCase() !== RateCategory.DAYRATE.toLowerCase() &&
        category.toLowerCase() !== RateCategory.KMRATE.toLowerCase()
      ) {
        return {
          code: 1,
          message:
            'Ógildur gjaldflokkur, vinsamlegast passið uppá stafsetningu (Daggjald eða Kilometragjald)',
          carNr,
        }
      }

      if (category.toLowerCase() !== rateToChangeTo.toLowerCase()) {
        return {
          code: 1,
          message: `Ógildur gjaldflokkur, þú valdir að breyta gjaldflokki í ${rateToChangeTo}`,
          carNr,
        }
      }

      return {
        vehicleId: carNr,
        oldMileage: prevMile,
        newMilage: currMile,
        rateCategory: category,
      }
    })

  // Filter out undefined values first
  const filteredData = data.filter(
    (x): x is CarCategoryRecord | CarCategoryError => x !== undefined,
  )

  const errors = filteredData.filter(
    (item): item is CarCategoryError => 'code' in item,
  )

  if(errors.length > 0) return errors

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

const createErrorExcel = async (
  file: File,
  type: 'csv' | 'xlsx',
  errors: CarCategoryError[],
) => {
  const parsedLines: Array<Array<string>> = await (type === 'csv'
    ? parseCsv(file)
    : parseXlsx(file))

  const [header, ...values] = parsedLines

  // Add error message column to header
  const newHeader = [...header, 'Villa']

  // Create a map of error messages by car number
  const errorMap = new Map(errors.map((error) => [error.carNr, error.message]))

  // Add error messages to rows and mark error rows
  const processedRows = values.map((row) => {
    const carNr = row[0]
    const errorMessage = errorMap.get(carNr)
    return {
      row,
      hasError: !!errorMessage,
      errorMessage: errorMessage || '',
    }
  })

  // Sort rows: errors first, then others
  const sortedRows = processedRows.sort((a, b) => {
    if (a.hasError && !b.hasError) return -1
    if (!a.hasError && b.hasError) return 1
    return 0
  })

  // Create workbook
  const wb = XLSX.utils.book_new()

  // Convert rows to worksheet format
  const wsData = [
    newHeader,
    ...sortedRows.map(({ row, errorMessage }) => [...row, errorMessage]),
  ]

  const ws = XLSX.utils.aoa_to_sheet(wsData)

  // Add red background to error rows
  const range = XLSX.utils.decode_range(ws['!ref'] || 'A1')
  for (let R = 1; R <= range.e.r; R++) {
    const rowHasError = sortedRows[R - 1]?.hasError
    if (rowHasError) {
      for (let C = 0; C <= range.e.c; C++) {
        const cellRef = XLSX.utils.encode_cell({ r: R, c: C })
        if (!ws[cellRef]) continue

        ws[cellRef].s = {
          ...ws[cellRef].s,
          fill: { fgColor: { rgb: 'FFFF0000' } },
          font: { color: { rgb: 'FFFFFFFF' } },
        }
      }
    }
  }

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')

  // Generate new file
  const newFile = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' })
  return newFile
}

interface Props {
  field: {
    props: {
      getFileContent: (
        vehicleMap: CarMap,
        rateCategory: RateCategory,
      ) => {
        base64Content: string
        fileType: string
        filename: string
      }
    }
  }
}

export const UploadCarCategoryFile = ({
  application,
  field,
}: Props & FieldBaseProps) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>()
  const [uploadErrorMessage, setUploadErrorMessage] = useState<string | null>(
    null,
  )
  const { setValue } = useFormContext()
  const [errorFile, setErrorFile] = useState<string | null>(null)

  const rateCategory = getValueViaPath<RateCategory>(
    application.answers,
    'categorySelectionRadio',
  )

  if (!rateCategory) return

  const currentVehicles = getValueViaPath<CurrentVehicleWithMilage[]>(
    application.externalData,
    'getCurrentVehicles.data',
  )

  const currentRates = getValueViaPath<EntryModel[]>(
    application.externalData,
    'getCurrentVehiclesRateCategory.data',
  )

  const currentDate = new Date()
  const currentCarData =
    currentVehicles?.reduce((acc, vehicle) => {
      if (!vehicle.permno || !vehicle.make) return acc

      const vehicleEntry = currentRates?.find(
        (rate) => rate.permno === vehicle.permno,
      )
      // Cannot change rate category of a car that isnt in the response from
      if (!vehicleEntry) {
        return acc
      }

      const activeDayRate = vehicleEntry?.dayRateEntries?.find((entry) =>
        isDayRateEntryActive(entry, currentDate),
      )

      acc[vehicle.permno] = {
        make: vehicle.make,
        milage: vehicle.milage ?? 0,
        category: activeDayRate ? RateCategory.DAYRATE : RateCategory.KMRATE,
        activeDayRate: activeDayRate,
      }

      return acc
    }, {} as CarMap) ?? {}

  const postCarCategories = async (file: File, type: 'xlsx' | 'csv') => {
    const dataToChange = await parseFileToCarCategory(
      file,
      type,
      rateCategory,
      currentCarData,
    )

    if (dataToChange.length > 0 && 'code' in dataToChange[0]) {
      // We have errors, show single error or generic message
      const errorMessages = dataToChange as CarCategoryError[]
      if (errorMessages.length === 1) {
        setUploadErrorMessage(
          `${errorMessages[0].carNr} - ${errorMessages[0].message}`,
        )
      } else {
        setUploadErrorMessage(
          `${errorMessages.length} errors found. Please download the error file for details.`,
        )
      }

      // Create error Excel file
      const errorExcel = await createErrorExcel(
        file,
        type,
        dataToChange as CarCategoryError[],
      )
      setErrorFile(errorExcel)
      return
    }

    if (!dataToChange.length) {
      setUploadErrorMessage('noDataInUploadedFile')
      return
    }

    setValue('dataToChange', dataToChange)
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
    setUploadedFile(null)
    setUploadErrorMessage(null)

    const file = fileToObjectDeprecated(files[0])

    if (file.status === 'done' && file.originalFileObj instanceof File) {
      //use value of file extension as key

      const type = file.type ? extensionToType[file.type] : undefined

      if (!type) {
        setUploadErrorMessage('wrongFileType')
        return
      }

      setUploadedFile(file.originalFileObj)
      postCarCategories(file.originalFileObj, type)
    }
  }

  const fileData = field.props.getFileContent?.(currentCarData, rateCategory)
  if (!fileData) {
    throw Error('No valid file data recieved!')
  }

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        paddingTop={2}
        paddingBottom={2}
      >
        <Button
          variant="utility"
          icon="document"
          onClick={() =>
            downloadFile(
              fileData?.filename,
              fileData?.base64Content,
              fileData?.fileType,
            )
          }
        >
          {'Sniðmát'}
        </Button>
      </Box>
      <InputFileUpload
        files={uploadedFile ? [uploadedFile] : []}
        title={
          !uploadErrorMessage
            ? 'Dragðu skjöl hingað til að hlaða upp'
            : 'Dragðu aftur inn skjal hingað til að hlaða upp eftir að lagfæra villur'
        }
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
      {uploadErrorMessage && errorFile ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          paddingTop={2}
          paddingBottom={2}
        >
          <Button
            variant="utility"
            icon="document"
            onClick={() =>
              downloadFile(
                `errors-in-${fileData.filename}`,
                errorFile,
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              )
            }
          >
            {'Sniðmát með villum'}
          </Button>
        </Box>
      ) : null}
    </>
  )
}

const downloadFile = (
  name: string,
  base64Content: string,
  mimeType: string,
) => {
  const blob = base64ToBlob(base64Content, mimeType)
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = name
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const base64ToBlob = (base64: string, mimeType: string) => {
  const buffer = Buffer.from(base64, 'base64')
  return new Blob([buffer], { type: mimeType })
}
