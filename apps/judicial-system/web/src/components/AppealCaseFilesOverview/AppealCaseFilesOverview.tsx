import React, { useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence } from 'framer-motion'
import router from 'next/router'

import { Box, Button, IconMapIcon, Text } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  isCompletedCase,
  isCourtOfAppealsUser,
  isDefenceUser,
  isProsecutionUser,
} from '@island.is/judicial-system/types'
import {
  ContextMenu,
  FileNotFoundModal,
  FormContext,
  PdfButton,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import {
  CaseAppealState,
  CaseFile,
  CaseFileCategory,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  TUploadFile,
  useFileList,
  useS3Upload,
} from '@island.is/judicial-system-web/src/utils/hooks'

import IconButton from '../IconButton/IconButton'
import { contextMenu } from '../ContextMenu/ContextMenu.strings'
import { strings } from './AppealCaseFilesOverview.strings'
import * as styles from './AppealCaseFilesOverview.css'

const AppealCaseFilesOverview: React.FC<
  React.PropsWithChildren<unknown>
> = () => {
  const { workingCase } = useContext(FormContext)

  const { onOpen, fileNotFound, dismissFileNotFound } = useFileList({
    caseId: workingCase.id,
  })
  const { handleRemove } = useS3Upload(workingCase.id)

  const { formatMessage } = useIntl()
  const { user, limitedAccess } = useContext(UserContext)
  const [allFiles, setAllFiles] = useState<CaseFile[]>([])

  const fileDate = (file: CaseFile) => {
    switch (file.category) {
      case CaseFileCategory.PROSECUTOR_APPEAL_BRIEF:
      case CaseFileCategory.PROSECUTOR_APPEAL_BRIEF_CASE_FILE:
      case CaseFileCategory.DEFENDANT_APPEAL_BRIEF:
      case CaseFileCategory.DEFENDANT_APPEAL_BRIEF_CASE_FILE:
        return workingCase.appealedDate
      case CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT:
      case CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT_CASE_FILE:
        return workingCase.prosecutorStatementDate

      case CaseFileCategory.DEFENDANT_APPEAL_STATEMENT:
      case CaseFileCategory.DEFENDANT_APPEAL_STATEMENT_CASE_FILE:
        return workingCase.defendantStatementDate
      default: {
        return file.created
      }
    }
  }

  useEffect(() => {
    if (workingCase.caseFiles) {
      setAllFiles(
        workingCase.caseFiles.filter(
          (caseFile) =>
            caseFile.category &&
            ((workingCase.prosecutorPostponedAppealDate &&
              [
                CaseFileCategory.PROSECUTOR_APPEAL_BRIEF,
                CaseFileCategory.PROSECUTOR_APPEAL_BRIEF_CASE_FILE,
              ].includes(caseFile.category)) ||
              (workingCase.prosecutorStatementDate &&
                [
                  CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT,
                  CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT_CASE_FILE,
                ].includes(caseFile.category)) ||
              (workingCase.accusedPostponedAppealDate &&
                [
                  CaseFileCategory.DEFENDANT_APPEAL_BRIEF,
                  CaseFileCategory.DEFENDANT_APPEAL_BRIEF_CASE_FILE,
                ].includes(caseFile.category)) ||
              (workingCase.defendantStatementDate &&
                [
                  CaseFileCategory.DEFENDANT_APPEAL_STATEMENT,
                  CaseFileCategory.DEFENDANT_APPEAL_STATEMENT_CASE_FILE,
                ].includes(caseFile.category)) ||
              [
                CaseFileCategory.PROSECUTOR_APPEAL_CASE_FILE,
                CaseFileCategory.DEFENDANT_APPEAL_CASE_FILE,
              ].includes(caseFile.category) ||
              ((workingCase.appealState === CaseAppealState.COMPLETED ||
                isCourtOfAppealsUser(user)) &&
                [CaseFileCategory.APPEAL_RULING].includes(caseFile.category))),
        ),
      )
    }
  }, [
    user,
    workingCase.accusedPostponedAppealDate,
    workingCase.appealState,
    workingCase.caseFiles,
    workingCase.defendantStatementDate,
    workingCase.prosecutorPostponedAppealDate,
    workingCase.prosecutorStatementDate,
  ])

  return isCompletedCase(workingCase.state) &&
    allFiles &&
    allFiles.length > 0 ? (
    <>
      <Box marginBottom={[2, 5]}>
        <Text as="h3" variant="h3" marginBottom={1}>
          {formatMessage(strings.title)}
        </Text>
        {allFiles.map((file) => {
          const prosecutorSubmitted = file.category?.includes('PROSECUTOR')
          const isDisabled = !file.key
          const canDeleteFile =
            file.category &&
            [
              CaseFileCategory.DEFENDANT_APPEAL_CASE_FILE,
              CaseFileCategory.PROSECUTOR_APPEAL_CASE_FILE,
              CaseFileCategory.DEFENDANT_APPEAL_BRIEF_CASE_FILE,
              CaseFileCategory.PROSECUTOR_APPEAL_BRIEF_CASE_FILE,
              CaseFileCategory.DEFENDANT_APPEAL_STATEMENT_CASE_FILE,
              CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT_CASE_FILE,
            ].includes(file.category) &&
            ((prosecutorSubmitted && isProsecutionUser(user)) ||
              (!prosecutorSubmitted && isDefenceUser(user)))

          return (
            <PdfButton
              key={file.id}
              renderAs="row"
              caseId={workingCase.id}
              title={file.name}
              disabled={isDisabled}
              handleClick={() => onOpen(file.id)}
            >
              <Box
                display="flex"
                alignItems={['flexEnd', 'flexEnd', 'center']}
                justifyContent={['spaceBetween', 'spaceBetween', 'center']}
              >
                <Box className={styles.childContainer}>
                  <Text whiteSpace="nowrap">
                    {`${formatDate(fileDate(file), 'dd.MM.y')} kl. ${formatDate(
                      fileDate(file),
                      constants.TIME_FORMAT,
                    )}`}
                  </Text>
                  {file.category &&
                    file.category !== CaseFileCategory.APPEAL_RULING && (
                      <Text variant="small">
                        {formatMessage(strings.submittedBy, {
                          filesCategory: prosecutorSubmitted,
                        })}
                      </Text>
                    )}
                </Box>
                <Box marginLeft={3}>
                  <ContextMenu
                    items={[
                      {
                        title: formatMessage(contextMenu.openFile),
                        onClick: () => onOpen(file.id),
                        icon: 'open' as IconMapIcon,
                      },
                      ...(canDeleteFile
                        ? [
                            {
                              title: formatMessage(contextMenu.deleteFile),
                              onClick: () =>
                                handleRemove(file as TUploadFile, () => {
                                  setAllFiles((prev) =>
                                    prev.filter((f) => f.id !== file.id),
                                  )
                                }),
                              icon: 'trash' as IconMapIcon,
                            },
                          ]
                        : []),
                    ]}
                    menuLabel="Opna valmöguleika á skjali"
                    disclosure={
                      <IconButton
                        icon="ellipsisVertical"
                        colorScheme="transparent"
                        onClick={(evt) => {
                          evt.stopPropagation()
                        }}
                        disabled={isDisabled}
                      />
                    }
                  />
                </Box>
              </Box>
            </PdfButton>
          )
        })}
      </Box>
      {(isProsecutionUser(user) || isDefenceUser(user)) &&
        workingCase.appealState &&
        workingCase.appealState !== CaseAppealState.COMPLETED && (
          <Box display="flex" justifyContent="flexEnd" marginTop={3}>
            <Button
              icon="add"
              onClick={() => {
                router.push(
                  limitedAccess
                    ? `${constants.DEFENDER_APPEAL_FILES_ROUTE}/${workingCase.id}`
                    : `${constants.APPEAL_FILES_ROUTE}/${workingCase.id}`,
                )
              }}
            >
              {formatMessage(strings.addFiles)}
            </Button>
          </Box>
        )}
      <AnimatePresence>
        {fileNotFound && <FileNotFoundModal dismiss={dismissFileNotFound} />}
      </AnimatePresence>
    </>
  ) : null
}

export default AppealCaseFilesOverview
