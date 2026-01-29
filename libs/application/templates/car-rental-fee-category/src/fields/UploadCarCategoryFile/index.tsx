import {
  Box,
  Button,
  fileToObjectDeprecated,
  InputFileUpload,
  LoadingDots,
} from '@island.is/island-ui/core'
import { Dispatch, useEffect, useRef, useState } from 'react'
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
import { useFormContext } from 'react-hook-form'
import {
  createErrorExcel,
  downloadFile,
} from '../../utils/UploadCarCategoryFileUtils'
import {
  buildCurrentCarMap,
  getUploadFileType,
  parseUploadFile,
  UploadFileType,
} from '../../utils/carCategoryUtils'
import { useMutation } from '@apollo/client'
import { useLocale } from '@island.is/localization'
import {
  UPDATE_APPLICATION,
  UPDATE_APPLICATION_EXTERNAL_DATA,
} from '@island.is/application/graphql'
import { m } from '../../lib/messages'
import { Locale } from '@island.is/shared/types'
import {
  CREATE_UPLOAD_URL,
  ADD_ATTACHMENT,
} from '@island.is/application/graphql'
import { uploadFileToS3 } from '@island.is/application/ui-components'

interface Props {
  field: {
    props: {
      getFileContent: (
        vehicleMap: CarMap,
        rateCategory: RateCategory,
        locale: Locale,
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
  setBeforeSubmitCallback,
}: Props & FieldBaseProps) => {
  const { locale, lang, formatMessage } = useLocale()
  const [updateApplicationExternalData] = useMutation(
    UPDATE_APPLICATION_EXTERNAL_DATA,
  )

  const { setValue, setError, clearErrors, watch } = useFormContext()
  const uploadedMeta = watch('carCategoryFile')

  const [updateApplication] = useMutation(UPDATE_APPLICATION)
  const [isRefreshingRates, setIsRefreshingRates] = useState(false)
  
  const hasRunRef = useRef(false)
  const updateExternalDataRef = useRef(updateApplicationExternalData)
  
  const [uploadedFile, setUploadedFile] = useState<File | null>()
  const [uploadErrorMessage, setUploadErrorMessage] = useState<string | null>(
    null,
  )
  const [errorFile, setErrorFile] = useState<string | null>(null)
  
  const [createUploadUrl] = useMutation(CREATE_UPLOAD_URL)
  const [addAttachment] = useMutation(ADD_ATTACHMENT)
  const noopDispatch: Dispatch<unknown> = () => undefined

  useEffect(() => {
    updateExternalDataRef.current = updateApplicationExternalData
  }, [updateApplicationExternalData])

  useEffect(() => {
    let cancelled = false

    if (hasRunRef.current) return
    hasRunRef.current = true

    const updateExtData = async () => {
      setIsRefreshingRates(true)
      try {
        await updateExternalDataRef.current({
          variables: {
            input: {
              id: application.id,
              dataProviders: [
                { actionId: 'getCurrentVehicles', order: 0 },
                { actionId: 'getCurrentVehiclesRateCategory', order: 1 },
              ],
            },
            locale,
          },
        })
      } finally {
        if (!cancelled) {
          setIsRefreshingRates(false)
        }
      }
    }

    updateExtData()

    return () => {
      cancelled = true
      hasRunRef.current = false // allow StrictMode double-invoke to re-run
    }
  }, [application.id, locale])

  useEffect(() => {
    const hasFile = Array.isArray(uploadedMeta) && uploadedMeta.length > 0
  
    if (uploadErrorMessage) {
      setError('carCategoryFile', {
        type: 'manual',
        message: uploadErrorMessage,
      })
      return
    }
  
    if (!hasFile) {
      setError('carCategoryFile', {
        type: 'manual',
        message: 'File is required',
      })
      return
    }
  
    clearErrors('carCategoryFile')
  }, [uploadErrorMessage, uploadedMeta, setError, clearErrors])

  useEffect(() => {
    if (!setBeforeSubmitCallback) return

    setBeforeSubmitCallback(
      async () => {
        const hasFile = Array.isArray(uploadedMeta) && uploadedMeta.length > 0

        if (uploadErrorMessage) {
          return [false, uploadErrorMessage]
        }

        if (!hasFile) {
          return [false, 'File is required']
        }

        return [true, null]
      },
      { allowMultiple: true, customCallbackId: 'carCategoryFileValidation' },
    )
  }, [setBeforeSubmitCallback, uploadedMeta, uploadErrorMessage])


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

  const currentCarData = buildCurrentCarMap(currentVehicles, currentRates)

  const postCarCategories = async (
    file: File,
    type: UploadFileType,
  ): Promise<number | null> => {
    const parsed = await parseUploadFile(
      await file.arrayBuffer(),
      type,
      rateCategory,
      currentCarData,
    )

    if (!parsed.ok) {
      if (parsed.reason === 'no-data') {
        setUploadErrorMessage('No cars to change found')
        return null
      }

      // We have errors, show single error or generic message
      const errorMessages = parsed.errors as CarCategoryError[]
      if (errorMessages.length === 1) {
        setUploadErrorMessage(
          `${errorMessages[0].carNr} - ${formatMessage(
            errorMessages[0].message,
          )}`,
        )
      } else {
        setUploadErrorMessage(
          `${errorMessages.length} ${formatMessage(
            m.multiUpload.errorMessageToUser,
          )}`,
        )
      }

      // Create error Excel file
      const errorExcel = await createErrorExcel(
        await file.arrayBuffer(),
        type,
        new Map(
          (parsed.errors as CarCategoryError[]).map((error) => [
            error.carNr,
            formatMessage(error.message),
          ]),
        ),
      )
      setErrorFile(errorExcel)
      return null
    }

    return parsed.records.length
  }

  const handleOnInputFileUploadError = (files: FileRejection[]) => {
    if (files[0].errors[0].code === 'file-invalid-type') {
      setUploadErrorMessage('Invalid file type')
    } else {
      setUploadErrorMessage(files[0].errors[0].message)
    }
  }

  const handleOnInputFileUploadRemove = () => {
    setUploadedFile(null)
    setValue('carCategoryFile', undefined)
  }

  const handleOnInputFileUploadChange = async (files: File[]) => {
    setUploadedFile(null)
    setUploadErrorMessage(null)

    const file = fileToObjectDeprecated(files[0])

    if (file.status === 'done' && file.originalFileObj instanceof File) {
      //use value of file extension as key

      const type =
        getUploadFileType(file.originalFileObj.name) ??
        (file.type ? getUploadFileType(file.type) : null)

      if (!type) {
        setUploadErrorMessage('wrongFileType')
        return
      }

      setUploadedFile(file.originalFileObj)
      const carsToChangeCount = await postCarCategories(
        file.originalFileObj,
        type,
      )
      if (carsToChangeCount !== null) {
        const uploadedMeta = await uploadAndStoreFile(file.originalFileObj)
        await persistUploadAnswers(carsToChangeCount, uploadedMeta)
      }
    }
  }

  const uploadAndStoreFile = async (
    file: File,
  ): Promise<{ name: string; key: string }> => {
    const upload = fileToObjectDeprecated(file)
  
    const { data } = await createUploadUrl({
      variables: { filename: upload.name },
    })
  
    const {
      createUploadUrl: { url, fields },
    } = data
  
    await uploadFileToS3(upload, noopDispatch, url, fields)
  
    const responseUrl = `${url}/${fields.key}`
  
    await addAttachment({
      variables: {
        input: {
          id: application.id,
          key: fields.key,
          url: responseUrl,
        },
      },
    })
  
    return { name: upload.name, key: fields.key }
  }

  const persistUploadAnswers = async (
    carsToChangeCount: number,
    uploadedMeta: { name: string; key: string },
  ) => {
    // Store only metadata in answers (small payload)
    setValue('carsToChangeCount', carsToChangeCount)
    setValue('carCategoryFile', [uploadedMeta])
    await updateApplication({
      variables: {
        input: {
          id: application.id,
          answers: {
            ...application.answers,
            carsToChangeCount,
            carCategoryFile: [uploadedMeta],
          },
        },
        locale,
      },
    })
  }

  const fileData = field.props.getFileContent?.(
    currentCarData,
    rateCategory,
    lang,
  )
  if (!fileData) {
    throw Error('No valid file data recieved!')
  }

  if (isRefreshingRates) {
    return (
      <Box display="flex" justifyContent="center" paddingY={4}>
        <LoadingDots />
      </Box>
    )
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
          {formatMessage(m.multiUpload.templateButton)}
        </Button>
      </Box>
      <InputFileUpload
        files={uploadedFile ? [uploadedFile] : []}
        title={
          !uploadErrorMessage
            ? formatMessage(m.multiUpload.uploadTitle)
            : formatMessage(m.multiUpload.uploadTitleError)
        }
        name={'inputFileUploadName'}
        description={formatMessage(m.multiUpload.uploadDescription)}
        buttonLabel={formatMessage(m.multiUpload.uploadButtonLabel)}
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
            {formatMessage(m.multiUpload.errorTemplateButton)}
          </Button>
        </Box>
      ) : null}
    </>
  )
}
