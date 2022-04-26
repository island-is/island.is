import React from 'react'
import { useIntl } from 'react-intl'

import { Box, Divider, Stack, Text } from '@island.is/island-ui/core'
import { Case } from '@island.is/judicial-system/types'

import { core } from '@island.is/judicial-system-web/messages'
import { signedVerdictOverview } from '@island.is/judicial-system-web/messages/Core/signedVerdictOverview'
import {
  FormContentContainer,
  PdfRow,
} from '@island.is/judicial-system-web/src/components'

import { SignedDocument } from './Components/SignedDocument'

interface Props {
  workingCase: Case
}

const DefenderSignedVerdictOverviewForm: React.FC<Props> = (props) => {
  const { workingCase } = props

  const { formatMessage } = useIntl()

  return (
    <FormContentContainer>
      <Text as="h3" variant="h3" marginBottom={5}>
        {formatMessage(signedVerdictOverview.caseDocuments)}
      </Text>
      <Box marginBottom={2}>
        <Stack space={2} dividers>
          <PdfRow
            caseId={workingCase.id}
            title={formatMessage(core.pdfButtonRequest)}
            pdfType="request/restricted"
          />
          <PdfRow
            caseId={workingCase.id}
            title={formatMessage(core.pdfButtonRulingShortVersion)}
            pdfType="courtRecord/restricted"
          >
            {workingCase.courtRecordSignatory ? (
              <SignedDocument
                signatory={workingCase.courtRecordSignatory.name}
                signingDate={workingCase.courtRecordSignatureDate}
              />
            ) : (
              <Text>
                {formatMessage(signedVerdictOverview.unsignedDocument)}
              </Text>
            )}
          </PdfRow>
          <PdfRow
            caseId={workingCase.id}
            title={formatMessage(core.pdfButtonRuling)}
            pdfType="ruling/restricted"
          >
            <SignedDocument
              signatory={workingCase.judge?.name}
              signingDate={workingCase.rulingDate}
            />
          </PdfRow>
        </Stack>
      </Box>
      <Divider />
    </FormContentContainer>
  )
}

export default DefenderSignedVerdictOverviewForm
