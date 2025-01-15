import { Controller, useFormContext } from 'react-hook-form'
import {
  Box,
  Button,
  InputFileUpload,
  UploadFile,
} from '@island.is/island-ui/core'
import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import { FC, useState } from 'react'
import { FILE_SIZE_LIMIT } from '../../lib/constants'
import { parse } from 'csv-parse'
import { FileUploadStatus, Participant } from '../../shared/types'
import { participants as participantMessages } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { DescriptionFormField } from '@island.is/application/ui-fields'

interface IndexableObject {
  [index: number]: Array<string>
}
const predefinedHeaders: IndexableObject = {
  0: ['nafn', 'name'],
  1: ['kennitala', 'ssn'],
  2: ['netfang', 'email'],
  3: ['sími', 'phone'],
}

const parseDataToParticipantList = (csvInput: string): Participant | null => {
  const values = csvInput.split(';')
  const hasNoEmptyValues =
    !!values[0] && !!values[1] && !!values[2] && !!values[3]
  if (!hasNoEmptyValues) {
    return null
  }
  const nationalIdWithoutHyphen = values[1].replace('-', '')
  return {
    name: values[0],
    nationalId: nationalIdWithoutHyphen,
    email: values[2],
    phoneNumber: values[3],
    disabled: 'false',
  }
}

const checkHeaders = (headers: string): boolean => {
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
  const { setValue } = useFormContext()
  const { formatMessage } = useLocale()
  const [fileState, setFileState] = useState<Array<UploadFile>>([])
  const [participantList, setParticipantList] = useState<Array<Participant>>([])
  const [foundNotValid, setFoundNotValid] = useState<boolean>(false)

  const changeFile = (props: Array<UploadFile>) => {
    const reader = new FileReader()
    reader.onload = function (e) {
      if (typeof reader.result !== 'string') {
        setValue('participantCsvError', true)
        throw new TypeError(
          `Expected reader.result to be a string, but got ${
            reader.result === null ? 'null' : typeof reader.result
          }.`,
        )
      }
      const csvData = reader.result
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
            const participantList = parseDataToParticipantList(value[0])
            if (participantList === null) {
              setValue('participantCsvError', true)
              return []
            } else {
              return parseDataToParticipantList(value[0])
            }
          },
        )

        const fileWithSuccessStatus: UploadFile = props[0]
        Object.assign(fileWithSuccessStatus, {
          status: FileUploadStatus.done,
        })
        setValue('participantCsvError', false)
        setFileState([fileWithSuccessStatus])
        setParticipantList(answerValue)
        setValue('participantList', answerValue)
      })
    }
    reader.readAsText(props[0] as unknown as Blob)
    return
  }

  const removeFile = () => {
    setFileState([])
  }

  const rejectFile = () => {
    setValue('participantCsvError', true)
    return
  }

  const csvFile = `data:text/csv;charset=utf-8,nafn;kennitala;netfang;sími`

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

  const removeInvalidParticipants = () => {
    const validParticipants = participantList.filter(
      (x) => x.disabled === 'false',
    )
    setValue('participantList', validParticipants)
    setParticipantList(validParticipants)
    setValue('participantValidityError', false)
    setFoundNotValid(false)
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
            errorMessage={error}
            multiple={false}
            accept={['text/csv']}
            maxSize={FILE_SIZE_LIMIT}
          />
        )}
      />
    </Box>
  )
}
