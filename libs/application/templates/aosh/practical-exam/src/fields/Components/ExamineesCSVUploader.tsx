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
import { FILE_SIZE_LIMIT, predefinedHeaders } from '../../lib/constants'
import { parse } from 'csv-parse'
import { useLocale } from '@island.is/localization'
import { DescriptionFormField } from '@island.is/application/ui-fields'
import { formatPhoneNumber } from '../../utils'
import { getValueViaPath } from '@island.is/application/core'
import { useLazyAreExamineesEligible } from '../../hooks/useLazyAreExamineesEligible'
import { CSVError, Examinee, ExamineeInput } from '../../utils/type'
import { TrueOrFalse } from '../../utils/enums'

const parseDataToExamineeList = (csvInput: string): ExamineeInput | null => {
  const values = csvInput.split(';')
  const hasNoEmptyValues =
    !!values[0] && !!values[1] && !!values[2] && !!values[3]
  if (!hasNoEmptyValues) {
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
  const [csvInputEmailWarning, setCsvInputEmailWarning] = useState<
    Array<number>
  >([])
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
      trigger('examineesList')
      // Avoid unnecessary setValue calls
      if (getValues('examineesValidityError') !== '') {
        setValue('examineesValidityError', '')
      }
    }
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

          //   const allEmails: Array<string> = []
          //   const allEmailWarnings: Array<number> = []

          const answerValue: Array<ExamineeInput> = data.reduce(
            (
              validExaminees: Array<ExamineeInput>,
              value: Array<string>,
              index: number,
            ) => {
              const parsedExaminee = parseDataToExamineeList(value[0])
              console.log(parsedExaminee)

              //       if (parsedParticipant === null) {
              //         setValue('participantCsvError', 'true')
              //         return validParticipants
              //       }

              //       // Check for duplicate email
              //       const isEmailDuplicate =
              //         parsedParticipant.email &&
              //         allEmails.includes(parsedParticipant.email)
              //       if (isEmailDuplicate) {
              //         allEmailWarnings.push(index + 1)
              //         return validParticipants
              //       }

              //       // Add email to tracking array
              //       parsedParticipant.email && allEmails.push(parsedParticipant.email)

              //       // Add valid participant to results
              //       return [...validParticipants, parsedParticipant]
              return [...validExaminees, parsedExaminee]
            },
            [],
          )

          // TODO(Balli) Validate duplicates etc..

          // setCsvInputError(errorListFromAnswers)

          const nationalIdList: string[] = answerValue.flatMap(
            (item) => item.nationalId.nationalId ?? [],
          )

          const response = await getAreExamineesEligibleCallback(nationalIdList)
          console.log('RESPONSE', response)

          //validate that individiduals are allowed to take this seminar
          const disabledExaminees = response?.getExamineeEligibility?.find(
            (x) => x.isEligable === false,
          )
          if (disabledExaminees) {
            console.log('THERE ARE DISABLED EXAMINEES')

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

            const finalAnswerValue: Examinee[] = answerValue.map(
              (x): Examinee => {
                const examineesInRes = response?.getExamineeEligibility?.find(
                  (z) => z.nationalId === x.nationalId.nationalId,
                )
                const disabled = !examineesInRes?.isEligable
                  ? TrueOrFalse.false
                  : TrueOrFalse.true
                return {
                  ...x,
                  disabled: disabled,
                }
              },
            )

            console.log('Will set examinee list to', finalAnswerValue)

            setValue('examineesCsvError', 'false')
            setFileState([fileWithSuccessStatus])
            setExamineeList(finalAnswerValue)
            setValue('examineeList', finalAnswerValue)
          }
        } finally {
          setCsvIsLoading(false)
        }
      })
    }
    reader.readAsText(props[0] as unknown as Blob)

    return
  }

  const removeFile = () => {
    // setFileState([])
  }

  const rejectFile = () => {
    // setValue('participantCsvError', 'true')
    return
  }

  const csvFile = `data:text/csv;charset=utf-8,nafn;kennitala;netfang;simi;okuskirteini;utgafuland\nNafn hér;123456-7890;netfang@netfang.com;123-4567;123123;Ísland`

  const onCsvButtonClick = () => {
    const encodeUri = encodeURI(csvFile)
    const a = document.createElement('a')
    a.setAttribute('href', encodeUri)
    a.setAttribute('target', '_blank')
    a.setAttribute('download', 'csv_template.csv')
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const removeInvalidParticipants = async () => {
    // const validParticipants = participantList.filter(
    //   (x) => x.disabled === 'false',
    // )
    // setValue('participantList', validParticipants)
    // setParticipantList(validParticipants)
    // setValue('participantValidityError', '')
    // setFoundNotValid(false)
    // trigger('participantList')
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
            {formatMessage('Fjarlægja ógjaldgenga þátttakendur')}
          </Button>
        </Box>
      )}
      <Box marginTop={2}>
        {DescriptionFormField({
          application: application,
          showFieldName: true,
          field: {
            id: 'title',
            title:
              'Ef þú ert að skrá marga einstaklinga í einu á námskeið geturðu hlaðið inn .csv skjali hér. Athugið að .csv skjal yfirskrifar þátttakendur í töflu',
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
          {formatMessage('Sækja csv sniðmát')}
        </Button>
      </Box>
      {csvIsLoading && (
        <Box
          width="full"
          display={'flex'}
          justifyContent={'center'}
          marginY={2}
        >
          <LoadingDots large />
        </Box>
      )}
      <Controller
        name="csv-upload-participants"
        render={() => (
          <InputFileUpload
            applicationId={application.id}
            fileList={fileState}
            header={formatMessage('Skrá marga þátttakendur í einu')}
            buttonLabel={formatMessage('Hlaða inn .csv skjali')}
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
            'Villa í CSV skjali fyrir línur:',
          )} ${csvError.items.join(', ')} - ${formatMessage(csvError.error)}`
          return <AlertMessage type="error" message={messageString} />
        })}

      {csvInputEmailWarning.length > 0 && (
        <AlertMessage type="warning" message={'blalaldasldsa'} />
      )}
    </Box>
  )
}
