import { Controller, useFormContext } from 'react-hook-form'
import {
  Box,
  Button,
  InputFileUpload,
  UploadFile,
  UploadFileStatus,
} from '@island.is/island-ui/core'
import { FieldBaseProps } from '@island.is/application/types'
import { FC, useEffect, useState } from 'react'
import { FILE_SIZE_LIMIT } from '../../lib/constants'
import { parse } from 'csv-parse'
import { Participant } from '../../shared/types'
import { participants as participantMessages } from '../../lib/messages'
import { useLocale } from '@island.is/localization'

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
}) => {
  const { setValue, getValues } = useFormContext()
  const { formatMessage } = useLocale()
  const [fileState, setFileState] = useState<Array<UploadFile>>([])
  const [uploadError, setUploadError] = useState<string>('')

  const changeFile = (props: Array<UploadFile>) => {
    const reader = new FileReader()
    reader.onload = function (e) {
      const csvData = reader.result as string
      // TODO if CSV error, display error on screen and make file rejected
      parse(csvData, (err, data) => {
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
        setValue('participantList', [...currentParticipantList, ...answerValue])

        const fileWithSuccessStatus: UploadFile = props[0]
        Object.assign(fileWithSuccessStatus, {
          status: 'done' as UploadFileStatus,
        })
        setValue('participantCsvError', false)
        setFileState([fileWithSuccessStatus])
      })
    }
    reader.readAsText(props[0] as Blob)
    return
  }

  const removeFile = (file: UploadFile) => {
    console.log('file', file)
    setFileState([])
  }

  const rejectFile = () => {
    setValue('participantCsvError', true)
    return
  }
  return (
    <Box>
      <Controller
        name="csv-upload-participants"
        render={() => (
          <InputFileUpload
            applicationId={application.id}
            fileList={fileState}
            header={formatMessage(participantMessages.labels.uploadHeader)}
            buttonLabel={formatMessage(participantMessages.labels.uploadButton)}
            onChange={(e) => changeFile(e)}
            onRemove={(e) => removeFile(e)}
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
