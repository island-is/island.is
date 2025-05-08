import { Dispatch, FC, SetStateAction } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence } from 'motion/react'

import { AccordionItem, Box, Button, Text } from '@island.is/island-ui/core'
import {
  isCourtOfAppealsUser,
  isDistrictCourtUser,
  isProsecutionUser,
} from '@island.is/judicial-system/types'
import { caseFilesAccordion as m } from '@island.is/judicial-system-web/messages'
import { Case, User } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  UploadState,
  useCourtUpload,
} from '@island.is/judicial-system-web/src/utils/hooks'

import { CaseFileList, InfoBox } from '../..'
import { UploadStateMessage } from './UploadStateMessage'

interface Props {
  workingCase: Case
  setWorkingCase: Dispatch<SetStateAction<Case>>
  user: User
}

const CaseFilesAccordionItem: FC<Props> = (props) => {
  const { workingCase, setWorkingCase, user } = props

  const { formatMessage } = useIntl()
  const { uploadFilesToCourt, uploadState } = useCourtUpload(
    workingCase,
    setWorkingCase,
  )

  const canCaseFilesBeOpened = () => {
    const canProsecutorOpen =
      isProsecutionUser(user) &&
      user.institution?.id === workingCase.prosecutorsOffice?.id

    return (
      canProsecutorOpen ||
      isDistrictCourtUser(user) ||
      isCourtOfAppealsUser(user)
    )
  }

  const canCaseFilesBeUploaded = () => {
    return isDistrictCourtUser(user)
  }

  const caseFiles =
    workingCase.caseFiles?.filter((file) => !file.category) ?? []

  return (
    <AccordionItem
      id="caseFilesAccordionItem"
      label={
        <Box
          display="flex"
          alignItems="center"
          flexGrow={1}
          overflow="hidden"
          justifyContent="spaceBetween"
        >
          <Text variant="h3">
            {formatMessage(m.title, {
              fileCount: caseFiles.length,
            })}
          </Text>
          {canCaseFilesBeUploaded() && (
            <AnimatePresence>
              {(uploadState === UploadState.SOME_NOT_UPLOADED_NONE_AVAILABLE ||
                uploadState === UploadState.ALL_UPLOADED_OR_NOT_AVAILABLE ||
                uploadState === UploadState.UPLOAD_ERROR) && (
                <UploadStateMessage
                  icon="warning"
                  iconColor="red600"
                  message={formatMessage(m.someFilesNotUploadedToCourtText)}
                />
              )}
              {caseFiles.length > 0 &&
                (uploadState === UploadState.ALL_UPLOADED ||
                  uploadState === UploadState.ALL_UPLOADED_NONE_AVAILABLE) && (
                  <UploadStateMessage
                    icon="checkmark"
                    iconColor="blue400"
                    message={formatMessage(m.allFilesUploadedToCourtText)}
                  />
                )}
            </AnimatePresence>
          )}
        </Box>
      }
      labelVariant="h3"
      labelUse="h3"
    >
      <CaseFileList
        caseId={workingCase.id}
        files={caseFiles}
        canOpenFiles={canCaseFilesBeOpened()}
        hideIcons={!isDistrictCourtUser(user)}
        handleRetryClick={(id: string) =>
          uploadFilesToCourt([
            caseFiles[caseFiles.findIndex((file) => file.id === id)],
          ])
        }
      />
      {canCaseFilesBeUploaded() &&
        uploadState !== UploadState.ALL_UPLOADED_OR_NOT_AVAILABLE && (
          <Box display="flex" justifyContent="flexEnd" marginTop={3}>
            {caseFiles.length === 0 ? null : uploadState ===
                UploadState.ALL_UPLOADED_NONE_AVAILABLE ||
              uploadState === UploadState.SOME_NOT_UPLOADED_NONE_AVAILABLE ? (
              <InfoBox text={formatMessage(m.uploadToCourtAllBrokenText)} />
            ) : (
              <Button
                size="small"
                data-testid="upload-to-court-button"
                onClick={() => uploadFilesToCourt(caseFiles)}
                loading={uploadState === UploadState.UPLOADING}
                disabled={
                  uploadState !== UploadState.SOME_NOT_UPLOADED &&
                  uploadState !== UploadState.UPLOAD_ERROR
                }
              >
                {formatMessage(
                  uploadState === UploadState.UPLOAD_ERROR
                    ? m.retryUploadToCourtButtonText
                    : m.uploadToCourtButtonText,
                )}
              </Button>
            )}
          </Box>
        )}
    </AccordionItem>
  )
}

export default CaseFilesAccordionItem
