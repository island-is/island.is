import React, { useContext } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/router'
import {
  Accordion,
  AccordionItem,
  Box,
  Button,
  Select,
  Tag,
  Text,
  Tooltip,
} from '@island.is/island-ui/core'
import {
  BlueBox,
  CaseFileList,
  CourtRecordAccordionItem,
  FormContentContainer,
  InfoCard,
  PdfButton,
  PoliceRequestAccordionItem,
  RulingAccordionItem,
} from '@island.is/judicial-system-web/src/shared-components'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import {
  CaseAppealDecision,
  CaseCustodyRestrictions,
  CaseDecision,
  CaseState,
  CaseType,
  InstitutionType,
  isRestrictionCase,
  isInvestigationCase,
  UserRole,
} from '@island.is/judicial-system/types'
import type { Case } from '@island.is/judicial-system/types'
import { getRestrictionTagVariant } from '@island.is/judicial-system-web/src/utils/stepHelper'
import {
  capitalize,
  caseTypes,
  formatDate,
  getShortRestrictionByValue,
  TIME_FORMAT,
} from '@island.is/judicial-system/formatters'
import { UserContext } from '@island.is/judicial-system-web/src/shared-components/UserProvider/UserProvider'
import AppealSection from './Components/AppealSection/AppealSection'
import { useInstitution } from '@island.is/judicial-system-web/src/utils/hooks'
import { ValueType } from 'react-select/src/types'
import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'
import { signedVerdictOverview as m } from '@island.is/judicial-system-web/messages/Core/signedVerdictOverview'
import { useIntl } from 'react-intl'
import {
  UploadState,
  useCourtUpload,
} from '@island.is/judicial-system-web/src/utils/hooks/useCourtUpload'
import { UploadStateMessage } from './Components/UploadStateMessage'
import InfoBox from '@island.is/judicial-system-web/src/shared-components/InfoBox/InfoBox'
import { core } from '@island.is/judicial-system-web/messages'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
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
  } = props
  const router = useRouter()
  const { user } = useContext(UserContext)
  const { formatMessage } = useIntl()
  const { prosecutorsOffices } = useInstitution()
  const { uploadFilesToCourt, uploadState } = useCourtUpload(
    workingCase,
    setWorkingCase,
  )

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
      return isTravelBan ? 'Farbanni lokið' : 'Gæsluvarðhaldi lokið'
    }

    return isTravelBan
      ? 'Farbann virkt'
      : isInvestigationCase(theCase.type)
      ? 'Krafa um rannsóknarheimild samþykkt'
      : 'Gæsluvarðhald virkt'
  }

  const subtitleForCase = (theCase: Case) => {
    const isTravelBan =
      theCase.decision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN ||
      theCase.type === CaseType.TRAVEL_BAN

    if (
      theCase.decision === CaseDecision.REJECTING ||
      theCase.decision === CaseDecision.DISMISSING ||
      isInvestigationCase(theCase.type)
    ) {
      return `Úrskurðað ${formatDate(
        theCase.courtEndTime,
        'PPP',
      )} kl. ${formatDate(theCase.courtEndTime, TIME_FORMAT)}`
    }

    if (theCase.isValidToDateInThePast) {
      return `${
        isTravelBan ? 'Farbann' : 'Gæsla' // ACCEPTING
      } rann út ${formatDate(theCase.validToDate, 'PPP')} kl. ${formatDate(
        theCase.validToDate,
        TIME_FORMAT,
      )}`
    }

    return `${
      isTravelBan ? 'Farbann' : 'Gæsla' // ACCEPTING
    } til ${formatDate(theCase.validToDate, 'PPP')} kl. ${formatDate(
      theCase.validToDate,
      TIME_FORMAT,
    )}`
  }

  const canCaseFilesBeOpened = () => {
    const isAppealGracePeriodExpired = workingCase.isAppealGracePeriodExpired

    const isProsecutorWithAccess =
      user?.role === UserRole.PROSECUTOR &&
      user.institution?.id === workingCase.creatingProsecutor?.institution?.id

    const isCourtRoleWithAccess =
      user?.role === UserRole.JUDGE || user?.role === UserRole.REGISTRAR

    if (
      !isAppealGracePeriodExpired &&
      (isProsecutorWithAccess || isCourtRoleWithAccess)
    ) {
      return true
    } else {
      return false
    }
  }

  return (
    <FormContentContainer>
      <Box marginBottom={5}>
        <Box marginBottom={3}>
          <Button
            variant="text"
            preTextIcon="arrowBack"
            onClick={() => router.push(Constants.REQUEST_LIST_ROUTE)}
          >
            Til baka
          </Button>
        </Box>
        <Box display="flex" justifyContent="spaceBetween">
          <Box>
            <Box marginBottom={1}>
              <Text as="h1" variant="h1">
                {titleForCase(workingCase)}
              </Text>
            </Box>
            <Text as="h5" variant="h5">
              {subtitleForCase(workingCase)}
            </Text>
          </Box>
          <Box display="flex" flexDirection="column">
            {
              // Custody restrictions
              workingCase.decision === CaseDecision.ACCEPTING &&
                workingCase.type === CaseType.CUSTODY &&
                workingCase.custodyRestrictions
                  ?.filter((restriction) =>
                    [
                      CaseCustodyRestrictions.ISOLATION,
                      CaseCustodyRestrictions.VISITAION,
                      CaseCustodyRestrictions.COMMUNICATION,
                      CaseCustodyRestrictions.MEDIA,
                    ].includes(restriction),
                  )
                  ?.map((custodyRestriction, index) => (
                    <Box marginTop={index > 0 ? 1 : 0} key={index}>
                      <Tag
                        variant={getRestrictionTagVariant(custodyRestriction)}
                        outlined
                        disabled
                      >
                        {getShortRestrictionByValue(custodyRestriction)}
                      </Tag>
                    </Box>
                  ))
            }
            {
              // Alternative travel ban restrictions
              (workingCase.decision ===
                CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN ||
                (workingCase.type === CaseType.TRAVEL_BAN &&
                  workingCase.decision === CaseDecision.ACCEPTING)) &&
                workingCase.custodyRestrictions
                  ?.filter((restriction) =>
                    [
                      CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_REQUIRE_NOTIFICATION,
                      CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_CONFISCATE_PASSPORT,
                    ].includes(restriction),
                  )
                  ?.map((custodyRestriction, index) => (
                    <Box marginTop={index > 0 ? 1 : 0} key={index}>
                      <Tag
                        variant={getRestrictionTagVariant(custodyRestriction)}
                        outlined
                        disabled
                      >
                        {getShortRestrictionByValue(custodyRestriction)}
                      </Tag>
                    </Box>
                  ))
            }
          </Box>
        </Box>
      </Box>
      <Box marginBottom={workingCase.isMasked ? 15 : 6}>
        <InfoCard
          data={[
            {
              title: 'LÖKE málsnúmer',
              value: workingCase.policeCaseNumber,
            },
            {
              title: 'Málsnúmer héraðsdóms',
              value: workingCase.courtCaseNumber,
            },
            {
              title: 'Embætti',
              value: `${
                workingCase.creatingProsecutor?.institution?.name ??
                'Ekki skráð'
              }`,
            },
            { title: 'Dómstóll', value: workingCase.court?.name },
            { title: 'Ákærandi', value: workingCase.prosecutor?.name },
            { title: 'Dómari', value: workingCase.judge?.name },
            { title: 'Dómritari', value: workingCase.registrar?.name },
            // Conditionally add this field based on case type
            ...(isInvestigationCase(workingCase.type)
              ? [
                  {
                    title: 'Tegund kröfu',
                    value: capitalize(caseTypes[workingCase.type]),
                  },
                ]
              : []),
          ]}
          accusedName={workingCase.accusedName}
          accusedNationalId={workingCase.accusedNationalId}
          accusedAddress={workingCase.accusedAddress}
          defender={{
            name: workingCase.defenderName ?? '',
            email: workingCase.defenderEmail,
            phoneNumber: workingCase.defenderPhoneNumber,
            defenderIsSpokesperson: workingCase.defenderIsSpokesperson,
          }}
        />
      </Box>
      {(workingCase.accusedAppealDecision === CaseAppealDecision.POSTPONE ||
        workingCase.accusedAppealDecision === CaseAppealDecision.APPEAL ||
        workingCase.prosecutorAppealDecision === CaseAppealDecision.POSTPONE ||
        workingCase.prosecutorAppealDecision === CaseAppealDecision.APPEAL) &&
        (user?.role === UserRole.JUDGE || user?.role === UserRole.REGISTRAR) &&
        user?.institution?.type !== InstitutionType.HIGH_COURT &&
        !workingCase.isMasked && (
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
      {user?.role !== UserRole.STAFF && !workingCase.isMasked && (
        <>
          <Box marginBottom={5} data-testid="accordionItems">
            <Accordion>
              <PoliceRequestAccordionItem workingCase={workingCase} />
              <CourtRecordAccordionItem workingCase={workingCase} />
              <RulingAccordionItem workingCase={workingCase} />
              <AccordionItem
                id="caseFilesAccordionItem"
                label={
                  <Box display="flex" alignItems="center" overflow="hidden">
                    {`Rannsóknargögn (${
                      workingCase.caseFiles ? workingCase.caseFiles.length : 0
                    })`}

                    {user &&
                      [UserRole.JUDGE, UserRole.REGISTRAR].includes(
                        user.role,
                      ) && (
                        <AnimatePresence>
                          {uploadState === UploadState.UPLOAD_ERROR && (
                            <UploadStateMessage
                              icon="warning"
                              iconColor="red600"
                              message={formatMessage(
                                m.someFilesUploadedToCourtText,
                              )}
                            />
                          )}
                          {uploadState === UploadState.ALL_UPLOADED && (
                            <UploadStateMessage
                              icon="checkmark"
                              iconColor="blue400"
                              message={formatMessage(
                                m.allFilesUploadedToCourtText,
                              )}
                            />
                          )}
                        </AnimatePresence>
                      )}
                  </Box>
                }
                labelVariant="h3"
              >
                <CaseFileList
                  caseId={workingCase.id}
                  files={workingCase.caseFiles ?? []}
                  canOpenFiles={canCaseFilesBeOpened()}
                  hideIcons={user?.role === UserRole.PROSECUTOR}
                  handleRetryClick={(id: string) =>
                    workingCase.caseFiles &&
                    uploadFilesToCourt([
                      workingCase.caseFiles[
                        workingCase.caseFiles.findIndex(
                          (file) => file.id === id,
                        )
                      ],
                    ])
                  }
                />
                {user &&
                  [UserRole.JUDGE, UserRole.REGISTRAR].includes(user?.role) && (
                    <Box display="flex" justifyContent="flexEnd">
                      {(workingCase.caseFiles || []).length ===
                      0 ? null : uploadState ===
                        UploadState.NONE_CAN_BE_UPLOADED ? (
                        <InfoBox
                          text={formatMessage(m.uploadToCourtAllBrokenText)}
                        />
                      ) : (
                        <Button
                          size="small"
                          onClick={() =>
                            uploadFilesToCourt(workingCase.caseFiles)
                          }
                          loading={uploadState === UploadState.UPLOADING}
                          disabled={
                            uploadState === UploadState.UPLOADING ||
                            uploadState === UploadState.ALL_UPLOADED
                          }
                        >
                          {formatMessage(
                            uploadState === UploadState.UPLOAD_ERROR
                              ? m.retryUploadToCourtButtonText
                              : m.uploadToCourtButtonText,
                          )}
                        </Button>
                      )}
                    </Box>
                  )}
              </AccordionItem>
            </Accordion>
          </Box>
          <Box marginBottom={7}>
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
                <Text variant="h4">
                  {workingCase?.judge ? workingCase.judge.name : user?.name}
                </Text>
              </Box>
            </BlueBox>
          </Box>
        </>
      )}
      {!workingCase.isMasked && (
        <Box marginBottom={user?.role === UserRole.PROSECUTOR ? 7 : 15}>
          {user?.role !== UserRole.STAFF && (
            <>
              <Box marginBottom={3}>
                <PdfButton
                  caseId={workingCase.id}
                  title={formatMessage(core.pdfButtonRequest)}
                  pdfType="request"
                />
              </Box>
              <Box marginBottom={3}>
                <PdfButton
                  caseId={workingCase.id}
                  title={formatMessage(core.pdfButtonRuling)}
                  pdfType="ruling?shortVersion=false"
                />
              </Box>
            </>
          )}
          <Box marginBottom={3}>
            <PdfButton
              caseId={workingCase.id}
              title={formatMessage(core.pdfButtonRulingShortVersion)}
              pdfType="ruling?shortVersion=true"
            />
          </Box>
          {workingCase.type === CaseType.CUSTODY &&
            workingCase.state === CaseState.ACCEPTED &&
            workingCase.decision === CaseDecision.ACCEPTING && (
              <PdfButton
                caseId={workingCase.id}
                title={formatMessage(core.pdfButtonCustodyNotice)}
                pdfType="custodyNotice"
              />
            )}
        </Box>
      )}
      {user?.role === UserRole.PROSECUTOR &&
        user.institution?.id === workingCase.prosecutor?.institution?.id &&
        isRestrictionCase(workingCase.type) && (
          <Box marginBottom={9}>
            <Box marginBottom={3}>
              <Text variant="h3">
                Opna mál fyrir öðru embætti{' '}
                <Tooltip text="Hægt er að gefa öðru embætti aðgang að málinu. Viðkomandi embætti getur skoðað málið og farið fram á framlengingu." />
              </Text>
            </Box>
            <BlueBox>
              <Box display="flex">
                <Box flexGrow={1} marginRight={2}>
                  <Select
                    name="sharedWithProsecutorsOfficeId"
                    label="Veldu embætti"
                    placeholder="Velja embætti sem tekur við málinu"
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
                    ? 'Loka aðgangi'
                    : 'Opna mál'}
                </Button>
              </Box>
            </BlueBox>
          </Box>
        )}
    </FormContentContainer>
  )
}

export default SignedVerdictOverviewForm
