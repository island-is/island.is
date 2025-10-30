import { Controller, useFormContext, useWatch } from 'react-hook-form'
import {
  AlertMessage,
  Box,
  Button,
  FileUploadStatus,
  InputFileUploadDeprecated,
  LoadingDots,
  UploadFileDeprecated,
} from '@island.is/island-ui/core'
import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import { FC, useCallback, useEffect, useState } from 'react'
import { FILE_SIZE_LIMIT, predefinedHeaders } from '../../lib/constants'
import { parse } from 'csv-parse'
import { CSVError, Participant } from '../../shared/types'
import { participants as participantMessages } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { DescriptionFormField } from '@island.is/application/ui-fields'
import {
  formatPhoneNumber,
  validateEmails,
  validatePhoneNumbers,
  validateSSN,
} from '../../utils'
import { useLazyAreIndividualsValid } from '../../hooks/useLazyAreIndividualsValid'
import { getValueViaPath } from '@island.is/application/core'
import { SeminarIndividual } from '@island.is/api/schema'

const parseDataToParticipantList = (csvInput: string): Participant | null => {
  const values = csvInput.split(';')
  const hasNoEmptyValues =
    !!values[0] && !!values[1] && !!values[2] && !!values[3]
  if (!hasNoEmptyValues) {
    return null
  }
  const nationalIdWithoutHyphen = values[1].replace('-', '')
  return {
    nationalIdWithName: {
      name: values[0],
      nationalId: nationalIdWithoutHyphen,
    },
    email: values[2],
    phoneNumber: formatPhoneNumber(values[3]),
    disabled: 'false',
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

export const Participants: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  error,
  application,
}) => {
  const { setValue, trigger } = useFormContext()
  const values = useWatch({ name: 'participantList' })
  const { formatMessage, locale } = useLocale()
  const [fileState, setFileState] = useState<Array<UploadFileDeprecated>>([])
  const [participantList, setParticipantList] = useState<Array<Participant>>([])
  const [foundNotValid, setFoundNotValid] = useState<boolean>(false)
  const [csvInputError, setCsvInputError] = useState<Array<CSVError>>([])
  const [csvInputEmailWarning, setCsvInputEmailWarning] = useState<
    Array<number>
  >([])
  const [csvIsLoading, setCsvIsLoading] = useState<boolean>(false)
  const courseID =
    getValueViaPath<string>(application.answers, 'initialQuery', '') ?? ''

  const registererNationalId =
    getValueViaPath<string>(
      application.externalData,
      'nationalRegistry.nationalId',
      '',
    ) ?? ''
  const getAreIndividualsValid = useLazyAreIndividualsValid()
  const getIsIndividualValidCallback = useCallback(
    async (individuals: Array<SeminarIndividual>) => {
      const { data } = await getAreIndividualsValid({
        input: { individuals: individuals },
        courseID,
        nationalIdOfRegisterer: registererNationalId,
      })
      return data
    },
    [getAreIndividualsValid, courseID, registererNationalId],
  )

  useEffect(() => {
    const finishedValues: Array<Participant> = values?.filter(
      (x: Participant) => x.disabled !== undefined,
    )
    const unfinishedValues: Array<Participant> = values?.filter(
      (x: Participant) => x.disabled === undefined,
    )

    if (
      (finishedValues ?? []).filter((x: Participant) => x.disabled === 'true')
        .length === 0 &&
      finishedValues !== participantList &&
      unfinishedValues?.length === 0
    ) {
      trigger('participantList')
      setValue('participantValidityError', '')
      setValue('participantFinishedValidation', 'true')
      setFoundNotValid(false)
    } else if (unfinishedValues?.length === 0) {
      trigger('participantList')
    }
  }, [values, participantList, setValue, trigger])

  const changeFile = (props: Array<UploadFileDeprecated>) => {
    const reader = new FileReader()
    reader.onload = function () {
      if (typeof reader.result !== 'string') {
        setValue('participantCsvError', true)
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
          if (err) {
            rejectFile()
            return
          }
          const headers = data.shift()
          const validHeaders = checkHeaders(headers[0])
          if (!validHeaders) {
            rejectFile()
            return
          }
          const errorListFromAnswers: Array<CSVError> = []

          const allEmails: Array<string> = []
          const allEmailWarnings: Array<number> = []

          const answerValue: Array<Participant> = data.reduce(
            (
              validParticipants: Array<Participant>,
              value: Array<string>,
              index: number,
            ) => {
              const parsedParticipant = parseDataToParticipantList(value[0])

              if (parsedParticipant === null) {
                setValue('participantCsvError', 'true')
                return validParticipants
              }

              // Check for duplicate email
              const isEmailDuplicate =
                parsedParticipant.email &&
                allEmails.includes(parsedParticipant.email)
              if (isEmailDuplicate) {
                allEmailWarnings.push(index + 1)
                return validParticipants
              }

              // Add email to tracking array
              parsedParticipant.email && allEmails.push(parsedParticipant.email)

              // Add valid participant to results
              return [...validParticipants, parsedParticipant]
            },
            [],
          )

          const allPhoneNumbers = answerValue.map((x) =>
            formatPhoneNumber(x.phoneNumber),
          )
          const allSSN = answerValue.map((x) => x.nationalIdWithName.nationalId)
          const ssnErrors = validateSSN(allSSN)
          const phoneErrors = validatePhoneNumbers(allPhoneNumbers)
          const emailErrors = validateEmails(allEmails)
          setCsvInputEmailWarning(allEmailWarnings)

          if (emailErrors.length > 0) {
            errorListFromAnswers.push({
              items: emailErrors,
              error: participantMessages.labels.csvEmailInputError,
            })
          }
          if (phoneErrors.length > 0) {
            errorListFromAnswers.push({
              items: phoneErrors,
              error: participantMessages.labels.csvPhoneNumberInputError,
            })
          }
          if (ssnErrors.length > 0) {
            errorListFromAnswers.push({
              items: ssnErrors,
              error: participantMessages.labels.csvSsnInputError,
            })
          }

          setCsvInputError(errorListFromAnswers)

          const individuals: Array<SeminarIndividual> = answerValue.map((x) => {
            return {
              nationalId: x.nationalIdWithName.nationalId,
              email: x.email,
            }
          })

          //validate that individiduals are allowed to take this seminar
          const response = await getIsIndividualValidCallback(individuals)
          const disabledParticipant = response?.areIndividualsValid?.find(
            (x) => x.mayTakeCourse === false,
          )
          if (disabledParticipant) {
            setValue(
              'participantValidityError',
              locale === 'is'
                ? disabledParticipant.errorMessage
                : disabledParticipant.errorMessageEn,
            )
            setFoundNotValid(true)
          }

          if (errorListFromAnswers.length === 0) {
            const fileWithSuccessStatus: UploadFileDeprecated = props[0]
            Object.assign(fileWithSuccessStatus, {
              status: FileUploadStatus.done,
            })
            const finalAnswerValue = answerValue.map<Participant>((x) => {
              const participantInRes = response?.areIndividualsValid?.find(
                (z) => z.nationalID === x.nationalIdWithName.nationalId,
              )
              return {
                ...x,
                disabled: (!participantInRes?.mayTakeCourse).toString(),
              }
            })
            setValue('participantCsvError', 'false')
            setFileState([fileWithSuccessStatus])
            setParticipantList(finalAnswerValue)
            setValue('participantList', finalAnswerValue)
          }
        } finally {
          setCsvIsLoading(false)
        }
      })
    }
    reader.readAsText(props[0] as unknown as Blob, 'UTF-8')

    return
  }

  const removeFile = () => {
    setFileState([])
  }

  const rejectFile = () => {
    setValue('participantCsvError', 'true')
    return
  }

  const onCsvButtonClick = () => {
    const csvContent = `\uFEFFnafn;kennitala;netfang;sími\nNafn hér;123456-7890;netfang@netfang.com;123-4567`

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', 'csv_template_ver.csv')
    document.body.appendChild(link)
    link.click()

    document.body.removeChild(link)
  }

  const removeInvalidParticipants = async () => {
    const validParticipants = participantList.filter(
      (x) => x.disabled === 'false',
    )
    setValue('participantList', validParticipants)
    setParticipantList(validParticipants)
    setValue('participantValidityError', '')
    setFoundNotValid(false)
    trigger('participantList')
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
            {formatMessage(
              participantMessages.labels.removeInvalidParticipantsButtonText,
            )}
          </Button>
        </Box>
      )}
      <Box marginTop={2}>
        {DescriptionFormField({
          application: application,
          showFieldName: true,
          field: {
            id: 'title',
            title: participantMessages.labels.csvDescription,
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
          {formatMessage(participantMessages.labels.csvButtonText)}
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
          <InputFileUploadDeprecated
            applicationId={application.id}
            fileList={fileState}
            header={formatMessage(participantMessages.labels.uploadHeader)}
            buttonLabel={formatMessage(participantMessages.labels.uploadButton)}
            onChange={(e) => changeFile(e)}
            onRemove={() => removeFile()}
            onUploadRejection={rejectFile}
            errorMessage={error}
            multiple={false}
            accept={['text/csv']}
            maxSize={FILE_SIZE_LIMIT}
          />
        )}
      />

      {csvInputError.length > 0 &&
        csvInputError.map((csvError: CSVError) => {
          const messageString = `${formatMessage(
            participantMessages.labels.csvErrorLabel,
          )} ${csvError.items.join(', ')} - ${formatMessage(csvError.error)}`
          return <AlertMessage type="error" message={messageString} />
        })}

      {csvInputEmailWarning.length > 0 && (
        <AlertMessage
          type="warning"
          message={`${formatMessage(
            participantMessages.labels.csvErrorLabel,
          )} ${csvInputEmailWarning.join(', ')} - ${formatMessage(
            participantMessages.labels.csvDuplicateEmailError,
          )}`}
        />
      )}
    </Box>
  )
}
