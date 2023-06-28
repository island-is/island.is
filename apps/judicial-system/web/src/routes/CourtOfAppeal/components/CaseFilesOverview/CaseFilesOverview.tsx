import React, { useContext } from 'react'
import { useIntl } from 'react-intl'

import { Box, Text } from '@island.is/island-ui/core'
import {
  FormContext,
  PdfButton,
  SignedDocument,
  AppealCaseFilesOverview,
} from '@island.is/judicial-system-web/src/components'
import { core } from '@island.is/judicial-system-web/messages'

import { strings } from './CaseFilesOverview.strings'

const CaseFilesOverview: React.FC = () => {
  const { workingCase } = useContext(FormContext)

  const { formatMessage } = useIntl()

  return (
    <>
      <AppealCaseFilesOverview />
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
