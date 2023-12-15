import { useContext } from 'react'
import { useIntl } from 'react-intl'
import { FetchResult, MutationFunctionOptions } from '@apollo/client'

import { Exact } from '@island.is/api/schema'
import { Box, Button, Text } from '@island.is/island-ui/core'
import {
  CaseState,
  isAcceptingCaseDecision,
  isDistrictCourtUser,
  isInvestigationCase,
  isPrisonSystemUser,
  isRestrictionCase,
} from '@island.is/judicial-system/types'
import {
  core,
  signedVerdictOverview as m,
} from '@island.is/judicial-system-web/messages'
import {
  FormContext,
  PdfButton,
  SignedDocument,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { RequestRulingSignatureMutation } from '@island.is/judicial-system-web/src/components/SigningModal/requestRulingSignature.generated'
import {
  CaseDecision,
  CaseType,
  RequestSignatureInput,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { RequestCourtRecordSignatureMutation } from '../../requestCourtRecordSignature.generated'

function showCustodyNotice(
  type: CaseType,
  state: CaseState,
  decision?: CaseDecision,
) {
  return (
    (type === CaseType.CUSTODY || type === CaseType.ADMISSION_TO_FACILITY) &&
    state === CaseState.ACCEPTED &&
    isAcceptingCaseDecision(decision)
  )
}

interface Props {
  isRequestingCourtRecordSignature: boolean
  handleRequestCourtRecordSignature: (
    options?:
      | MutationFunctionOptions<
          RequestCourtRecordSignatureMutation,
          Exact<{
            input: RequestSignatureInput
          }>
        >
      | undefined,
  ) => Promise<FetchResult<RequestRulingSignatureMutation>>
  isRequestingRulingSignature: boolean
  requestRulingSignature: (
    options?:
      | MutationFunctionOptions<
          RequestRulingSignatureMutation,
          Exact<{
            input: RequestSignatureInput
          }>
        >
      | undefined,
  ) => Promise<FetchResult<RequestRulingSignatureMutation>>
}

const CaseDocuments: React.FC<React.PropsWithChildren<Props>> = ({
  isRequestingCourtRecordSignature,
  handleRequestCourtRecordSignature,
  isRequestingRulingSignature,
  requestRulingSignature,
}) => {
  const { formatMessage } = useIntl()
  const { workingCase } = useContext(FormContext)

  const { user } = useContext(UserContext)

  return (
    <Box marginBottom={10}>
      <Text as="h3" variant="h3" marginBottom={3}>
        {formatMessage(m.caseDocuments)}
      </Text>
      <Box marginBottom={2}>
        {!isPrisonSystemUser(user) && (
          <PdfButton
            renderAs="row"
            caseId={workingCase.id}
            title={formatMessage(core.pdfButtonRequest)}
            pdfType={'request'}
          />
        )}
        {showCustodyNotice(
          workingCase.type,
          workingCase.state,
          workingCase.decision,
        ) && (
          <PdfButton
            renderAs="row"
            caseId={workingCase.id}
            title={formatMessage(core.pdfButtonCustodyNotice)}
            pdfType="custodyNotice"
          />
        )}
        <PdfButton
          renderAs="row"
          caseId={workingCase.id}
          title={formatMessage(core.pdfButtonRulingShortVersion)}
          pdfType={'courtRecord'}
        >
          {isInvestigationCase(workingCase.type) &&
            (workingCase.courtRecordSignatory ? (
              <SignedDocument
                signatory={workingCase.courtRecordSignatory.name}
                signingDate={workingCase.courtRecordSignatureDate}
              />
            ) : isDistrictCourtUser(user) ? (
              <Button
                size="small"
                data-testid="signCourtRecordButton"
                loading={isRequestingCourtRecordSignature}
                onClick={(event) => {
                  event.stopPropagation()
                  handleRequestCourtRecordSignature()
                }}
              >
                {formatMessage(m.signButton)}
              </Button>
            ) : isRestrictionCase(workingCase.type) ? null : (
              <Text>{formatMessage(m.unsignedDocument)}</Text>
            ))}
        </PdfButton>
        {!isPrisonSystemUser(user) && (
          <PdfButton
            renderAs="row"
            caseId={workingCase.id}
            title={formatMessage(core.pdfButtonRuling)}
            pdfType={'ruling'}
          >
            <Box display="flex" flexDirection="row">
              {workingCase.rulingSignatureDate ? (
                <SignedDocument
                  signatory={workingCase.judge?.name}
                  signingDate={workingCase.rulingSignatureDate}
                />
              ) : user?.id === workingCase.judge?.id ? (
                <Button
                  size="small"
                  loading={isRequestingRulingSignature}
                  onClick={(event) => {
                    event.stopPropagation()
                    requestRulingSignature()
                  }}
                >
                  {formatMessage(m.signButton)}
                </Button>
              ) : (
                <Text>{formatMessage(m.unsignedDocument)}</Text>
              )}
            </Box>
          </PdfButton>
        )}
      </Box>
    </Box>
  )
}

export default CaseDocuments
