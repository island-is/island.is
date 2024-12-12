import { Controller, useFormContext } from 'react-hook-form'
import {
  Box,
  Button,
  InputFileUpload,
  UploadFile,
  UploadFileStatus,
} from '@island.is/island-ui/core'
import { FieldBaseProps } from '@island.is/application/types'
import { FC, useCallback, useEffect, useState } from 'react'
import { FILE_SIZE_LIMIT } from '../../lib/constants'
import { parse } from 'csv-parse'
import { Participant } from '../../shared/types'
import { participants as participantMessages } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { useLazyAreIndividualsValid } from '../../hooks/useLazyAreIndividualsValid'
import { formatText, getValueViaPath } from '@island.is/application/core'

interface IndexableObject {
  [index: number]: Array<string>
}
const predefinedHeaders: IndexableObject = {
  0: ['nafn', 'name'],
  1: ['kennitala', 'ssn'],
  2: ['netfang', 'email'],
  3: ['sími', 'phone'],
}

const parseDataToParticipantList = (csvInput: string): Participant => {
  const values = csvInput.split(';')
  const nationalIdWithoutHyphen = values[1].replace('-', '')
  // TODO check if fields are empty og input is empty
  return {
    name: values[0],
    nationalId: nationalIdWithoutHyphen,
    email: values[2],
    phoneNumber: values[3],
  }
}

const checkHeaders = (headers: string): boolean => {
  console.log('headers', headers)
  const values = headers.split(';')
  let validHeaders = true
  values.map((value, index) => {
    if (!predefinedHeaders[index].includes(value)) {
      validHeaders = false
    }
  })

  return validHeaders
}

export const Participants: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  error,
  application,
  setBeforeSubmitCallback,
}) => {
  const { setValue, getValues } = useFormContext()
  const { formatMessage } = useLocale()
  const [fileState, setFileState] = useState<Array<UploadFile>>([])
  const [uploadError, setUploadError] = useState<string>('')
  const [participantList, setParticipantList] = useState<Array<Participant>>([])

  // setBeforeSubmitCallback?.(async () => {
  //   setValue('participantList', participantList)
  //   return [true, null]
  // })

  const getAreIndividualsValid = useLazyAreIndividualsValid()
  const getIsCompanyValidCallback = useCallback(
    async (nationalIds: Array<string>, courseID: number) => {
      const { data } = await getAreIndividualsValid({
        nationalIds,
        courseID,
      })
      return data
    },
    [getAreIndividualsValid],
  )

  const changeFile = (props: Array<UploadFile>) => {
    const reader = new FileReader()
    reader.onload = function (e) {
      const csvData = reader.result as string
      parse(csvData, (err, data) => {
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
        const answerValue: Array<Participant> = data.map(
          (value: Array<string>) => {
            return parseDataToParticipantList(value[0])
          },
        )
        const currentParticipantList = getValues('participantList')
        const combinedParticipants = [...currentParticipantList, ...answerValue]

        const fileWithSuccessStatus: UploadFile = props[0]
        Object.assign(fileWithSuccessStatus, {
          status: 'done' as UploadFileStatus,
        })
        setValue('participantCsvError', false)
        setFileState([fileWithSuccessStatus])
        setParticipantList(combinedParticipants)
        updateValidity(combinedParticipants)
      })
    }
    reader.readAsText(props[0] as Blob)
    return
  }

  const updateValidity = async (participants: Array<Participant>) => {
    const nationalIds = participants.map((x) => x.nationalId)

    if (nationalIds.length > 0) {
      const seminarId = getValueViaPath(
        application.answers,
        'initialQuery',
        '',
      ) as string
      const res = await getIsCompanyValidCallback(
        nationalIds,
        parseInt(seminarId),
      )
      const updatedParticipantList = participants.map((x) => {
        const participantInRes = res.areIndividualsValid.filter(
          (z) => z.nationalID === x.nationalId,
        )
        return { ...x, disabled: participantInRes[0].mayTakeCourse }
      })

      setParticipantList(updatedParticipantList)
      setValue('participantList', updatedParticipantList)
    }
  }

  const removeFile = () => {
    setFileState([])
  }

  const rejectFile = () => {
    setValue('participantCsvError', true)
    return
  }

  const csvFile = `data:text/csv;charset=utf-8,nafn;kennitala;netfang;sími
      PRUFA;010130-3019;prufa@prufa.is;8889999
      PRUFA 2;111111-1119;prufa2@prufa.is;1283499`

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

  return (
    <Box>
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

      <Controller
        name="csv-upload-participants"
        render={() => (
          <InputFileUpload
            applicationId={application.id}
            fileList={fileState}
            header={formatMessage(participantMessages.labels.uploadHeader)}
            buttonLabel={formatMessage(participantMessages.labels.uploadButton)}
            onChange={(e) => changeFile(e)}
            onRemove={() => removeFile()}
            onUploadRejection={rejectFile}
            errorMessage={uploadError || error}
            multiple={false}
            accept={['text/csv']}
            maxSize={FILE_SIZE_LIMIT}
          />
        )}
      />
    </Box>
  )
}
