import { useContext } from 'react'
import { useIntl } from 'react-intl'

import { Text } from '@island.is/island-ui/core'
import { core } from '@island.is/judicial-system-web/messages'
import {
  AppealCaseFilesOverview,
  FormContext,
  PdfButton,
  SectionHeading,
  SignedDocument,
} from '@island.is/judicial-system-web/src/components'

import { strings } from './CaseFilesOverview.strings'

const CaseFilesOverview = () => {
  const { workingCase } = useContext(FormContext)

  const { formatMessage } = useIntl()

  return (
    <>
      <AppealCaseFilesOverview />
      <section>
        <SectionHeading
          title={formatMessage(strings.courtCaseFilesTitle)}
          marginBottom={1}
        />
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
      </section>
    </>
  )
}

export default CaseFilesOverview
