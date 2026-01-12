import { FC, useContext } from 'react'
import { useIntl } from 'react-intl'
import { FetchResult, MutationFunctionOptions } from '@apollo/client'

import { Exact } from '@island.is/api/schema'
import { Box, Button, Text } from '@island.is/island-ui/core'
import {
  isAcceptingCaseDecision,
  isDistrictCourtUser,
  isInvestigationCase,
  isPrisonAdminUser,
  isPrisonStaffUser,
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
import { RequestRulingSignatureMutation } from '@island.is/judicial-system-web/src/components/Modals/SigningModal/requestRulingSignature.generated'
import {
  CaseDecision,
  CaseState,
  CaseType,
  RequestSignatureInput,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { RequestCourtRecordSignatureMutation } from '../../requestCourtRecordSignature.generated'

const showCustodyNotice = (
  type?: CaseType | null,
  state?: CaseState | null,
  decision?: CaseDecision | null,
) => {
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

const CaseDocuments: FC<Props> = ({
  isRequestingCourtRecordSignature,
  handleRequestCourtRecordSignature,
  isRequestingRulingSignature,
  requestRulingSignature,
}) => {
  const { formatMessage } = useIntl()
  const { workingCase } = useContext(FormContext)

  const { user } = useContext(UserContext)

  const isRulingRequired = !workingCase.isCompletedWithoutRuling

  const showRuling: () => boolean = () => {
    if (!user) {
      return false
    }

    if (isPrisonStaffUser(user)) {
      return false
    }

    if (isPrisonAdminUser(user)) {
      return (
        workingCase.type === CaseType.CUSTODY ||
        workingCase.type === CaseType.PAROLE_REVOCATION
      )
    }

    return true
  }

  return (
    <Box marginBottom={10}>
      <Text as="h3" variant="h3" marginBottom={1}>
        {formatMessage(m.caseDocuments)}
      </Text>
      <Box marginBottom={2} component="ul">
        {!isPrisonSystemUser(user) && (
          <li>
            <PdfButton
              renderAs="row"
              caseId={workingCase.id}
              title={formatMessage(core.pdfButtonRequest)}
              pdfType="request"
              elementId={formatMessage(core.pdfButtonRequest)}
            />
          </li>
        )}
        {showCustodyNotice(
          workingCase.type,
          workingCase.state,
          workingCase.decision,
        ) && (
          <li>
            <PdfButton
              renderAs="row"
              caseId={workingCase.id}
              title={formatMessage(core.pdfButtonCustodyNotice)}
              pdfType="custodyNotice"
              elementId={formatMessage(core.pdfButtonCustodyNotice)}
            />
          </li>
        )}
        <li>
          <PdfButton
            renderAs="row"
            caseId={workingCase.id}
            title={formatMessage(core.pdfButtonRulingShortVersion)}
            pdfType="courtRecord"
            elementId={formatMessage(core.pdfButtonRulingShortVersion)}
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
        </li>
        {showRuling() && (
          <li>
            <PdfButton
              renderAs="row"
              caseId={workingCase.id}
              title={formatMessage(core.pdfButtonRuling)}
              pdfType="ruling"
              elementId={formatMessage(core.pdfButtonRuling)}
              disabled={!isRulingRequired}
            >
              {isRulingRequired &&
                (workingCase.rulingSignatureDate ? (
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
                ))}
            </PdfButton>
          </li>
        )}
      </Box>
    </Box>
  )
}

export default CaseDocuments
