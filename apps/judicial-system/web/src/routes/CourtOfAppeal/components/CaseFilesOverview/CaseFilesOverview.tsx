import { useContext } from 'react'

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

  return (
    <>
      <AppealCaseFilesOverview />
      <section>
        <SectionHeading title={strings.courtCaseFilesTitle} marginBottom={1} />
        <PdfButton
          renderAs="row"
          caseId={workingCase.id}
          title={core.pdfButtonRequest}
          pdfType="request"
          elementId={core.pdfButtonRequest}
        />
        <PdfButton
          renderAs="row"
          caseId={workingCase.id}
          title={core.pdfButtonRulingShortVersion}
          pdfType="courtRecord"
          elementId={core.pdfButtonRulingShortVersion}
        />
        <PdfButton
          renderAs="row"
          caseId={workingCase.id}
          title={core.pdfButtonRuling}
          pdfType="ruling"
          elementId={core.pdfButtonRuling}
        >
          {workingCase.rulingSignatureDate ? (
            <SignedDocument
              signatory={workingCase.judge?.name}
              signingDate={workingCase.rulingSignatureDate}
            />
          ) : (
            <Text>{strings.unsignedDocument}</Text>
          )}
        </PdfButton>
      </section>
    </>
  )
}

export default CaseFilesOverview
