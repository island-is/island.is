import { FC, useContext, useState } from 'react'
import { useIntl } from 'react-intl'

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
  SectionHeading,
  SigningMethodSelectionModal,
  SignatureType,
  SignedDocument,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import {
  CaseDecision,
  CaseState,
  CaseType,
  RequestSignatureResponse,
} from '@island.is/judicial-system-web/src/graphql/schema'

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
  onCourtRecordSignatureRequested: (
    response: RequestSignatureResponse,
    isAudkenni: boolean,
  ) => void
  onRulingSignatureRequested: (
    response: RequestSignatureResponse,
    isAudkenni: boolean,
  ) => void
}

const CaseDocuments: FC<Props> = ({
  onCourtRecordSignatureRequested,
  onRulingSignatureRequested,
}) => {
  const { formatMessage } = useIntl()
  const { workingCase } = useContext(FormContext)
  const { user } = useContext(UserContext)
  const [showMethodSelectionModal, setShowMethodSelectionModal] = useState<{
    type: SignatureType
  } | null>(null)

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
    <Box component="section">
      <SectionHeading title={formatMessage(m.caseDocuments)} marginBottom={1} />
      <Box component="ul">
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
                  onClick={(event) => {
                    event.stopPropagation()
                    setShowMethodSelectionModal({ type: 'courtRecord' })
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
                    onClick={(event) => {
                      event.stopPropagation()
                      setShowMethodSelectionModal({ type: 'ruling' })
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
      {showMethodSelectionModal && (
        <SigningMethodSelectionModal
          workingCase={workingCase}
          signatureType={showMethodSelectionModal.type}
          onClose={() => setShowMethodSelectionModal(null)}
          onSignatureRequested={(response, isAudkenni) => {
            if (showMethodSelectionModal.type === 'ruling') {
              onRulingSignatureRequested(response, isAudkenni)
            } else {
              onCourtRecordSignatureRequested(response, isAudkenni)
            }
          }}
        />
      )}
    </Box>
  )
}

export default CaseDocuments
