import { useContext } from 'react'
import { useIntl } from 'react-intl'

import { Box, Text } from '@island.is/island-ui/core'
import { core } from '@island.is/judicial-system-web/messages'
import {
  AppealCaseFilesOverview,
  FormContext,
  PdfButton,
  SignedDocument,
} from '@island.is/judicial-system-web/src/components'

import { strings } from './CaseFilesOverview.strings'

const CaseFilesOverview = () => {
  const { workingCase } = useContext(FormContext)

  const { formatMessage } = useIntl()

  return (
    <>
      <Box marginBottom={6}>
        <AppealCaseFilesOverview />
      </Box>
      <Box marginBottom={6}>
        <Text as="h3" variant="h3" marginBottom={3}>
          {formatMessage(strings.courtCaseFilesTitle)}
        </Text>
        <PdfButton
          renderAs="row"
          caseId={workingCase.id}
          title={formatMessage(core.pdfButtonRequest)}
          pdfType="request"
          elementId={formatMessage(core.pdfButtonRequest)}
        />
        <PdfButton
          renderAs="row"
          caseId={workingCase.id}
          title={formatMessage(core.pdfButtonRulingShortVersion)}
          pdfType="courtRecord"
          elementId={formatMessage(core.pdfButtonRulingShortVersion)}
        />
        <PdfButton
          renderAs="row"
          caseId={workingCase.id}
          title={formatMessage(core.pdfButtonRuling)}
          pdfType="ruling"
          elementId={formatMessage(core.pdfButtonRuling)}
        >
          {workingCase.rulingSignatureDate ? (
            <SignedDocument
              signatory={workingCase.judge?.name}
              signingDate={workingCase.rulingSignatureDate}
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
