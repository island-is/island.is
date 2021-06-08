import React, { useContext } from 'react'
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
  Case,
  CaseAppealDecision,
  CaseCustodyRestrictions,
  CaseDecision,
  CaseGender,
  CaseType,
  UserRole,
} from '@island.is/judicial-system/types'
import { getRestrictionTagVariant } from '@island.is/judicial-system-web/src/utils/stepHelper'
import {
  formatDate,
  getShortRestrictionByValue,
  TIME_FORMAT,
} from '@island.is/judicial-system/formatters'
import { UserContext } from '@island.is/judicial-system-web/src/shared-components/UserProvider/UserProvider'
import AppealSection from './Components/AppealSection/AppealSection'
import useInstitution from '@island.is/judicial-system-web/src/utils/hooks/useInstitution'
import { ValueType } from 'react-select/src/types'
import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'

interface Props {
  workingCase: Case
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
  const { prosecutorsOffices } = useInstitution()

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
    if (theCase.decision === CaseDecision.REJECTING) {
      return 'Kröfu hafnað'
    }

    const isTravelBan =
      theCase.decision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN ||
      theCase.type === CaseType.TRAVEL_BAN

    if (theCase.isCustodyEndDateInThePast) {
      return isTravelBan ? 'Farbanni lokið' : 'Gæsluvarðhaldi lokið'
    }

    return isTravelBan ? 'Farbann virkt' : 'Gæsluvarðhald virkt'
  }

  const subtitleForCase = (theCase: Case) => {
    if (theCase.decision === CaseDecision.REJECTING) {
      return `Úrskurðað ${formatDate(
        theCase.courtEndTime,
        'PPP',
      )} kl. ${formatDate(theCase.courtEndTime, TIME_FORMAT)}`
    }

    const isTravelBan =
      theCase.decision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN ||
      theCase.type === CaseType.TRAVEL_BAN

    if (theCase.isCustodyEndDateInThePast) {
      return `${
        isTravelBan ? 'Farbann' : 'Gæsla' // ACCEPTING
      } rann út ${formatDate(theCase.custodyEndDate, 'PPP')} kl. ${formatDate(
        theCase.custodyEndDate,
        TIME_FORMAT,
      )}`
    }

    return `${
      isTravelBan ? 'Farbann' : 'Gæsla' // ACCEPTING
    } til ${formatDate(theCase.custodyEndDate, 'PPP')} kl. ${formatDate(
      theCase.custodyEndDate,
      TIME_FORMAT,
    )}`
  }

  const canCaseFilesBeOpened = () => {
    if (
      !workingCase?.isAppealGracePeriodExpired &&
      user?.role === UserRole.PROSECUTOR &&
      user.institution?.id === workingCase.prosecutor?.institution?.id &&
      (workingCase?.accusedAppealDecision === CaseAppealDecision.APPEAL ||
        workingCase?.prosecutorAppealDecision === CaseAppealDecision.APPEAL ||
        Boolean(workingCase?.accusedPostponedAppealDate) ||
        Boolean(workingCase?.prosecutorPostponedAppealDate))
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
      <Box marginBottom={6}>
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
                workingCase.prosecutor?.institution?.name || 'Ekki skráð'
              }`,
            },
            { title: 'Dómstóll', value: workingCase.court?.name },
            { title: 'Ákærandi', value: workingCase.prosecutor?.name },
            { title: 'Dómari', value: workingCase.judge?.name },
          ]}
          accusedName={workingCase.accusedName}
          accusedNationalId={workingCase.accusedNationalId}
          accusedAddress={workingCase.accusedAddress}
          defender={{
            name: workingCase.defenderName || '',
            email: workingCase.defenderEmail,
            phoneNumber: workingCase.defenderPhoneNumber,
          }}
        />
      </Box>
      {(workingCase.accusedAppealDecision === CaseAppealDecision.POSTPONE ||
        workingCase.prosecutorAppealDecision === CaseAppealDecision.POSTPONE) &&
        workingCase.rulingDate &&
        (user?.role === UserRole.JUDGE ||
          user?.role === UserRole.REGISTRAR) && (
          <Box marginBottom={7}>
            <AppealSection
              rulingDate={workingCase.rulingDate}
              accusedGender={
                // Handle missing gender
                workingCase.accusedGender ?? CaseGender.OTHER
              }
              accusedAppealDecision={workingCase.accusedAppealDecision}
              prosecutorAppealDecision={workingCase.prosecutorAppealDecision}
              accusedPostponedAppealDate={
                workingCase.accusedPostponedAppealDate
              }
              prosecutorPostponedAppealDate={
                workingCase.prosecutorPostponedAppealDate
              }
              setAccusedAppealDate={setAccusedAppealDate}
              setProsecutorAppealDate={setProsecutorAppealDate}
              withdrawAccusedAppealDate={withdrawAccusedAppealDate}
              withdrawProsecutorAppealDate={withdrawProsecutorAppealDate}
              isAppealDeadlineExpired={
                workingCase.isAppealDeadlineExpired ?? false
              }
              isAppealGracePeriodExpired={
                workingCase.isAppealGracePeriodExpired ?? false
              }
            />
          </Box>
        )}
      <Box marginBottom={5}>
        <Accordion>
          <PoliceRequestAccordionItem workingCase={workingCase} />
          <CourtRecordAccordionItem workingCase={workingCase} />
          <RulingAccordionItem workingCase={workingCase} />
          <AccordionItem
            id="id_4"
            label={`Rannsóknargögn (${
              workingCase.files ? workingCase.files.length : 0
            })`}
            labelVariant="h3"
          >
            <CaseFileList
              caseId={workingCase.id}
              files={workingCase.files || []}
              canOpenFiles={canCaseFilesBeOpened()}
            />
          </AccordionItem>
        </Accordion>
      </Box>
      <Box marginBottom={user?.role === UserRole.PROSECUTOR ? 7 : 15}>
        <Box marginBottom={3}>
          <PdfButton
            caseId={workingCase.id}
            title="Opna PDF kröfu"
            pdfType="request"
          />
        </Box>
        <PdfButton
          caseId={workingCase.id}
          title="Opna PDF þingbók og úrskurð"
          pdfType="ruling"
        />
      </Box>
      {user?.role === UserRole.PROSECUTOR &&
        user.institution?.id === workingCase.prosecutor?.institution?.id && (
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
