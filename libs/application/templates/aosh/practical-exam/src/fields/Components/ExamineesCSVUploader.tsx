import { Controller, useFormContext, useWatch } from 'react-hook-form'
import {
  AlertMessage,
  Box,
  Button,
  FileUploadStatus,
  InputFileUpload,
  LoadingDots,
  UploadFile,
} from '@island.is/island-ui/core'
import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import { FC, useCallback, useEffect, useState } from 'react'
import {
  FILE_SIZE_LIMIT,
  predefinedHeaders,
  CSV_FILE,
} from '../../lib/constants'
import { parse } from 'csv-parse'
import { useLocale } from '@island.is/localization'
import { DescriptionFormField } from '@island.is/application/ui-fields'
import { formatPhoneNumber } from '../../utils'
import { useLazyAreExamineesEligible } from '../../hooks/useLazyAreExamineesEligible'
import { Examinee, ExamineeInput } from '../../utils/types'
import { TrueOrFalse } from '../../utils/enums'
import { examinee } from '../../lib/messages'
import {
  ErrorIndexes,
  processErrors,
  trackDuplicates,
  validateExaminee,
} from './examineeCSVUtils'
import { CSVError } from '../../utils/interfaces'

export const ExamineesCSVUploader: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ error, application }) => {
  const { formatMessage, locale } = useLocale()
  const [fileState, setFileState] = useState<Array<UploadFile>>([])
  const values = useWatch({ name: 'examinees' })
  const { setValue, trigger, getValues } = useFormContext()
  const [examineesList, setExamineeList] = useState<Array<ExamineeInput>>()
  const [foundNotValid, setFoundNotValid] = useState<boolean>(false)
  const [csvInputError, setCsvInputError] = useState<Array<CSVError>>([])
  const [csvIsLoading, setCsvIsLoading] = useState<boolean>(false)

  const getAreExamineesEligible = useLazyAreExamineesEligible()
  const getAreExamineesEligibleCallback = useCallback(
    async (nationalIds: Array<string>) => {
      const { data } = await getAreExamineesEligible({
        input: { nationalIds: nationalIds, xCorrelationID: application.id },
      })
      return data
    },
    [application.id, getAreExamineesEligible],
  )

  const parseDataToExamineeList = (csvInput: string): ExamineeInput | null => {
    const values = csvInput.split(';')
    const isValid = values.length === 6 && values.every((value) => !!value)

    if (!isValid) {
      return null
    }
    const nationalIdWithoutHyphen = values[1].replace('-', '')
    return {
      nationalId: {
        name: values[0],
        nationalId: nationalIdWithoutHyphen,
      },
      email: values[2],
      phone: formatPhoneNumber(values[3]),
      licenseNumber: values[4],
      countryIssuer: values[5],
    }
  }

  const checkHeaders = (headers: string): boolean => {
    const values = headers.split(';')
    let validHeaders = true
    values.forEach((value, index) => {
      if (!predefinedHeaders[index].includes(value)) {
        validHeaders = false
      }
    })

    return validHeaders
  }

  useEffect(() => {
    const finishedValues: Array<Examinee> = values?.filter(
      (x: Examinee) => x.disabled !== undefined,
    )
    const unfinishedValues: Array<Examinee> = values?.filter(
      (x: Examinee) => x.disabled === undefined,
    )

    if (
      finishedValues?.filter((x: Examinee) => x.disabled === 'true').length ===
        0 &&
      finishedValues !== examineesList &&
      unfinishedValues.length === 0
    ) {
      trigger('examinees')
      // Avoid unnecessary setValue calls
      if (getValues('examineesValidityError') !== '') {
        setValue('examineesValidityError', '')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examineesList, values])

  const changeFile = (props: Array<UploadFile>) => {
    const reader = new FileReader()
    reader.onload = function () {
      if (typeof reader.result !== 'string') {
        setValue('examineeCsvError', true)
        throw new TypeError(
          `Expected reader.result to be a string, but got ${
            reader.result === null ? 'null' : typeof reader.result
          }.`,
        )
      }
      const csvData = reader.result

      setCsvIsLoading(true)
      parse(csvData, async (err, data) => {
        try {
          if (err) return rejectFile()

          const headers = data.shift()
          if (!checkHeaders(headers[0])) return rejectFile()

          const errorListFromAnswers: Array<CSVError> = []
          const duplicateEmails: number[] = []
          const duplicateNationalIds: number[] = []

          const seenEmails = new Map<string, Set<number>>()
          const seenNationalIds = new Map<string, Set<number>>()

          const errors: ErrorIndexes = {
            invalidSSNs: [],
            invalidEmails: [],
            invalidPhones: [],
          }

          const answerValue: Array<ExamineeInput> = data.reduce(
            (
              validExaminees: Array<ExamineeInput>,
              value: Array<string>,
              index: number,
            ) => {
              const parsedExaminee = parseDataToExamineeList(value[0])
              if (!parsedExaminee) {
                setValue('examineesCsvError', 'true')
                return validExaminees
              }

              // Validate fields
              const validationErrors: ErrorIndexes = validateExaminee(
                parsedExaminee,
                index,
              )
              Object.keys(errors).forEach((key) => {
                const errorKey = key as keyof ErrorIndexes
                errors[errorKey].push(...validationErrors[errorKey])
              })

              // Track duplicates
              if (parsedExaminee.email)
                trackDuplicates(
                  seenEmails,
                  parsedExaminee.email,
                  index,
                  duplicateEmails,
                )
              if (parsedExaminee.nationalId.nationalId)
                trackDuplicates(
                  seenNationalIds,
                  parsedExaminee.nationalId.nationalId,
                  index,
                  duplicateNationalIds,
                )

              return [...validExaminees, parsedExaminee]
            },
            [],
          )

          // Process errors
          processErrors(errorListFromAnswers, errors)
          if (duplicateEmails.length)
            errorListFromAnswers.push({
              items: duplicateEmails,
              error: examinee.tableRepeater.csvDuplicateEmailError,
            })
          if (duplicateNationalIds.length)
            errorListFromAnswers.push({
              items: duplicateNationalIds,
              error: examinee.tableRepeater.csvDuplicateNationalId,
            })

          setCsvInputError(errorListFromAnswers)

          const nationalIdList: string[] = answerValue.flatMap(
            (item) => item.nationalId.nationalId ?? [],
          )
          const response = await getAreExamineesEligibleCallback(nationalIdList)

          const disabledExaminees = response?.getExamineeEligibility?.find(
            (x) => x.isEligible === false,
          )
          if (disabledExaminees) {
            setValue(
              'examineesValidityError',
              locale === 'is'
                ? disabledExaminees.errorMsg
                : disabledExaminees.errorMsgEn,
            )
            setFoundNotValid(true)
          }

          if (errorListFromAnswers.length === 0) {
            const fileWithSuccessStatus: UploadFile = props[0]
            Object.assign(fileWithSuccessStatus, {
              status: FileUploadStatus.done,
            })

            const finalAnswerValue: Examinee[] = answerValue.map((x) => {
              const examineesInRes = response?.getExamineeEligibility?.find(
                (z) => z.nationalId === x.nationalId.nationalId,
              )
              return {
                ...x,
                disabled: examineesInRes?.isEligible
                  ? TrueOrFalse.false
                  : TrueOrFalse.true,
              }
            })

            setValue('examineesCsvError', 'false')
            setFileState([fileWithSuccessStatus])
            setExamineeList(finalAnswerValue)
            setValue('examinees', finalAnswerValue)
          } else {
            setFoundNotValid(false)
          }
        } finally {
          setCsvIsLoading(false)
        }
      })
    }

    reader.readAsText(props[0] as unknown as Blob)
  }

  const removeFile = () => {
    setFileState([])
  }

  const rejectFile = () => {
    setValue('examineesCsvError', 'true')
    return
  }

  const onCsvButtonClick = () => {
    const encodeUri = encodeURI(CSV_FILE)
    const a = document.createElement('a')
    a.setAttribute('href', encodeUri)
    a.setAttribute('target', '_blank')
    a.setAttribute('download', 'csv_template.csv')
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const removeInvalidParticipants = async () => {
    const validExaminees: Array<Examinee> = values?.filter(
      (x: Examinee) => x.disabled === 'false',
    )
    setValue('examinees', validExaminees)
    setExamineeList(validExaminees)
    setValue('examineesValidityError', '')
    setFoundNotValid(false)
    trigger('examinees')
  }

  return (
    <Box>
      {foundNotValid && (
        <Box display="flex" justifyContent="flexEnd" marginTop={2}>
          <Button
            onClick={removeInvalidParticipants}
            variant="ghost"
            size="default"
            icon="trash"
            iconType="outline"
            colorScheme="destructive"
          >
            {formatMessage(examinee.labels.csvRemoveButton)}
          </Button>
        </Box>
      )}
      <Box marginTop={2}>
        {DescriptionFormField({
          application: application,
          showFieldName: true,
          field: {
            id: 'title',
            title: formatMessage(examinee.labels.csvDescription),
            titleVariant: 'h5',
            type: FieldTypes.DESCRIPTION,
            component: FieldComponents.DESCRIPTION,
            children: undefined,
          },
        })}
      </Box>
      <Box marginTop={1} marginBottom={4}>
        <Button
          onClick={onCsvButtonClick}
          variant="text"
          size="small"
          icon="download"
          iconType="outline"
        >
          {formatMessage(examinee.labels.csvCopy)}
        </Button>
      </Box>
      {csvIsLoading && (
        <Box
          width="full"
          display={'flex'}
          justifyContent={'center'}
          marginY={2}
        >
          <LoadingDots size="large" />
        </Box>
      )}
      <Controller
        name="csv-upload-participants"
        render={() => (
          <InputFileUpload
            files={fileState}
            title={formatMessage(examinee.labels.csvHeader)}
            buttonLabel={formatMessage(examinee.labels.csvUpload)}
            onChange={(e) => changeFile(e)}
            onRemove={() => removeFile()}
            onUploadRejection={rejectFile}
            errorMessage={error}
            multiple={false}
            accept={['text/csv']}
            maxSize={FILE_SIZE_LIMIT}
            name={'csv-upload-participants-file-upload'}
          />
        )}
      />

      {csvInputError.length > 0 &&
        csvInputError.map((csvError: CSVError, index) => {
          const messageString = `${formatMessage(
            examinee.tableRepeater.csvLineError,
          )} ${csvError.items.join(', ')} - ${formatMessage(csvError.error)}`
          return (
            <Box paddingTop={1} key={index}>
              <AlertMessage type="error" message={messageString} />
            </Box>
          )
        })}
    </Box>
  )
}
