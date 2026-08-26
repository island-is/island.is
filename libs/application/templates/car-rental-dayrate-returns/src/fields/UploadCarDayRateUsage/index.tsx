import {
  Box,
  Button,
  fileToObjectDeprecated,
  FileUploadStatus,
  InputFileUpload,
} from '@island.is/island-ui/core'
import { Dispatch, useEffect, useState } from 'react'
import { FileRejection } from 'react-dropzone'
import { FieldBaseProps } from '@island.is/application/types'
import { CarUsageError, DayRateRecord } from '../../utils/types'
import { getEligibleDayRateRecords } from '../../utils/dayRateRecordUtils'
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

type FileMeta = { name: string; key: string }

// Enough to act on without turning the inline error into a wall of plates
const MAX_LISTED_ERROR_ROWS = 10

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
  const uploadedMeta: FileMeta[] | undefined = watch('carDayRateUsageFile')

  // Drive the dropzone off the answers, not local state, so the file shown
  // always matches what validation and submit will use after a remount
  const uploadedFiles = (uploadedMeta ?? []).map(({ name, key }) => ({
    name,
    key,
    status: FileUploadStatus.done,
  }))

  const [updateApplication] = useMutation(UPDATE_APPLICATION)

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

  // Keyed on every record, including already reported ones, so the parser can
  // tell "not one of your vehicles" apart from "nothing left to report"
  const dayRateRecordsByPermno = new Map<string, DayRateRecord>(
    dayRateRecords.map((d) => [d.permno, d]),
  )

  const eligibleRecordCount = getEligibleDayRateRecords(dayRateRecords).length

  // A blank plate cell is itself a "car not found" error, so fall back to the
  // row number rather than rendering a bare dash
  const describeErrorRow = (error: CarUsageError) =>
    error.carNr?.trim() ||
    formatMessage(m.multiUpload.rowLabel, { row: error.row })

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
      if (parsed.reason === 'unreadable') {
        setUploadErrorMessage(formatMessage(m.multiUpload.unreadableFile))
        return null
      }

      if (parsed.reason === 'no-data') {
        setUploadErrorMessage(formatMessage(m.multiUpload.noCarsToChangeFound))
        return null
      }

      // We have errors, name the offending rows either way
      const errorMessages = parsed.errors as CarUsageError[]
      if (errorMessages.length === 1) {
        setUploadErrorMessage(
          `${describeErrorRow(errorMessages[0])} - ${formatMessage(
            errorMessages[0].message,
          )}`,
        )
      } else {
        const listed = errorMessages.slice(0, MAX_LISTED_ERROR_ROWS)
        setUploadErrorMessage(
          `${errorMessages.length} ${formatMessage(
            m.multiUpload.errorMessageToUser,
          )} (${listed.map(describeErrorRow).join(', ')}${
            errorMessages.length > listed.length ? '…' : ''
          })`,
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

    // Already reported vehicles are left out of the generated template and
    // skipped by the parser, so only the eligible ones have to be accounted for
    if (parsed.records.length !== eligibleRecordCount) {
      setUploadErrorMessage(formatMessage(m.multiUpload.allCarsMustBePresent))
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

  const handleOnInputFileUploadRemove = async () => {
    setUploadErrorMessage(null)
    setErrorFile(null)
    await persistUploadAnswers(undefined, undefined)
  }

  const handleOnInputFileUploadChange = async (files: File[]) => {
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
      }
    }
  }

  const uploadAndStoreFile = async (file: File): Promise<FileMeta> => {
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
    carDayRateUsageCount: number | undefined,
    uploadedMeta: FileMeta | undefined,
  ) => {
    // Store only metadata in answers (small payload)
    const carDayRateUsageFile = uploadedMeta ? [uploadedMeta] : []
    setValue('carDayRateUsageCount', carDayRateUsageCount)
    setValue('carDayRateUsageFile', carDayRateUsageFile)
    await updateApplication({
      variables: {
        input: {
          id: application.id,
          answers: {
            ...application.answers,
            carDayRateUsageCount,
            carDayRateUsageFile,
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
        files={uploadedFiles}
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
