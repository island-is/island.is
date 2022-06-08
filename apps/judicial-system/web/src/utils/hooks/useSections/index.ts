import { useIntl } from 'react-intl'

import {
  Case,
  InstitutionType,
  isRestrictionCase,
  User,
} from '@island.is/judicial-system/types'
import { core, sections } from '@island.is/judicial-system-web/messages'
import { caseResult } from '@island.is/judicial-system-web/src/components/PageLayout/utils'
import { capitalize } from '@island.is/judicial-system/formatters'
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
  isReceptionAndAssignmentStepValidRC,
  isReceptionAndAssignmentStepValidIC,
  isPoliceDemandsStepValidIC,
  isPoliceDemandsStepValidRC,
  isPoliceReportStepValidIC,
  isPoliceReportStepValidRC,
  isRulingValidIC,
  isRulingValidRC,
} from '../../validate'

interface Section {
  name: string
  children: {
    type: string
    name: string
    href: string | undefined
  }[]
}

const useSections = () => {
  const { formatMessage } = useIntl()

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
                href: `${constants.STEP_ONE_ROUTE}/${id}`,
              },
              {
                type: 'SUB_SECTION',
                name: formatMessage(
                  sections.restrictionCaseProsecutorSection.hearingArrangements,
                ),
                href:
                  (activeSubSection && activeSubSection > 1) ||
                  isDefendantStepValidForSidebarRC(workingCase)
                    ? `${constants.STEP_TWO_ROUTE}/${id}`
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
                    isHearingArrangementsStepValidRC(workingCase))
                    ? `${constants.STEP_THREE_ROUTE}/${id}`
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
                    ? `${constants.STEP_FOUR_ROUTE}/${id}`
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
                    ? `${constants.STEP_FIVE_ROUTE}/${id}`
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
                    ? `${constants.STEP_SIX_ROUTE}/${id}`
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
                href: `${constants.IC_DEFENDANT_ROUTE}/${id}`,
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
                    ? `${constants.IC_HEARING_ARRANGEMENTS_ROUTE}/${id}`
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
                    isHearingArrangementsStepValidIC(workingCase))
                    ? `${constants.IC_POLICE_DEMANDS_ROUTE}/${id}`
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
                    ? `${constants.IC_POLICE_REPORT_ROUTE}/${id}`
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
                    isPoliceDemandsStepValidIC(workingCase))
                    ? `${constants.IC_CASE_FILES_ROUTE}/${id}`
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
                  isPoliceDemandsStepValidIC(workingCase)
                    ? `${constants.IC_POLICE_CONFIRMATION_ROUTE}/${id}`
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
                href: `${constants.RECEPTION_AND_ASSIGNMENT_ROUTE}/${id}`,
              },
              {
                type: 'SUB_SECTION',
                name: formatMessage(sections.courtSection.overview),
                href:
                  (activeSubSection && activeSubSection > 1) ||
                  isReceptionAndAssignmentStepValidRC(workingCase)
                    ? `${constants.OVERVIEW_ROUTE}/${id}`
                    : undefined,
              },
              {
                type: 'SUB_SECTION',
                name: formatMessage(sections.courtSection.hearingArrangements),
                href:
                  (activeSubSection && activeSubSection > 2) ||
                  isReceptionAndAssignmentStepValidRC(workingCase)
                    ? `${constants.HEARING_ARRANGEMENTS_ROUTE}/${id}`
                    : undefined,
              },
              {
                type: 'SUB_SECTION',
                name: formatMessage(sections.courtSection.ruling),
                href:
                  (activeSubSection && activeSubSection > 3) ||
                  (isReceptionAndAssignmentStepValidRC(workingCase) &&
                    isCourtHearingArrangemenstStepValidRC(workingCase))
                    ? `${constants.RULING_ROUTE}/${id}`
                    : undefined,
              },
              {
                type: 'SUB_SECTION',
                name: formatMessage(sections.courtSection.courtRecord),
                href:
                  (activeSubSection && activeSubSection > 4) ||
                  (isReceptionAndAssignmentStepValidRC(workingCase) &&
                    isCourtHearingArrangemenstStepValidRC(workingCase) &&
                    isRulingValidRC(workingCase))
                    ? `${constants.COURT_RECORD_ROUTE}/${id}`
                    : undefined,
              },
              {
                type: 'SUB_SECTION',
                name: formatMessage(sections.courtSection.conclusion),
                href:
                  isReceptionAndAssignmentStepValidRC(workingCase) &&
                  isCourtHearingArrangemenstStepValidRC(workingCase) &&
                  isRulingValidRC(workingCase) &&
                  isCourtRecordStepValidRC(workingCase)
                    ? `${constants.CONFIRMATION_ROUTE}/${id}`
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
                href: `${constants.IC_RECEPTION_AND_ASSIGNMENT_ROUTE}/${id}`,
              },
              {
                type: 'SUB_SECTION',
                name: formatMessage(
                  sections.investigationCaseCourtSection.overview,
                ),
                href:
                  (activeSubSection && activeSubSection > 1) ||
                  isReceptionAndAssignmentStepValidIC(workingCase)
                    ? `${constants.IC_OVERVIEW_ROUTE}/${id}`
                    : undefined,
              },
              {
                type: 'SUB_SECTION',
                name: formatMessage(
                  sections.investigationCaseCourtSection.hearingArrangements,
                ),
                href:
                  (activeSubSection && activeSubSection > 2) ||
                  isReceptionAndAssignmentStepValidIC(workingCase)
                    ? `${constants.IC_COURT_HEARING_ARRANGEMENTS_ROUTE}/${id}`
                    : undefined,
              },
              {
                type: 'SUB_SECTION',
                name: formatMessage(
                  sections.investigationCaseCourtSection.ruling,
                ),
                href:
                  (activeSubSection && activeSubSection > 3) ||
                  (isReceptionAndAssignmentStepValidIC(workingCase) &&
                    isCourtHearingArrangementsStepValidIC(workingCase))
                    ? `${constants.IC_RULING_ROUTE}/${id}`
                    : undefined,
              },
              {
                type: 'SUB_SECTION',
                name: formatMessage(
                  sections.investigationCaseCourtSection.courtRecord,
                ),
                href:
                  (activeSubSection && activeSubSection > 4) ||
                  (isReceptionAndAssignmentStepValidIC(workingCase) &&
                    isCourtHearingArrangementsStepValidIC(workingCase) &&
                    isRulingValidIC(workingCase))
                    ? `${constants.IC_COURT_RECORD_ROUTE}/${id}`
                    : undefined,
              },
              {
                type: 'SUB_SECTION',
                name: formatMessage(
                  sections.investigationCaseCourtSection.conclusion,
                ),
                href:
                  isReceptionAndAssignmentStepValidIC(workingCase) &&
                  isCourtHearingArrangementsStepValidIC(workingCase) &&
                  isRulingValidIC(workingCase) &&
                  isCourtRecordStepValidIC(workingCase)
                    ? `${constants.IC_CONFIRMATION_ROUTE}/${id}`
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
                href: `${constants.STEP_ONE_ROUTE}/${id}`,
              },
              {
                type: 'SUB_SECTION',
                name: formatMessage(
                  sections.extensionSection.hearingArrangements,
                ),
                href:
                  (activeSubSection && activeSubSection > 1) ||
                  isDefendantStepValidForSidebarRC(workingCase)
                    ? `${constants.STEP_TWO_ROUTE}/${id}`
                    : undefined,
              },
              {
                type: 'SUB_SECTION',
                name: formatMessage(sections.extensionSection.policeDemands),
                href:
                  (activeSubSection && activeSubSection > 2) ||
                  (isDefendantStepValidForSidebarRC(workingCase) &&
                    isHearingArrangementsStepValidRC(workingCase))
                    ? `${constants.STEP_THREE_ROUTE}/${id}`
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
                    ? `${constants.STEP_FOUR_ROUTE}/${id}`
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
                    ? `${constants.STEP_FIVE_ROUTE}/${id}`
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
                    ? `${constants.STEP_SIX_ROUTE}/${id}`
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
                href: `${constants.IC_DEFENDANT_ROUTE}/${id}`,
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
                    ? `${constants.IC_HEARING_ARRANGEMENTS_ROUTE}/${id}`
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
                    ? `${constants.IC_POLICE_DEMANDS_ROUTE}/${id}`
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
                    ? `${constants.IC_POLICE_REPORT_ROUTE}/${id}`
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
                    ? `${constants.IC_CASE_FILES_ROUTE}/${id}`
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
                    ? `${constants.IC_POLICE_CONFIRMATION_ROUTE}/${id}`
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
        : getInvestigationCaseProsecutorSection(
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
    getRestrictionCaseCourtSections,
    getInvestigationCaseCourtSections,
    getSections,
    findLastValidStep,
  }
}

export default useSections
