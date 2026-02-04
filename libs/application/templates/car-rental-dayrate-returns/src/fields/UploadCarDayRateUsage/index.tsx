import {
  Box,
  Button,
  fileToObjectDeprecated,
  InputFileUpload,
} from '@island.is/island-ui/core'
import { Dispatch, useEffect, useState } from 'react'
import { FileRejection } from 'react-dropzone'
import { FieldBaseProps } from '@island.is/application/types'
import { CarUsageError, DayRateRecord } from '../../utils/types'
import { getValueViaPath } from '@island.is/application/core'
import { useFormContext } from 'react-hook-form'
import {
  createErrorExcel,
  downloadFile,
} from '../../utils/UploadCarDayRateUsageUtils'
import {
  parseUploadFile,
  UploadFileType,
  getUploadFileType,
} from '../../utils/UploadCarDayRateUsageUtils'
import { useMutation } from '@apollo/client'
import { useLocale } from '@island.is/localization'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
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
        dayRateRecords: DayRateRecord[],
        locale: Locale,
      ) => {
        base64Content: string
        fileType: string
        filename: string
      }
    }
  }
}

export const UploadCarDayRateUsage = ({
  application,
  field,
  setBeforeSubmitCallback,
}: Props & FieldBaseProps) => {
  const { locale, lang, formatMessage } = useLocale()

  const { setValue, setError, clearErrors, watch } = useFormContext()
  const uploadedMeta = watch('carDayRateUsageFile')

  const [updateApplication] = useMutation(UPDATE_APPLICATION)

  const [uploadedFile, setUploadedFile] = useState<File | null>()
  const [uploadErrorMessage, setUploadErrorMessage] = useState<string | null>(
    null,
  )
  const [errorFile, setErrorFile] = useState<string | null>(null)

  const [createUploadUrl] = useMutation(CREATE_UPLOAD_URL)
  const [addAttachment] = useMutation(ADD_ATTACHMENT)
  const noopDispatch: Dispatch<unknown> = () => undefined

  useEffect(() => {
    const hasFile = Array.isArray(uploadedMeta) && uploadedMeta.length > 0

    if (uploadErrorMessage) {
      setError('carDayRateUsageFile', {
        type: 'manual',
        message: uploadErrorMessage,
      })
      return
    }

    if (!hasFile) {
      setError('carDayRateUsageFile', {
        type: 'manual',
        message: 'File is required',
      })
      return
    }

    clearErrors('carDayRateUsageFile')
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
      {
        allowMultiple: true,
        customCallbackId: 'carDayRateUsageFileValidation',
      },
    )
  }, [setBeforeSubmitCallback, uploadedMeta, uploadErrorMessage])

  const dayRateRecords =
    getValueViaPath<DayRateRecord[]>(
      application.externalData,
      'getPreviousPeriodDayRateReturns.data',
    ) ?? []

  const dayRateRecordsByPermno = new Map<string, DayRateRecord>(
    dayRateRecords.map((d) => [d.permno, d]),
  )

  const parseAndValidateCarDayRateUsage = async (
    file: File,
    type: UploadFileType,
  ): Promise<number | null> => {
    const parsed = await parseUploadFile(
      await file.arrayBuffer(),
      type,
      dayRateRecordsByPermno,
    )

    if (!parsed.ok) {
      if (parsed.reason === 'no-data') {
        setUploadErrorMessage(formatMessage(m.multiUpload.noCarsToChangeFound))
        return null
      }

      // We have errors, show single error or generic message
      const errorMessages = parsed.errors as CarUsageError[]
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
          (parsed.errors as CarUsageError[]).map((error) => [
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
      setUploadErrorMessage(formatMessage(m.multiUpload.invalidFileType))
    } else {
      setUploadErrorMessage(files[0].errors[0].message)
    }
  }

  const handleOnInputFileUploadRemove = () => {
    setUploadedFile(null)
    setUploadErrorMessage(null)
    setErrorFile(null)
    setValue('carDayRateUsageCount', undefined)
    setValue('carDayRateUsageFile', undefined)
  }

  const handleOnInputFileUploadChange = async (files: File[]) => {
    setUploadedFile(null)
    setUploadErrorMessage(null)

    const file = fileToObjectDeprecated(files[0])

    if (file.status === 'done' && file.originalFileObj instanceof File) {
      const type =
        getUploadFileType(file.originalFileObj.name) ??
        (file.type ? getUploadFileType(file.type) : null)

      if (!type) {
        setUploadErrorMessage(formatMessage(m.multiUpload.invalidFileType))
        return
      }

      const dataToPost = await parseAndValidateCarDayRateUsage(
        file.originalFileObj,
        type,
      )
      if (dataToPost !== null) {
        const uploadedMeta = await uploadAndStoreFile(file.originalFileObj)
        await persistUploadAnswers(dataToPost, uploadedMeta)
        setUploadedFile(file.originalFileObj)
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
    carDayRateUsageCount: number,
    uploadedMeta: { name: string; key: string },
  ) => {
    // Store only metadata in answers (small payload)
    setValue('carDayRateUsageCount', carDayRateUsageCount)
    setValue('carDayRateUsageFile', [uploadedMeta])
    await updateApplication({
      variables: {
        input: {
          id: application.id,
          answers: {
            ...application.answers,
            carDayRateUsageCount,
            carDayRateUsageFile: [uploadedMeta],
          },
        },
        locale,
      },
    })
  }

  const fileData = field.props.getFileContent?.(dayRateRecords, lang)
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
