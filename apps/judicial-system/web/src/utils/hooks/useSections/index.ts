import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import {
  Case,
  CaseState,
  Gender,
  InstitutionType,
  isInvestigationCase,
  isRestrictionCase,
  User,
} from '@island.is/judicial-system/types'
import { core, sections } from '@island.is/judicial-system-web/messages'
import { caseResult } from '@island.is/judicial-system-web/src/components/PageLayout/utils'
import { capitalize } from '@island.is/judicial-system/formatters'
import {
  INVESTIGATION_CASE_MODIFY_RULING_ROUTE,
  RESTRICTION_CASE_MODIFY_RULING_ROUTE,
} from '@island.is/judicial-system/consts'
import * as constants from '@island.is/judicial-system/consts'

import {
  isDefendantStepValidForSidebarRC,
  isCourtHearingArrangemenstStepValidRC,
  isCourtHearingArrangementsStepValidIC,
  isCourtRecordStepValidIC,
  isCourtRecordStepValidRC,
  isDefendantStepValidForSidebarIC,
  isHearingArrangementsStepValidIC,
  isHearingArrangementsStepValidRC,
  isPoliceDemandsStepValidIC,
  isPoliceDemandsStepValidRC,
  isPoliceReportStepValidIC,
  isPoliceReportStepValidRC,
  isRulingValidIC,
  isRulingValidRC,
  isDefendantStepValidForSidebarIndictments,
  isProcessingStepValidIndictments,
  isReceptionAndAssignmentStepValid,
  isSubpoenaStepValid,
  isProsecutorAndDefenderStepValid,
} from '../../validate'

interface Section {
  name: string
  children: {
    type: string
    name: string
    href?: string
  }[]
}

const useSections = () => {
  const { formatMessage } = useIntl()
  const router = useRouter()

  const findLastValidStep = (section: Section) => {
    const filterValidSteps = section.children.filter((c) => c.href)
    return filterValidSteps[filterValidSteps.length - 1]
  }

  const getRestrictionCaseProsecutorSection = (
    workingCase: Case,
    user?: User,
    activeSubSection?: number,
  ): Section => {
    const { type, id } = workingCase

    return {
      name: formatMessage(sections.restrictionCaseProsecutorSection.caseTitle, {
        caseType: type,
      }),
      children:
        user?.institution?.type !== InstitutionType.PROSECUTORS_OFFICE
          ? []
          : [
              {
                type: 'SUB_SECTION',
                name: capitalize(
                  formatMessage(core.defendant, { suffix: 'i' }),
                ),
                href: `${constants.RESTRICTION_CASE_DEFENDANT_ROUTE}/${id}`,
              },
              {
                type: 'SUB_SECTION',
                name: formatMessage(
                  sections.restrictionCaseProsecutorSection.hearingArrangements,
                ),
                href:
                  (activeSubSection && activeSubSection > 1) ||
                  isDefendantStepValidForSidebarRC(workingCase)
                    ? `${constants.RESTRICTION_CASE_HEARING_ARRANGEMENTS_ROUTE}/${id}`
                    : undefined,
              },
              {
                type: 'SUB_SECTION',
                name: formatMessage(
                  sections.restrictionCaseProsecutorSection.policeDemands,
                ),
                href:
                  (activeSubSection && activeSubSection > 2) ||
                  (isDefendantStepValidForSidebarRC(workingCase) &&
                    isHearingArrangementsStepValidRC(workingCase) &&
                    workingCase.state !== CaseState.NEW)
                    ? `${constants.RESTRICTION_CASE_POLICE_DEMANDS_ROUTE}/${id}`
                    : undefined,
              },
              {
                type: 'SUB_SECTION',
                name: formatMessage(
                  sections.restrictionCaseProsecutorSection.policeReport,
                ),
                href:
                  (activeSubSection && activeSubSection > 3) ||
                  (isDefendantStepValidForSidebarRC(workingCase) &&
                    isHearingArrangementsStepValidRC(workingCase) &&
                    isPoliceDemandsStepValidRC(workingCase))
                    ? `${constants.RESTRICTION_CASE_POLICE_REPORT_ROUTE}/${id}`
                    : undefined,
              },
              {
                type: 'SUB_SECTION',
                name: formatMessage(
                  sections.restrictionCaseProsecutorSection.caseFiles,
                ),
                href:
                  (activeSubSection && activeSubSection > 4) ||
                  (isDefendantStepValidForSidebarRC(workingCase) &&
                    isHearingArrangementsStepValidRC(workingCase) &&
                    isPoliceDemandsStepValidRC(workingCase) &&
                    isPoliceReportStepValidRC(workingCase))
                    ? `${constants.RESTRICTION_CASE_CASE_FILES_ROUTE}/${id}`
                    : undefined,
              },
              {
                type: 'SUB_SECTION',
                name: formatMessage(
                  sections.restrictionCaseProsecutorSection.overview,
                ),
                href:
                  isDefendantStepValidForSidebarRC(workingCase) &&
                  isHearingArrangementsStepValidRC(workingCase) &&
                  isPoliceDemandsStepValidRC(workingCase) &&
                  isPoliceReportStepValidRC(workingCase)
                    ? `${constants.RESTRICTION_CASE_OVERVIEW_ROUTE}/${id}`
                    : undefined,
              },
            ],
    }
  }

  const getInvestigationCaseProsecutorSection = (
    workingCase: Case,
    user?: User,
    activeSubSection?: number,
  ): Section => {
    const { id } = workingCase

    return {
      name: formatMessage(sections.investigationCaseProsecutorSection.title),
      children:
        user?.institution?.type !== InstitutionType.PROSECUTORS_OFFICE
          ? []
          : [
              {
                type: 'SUB_SECTION',
                name: capitalize(
                  formatMessage(core.defendant, { suffix: 'i' }),
                ),
                href: `${constants.INVESTIGATION_CASE_DEFENDANT_ROUTE}/${id}`,
              },
              {
                type: 'SUB_SECTION',
                name: formatMessage(
                  sections.investigationCaseProsecutorSection
                    .hearingArrangements,
                ),
                href:
                  (activeSubSection && activeSubSection > 1) ||
                  isDefendantStepValidForSidebarIC(workingCase)
                    ? `${constants.INVESTIGATION_CASE_HEARING_ARRANGEMENTS_ROUTE}/${id}`
                    : undefined,
              },
              {
                type: 'SUB_SECTION',
                name: formatMessage(
                  sections.investigationCaseProsecutorSection.policeDemands,
                ),
                href:
                  (activeSubSection && activeSubSection > 2) ||
                  (isDefendantStepValidForSidebarIC(workingCase) &&
                    isHearingArrangementsStepValidIC(workingCase) &&
                    workingCase.state !== CaseState.NEW)
                    ? `${constants.INVESTIGATION_CASE_POLICE_DEMANDS_ROUTE}/${id}`
                    : undefined,
              },
              {
                type: 'SUB_SECTION',
                name: formatMessage(
                  sections.investigationCaseProsecutorSection.policeReport,
                ),
                href:
                  (activeSubSection && activeSubSection > 3) ||
                  (isDefendantStepValidForSidebarIC(workingCase) &&
                    isHearingArrangementsStepValidIC(workingCase) &&
                    isPoliceDemandsStepValidIC(workingCase))
                    ? `${constants.INVESTIGATION_CASE_POLICE_REPORT_ROUTE}/${id}`
                    : undefined,
              },
              {
                type: 'SUB_SECTION',
                name: formatMessage(
                  sections.investigationCaseProsecutorSection.caseFiles,
                ),
                href:
                  (activeSubSection && activeSubSection > 4) ||
                  (isDefendantStepValidForSidebarIC(workingCase) &&
                    isHearingArrangementsStepValidIC(workingCase) &&
                    isPoliceDemandsStepValidIC(workingCase) &&
                    isPoliceReportStepValidIC(workingCase))
                    ? `${constants.INVESTIGATION_CASE_CASE_FILES_ROUTE}/${id}`
                    : undefined,
              },
              {
                type: 'SUB_SECTION',
                name: formatMessage(
                  sections.investigationCaseProsecutorSection.overview,
                ),
                href:
                  isDefendantStepValidForSidebarIC(workingCase) &&
                  isHearingArrangementsStepValidIC(workingCase) &&
                  isPoliceDemandsStepValidIC(workingCase) &&
                  isPoliceReportStepValidIC(workingCase)
                    ? `${constants.INVESTIGATION_CASE_POLICE_CONFIRMATION_ROUTE}/${id}`
                    : undefined,
              },
            ],
    }
  }

  const getIndictmentCaseProsecutorSection = (workingCase: Case): Section => {
    const { id } = workingCase

    const caseHasBeenSentToCourt =
      workingCase.state !== CaseState.NEW &&
      workingCase.state !== CaseState.DRAFT
    return {
      name: formatMessage(sections.indictmentCaseProsecutorSection.title),
      // Procsecutor can only view the overview when case has been submitted to court
      children: caseHasBeenSentToCourt
        ? []
        : [
            {
              type: 'SUB_SECTION',
              name: capitalize(
                formatMessage(core.indictmentDefendant, {
                  gender: Gender.MALE,
                }),
              ),
              href: `${constants.INDICTMENTS_DEFENDANT_ROUTE}/${id}`,
            },
            {
              type: 'SUB_SECTION',
              name: capitalize(
                formatMessage(
                  sections.indictmentCaseProsecutorSection.policeCaseFiles,
                ),
              ),
              href:
                isDefendantStepValidForSidebarIndictments(workingCase) &&
                isProcessingStepValidIndictments(workingCase)
                  ? `${constants.INDICTMENTS_POLICE_CASE_FILES_ROUTE}/${id}`
                  : undefined,
            },
            {
              type: 'SUB_SECTION',
              name: capitalize(
                formatMessage(
                  sections.indictmentCaseProsecutorSection.caseFile,
                ),
              ),
              href:
                isDefendantStepValidForSidebarIndictments(workingCase) &&
                isProcessingStepValidIndictments(workingCase)
                  ? `${constants.INDICTMENTS_CASE_FILE_ROUTE}/${id}`
                  : undefined,
            },
            {
              type: 'SUB_SECTION',
              name: capitalize(
                formatMessage(
                  sections.indictmentCaseProsecutorSection.processing,
                ),
              ),
              href: isDefendantStepValidForSidebarIndictments(workingCase)
                ? `${constants.INDICTMENTS_PROCESSING_ROUTE}/${id}`
                : undefined,
            },
            {
              type: 'SUB_SECTION',
              name: capitalize(
                formatMessage(
                  sections.indictmentCaseProsecutorSection.caseFiles,
                ),
              ),
              href:
                isDefendantStepValidForSidebarIndictments(workingCase) &&
                isProcessingStepValidIndictments(workingCase)
                  ? `${constants.INDICTMENTS_CASE_FILES_ROUTE}/${id}`
                  : undefined,
            },
            {
              type: 'SUB_SECTION',
              name: capitalize(
                formatMessage(
                  sections.indictmentCaseProsecutorSection.overview,
                ),
              ),
              href:
                isDefendantStepValidForSidebarIndictments(workingCase) &&
                isProcessingStepValidIndictments(workingCase)
                  ? `${constants.INDICTMENTS_OVERVIEW_ROUTE}/${id}`
                  : undefined,
            },
          ],
    }
  }

  const getRestrictionCaseCourtSections = (
    workingCase: Case,
    user?: User,
    activeSubSection?: number,
  ): Section => {
    const { id } = workingCase
    const isModifyingRuling = router.pathname.includes(
      RESTRICTION_CASE_MODIFY_RULING_ROUTE,
    )

    return {
      name: formatMessage(sections.courtSection.title),
      children:
        user?.institution?.type !== InstitutionType.COURT
          ? []
          : [
              {
                type: 'SUB_SECTION',
                name: formatMessage(
                  sections.courtSection.receptionAndAssignment,
                ),
                href: isModifyingRuling
                  ? undefined
                  : `${constants.RESTRICTION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE}/${id}`,
              },
              {
                type: 'SUB_SECTION',
                name: formatMessage(sections.courtSection.overview),
                href:
                  !isModifyingRuling &&
                  ((activeSubSection && activeSubSection > 1) ||
                    isReceptionAndAssignmentStepValid(workingCase))
                    ? `${constants.RESTRICTION_CASE_COURT_OVERVIEW_ROUTE}/${id}`
                    : undefined,
              },
              {
                type: 'SUB_SECTION',
                name: formatMessage(sections.courtSection.hearingArrangements),
                href:
                  !isModifyingRuling &&
                  ((activeSubSection && activeSubSection > 2) ||
                    isReceptionAndAssignmentStepValid(workingCase))
                    ? `${constants.RESTRICTION_CASE_COURT_HEARING_ARRANGEMENTS_ROUTE}/${id}`
                    : undefined,
              },
              {
                type: 'SUB_SECTION',
                name: formatMessage(sections.courtSection.ruling),
                href:
                  !isModifyingRuling &&
                  ((activeSubSection && activeSubSection > 3) ||
                    (isReceptionAndAssignmentStepValid(workingCase) &&
                      isCourtHearingArrangemenstStepValidRC(workingCase)))
                    ? `${constants.RESTRICTION_CASE_RULING_ROUTE}/${id}`
                    : undefined,
              },
              {
                type: 'SUB_SECTION',
                name: formatMessage(sections.courtSection.courtRecord),
                href:
                  !isModifyingRuling &&
                  ((activeSubSection && activeSubSection > 4) ||
                    (isReceptionAndAssignmentStepValid(workingCase) &&
                      isCourtHearingArrangemenstStepValidRC(workingCase) &&
                      isRulingValidRC(workingCase)))
                    ? `${constants.RESTRICTION_CASE_COURT_RECORD_ROUTE}/${id}`
                    : undefined,
              },
              {
                type: 'SUB_SECTION',
                name: formatMessage(sections.courtSection.conclusion),
                href:
                  !isModifyingRuling &&
                  isReceptionAndAssignmentStepValid(workingCase) &&
                  isCourtHearingArrangemenstStepValidRC(workingCase) &&
                  isRulingValidRC(workingCase) &&
                  isCourtRecordStepValidRC(workingCase)
                    ? `${constants.RESTRICTION_CASE_CONFIRMATION_ROUTE}/${id}`
                    : undefined,
              },
            ],
    }
  }

  const getInvestigationCaseCourtSections = (
    workingCase: Case,
    user?: User,
    activeSubSection?: number,
  ): Section => {
    const { id } = workingCase
    const isModifyingRuling = router.pathname.includes(
      INVESTIGATION_CASE_MODIFY_RULING_ROUTE,
    )

    return {
      name: formatMessage(sections.investigationCaseCourtSection.title),
      children:
        user?.institution?.type !== InstitutionType.COURT
          ? []
          : [
              {
                type: 'SUB_SECTION',
                name: formatMessage(
                  sections.courtSection.receptionAndAssignment,
                ),
                href: isModifyingRuling
                  ? undefined
                  : `${constants.INVESTIGATION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE}/${id}`,
              },
              {
                type: 'SUB_SECTION',
                name: formatMessage(
                  sections.investigationCaseCourtSection.overview,
                ),
                href:
                  !isModifyingRuling &&
                  ((activeSubSection && activeSubSection > 1) ||
                    isReceptionAndAssignmentStepValid(workingCase))
                    ? `${constants.INVESTIGATION_CASE_OVERVIEW_ROUTE}/${id}`
                    : undefined,
              },
              {
                type: 'SUB_SECTION',
                name: formatMessage(
                  sections.investigationCaseCourtSection.hearingArrangements,
                ),
                href:
                  !isModifyingRuling &&
                  ((activeSubSection && activeSubSection > 2) ||
                    isReceptionAndAssignmentStepValid(workingCase))
                    ? `${constants.INVESTIGATION_CASE_COURT_HEARING_ARRANGEMENTS_ROUTE}/${id}`
                    : undefined,
              },
              {
                type: 'SUB_SECTION',
                name: formatMessage(
                  sections.investigationCaseCourtSection.ruling,
                ),
                href:
                  !isModifyingRuling &&
                  ((activeSubSection && activeSubSection > 3) ||
                    (isReceptionAndAssignmentStepValid(workingCase) &&
                      isCourtHearingArrangementsStepValidIC(workingCase)))
                    ? `${constants.INVESTIGATION_CASE_RULING_ROUTE}/${id}`
                    : undefined,
              },
              {
                type: 'SUB_SECTION',
                name: formatMessage(
                  sections.investigationCaseCourtSection.courtRecord,
                ),
                href:
                  !isModifyingRuling &&
                  ((activeSubSection && activeSubSection > 4) ||
                    (isReceptionAndAssignmentStepValid(workingCase) &&
                      isCourtHearingArrangementsStepValidIC(workingCase) &&
                      isRulingValidIC(workingCase)))
                    ? `${constants.INVESTIGATION_CASE_COURT_RECORD_ROUTE}/${id}`
                    : undefined,
              },
              {
                type: 'SUB_SECTION',
                name: formatMessage(
                  sections.investigationCaseCourtSection.conclusion,
                ),
                href:
                  !isModifyingRuling &&
                  isReceptionAndAssignmentStepValid(workingCase) &&
                  isCourtHearingArrangementsStepValidIC(workingCase) &&
                  isRulingValidIC(workingCase) &&
                  isCourtRecordStepValidIC(workingCase)
                    ? `${constants.INVESTIGATION_CASE_CONFIRMATION_ROUTE}/${id}`
                    : undefined,
              },
            ],
    }
  }

  const getIndictmentsCourtSections = (
    workingCase: Case,
    activeSubSection?: number,
  ) => {
    const { id } = workingCase

    return {
      name: formatMessage(sections.indictmentsCourtSection.title),
      children:
        activeSubSection === undefined
          ? []
          : [
              {
                type: 'SUB_SECTION',
                name: formatMessage(sections.indictmentsCourtSection.overview),
                href: `${constants.INDICTMENTS_COURT_OVERVIEW_ROUTE}/${id}`,
              },
              {
                type: 'SUB_SECTION',
                name: formatMessage(
                  sections.indictmentsCourtSection.receptionAndAssignment,
                ),
                href: `${constants.INDICTMENTS_RECEPTION_AND_ASSIGNMENT_ROUTE}/${workingCase.id}`,
              },
              {
                type: 'SUB_SECTION',
                name: formatMessage(sections.indictmentsCourtSection.subpoena),
                href: isReceptionAndAssignmentStepValid(workingCase)
                  ? `${constants.INDICTMENTS_SUBPOENA_ROUTE}/${workingCase.id}`
                  : undefined,
              },
              {
                type: 'SUB_SECTION',
                name: formatMessage(
                  sections.indictmentsCourtSection.prosecutorAndDefender,
                ),
                href:
                  isReceptionAndAssignmentStepValid(workingCase) &&
                  isSubpoenaStepValid(workingCase)
                    ? `${constants.INDICTMENTS_PROSECUTOR_AND_DEFENDER_ROUTE}/${workingCase.id}`
                    : undefined,
              },
              {
                type: 'SUB_SECTION',
                name: formatMessage(
                  sections.indictmentsCourtSection.courtRecord,
                ),
                href:
                  isReceptionAndAssignmentStepValid(workingCase) &&
                  isSubpoenaStepValid(workingCase) &&
                  isProsecutorAndDefenderStepValid(workingCase)
                    ? `${constants.INDICTMENTS_COURT_RECORD_ROUTE}/${workingCase.id}`
                    : undefined,
              },
            ],
    }
  }

  const getRestrictionCaseExtenstionSections = (
    workingCase: Case,
    user?: User,
    activeSubSection?: number,
  ): Section => {
    const { id } = workingCase

    return {
      name: formatMessage(sections.extensionSection.title),
      children:
        user?.institution?.type !== InstitutionType.PROSECUTORS_OFFICE
          ? []
          : [
              {
                type: 'SUB_SECTION',
                name: capitalize(
                  formatMessage(core.defendant, { suffix: 'i' }),
                ),
                href: `${constants.RESTRICTION_CASE_DEFENDANT_ROUTE}/${id}`,
              },
              {
                type: 'SUB_SECTION',
                name: formatMessage(
                  sections.extensionSection.hearingArrangements,
                ),
                href:
                  (activeSubSection && activeSubSection > 1) ||
                  isDefendantStepValidForSidebarRC(workingCase)
                    ? `${constants.RESTRICTION_CASE_HEARING_ARRANGEMENTS_ROUTE}/${id}`
                    : undefined,
              },
              {
                type: 'SUB_SECTION',
                name: formatMessage(sections.extensionSection.policeDemands),
                href:
                  (activeSubSection && activeSubSection > 2) ||
                  (isDefendantStepValidForSidebarRC(workingCase) &&
                    isHearingArrangementsStepValidRC(workingCase))
                    ? `${constants.RESTRICTION_CASE_POLICE_DEMANDS_ROUTE}/${id}`
                    : undefined,
              },
              {
                type: 'SUB_SECTION',
                name: formatMessage(sections.extensionSection.policeReport),
                href:
                  (activeSubSection && activeSubSection > 3) ||
                  (isDefendantStepValidForSidebarRC(workingCase) &&
                    isHearingArrangementsStepValidRC(workingCase) &&
                    isPoliceDemandsStepValidRC(workingCase))
                    ? `${constants.RESTRICTION_CASE_POLICE_REPORT_ROUTE}/${id}`
                    : undefined,
              },
              {
                type: 'SUB_SECTION',
                name: formatMessage(sections.extensionSection.caseFiles),
                href:
                  (activeSubSection && activeSubSection > 4) ||
                  (isDefendantStepValidForSidebarRC(workingCase) &&
                    isHearingArrangementsStepValidRC(workingCase) &&
                    isPoliceDemandsStepValidRC(workingCase) &&
                    isPoliceReportStepValidRC(workingCase))
                    ? `${constants.RESTRICTION_CASE_CASE_FILES_ROUTE}/${id}`
                    : undefined,
              },
              {
                type: 'SUB_SECTION',
                name: formatMessage(sections.extensionSection.overview),
                href:
                  isDefendantStepValidForSidebarRC(workingCase) &&
                  isHearingArrangementsStepValidRC(workingCase) &&
                  isPoliceDemandsStepValidRC(workingCase) &&
                  isPoliceReportStepValidRC(workingCase)
                    ? `${constants.RESTRICTION_CASE_OVERVIEW_ROUTE}/${id}`
                    : undefined,
              },
            ],
    }
  }

  const getInvestigationCaseExtenstionSections = (
    workingCase: Case,
    user?: User,
    activeSubSection?: number,
  ): Section => {
    const { id } = workingCase

    return {
      name: formatMessage(sections.investigationCaseExtensionSection.title),
      children:
        user?.institution?.type !== InstitutionType.PROSECUTORS_OFFICE
          ? []
          : [
              {
                type: 'SUB_SECTION',
                name: capitalize(
                  formatMessage(core.defendant, { suffix: 'i' }),
                ),
                href: `${constants.INVESTIGATION_CASE_DEFENDANT_ROUTE}/${id}`,
              },
              {
                type: 'SUB_SECTION',
                name: formatMessage(
                  sections.investigationCaseExtensionSection
                    .hearingArrangements,
                ),
                href:
                  (activeSubSection && activeSubSection > 1) ||
                  isDefendantStepValidForSidebarIC(workingCase)
                    ? `${constants.INVESTIGATION_CASE_HEARING_ARRANGEMENTS_ROUTE}/${id}`
                    : undefined,
              },
              {
                type: 'SUB_SECTION',
                name: formatMessage(
                  sections.investigationCaseExtensionSection.policeDemands,
                ),
                href:
                  (activeSubSection && activeSubSection > 2) ||
                  (isDefendantStepValidForSidebarIC(workingCase) &&
                    isHearingArrangementsStepValidIC(workingCase))
                    ? `${constants.INVESTIGATION_CASE_POLICE_DEMANDS_ROUTE}/${id}`
                    : undefined,
              },
              {
                type: 'SUB_SECTION',
                name: formatMessage(
                  sections.investigationCaseExtensionSection.policeReport,
                ),
                href:
                  (activeSubSection && activeSubSection > 3) ||
                  (isDefendantStepValidForSidebarIC(workingCase) &&
                    isHearingArrangementsStepValidIC(workingCase) &&
                    isPoliceDemandsStepValidIC(workingCase))
                    ? `${constants.INVESTIGATION_CASE_POLICE_REPORT_ROUTE}/${id}`
                    : undefined,
              },
              {
                type: 'SUB_SECTION',
                name: formatMessage(
                  sections.investigationCaseExtensionSection.caseFiles,
                ),
                href:
                  (activeSubSection && activeSubSection > 4) ||
                  (isDefendantStepValidForSidebarIC(workingCase) &&
                    isHearingArrangementsStepValidIC(workingCase) &&
                    isPoliceDemandsStepValidIC(workingCase) &&
                    isPoliceReportStepValidIC(workingCase))
                    ? `${constants.INVESTIGATION_CASE_CASE_FILES_ROUTE}/${id}`
                    : undefined,
              },
              {
                type: 'SUB_SECTION',
                name: formatMessage(
                  sections.investigationCaseExtensionSection.overview,
                ),
                href:
                  isDefendantStepValidForSidebarIC(workingCase) &&
                  isHearingArrangementsStepValidIC(workingCase) &&
                  isPoliceDemandsStepValidIC(workingCase) &&
                  isPoliceReportStepValidIC(workingCase)
                    ? `${constants.INVESTIGATION_CASE_POLICE_CONFIRMATION_ROUTE}/${id}`
                    : undefined,
              },
            ],
    }
  }

  const getSections = (
    workingCase?: Case,
    activeSubSection?: number,
    user?: User,
  ): Section[] => {
    return [
      isRestrictionCase(workingCase?.type)
        ? getRestrictionCaseProsecutorSection(
            workingCase || ({} as Case),
            user,
            activeSubSection,
          )
        : isInvestigationCase(workingCase?.type)
        ? getInvestigationCaseProsecutorSection(
            workingCase || ({} as Case),
            user,
            activeSubSection,
          )
        : getIndictmentCaseProsecutorSection(workingCase || ({} as Case)),
      isRestrictionCase(workingCase?.type)
        ? getRestrictionCaseCourtSections(
            workingCase || ({} as Case),
            user,
            activeSubSection,
          )
        : isInvestigationCase(workingCase?.type)
        ? getInvestigationCaseCourtSections(
            workingCase || ({} as Case),
            user,
            activeSubSection,
          )
        : getIndictmentsCourtSections(
            workingCase || ({} as Case),
            activeSubSection,
          ),
      {
        name: caseResult(formatMessage, workingCase),
        children: [],
      },
      isRestrictionCase(workingCase?.type)
        ? getRestrictionCaseExtenstionSections(
            workingCase || ({} as Case),
            user,
            activeSubSection,
          )
        : getInvestigationCaseExtenstionSections(
            workingCase || ({} as Case),
            user,
            activeSubSection,
          ),
      isRestrictionCase(workingCase?.type)
        ? getRestrictionCaseCourtSections(
            workingCase || ({} as Case),
            user,
            activeSubSection,
          )
        : getInvestigationCaseCourtSections(
            workingCase || ({} as Case),
            user,
            activeSubSection,
          ),
    ]
  }

  return {
    getRestrictionCaseProsecutorSection,
    getInvestigationCaseProsecutorSection,
    getIndictmentCaseProsecutorSection,
    getRestrictionCaseCourtSections,
    getInvestigationCaseCourtSections,
    getIndictmentsCourtSections,
    getSections,
    findLastValidStep,
  }
}

export default useSections
