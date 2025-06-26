import { fileExtensionWhitelist } from '@island.is/island-ui/core/types'
import {
  Box,
  Button,
  fileToObjectDeprecated,
  InputFileUpload,
} from '@island.is/island-ui/core'
import { useState } from 'react'
import { FileRejection } from 'react-dropzone'
import { FieldBaseProps } from '@island.is/application/types'
import {
  CarCategoryError,
  CurrentVehicleWithMilage,
  CarMap,
} from '../../utils/types'
import { RateCategory } from '../../utils/constants'
import { getValueViaPath } from '@island.is/application/core'
import { EntryModel } from '@island.is/clients-rental-day-rate'
import {
  isDayRateEntryActive,
} from '../../utils/dayRateUtils'
import { useFormContext } from 'react-hook-form'
import { createErrorExcel, downloadFile, parseFileToCarCategory } from '../../utils/UploadCarCategoryFileUtils'

const extensionToType = {
  [fileExtensionWhitelist['.csv']]: 'csv',
  [fileExtensionWhitelist['.xlsx']]: 'xlsx',
} as const

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
