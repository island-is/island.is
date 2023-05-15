import React, { useContext } from 'react'
import { useIntl } from 'react-intl'

import {
  FormContext,
  PdfButton,
  SignedDocument,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { Box, Text } from '@island.is/island-ui/core'
import { core } from '@island.is/judicial-system-web/messages'
import { formatDate } from '@island.is/judicial-system/formatters'
import { CaseFileCategory } from '@island.is/judicial-system/types'
import { useFileList } from '@island.is/judicial-system-web/src/utils/hooks'
import * as constants from '@island.is/judicial-system/consts'

import { courtOfAppealCaseFilesOverview as strings } from './CaseFilesOverview.strings'

const CaseFilesOverview: React.FC = () => {
  const { workingCase } = useContext(FormContext)

  const { onOpen } = useFileList({
    caseId: workingCase.id,
  })

  const { formatMessage } = useIntl()

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

  const allFiles = appealCaseFiles?.concat(
    appealRulingFiles ? appealRulingFiles : [],
  )

  return (
    <>
      {allFiles && allFiles.length > 0 && (
        <Box marginBottom={5}>
          <Text as="h3" variant="h3">
            {formatMessage(strings.appealFilesTitle)}
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
                  <Box
                    display="flex"
                    alignItems="flexEnd"
                    flexDirection="column"
                  >
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
                      {formatMessage(strings.appealFilesCategory, {
                        filesCategory: file.category?.includes('PROSECUTOR'),
                      })}
                    </Text>
                  </Box>
                )}
            </PdfButton>
          ))}
        </Box>
      )}
      <Box marginBottom={6}>
        <Text as="h3" variant="h3">
          {formatMessage(strings.courtCaseFilesTitle)}
        </Text>
        <PdfButton
          renderAs="row"
          caseId={workingCase.id}
          title={formatMessage(core.pdfButtonRequest)}
          pdfType={'request'}
        />
        <PdfButton
          renderAs="row"
          caseId={workingCase.id}
          title={formatMessage(core.pdfButtonRulingShortVersion)}
          pdfType={'courtRecord'}
        />
        <PdfButton
          renderAs="row"
          caseId={workingCase.id}
          title={formatMessage(core.pdfButtonRuling)}
          pdfType={'ruling'}
        >
          {workingCase.rulingDate ? (
            <SignedDocument
              signatory={workingCase.judge?.name}
              signingDate={workingCase.rulingDate}
            />
          ) : (
            <Text>{formatMessage(strings.unsignedDocument)}</Text>
          )}
        </PdfButton>
      </Box>
    </>
  )
}

export default CaseFilesOverview
