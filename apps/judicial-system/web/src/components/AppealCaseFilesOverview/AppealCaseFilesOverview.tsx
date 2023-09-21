import React, { useContext } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence } from 'framer-motion'

import { Box, Text } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  CaseFileCategory,
  completedCaseStates,
  UserRole,
} from '@island.is/judicial-system/types'
import {
  FileNotFoundModal,
  FormContext,
  PdfButton,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { CaseAppealState } from '@island.is/judicial-system-web/src/graphql/schema'
import { useFileList } from '@island.is/judicial-system-web/src/utils/hooks'

import { strings } from './AppealCaseFilesOverview.strings'

const AppealCaseFilesOverview: React.FC<
  React.PropsWithChildren<unknown>
> = () => {
  const { workingCase } = useContext(FormContext)

  const { onOpen, fileNotFound, dismissFileNotFound } = useFileList({
    caseId: workingCase.id,
  })

  const { formatMessage } = useIntl()
  const { user } = useContext(UserContext)

  const appealCaseFiles = workingCase.caseFiles?.filter(
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
          ].includes(caseFile.category))),
  )

  const appealRulingFiles = workingCase.caseFiles?.filter(
    (caseFile) =>
      workingCase.appealState === CaseAppealState.COMPLETED &&
      caseFile.category &&
      [CaseFileCategory.APPEAL_RULING].includes(caseFile.category),
  )

  const allFiles =
    user?.role === UserRole.PRISON_SYSTEM_STAFF
      ? appealRulingFiles
      : appealCaseFiles?.concat(appealRulingFiles ?? [])

  return completedCaseStates.includes(workingCase.state) &&
    allFiles &&
    allFiles.length > 0 ? (
    <>
      <Box marginBottom={5}>
        <Text as="h3" variant="h3">
          {formatMessage(strings.title)}
        </Text>
        {allFiles.map((file) => (
          <PdfButton
            key={file.id}
            renderAs="row"
            caseId={workingCase.id}
            title={file.name}
            disabled={!file.key}
            handleClick={() => onOpen(file.id)}
          >
            {file.category && file.category !== CaseFileCategory.APPEAL_RULING && (
              <Box display="flex" alignItems="flexEnd" flexDirection="column">
                <Text>
                  {`
                       ${formatDate(
                         file.created,
                         'dd.MM.y',
                       )}   kl. ${formatDate(
                    file.created,
                    constants.TIME_FORMAT,
                  )}
                    `}
                </Text>

                <Text variant="small">
                  {formatMessage(strings.submittedBy, {
                    filesCategory: file.category?.includes('PROSECUTOR'),
                  })}
                </Text>
              </Box>
            )}
          </PdfButton>
        ))}
      </Box>
      <AnimatePresence>
        {fileNotFound && <FileNotFoundModal dismiss={dismissFileNotFound} />}
      </AnimatePresence>
    </>
  ) : null
}

export default AppealCaseFilesOverview
