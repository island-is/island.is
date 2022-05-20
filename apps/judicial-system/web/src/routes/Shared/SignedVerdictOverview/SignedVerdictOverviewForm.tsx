import React, { useContext, useCallback } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { ValueType } from 'react-select/src/types'

import {
  Accordion,
  Box,
  Button,
  Select,
  Text,
  Tooltip,
  Stack,
  Divider,
  AlertMessage,
} from '@island.is/island-ui/core'
import {
  BlueBox,
  CourtRecordAccordionItem,
  FormContentContainer,
  InfoCard,
  PdfRow,
  PoliceRequestAccordionItem,
  RulingAccordionItem,
  CommentsAccordionItem,
  CaseFilesAccordionItem,
} from '@island.is/judicial-system-web/src/components'
import {
  CaseAppealDecision,
  CaseDecision,
  CaseState,
  CaseType,
  InstitutionType,
  isRestrictionCase,
  isInvestigationCase,
  UserRole,
  isAcceptingCaseDecision,
  Case,
} from '@island.is/judicial-system/types'
import {
  capitalize,
  caseTypes,
  formatDate,
} from '@island.is/judicial-system/formatters'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import {
  core,
  signedVerdictOverview as m,
} from '@island.is/judicial-system-web/messages'
import { useInstitution } from '@island.is/judicial-system-web/src/utils/hooks'
import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'
import * as Constants from '@island.is/judicial-system/consts'
import { TIME_FORMAT } from '@island.is/judicial-system/consts'
import AppealSection from './Components/AppealSection/AppealSection'
import { SignedDocument } from '@island.is/judicial-system-web/src/components/SignedDocument/SignedDocument'
import CaseDates from '@island.is/judicial-system-web/src/components/CaseDates/CaseDates'
import MarkdownWrapper from '@island.is/judicial-system-web/src/components/MarkdownWrapper/MarkdownWrapper'
import RestrictionTags from '@island.is/judicial-system-web/src/components/RestrictionTags/RestrictionTags'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>
  setAccusedAppealDate: () => void
  setProsecutorAppealDate: () => void
  withdrawAccusedAppealDate: () => void
  withdrawProsecutorAppealDate: () => void
  shareCaseWithAnotherInstitution: (
    selectedInstitution?: ValueType<ReactSelectOption>,
  ) => void
  selectedSharingInstitutionId: ValueType<ReactSelectOption>
  setSelectedSharingInstitutionId: React.Dispatch<
    React.SetStateAction<ValueType<ReactSelectOption>>
  >
  isRequestingCourtRecordSignature: boolean
  handleRequestCourtRecordSignature: () => void
  handleOpenDateModificationModal: () => void
}

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

const SignedVerdictOverviewForm: React.FC<Props> = (props) => {
  const {
    workingCase,
    setWorkingCase,
    setAccusedAppealDate,
    setProsecutorAppealDate,
    withdrawAccusedAppealDate,
    withdrawProsecutorAppealDate,
    shareCaseWithAnotherInstitution,
    selectedSharingInstitutionId,
    setSelectedSharingInstitutionId,
    isRequestingCourtRecordSignature,
    handleRequestCourtRecordSignature,
    handleOpenDateModificationModal,
  } = props
  const router = useRouter()
  const { user } = useContext(UserContext)
  const { formatMessage } = useIntl()

  // skip loading institutions if the user does not have an id
  const { prosecutorsOffices } = useInstitution(!user?.id)

  /**
   * If the case is not rejected it must be accepted because
   * this screen is only rendered if the case is either accepted
   * or rejected. Here we are first handling the case where a case
   * is rejected, then the case where a case is accepted and the
   * custody end date is in the past and then we assume that
   * the case is accepted and the custody end date has not come yet.
   * For accepted cases, we first handle the case where the judge
   * decided only accept an alternative travel ban and finally we
   * assume that the actual custody was accepted.
   */
  const titleForCase = (theCase: Case) => {
    const isTravelBan =
      theCase.decision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN ||
      theCase.type === CaseType.TRAVEL_BAN

    if (theCase.state === CaseState.REJECTED) {
      if (isInvestigationCase(theCase.type)) {
        return 'Kröfu um rannsóknarheimild hafnað'
      } else {
        return 'Kröfu hafnað'
      }
    }

    if (theCase.state === CaseState.DISMISSED) {
      return formatMessage(m.dismissedTitle)
    }

    if (theCase.isValidToDateInThePast) {
      return formatMessage(m.validToDateInThePast, {
        caseType: isTravelBan ? CaseType.TRAVEL_BAN : theCase.type,
      })
    }

    return isInvestigationCase(theCase.type)
      ? formatMessage(m.investigationAccepted)
      : formatMessage(m.restrictionActive, {
          caseType: isTravelBan ? CaseType.TRAVEL_BAN : theCase.type,
        })
  }

  const canModifyCaseDates = useCallback(() => {
    return (
      user &&
      [UserRole.JUDGE, UserRole.REGISTRAR, UserRole.PROSECUTOR].includes(
        user.role,
      ) &&
      (workingCase.type === CaseType.CUSTODY ||
        workingCase.type === CaseType.ADMISSION_TO_FACILITY)
    )
  }, [workingCase.type, user])

  return (
    <FormContentContainer>
      <Box marginBottom={5}>
        <Box marginBottom={3}>
          <Button
            variant="text"
            preTextIcon="arrowBack"
            onClick={() => router.push(Constants.CASE_LIST_ROUTE)}
          >
            Til baka
          </Button>
        </Box>
        <Box display="flex" justifyContent="spaceBetween" marginBottom={3}>
          <Box>
            <Box marginBottom={1}>
              <Text as="h1" variant="h1">
                {titleForCase(workingCase)}
              </Text>
            </Box>
            <Box>
              <Text variant="h5">
                {formatMessage(m.rulingDateLabel, {
                  courtEndTime: `${formatDate(
                    workingCase.courtEndTime,
                    'PPP',
                  )} kl. ${formatDate(workingCase.courtEndTime, TIME_FORMAT)}`,
                })}
              </Text>
            </Box>
          </Box>
          <Box display="flex" flexDirection="column">
            <RestrictionTags workingCase={workingCase} />
          </Box>
        </Box>
        {isRestrictionCase(workingCase.type) &&
          workingCase.state === CaseState.ACCEPTED && (
            <CaseDates
              workingCase={workingCase}
              button={
                canModifyCaseDates()
                  ? {
                      label: formatMessage(core.update),
                      onClick: handleOpenDateModificationModal,
                      icon: 'pencil',
                    }
                  : undefined
              }
            />
          )}
      </Box>
      {workingCase.caseModifiedExplanation && (
        <Box marginBottom={5}>
          <AlertMessage
            type="info"
            title={formatMessage(m.sections.modifyDatesInfo.titleV2, {
              caseType: workingCase.type,
            })}
            message={
              <MarkdownWrapper
                markdown={workingCase.caseModifiedExplanation}
                textProps={{ variant: 'small' }}
              />
            }
          />
        </Box>
      )}
      {workingCase.rulingModifiedHistory && (
        <Box marginBottom={5}>
          <AlertMessage
            type="info"
            title={formatMessage(m.sections.modifyRulingInfo.title)}
            message={
              <MarkdownWrapper
                markdown={workingCase.rulingModifiedHistory}
                textProps={{ variant: 'small' }}
              />
            }
          />
        </Box>
      )}
      <Box marginBottom={6}>
        <InfoCard
          data={[
            {
              title: formatMessage(core.policeCaseNumber),
              value: workingCase.policeCaseNumber,
            },
            {
              title: formatMessage(core.courtCaseNumber),
              value: workingCase.courtCaseNumber,
            },
            {
              title: formatMessage(core.prosecutor),
              value: `${workingCase.creatingProsecutor?.institution?.name}`,
            },
            {
              title: formatMessage(core.court),
              value: workingCase.court?.name,
            },
            {
              title: formatMessage(core.prosecutorPerson),
              value: workingCase.prosecutor?.name,
            },
            {
              title: formatMessage(core.judge),
              value: workingCase.judge?.name,
            },
            // Conditionally add this field based on case type
            ...(isInvestigationCase(workingCase.type)
              ? [
                  {
                    title: formatMessage(core.caseType),
                    value: capitalize(caseTypes[workingCase.type]),
                  },
                ]
              : []),
            ...(workingCase.registrar
              ? [
                  {
                    title: formatMessage(core.registrar),
                    value: workingCase.registrar?.name,
                  },
                ]
              : []),
          ]}
          defendants={workingCase.defendants ?? []}
          defender={{
            name: workingCase.defenderName ?? '',
            defenderNationalId: workingCase.defenderNationalId,
            email: workingCase.defenderEmail,
            phoneNumber: workingCase.defenderPhoneNumber,
          }}
          sessionArrangement={workingCase.sessionArrangements}
        />
      </Box>
      {(workingCase.accusedAppealDecision === CaseAppealDecision.POSTPONE ||
        workingCase.accusedAppealDecision === CaseAppealDecision.APPEAL ||
        workingCase.prosecutorAppealDecision === CaseAppealDecision.POSTPONE ||
        workingCase.prosecutorAppealDecision === CaseAppealDecision.APPEAL) &&
        (user?.role === UserRole.JUDGE || user?.role === UserRole.REGISTRAR) &&
        user?.institution?.type !== InstitutionType.HIGH_COURT && (
          <Box marginBottom={7}>
            <AppealSection
              workingCase={workingCase}
              setAccusedAppealDate={setAccusedAppealDate}
              setProsecutorAppealDate={setProsecutorAppealDate}
              withdrawAccusedAppealDate={withdrawAccusedAppealDate}
              withdrawProsecutorAppealDate={withdrawProsecutorAppealDate}
            />
          </Box>
        )}
      {user?.role !== UserRole.STAFF && (
        <>
          <Box marginBottom={5} data-testid="accordionItems">
            <Accordion>
              <PoliceRequestAccordionItem workingCase={workingCase} />
              <CourtRecordAccordionItem workingCase={workingCase} />
              <RulingAccordionItem workingCase={workingCase} />
              {user && (
                <CaseFilesAccordionItem
                  workingCase={workingCase}
                  setWorkingCase={setWorkingCase}
                  user={user}
                />
              )}
              {(workingCase.comments ||
                workingCase.caseFilesComments ||
                workingCase.caseResentExplanation) && (
                <CommentsAccordionItem workingCase={workingCase} />
              )}
            </Accordion>
          </Box>
          <Box marginBottom={6}>
            <BlueBox>
              <Box marginBottom={2} textAlign="center">
                <Text as="h3" variant="h3">
                  {formatMessage(m.conclusionTitle)}
                </Text>
              </Box>
              <Box marginBottom={3}>
                <Box marginTop={1}>
                  <Text variant="intro">{workingCase.conclusion}</Text>
                </Box>
              </Box>
              <Box marginBottom={1} textAlign="center">
                <Text variant="h4">{workingCase?.judge?.name}</Text>
              </Box>
            </BlueBox>
          </Box>
        </>
      )}
      <Box marginBottom={10}>
        <Text as="h3" variant="h3" marginBottom={3}>
          {formatMessage(m.caseDocuments)}
        </Text>
        <Box marginBottom={2}>
          <Stack space={2} dividers>
            {user?.role !== UserRole.STAFF && (
              <PdfRow
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
              <PdfRow
                caseId={workingCase.id}
                title={formatMessage(core.pdfButtonCustodyNotice)}
                pdfType="custodyNotice"
              />
            )}
            <PdfRow
              caseId={workingCase.id}
              title={formatMessage(core.pdfButtonRulingShortVersion)}
              pdfType={'courtRecord'}
            >
              {workingCase.courtRecordSignatory ? (
                <SignedDocument
                  signatory={workingCase.courtRecordSignatory.name}
                  signingDate={workingCase.courtRecordSignatureDate}
                />
              ) : user?.role === UserRole.JUDGE ||
                user?.role === UserRole.REGISTRAR ? (
                <Button
                  loading={isRequestingCourtRecordSignature}
                  onClick={(event) => {
                    event.stopPropagation()
                    handleRequestCourtRecordSignature()
                  }}
                >
                  {formatMessage(m.signButton)}
                </Button>
              ) : (
                <Text>{formatMessage(m.unsignedDocument)}</Text>
              )}
            </PdfRow>
            {user?.role !== UserRole.STAFF && (
              <PdfRow
                caseId={workingCase.id}
                title={formatMessage(core.pdfButtonRuling)}
                pdfType={'ruling'}
              >
                <SignedDocument
                  signatory={workingCase.judge?.name}
                  signingDate={workingCase.rulingDate}
                />
                {(user?.role === UserRole.JUDGE ||
                  user?.role === UserRole.REGISTRAR) && (
                  <Button
                    variant="ghost"
                    data-testid="amendRulingButton"
                    onClick={(event) => {
                      event.stopPropagation()
                      router.push(
                        isRestrictionCase(workingCase.type)
                          ? `${Constants.MODIFY_RULING_ROUTE}/${workingCase.id}`
                          : `${Constants.IC_MODIFY_RULING_ROUTE}/${workingCase.id}`,
                      )
                    }}
                  >
                    {capitalize(formatMessage(core.amend))}
                  </Button>
                )}
              </PdfRow>
            )}
          </Stack>
        </Box>
        <Divider />
      </Box>
      {user?.role === UserRole.PROSECUTOR &&
        user.institution?.id ===
          workingCase.creatingProsecutor?.institution?.id &&
        isRestrictionCase(workingCase.type) && (
          <Box marginBottom={9}>
            <Box marginBottom={3}>
              <Text variant="h3">
                {formatMessage(m.sections.shareCase.title)}{' '}
                <Tooltip text={formatMessage(m.sections.shareCase.info)} />
              </Text>
            </Box>
            <BlueBox>
              <Box display="flex">
                <Box flexGrow={1} marginRight={2}>
                  <Select
                    name="sharedWithProsecutorsOfficeId"
                    label={formatMessage(m.sections.shareCase.label)}
                    placeholder={formatMessage(
                      m.sections.shareCase.placeholder,
                    )}
                    size="sm"
                    icon={
                      workingCase.sharedWithProsecutorsOffice
                        ? 'checkmark'
                        : undefined
                    }
                    options={prosecutorsOffices
                      .map((prosecutorsOffice) => ({
                        label: prosecutorsOffice.name,
                        value: prosecutorsOffice.id,
                      }))
                      .filter((t) => t.value !== user?.institution?.id)}
                    value={
                      workingCase.sharedWithProsecutorsOffice
                        ? {
                            label: workingCase.sharedWithProsecutorsOffice.name,
                            value: workingCase.sharedWithProsecutorsOffice.id,
                          }
                        : selectedSharingInstitutionId
                        ? {
                            label: (selectedSharingInstitutionId as ReactSelectOption)
                              .label,
                            value: (selectedSharingInstitutionId as ReactSelectOption)
                              .value as string,
                          }
                        : null
                    }
                    onChange={(so: ValueType<ReactSelectOption>) =>
                      setSelectedSharingInstitutionId(so)
                    }
                    disabled={Boolean(workingCase.sharedWithProsecutorsOffice)}
                  />
                </Box>
                <Button
                  size="small"
                  disabled={
                    !selectedSharingInstitutionId &&
                    !workingCase.sharedWithProsecutorsOffice
                  }
                  onClick={() =>
                    shareCaseWithAnotherInstitution(
                      selectedSharingInstitutionId,
                    )
                  }
                >
                  {workingCase.sharedWithProsecutorsOffice
                    ? formatMessage(m.sections.shareCase.close)
                    : formatMessage(m.sections.shareCase.open)}
                </Button>
              </Box>
            </BlueBox>
          </Box>
        )}
    </FormContentContainer>
  )
}

export default SignedVerdictOverviewForm
