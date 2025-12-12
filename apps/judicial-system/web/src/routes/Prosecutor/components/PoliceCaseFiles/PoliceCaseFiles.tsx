import { FC, useContext } from 'react'
import { useIntl } from 'react-intl'

import { AlertMessage, Box } from '@island.is/island-ui/core'
import { isIndictmentCase } from '@island.is/judicial-system/types'
import {
  FormContext,
  Item,
  SelectableList,
} from '@island.is/judicial-system-web/src/components'
import {
  CaseOrigin,
  CaseType,
  PoliceCaseFile,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { strings } from './PoliceCaseFiles.strings'

export interface PoliceCaseFilesData {
  files: PoliceCaseFile[]
  isLoading: boolean
  hasError: boolean
  errorCode?: string
}

export interface PoliceCaseFileCheck extends PoliceCaseFile {
  checked: boolean
}

export const mapPoliceCaseFileToPoliceCaseFileCheck = (
  file: PoliceCaseFile,
): PoliceCaseFileCheck => ({
  id: file.id,
  name: file.name,
  policeCaseNumber: file.policeCaseNumber,
  chapter: file.chapter,
  displayDate: file.displayDate,
  type: file.type,
  checked: false,
})

interface Props {
  onUpload: (selectedFiles: Item[]) => Promise<void>
  policeCaseFileList?: PoliceCaseFileCheck[]
  policeCaseFiles?: PoliceCaseFilesData
}

const PoliceCaseFiles: FC<Props> = ({
  onUpload,
  policeCaseFileList,
  policeCaseFiles,
}) => {
  const { formatMessage } = useIntl()
  const { workingCase } = useContext(FormContext)
  const isIndictment = workingCase.type === CaseType.INDICTMENT

  const validateFileName = (filename: string) => {
    const invalid = !filename.endsWith('.pdf')
    if (!invalid) return {}

    return {
      invalid,
      tooltipText: formatMessage(strings.invalidPoliceCaseFileFromLOKE),
    }
  }

  return (
    <Box marginBottom={5}>
      {workingCase.origin === CaseOrigin.LOKE && (
        <Box marginBottom={3}>
          <SelectableList
            items={policeCaseFileList?.map((p) => {
              return {
                id: p.id,
                name: p.name,
                ...(isIndictment ? validateFileName(p.name) : {}),
              }
            })}
            CTAButton={{
              onClick: onUpload,
              label: formatMessage(strings.uploadButtonLabel),
            }}
            errorMessage={
              policeCaseFiles?.hasError
                ? formatMessage(strings.couldNotGetFromLOKEMessage)
                : undefined
            }
            isLoading={
              policeCaseFiles?.isLoading === undefined
                ? true
                : policeCaseFiles?.isLoading
            }
            successMessage={
              policeCaseFileList?.length === 0
                ? formatMessage(strings.allFilesUploadedMessage)
                : undefined
            }
            warningMessage={
              policeCaseFiles?.files.length === 0
                ? formatMessage(strings.noFilesFoundInLOKEMessage, {
                    isIndictmentCase: isIndictmentCase(workingCase.type),
                  })
                : undefined
            }
          />
        </Box>
      )}
      {workingCase.origin !== CaseOrigin.LOKE && (
        <AlertMessage
          type="info"
          title={formatMessage(strings.originNotLokeTitle, {
            isIndictmentCase: isIndictmentCase(workingCase.type),
          })}
          message={formatMessage(strings.originNotLokeMessage, {
            isIndictmentCase: isIndictmentCase(workingCase.type),
          })}
        ></AlertMessage>
      )}
    </Box>
  )
}

export default PoliceCaseFiles
