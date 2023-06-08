import React, { useContext } from 'react'
import { useIntl } from 'react-intl'

import { Box, Text } from '@island.is/island-ui/core'
import { formatDate } from '@island.is/judicial-system/formatters'
import * as constants from '@island.is/judicial-system/consts'
import {
  CaseFileCategory,
  completedCaseStates,
  UserRole,
} from '@island.is/judicial-system/types'
import {
  FormContext,
  PdfButton,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { useFileList } from '@island.is/judicial-system-web/src/utils/hooks'

import { strings } from './AppealCaseFilesOverview.strings'

const AppealCaseFilesOverview: React.FC = () => {
  const { workingCase } = useContext(FormContext)

  const { onOpen } = useFileList({
    caseId: workingCase.id,
  })

  const { formatMessage } = useIntl()
  const { user } = useContext(UserContext)

  const appealCaseFiles = workingCase.caseFiles?.filter(
    (caseFile) =>
      caseFile.category &&
      /* 
      Please do not change the order of the following lines as they
      are rendered in the same order as they are listed here
      */
      [
        CaseFileCategory.PROSECUTOR_APPEAL_BRIEF,
        CaseFileCategory.PROSECUTOR_APPEAL_BRIEF_CASE_FILE,
        CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT,
        CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT_CASE_FILE,
        CaseFileCategory.DEFENDANT_APPEAL_BRIEF,
        CaseFileCategory.DEFENDANT_APPEAL_BRIEF_CASE_FILE,
        CaseFileCategory.DEFENDANT_APPEAL_STATEMENT,
        CaseFileCategory.DEFENDANT_APPEAL_STATEMENT_CASE_FILE,
      ].includes(caseFile.category),
  )

  const appealRulingFiles = workingCase.caseFiles?.filter(
    (caseFile) =>
      caseFile.category &&
      /* 
      Please do not change the order of the following lines as they
      are rendered in the same order as they are listed here
      */
      [CaseFileCategory.APPEAL_RULING].includes(caseFile.category),
  )

  const allFiles =
    user?.role === UserRole.STAFF
      ? appealRulingFiles
      : appealCaseFiles?.concat(appealRulingFiles ? appealRulingFiles : [])

  return completedCaseStates.includes(workingCase.state) &&
    allFiles &&
    allFiles.length > 0 ? (
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
          handleClick={() => onOpen(file.id)}
        >
          {file.category &&
            file.category !== CaseFileCategory.APPEAL_RULING && (
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
  ) : null
}

export default AppealCaseFilesOverview
