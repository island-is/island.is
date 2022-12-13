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
import * as constants from '@island.is/judicial-system/consts'

import {
  isDefendantStepValidRC,
  isCourtHearingArrangemenstStepValidRC,
  isCourtHearingArrangementsStepValidIC,
  isCourtRecordStepValidIC,
  isCourtRecordStepValidRC,
  isHearingArrangementsStepValidIC,
  isHearingArrangementsStepValidRC,
  isPoliceDemandsStepValidIC,
  isPoliceDemandsStepValidRC,
  isPoliceReportStepValidIC,
  isPoliceReportStepValidRC,
  isRulingValidIC,
  isRulingValidRC,
  isProcessingStepValidIndictments,
  isReceptionAndAssignmentStepValid,
  isSubpoenaStepValid,
  isProsecutorAndDefenderStepValid,
  isDefendantStepValidIC,
  isDefendantStepValidIndictments,
} from '../../validate'

interface Section {
  name: string
  children: {
    name: string
    href?: string
    onClick?: () => void
  }[]
}

const validateFormStepper = (
  isActiveSubSectionValid: boolean,
  steps: string[],
  workingCase: Case,
) => {
  if (!isActiveSubSectionValid) {
    return false
  }

  const validationForStep = {
    [constants.CREATE_RESTRICTION_CASE_ROUTE]: isDefendantStepValidRC(
      workingCase,
      workingCase.policeCaseNumbers,
    ),
    [constants.RESTRICTION_CASE_DEFENDANT_ROUTE]: isDefendantStepValidRC(
      workingCase,
      workingCase.policeCaseNumbers,
    ),
    [constants.RESTRICTION_CASE_HEARING_ARRANGEMENTS_ROUTE]: isHearingArrangementsStepValidRC(
      workingCase,
    ),
    [constants.RESTRICTION_CASE_POLICE_DEMANDS_ROUTE]: isPoliceDemandsStepValidRC(
      workingCase,
    ),
    [constants.RESTRICTION_CASE_POLICE_REPORT_ROUTE]: isPoliceReportStepValidRC(
      workingCase,
    ),
    [constants.INVESTIGATION_CASE_DEFENDANT_ROUTE]: isDefendantStepValidIC(
      workingCase,
      workingCase.type,
      workingCase.policeCaseNumbers,
    ),
    [constants.INVESTIGATION_CASE_HEARING_ARRANGEMENTS_ROUTE]: isHearingArrangementsStepValidIC(
      workingCase,
    ),
    [constants.INVESTIGATION_CASE_POLICE_DEMANDS_ROUTE]: isPoliceDemandsStepValidIC(
      workingCase,
    ),
    [constants.INVESTIGATION_CASE_POLICE_REPORT_ROUTE]: isPoliceReportStepValidIC(
      workingCase,
    ),
    [constants.INVESTIGATION_CASE_CASE_FILES_ROUTE]: true,
    [constants.INDICTMENTS_DEFENDANT_ROUTE]: isDefendantStepValidIndictments,
    [constants.INDICTMENTS_POLICE_CASE_FILES_ROUTE]: true,
    [constants.INDICTMENTS_CASE_FILE_ROUTE]: true,
    [constants.INDICTMENTS_PROCESSING_ROUTE]: isProcessingStepValidIndictments,
    [constants.INDICTMENTS_CASE_FILES_ROUTE]: true,
    [constants.RESTRICTION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE]: isReceptionAndAssignmentStepValid(
      workingCase,
    ),
    [constants.RESTRICTION_CASE_COURT_OVERVIEW_ROUTE]: true,
    [constants.RESTRICTION_CASE_COURT_HEARING_ARRANGEMENTS_ROUTE]: isCourtHearingArrangemenstStepValidRC(
      workingCase,
    ),
    [constants.RESTRICTION_CASE_RULING_ROUTE]: isRulingValidRC(workingCase),
    [constants.RESTRICTION_CASE_COURT_RECORD_ROUTE]: isCourtRecordStepValidRC(
      workingCase,
    ),
    [constants.INDICTMENTS_RECEPTION_AND_ASSIGNMENT_ROUTE]: isReceptionAndAssignmentStepValid(
      workingCase,
    ),
    [constants.INVESTIGATION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE]: isReceptionAndAssignmentStepValid(
      workingCase,
    ),
    [constants.INVESTIGATION_CASE_OVERVIEW_ROUTE]: true,
    [constants.INVESTIGATION_CASE_COURT_HEARING_ARRANGEMENTS_ROUTE]: isCourtHearingArrangementsStepValidIC(
      workingCase,
    ),
    [constants.INVESTIGATION_CASE_RULING_ROUTE]: isRulingValidIC(workingCase),
    [constants.INVESTIGATION_CASE_COURT_RECORD_ROUTE]: isCourtRecordStepValidIC(
      workingCase,
    ),
    [constants.INDICTMENTS_OVERVIEW_ROUTE]: true,
    [constants.INDICTMENTS_RECEPTION_AND_ASSIGNMENT_ROUTE]: isReceptionAndAssignmentStepValid(
      workingCase,
    ),
    [constants.INDICTMENTS_SUBPOENA_ROUTE]: isSubpoenaStepValid(workingCase),
    [constants.INDICTMENTS_PROSECUTOR_AND_DEFENDER_ROUTE]: isProsecutorAndDefenderStepValid(
      workingCase,
    ),
  }

  return (
    steps.map(
      (step) =>
        validationForStep[step as keyof typeof validationForStep] === false,
    ).length > 0
  )
}

const useSections = (
  activeSubSection?: number,
  isValid = true,
  onNavigationTo?: (destination: string) => Promise<void>,
) => {
  const { formatMessage } = useIntl()
  const router = useRouter()

  const findLastValidStep = (section: Section) => {
    const filterValidSteps = section.children.filter((c) => c.href)
    return filterValidSteps[filterValidSteps.length - 1]
  }

  const getRestrictionCaseProsecutorSection = (
    workingCase: Case,
    user?: User,
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
                name: capitalize(
                  formatMessage(core.defendant, {
                    suffix: 'i',
                  }),
                ),
                href: `${constants.RESTRICTION_CASE_DEFENDANT_ROUTE}/${id}`,
              },
              {
                name: formatMessage(
                  sections.restrictionCaseProsecutorSection.hearingArrangements,
                ),
                href:
                  activeSubSection && activeSubSection > 1
                    ? `${constants.RESTRICTION_CASE_HEARING_ARRANGEMENTS_ROUTE}/${id}`
                    : undefined,
                onClick:
                  validateFormStepper(
                    isValid,
                    [constants.RESTRICTION_CASE_DEFENDANT_ROUTE],
                    workingCase,
                  ) && onNavigationTo
                    ? async () =>
                        await onNavigationTo(
                          constants.RESTRICTION_CASE_HEARING_ARRANGEMENTS_ROUTE,
                        )
                    : undefined,
              },
              {
                name: formatMessage(
                  sections.restrictionCaseProsecutorSection.policeDemands,
                ),
                href:
                  activeSubSection && activeSubSection > 2
                    ? `${constants.RESTRICTION_CASE_POLICE_DEMANDS_ROUTE}/${id}`
                    : undefined,
                onClick:
                  validateFormStepper(
                    isValid,
                    [
                      constants.RESTRICTION_CASE_DEFENDANT_ROUTE,
                      constants.RESTRICTION_CASE_HEARING_ARRANGEMENTS_ROUTE,
                    ],
                    workingCase,
                  ) && onNavigationTo
                    ? async () =>
                        await onNavigationTo(
                          constants.RESTRICTION_CASE_POLICE_DEMANDS_ROUTE,
                        )
                    : undefined,
              },
              {
                name: formatMessage(
                  sections.restrictionCaseProsecutorSection.policeReport,
                ),
                href:
                  activeSubSection && activeSubSection > 3
                    ? `${constants.RESTRICTION_CASE_POLICE_REPORT_ROUTE}/${id}`
                    : undefined,
                onClick:
                  validateFormStepper(
                    isValid,
                    [
                      constants.RESTRICTION_CASE_DEFENDANT_ROUTE,
                      constants.RESTRICTION_CASE_HEARING_ARRANGEMENTS_ROUTE,
                      constants.RESTRICTION_CASE_POLICE_DEMANDS_ROUTE,
                    ],
                    workingCase,
                  ) && onNavigationTo
                    ? async () =>
                        await onNavigationTo(
                          constants.RESTRICTION_CASE_POLICE_REPORT_ROUTE,
                        )
                    : undefined,
              },
              {
                name: formatMessage(
                  sections.restrictionCaseProsecutorSection.caseFiles,
                ),
                href:
                  activeSubSection && activeSubSection > 4
                    ? `${constants.RESTRICTION_CASE_HEARING_ARRANGEMENTS_ROUTE}/${id}`
                    : undefined,
                onClick:
                  validateFormStepper(
                    isValid,
                    [
                      constants.RESTRICTION_CASE_DEFENDANT_ROUTE,
                      constants.RESTRICTION_CASE_HEARING_ARRANGEMENTS_ROUTE,
                      constants.RESTRICTION_CASE_POLICE_DEMANDS_ROUTE,
                      constants.RESTRICTION_CASE_POLICE_REPORT_ROUTE,
                    ],
                    workingCase,
                  ) && onNavigationTo
                    ? async () =>
                        await onNavigationTo(
                          constants.RESTRICTION_CASE_CASE_FILES_ROUTE,
                        )
                    : undefined,
              },
              {
                name: formatMessage(
                  sections.restrictionCaseProsecutorSection.overview,
                ),
                href:
                  activeSubSection && activeSubSection > 5
                    ? `${constants.RESTRICTION_CASE_CASE_FILES_ROUTE}/${id}`
                    : undefined,
                onClick:
                  validateFormStepper(
                    isValid,
                    [
                      constants.RESTRICTION_CASE_DEFENDANT_ROUTE,
                      constants.RESTRICTION_CASE_HEARING_ARRANGEMENTS_ROUTE,
                      constants.RESTRICTION_CASE_POLICE_DEMANDS_ROUTE,
                      constants.RESTRICTION_CASE_POLICE_REPORT_ROUTE,
                      constants.RESTRICTION_CASE_CASE_FILES_ROUTE,
                    ],
                    workingCase,
                  ) && onNavigationTo
                    ? async () =>
                        await onNavigationTo(
                          constants.RESTRICTION_CASE_OVERVIEW_ROUTE,
                        )
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
                name: capitalize(
                  formatMessage(core.defendant, { suffix: 'i' }),
                ),
                href: `${constants.INVESTIGATION_CASE_DEFENDANT_ROUTE}/${id}`,
              },
              {
                name: formatMessage(
                  sections.investigationCaseProsecutorSection
                    .hearingArrangements,
                ),
                href:
                  activeSubSection && activeSubSection > 1
                    ? `${constants.INVESTIGATION_CASE_HEARING_ARRANGEMENTS_ROUTE}/${id}`
                    : undefined,
                onClick: () =>
                  validateFormStepper(
                    isValid,
                    [constants.INVESTIGATION_CASE_DEFENDANT_ROUTE],
                    workingCase,
                  ) && onNavigationTo
                    ? async () =>
                        await onNavigationTo(
                          constants.INVESTIGATION_CASE_HEARING_ARRANGEMENTS_ROUTE,
                        )
                    : undefined,
              },
              {
                name: formatMessage(
                  sections.investigationCaseProsecutorSection.policeDemands,
                ),
                href:
                  activeSubSection && activeSubSection > 2
                    ? `${constants.INVESTIGATION_CASE_POLICE_DEMANDS_ROUTE}/${id}`
                    : undefined,
                onClick: () =>
                  validateFormStepper(
                    isValid,
                    [
                      constants.INVESTIGATION_CASE_DEFENDANT_ROUTE,
                      constants.INVESTIGATION_CASE_HEARING_ARRANGEMENTS_ROUTE,
                    ],
                    workingCase,
                  ) && onNavigationTo
                    ? async () =>
                        await onNavigationTo(
                          constants.INVESTIGATION_CASE_POLICE_DEMANDS_ROUTE,
                        )
                    : undefined,
              },
              {
                name: formatMessage(
                  sections.investigationCaseProsecutorSection.policeReport,
                ),
                href:
                  activeSubSection && activeSubSection > 3
                    ? `${constants.INVESTIGATION_CASE_POLICE_REPORT_ROUTE}/${id}`
                    : undefined,

                onClick: () =>
                  validateFormStepper(
                    isValid,
                    [
                      constants.INVESTIGATION_CASE_DEFENDANT_ROUTE,
                      constants.INVESTIGATION_CASE_HEARING_ARRANGEMENTS_ROUTE,
                      constants.INVESTIGATION_CASE_POLICE_DEMANDS_ROUTE,
                    ],
                    workingCase,
                  ) && onNavigationTo
                    ? async () =>
                        await onNavigationTo(
                          constants.INVESTIGATION_CASE_POLICE_REPORT_ROUTE,
                        )
                    : undefined,
              },
              {
                name: formatMessage(
                  sections.investigationCaseProsecutorSection.caseFiles,
                ),
                href:
                  activeSubSection && activeSubSection > 4
                    ? `${constants.INVESTIGATION_CASE_CASE_FILES_ROUTE}/${id}`
                    : undefined,
                onClick: () =>
                  validateFormStepper(
                    isValid,
                    [
                      constants.INVESTIGATION_CASE_DEFENDANT_ROUTE,
                      constants.INVESTIGATION_CASE_HEARING_ARRANGEMENTS_ROUTE,
                      constants.INVESTIGATION_CASE_POLICE_DEMANDS_ROUTE,
                      constants.INVESTIGATION_CASE_POLICE_REPORT_ROUTE,
                    ],
                    workingCase,
                  ) && onNavigationTo
                    ? async () =>
                        await onNavigationTo(
                          constants.INVESTIGATION_CASE_CASE_FILES_ROUTE,
                        )
                    : undefined,
              },
              {
                name: formatMessage(
                  sections.investigationCaseProsecutorSection.overview,
                ),
                href:
                  activeSubSection && activeSubSection > 5
                    ? `${constants.INVESTIGATION_CASE_POLICE_CONFIRMATION_ROUTE}/${id}`
                    : undefined,
                onClick: () =>
                  validateFormStepper(
                    isValid,
                    [
                      constants.INVESTIGATION_CASE_DEFENDANT_ROUTE,
                      constants.INVESTIGATION_CASE_HEARING_ARRANGEMENTS_ROUTE,
                      constants.INVESTIGATION_CASE_POLICE_DEMANDS_ROUTE,
                      constants.INVESTIGATION_CASE_POLICE_REPORT_ROUTE,
                      constants.INVESTIGATION_CASE_CASE_FILES_ROUTE,
                    ],
                    workingCase,
                  ) && onNavigationTo
                    ? async () =>
                        await onNavigationTo(
                          constants.INVESTIGATION_CASE_POLICE_CONFIRMATION_ROUTE,
                        )
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
      // Prosecutor can only view the overview when case has been submitted to court
      children: caseHasBeenSentToCourt
        ? []
        : [
            {
              name: capitalize(
                formatMessage(core.indictmentDefendant, {
                  gender: Gender.MALE,
                }),
              ),
              href: `${constants.INDICTMENTS_DEFENDANT_ROUTE}/${id}`,
            },
            {
              name: capitalize(
                formatMessage(
                  sections.indictmentCaseProsecutorSection.policeCaseFiles,
                ),
              ),
              href:
                activeSubSection && activeSubSection > 1
                  ? `${constants.INDICTMENTS_POLICE_CASE_FILES_ROUTE}/${id}`
                  : undefined,
              onClick: () =>
                validateFormStepper(
                  isValid,
                  [constants.INDICTMENTS_DEFENDANT_ROUTE],
                  workingCase,
                ) && onNavigationTo
                  ? async () =>
                      await onNavigationTo(
                        constants.INDICTMENTS_POLICE_CASE_FILES_ROUTE,
                      )
                  : undefined,
            },
            {
              name: capitalize(
                formatMessage(
                  sections.indictmentCaseProsecutorSection.caseFile,
                ),
              ),
              href:
                activeSubSection && activeSubSection > 2
                  ? `${constants.INDICTMENTS_CASE_FILE_ROUTE}/${id}`
                  : undefined,
              onClick: () =>
                validateFormStepper(
                  isValid,
                  [
                    constants.INDICTMENTS_DEFENDANT_ROUTE,
                    constants.INDICTMENTS_POLICE_CASE_FILES_ROUTE,
                  ],
                  workingCase,
                ) && onNavigationTo
                  ? async () =>
                      await onNavigationTo(
                        constants.INDICTMENTS_CASE_FILE_ROUTE,
                      )
                  : undefined,
            },
            {
              name: capitalize(
                formatMessage(
                  sections.indictmentCaseProsecutorSection.processing,
                ),
              ),
              href:
                activeSubSection && activeSubSection > 3
                  ? `${constants.INDICTMENTS_PROCESSING_ROUTE}/${id}`
                  : undefined,
              onClick: () =>
                validateFormStepper(
                  isValid,
                  [
                    constants.INDICTMENTS_DEFENDANT_ROUTE,
                    constants.INDICTMENTS_POLICE_CASE_FILES_ROUTE,
                    constants.INDICTMENTS_CASE_FILE_ROUTE,
                  ],
                  workingCase,
                ) && onNavigationTo
                  ? async () =>
                      await onNavigationTo(
                        constants.INDICTMENTS_PROCESSING_ROUTE,
                      )
                  : undefined,
            },
            {
              name: capitalize(
                formatMessage(
                  sections.indictmentCaseProsecutorSection.caseFiles,
                ),
              ),
              href:
                activeSubSection && activeSubSection > 4
                  ? `${constants.INDICTMENTS_CASE_FILES_ROUTE}/${id}`
                  : undefined,
              onClick: () =>
                validateFormStepper(
                  isValid,
                  [
                    constants.INDICTMENTS_DEFENDANT_ROUTE,
                    constants.INDICTMENTS_POLICE_CASE_FILES_ROUTE,
                    constants.INDICTMENTS_CASE_FILE_ROUTE,
                    constants.INDICTMENTS_PROCESSING_ROUTE,
                  ],
                  workingCase,
                ) && onNavigationTo
                  ? async () =>
                      await onNavigationTo(
                        constants.INDICTMENTS_CASE_FILES_ROUTE,
                      )
                  : undefined,
            },
            {
              name: capitalize(
                formatMessage(
                  sections.indictmentCaseProsecutorSection.overview,
                ),
              ),
              href:
                activeSubSection && activeSubSection > 5
                  ? `${constants.INDICTMENTS_OVERVIEW_ROUTE}/${id}`
                  : undefined,
              onClick: () =>
                validateFormStepper(
                  isValid,
                  [
                    constants.INDICTMENTS_DEFENDANT_ROUTE,
                    constants.INDICTMENTS_POLICE_CASE_FILES_ROUTE,
                    constants.INDICTMENTS_CASE_FILE_ROUTE,
                    constants.INDICTMENTS_PROCESSING_ROUTE,
                    constants.INDICTMENTS_CASE_FILES_ROUTE,
                  ],
                  workingCase,
                ) && onNavigationTo
                  ? async () =>
                      await onNavigationTo(constants.INDICTMENTS_OVERVIEW_ROUTE)
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
      constants.RESTRICTION_CASE_MODIFY_RULING_ROUTE,
    )

    return {
      name: formatMessage(sections.courtSection.title),
      children:
        user?.institution?.type !== InstitutionType.COURT
          ? []
          : [
              {
                name: formatMessage(
                  sections.courtSection.receptionAndAssignment,
                ),
                href: isModifyingRuling
                  ? undefined
                  : `${constants.RESTRICTION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE}/${id}`,
              },
              {
                name: formatMessage(sections.courtSection.overview),
                href:
                  !isModifyingRuling && activeSubSection && activeSubSection > 1
                    ? `${constants.RESTRICTION_CASE_COURT_OVERVIEW_ROUTE}/${id}`
                    : undefined,
                onClick: () =>
                  validateFormStepper(
                    isValid,
                    [constants.RESTRICTION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE],
                    workingCase,
                  ) && onNavigationTo
                    ? async () =>
                        await onNavigationTo(
                          constants.RESTRICTION_CASE_COURT_OVERVIEW_ROUTE,
                        )
                    : undefined,
              },
              {
                name: formatMessage(sections.courtSection.hearingArrangements),
                href:
                  !isModifyingRuling && activeSubSection && activeSubSection > 2
                    ? `${constants.RESTRICTION_CASE_COURT_HEARING_ARRANGEMENTS_ROUTE}/${id}`
                    : undefined,
                onClick:
                  validateFormStepper(
                    isValid,
                    [
                      constants.RESTRICTION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE,
                      constants.RESTRICTION_CASE_COURT_OVERVIEW_ROUTE,
                    ],
                    workingCase,
                  ) && onNavigationTo
                    ? async () =>
                        await onNavigationTo(
                          constants.RESTRICTION_CASE_COURT_HEARING_ARRANGEMENTS_ROUTE,
                        )
                    : undefined,
              },
              {
                name: formatMessage(sections.courtSection.ruling),
                href:
                  !isModifyingRuling && activeSubSection && activeSubSection > 3
                    ? `${constants.RESTRICTION_CASE_RULING_ROUTE}/${id}`
                    : undefined,
                onClick:
                  validateFormStepper(
                    isValid,
                    [
                      constants.RESTRICTION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE,
                      constants.RESTRICTION_CASE_COURT_OVERVIEW_ROUTE,
                      constants.RESTRICTION_CASE_COURT_HEARING_ARRANGEMENTS_ROUTE,
                    ],
                    workingCase,
                  ) && onNavigationTo
                    ? async () =>
                        await onNavigationTo(
                          constants.RESTRICTION_CASE_RULING_ROUTE,
                        )
                    : undefined,
              },
              {
                name: formatMessage(sections.courtSection.courtRecord),
                href:
                  !isModifyingRuling && activeSubSection && activeSubSection > 4
                    ? `${constants.RESTRICTION_CASE_COURT_RECORD_ROUTE}/${id}`
                    : undefined,
                onClick:
                  validateFormStepper(
                    isValid,
                    [
                      constants.RESTRICTION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE,
                      constants.RESTRICTION_CASE_COURT_OVERVIEW_ROUTE,
                      constants.RESTRICTION_CASE_COURT_HEARING_ARRANGEMENTS_ROUTE,
                      constants.RESTRICTION_CASE_RULING_ROUTE,
                    ],
                    workingCase,
                  ) && onNavigationTo
                    ? async () =>
                        await onNavigationTo(
                          constants.RESTRICTION_CASE_COURT_RECORD_ROUTE,
                        )
                    : undefined,
              },
              {
                name: formatMessage(sections.courtSection.conclusion),
                href:
                  !isModifyingRuling && activeSubSection && activeSubSection > 5
                    ? `${constants.RESTRICTION_CASE_CONFIRMATION_ROUTE}/${id}`
                    : undefined,
                onClick:
                  validateFormStepper(
                    isValid,
                    [
                      constants.RESTRICTION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE,
                      constants.RESTRICTION_CASE_COURT_OVERVIEW_ROUTE,
                      constants.RESTRICTION_CASE_COURT_HEARING_ARRANGEMENTS_ROUTE,
                      constants.RESTRICTION_CASE_RULING_ROUTE,
                      constants.RESTRICTION_CASE_COURT_RECORD_ROUTE,
                    ],
                    workingCase,
                  ) && onNavigationTo
                    ? async () =>
                        await onNavigationTo(
                          constants.RESTRICTION_CASE_CONFIRMATION_ROUTE,
                        )
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
      constants.INVESTIGATION_CASE_MODIFY_RULING_ROUTE,
    )

    return {
      name: formatMessage(sections.investigationCaseCourtSection.title),
      children:
        user?.institution?.type !== InstitutionType.COURT
          ? []
          : [
              {
                name: formatMessage(
                  sections.courtSection.receptionAndAssignment,
                ),
                href: isModifyingRuling
                  ? undefined
                  : `${constants.INVESTIGATION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE}/${id}`,
              },
              {
                name: formatMessage(
                  sections.investigationCaseCourtSection.overview,
                ),
                href:
                  !isModifyingRuling && activeSubSection && activeSubSection > 1
                    ? `${constants.INVESTIGATION_CASE_OVERVIEW_ROUTE}/${id}`
                    : undefined,
                onClick:
                  validateFormStepper(
                    isValid,
                    [
                      constants.INVESTIGATION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE,
                    ],
                    workingCase,
                  ) && onNavigationTo
                    ? async () =>
                        await onNavigationTo(
                          constants.INVESTIGATION_CASE_OVERVIEW_ROUTE,
                        )
                    : undefined,
              },
              {
                name: formatMessage(
                  sections.investigationCaseCourtSection.hearingArrangements,
                ),
                href:
                  !isModifyingRuling && activeSubSection && activeSubSection > 2
                    ? `${constants.INVESTIGATION_CASE_COURT_HEARING_ARRANGEMENTS_ROUTE}/${id}`
                    : undefined,
                onClick:
                  validateFormStepper(
                    isValid,
                    [
                      constants.INVESTIGATION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE,
                      constants.INVESTIGATION_CASE_OVERVIEW_ROUTE,
                    ],
                    workingCase,
                  ) && onNavigationTo
                    ? async () =>
                        await onNavigationTo(
                          constants.INVESTIGATION_CASE_COURT_HEARING_ARRANGEMENTS_ROUTE,
                        )
                    : undefined,
              },
              {
                name: formatMessage(
                  sections.investigationCaseCourtSection.ruling,
                ),
                href:
                  !isModifyingRuling && activeSubSection && activeSubSection > 3
                    ? `${constants.INVESTIGATION_CASE_RULING_ROUTE}/${id}`
                    : undefined,
                onClick:
                  validateFormStepper(
                    isValid,
                    [
                      constants.INVESTIGATION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE,
                      constants.INVESTIGATION_CASE_OVERVIEW_ROUTE,
                      constants.INVESTIGATION_CASE_COURT_HEARING_ARRANGEMENTS_ROUTE,
                    ],
                    workingCase,
                  ) && onNavigationTo
                    ? async () =>
                        await onNavigationTo(
                          constants.INVESTIGATION_CASE_RULING_ROUTE,
                        )
                    : undefined,
              },
              {
                name: formatMessage(
                  sections.investigationCaseCourtSection.courtRecord,
                ),
                href:
                  !isModifyingRuling && activeSubSection && activeSubSection > 4
                    ? `${constants.INVESTIGATION_CASE_COURT_RECORD_ROUTE}/${id}`
                    : undefined,
                onClick:
                  validateFormStepper(
                    isValid,
                    [
                      constants.INVESTIGATION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE,
                      constants.INVESTIGATION_CASE_OVERVIEW_ROUTE,
                      constants.INVESTIGATION_CASE_COURT_HEARING_ARRANGEMENTS_ROUTE,
                      constants.INVESTIGATION_CASE_RULING_ROUTE,
                    ],
                    workingCase,
                  ) && onNavigationTo
                    ? async () =>
                        await onNavigationTo(
                          constants.INVESTIGATION_CASE_COURT_RECORD_ROUTE,
                        )
                    : undefined,
              },
              {
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
                onClick:
                  validateFormStepper(
                    isValid,
                    [
                      constants.INVESTIGATION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE,
                      constants.INVESTIGATION_CASE_OVERVIEW_ROUTE,
                      constants.INVESTIGATION_CASE_COURT_HEARING_ARRANGEMENTS_ROUTE,
                      constants.INVESTIGATION_CASE_RULING_ROUTE,
                      constants.INVESTIGATION_CASE_COURT_RECORD_ROUTE,
                    ],
                    workingCase,
                  ) && onNavigationTo
                    ? async () =>
                        await onNavigationTo(
                          constants.INVESTIGATION_CASE_CONFIRMATION_ROUTE,
                        )
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
                name: formatMessage(sections.indictmentsCourtSection.overview),
                href: `${constants.INDICTMENTS_COURT_OVERVIEW_ROUTE}/${id}`,
              },
              {
                name: formatMessage(
                  sections.indictmentsCourtSection.receptionAndAssignment,
                ),
                href:
                  activeSubSection && activeSubSection > 1
                    ? `${constants.INDICTMENTS_RECEPTION_AND_ASSIGNMENT_ROUTE}/${workingCase.id}`
                    : undefined,
                onClick:
                  validateFormStepper(
                    isValid,
                    [constants.INDICTMENTS_OVERVIEW_ROUTE],
                    workingCase,
                  ) && onNavigationTo
                    ? async () =>
                        await onNavigationTo(
                          constants.INDICTMENTS_RECEPTION_AND_ASSIGNMENT_ROUTE,
                        )
                    : undefined,
              },
              {
                name: formatMessage(sections.indictmentsCourtSection.subpoena),
                href:
                  activeSubSection && activeSubSection > 2
                    ? `${constants.INDICTMENTS_SUBPOENA_ROUTE}/${workingCase.id}`
                    : undefined,
                onClick:
                  validateFormStepper(
                    isValid,
                    [
                      constants.INDICTMENTS_OVERVIEW_ROUTE,
                      constants.INDICTMENTS_RECEPTION_AND_ASSIGNMENT_ROUTE,
                    ],
                    workingCase,
                  ) && onNavigationTo
                    ? async () =>
                        await onNavigationTo(
                          constants.INDICTMENTS_SUBPOENA_ROUTE,
                        )
                    : undefined,
              },
              {
                name: formatMessage(
                  sections.indictmentsCourtSection.prosecutorAndDefender,
                ),
                href:
                  activeSubSection && activeSubSection > 3
                    ? `${constants.INDICTMENTS_PROSECUTOR_AND_DEFENDER_ROUTE}/${workingCase.id}`
                    : undefined,
                onClick:
                  validateFormStepper(
                    isValid,
                    [
                      constants.INDICTMENTS_OVERVIEW_ROUTE,
                      constants.INDICTMENTS_RECEPTION_AND_ASSIGNMENT_ROUTE,
                      constants.INDICTMENTS_SUBPOENA_ROUTE,
                    ],
                    workingCase,
                  ) && onNavigationTo
                    ? async () =>
                        await onNavigationTo(
                          constants.INDICTMENTS_PROSECUTOR_AND_DEFENDER_ROUTE,
                        )
                    : undefined,
              },
              {
                name: formatMessage(
                  sections.indictmentsCourtSection.courtRecord,
                ),
                href:
                  activeSubSection && activeSubSection > 4
                    ? `${constants.INDICTMENTS_COURT_RECORD_ROUTE}/${workingCase.id}`
                    : undefined,
                onClick:
                  validateFormStepper(
                    isValid,
                    [
                      constants.INDICTMENTS_OVERVIEW_ROUTE,
                      constants.INDICTMENTS_RECEPTION_AND_ASSIGNMENT_ROUTE,
                      constants.INDICTMENTS_SUBPOENA_ROUTE,
                      constants.INDICTMENTS_PROSECUTOR_AND_DEFENDER_ROUTE,
                    ],
                    workingCase,
                  ) && onNavigationTo
                    ? async () =>
                        await onNavigationTo(
                          constants.INDICTMENTS_COURT_RECORD_ROUTE,
                        )
                    : undefined,
              },
            ],
    }
  }

  const getRestrictionCaseExtenstionSections = (
    workingCase: Case,
    user?: User,
  ): Section => {
    return {
      name: formatMessage(sections.extensionSection.title),
      children:
        user?.institution?.type !== InstitutionType.PROSECUTORS_OFFICE
          ? []
          : [
              {
                name: capitalize(
                  formatMessage(core.defendant, { suffix: 'i' }),
                ),
                href: getRestrictionCaseCourtSections(workingCase, user)
                  .children[0].href,
              },
              {
                name: formatMessage(
                  sections.extensionSection.hearingArrangements,
                ),
                href: getRestrictionCaseCourtSections(workingCase, user)
                  .children[1].href,
                onClick: getRestrictionCaseCourtSections(workingCase, user)
                  .children[1].onClick,
              },
              {
                name: formatMessage(sections.extensionSection.policeDemands),
                href: getRestrictionCaseCourtSections(workingCase, user)
                  .children[2].href,
                onClick: getRestrictionCaseCourtSections(workingCase, user)
                  .children[2].onClick,
              },
              {
                name: formatMessage(sections.extensionSection.policeReport),
                href: getRestrictionCaseCourtSections(workingCase, user)
                  .children[3].href,
                onClick: getRestrictionCaseCourtSections(workingCase, user)
                  .children[3].onClick,
              },
              {
                name: formatMessage(sections.extensionSection.caseFiles),
                href: getRestrictionCaseCourtSections(workingCase, user)
                  .children[4].href,
                onClick: getRestrictionCaseCourtSections(workingCase, user)
                  .children[4].onClick,
              },
              {
                name: formatMessage(sections.extensionSection.overview),
                href: getRestrictionCaseCourtSections(workingCase, user)
                  .children[5].href,
                onClick: getRestrictionCaseCourtSections(workingCase, user)
                  .children[5].onClick,
              },
            ],
    }
  }

  const getInvestigationCaseExtenstionSections = (
    workingCase: Case,
    user?: User,
  ): Section => {
    return {
      name: formatMessage(sections.investigationCaseExtensionSection.title),
      children:
        user?.institution?.type !== InstitutionType.PROSECUTORS_OFFICE
          ? []
          : [
              {
                name: capitalize(
                  formatMessage(core.defendant, { suffix: 'i' }),
                ),
                href: getInvestigationCaseCourtSections(workingCase, user)
                  .children[0].href,
              },
              {
                name: formatMessage(
                  sections.investigationCaseExtensionSection
                    .hearingArrangements,
                ),
                href: getInvestigationCaseCourtSections(workingCase, user)
                  .children[1].href,
                onClick: getInvestigationCaseCourtSections(workingCase, user)
                  .children[1].onClick,
              },
              {
                name: formatMessage(
                  sections.investigationCaseExtensionSection.policeDemands,
                ),
                href: getInvestigationCaseCourtSections(workingCase, user)
                  .children[2].href,
                onClick: getInvestigationCaseCourtSections(workingCase, user)
                  .children[2].onClick,
              },
              {
                name: formatMessage(
                  sections.investigationCaseExtensionSection.policeReport,
                ),
                href: getInvestigationCaseCourtSections(workingCase, user)
                  .children[3].href,
                onClick: getInvestigationCaseCourtSections(workingCase, user)
                  .children[3].onClick,
              },
              {
                name: formatMessage(
                  sections.investigationCaseExtensionSection.caseFiles,
                ),
                href: getInvestigationCaseCourtSections(workingCase, user)
                  .children[4].href,
                onClick: getInvestigationCaseCourtSections(workingCase, user)
                  .children[4].onClick,
              },
              {
                name: formatMessage(
                  sections.investigationCaseExtensionSection.overview,
                ),
                href: getInvestigationCaseCourtSections(workingCase, user)
                  .children[5].href,
                onClick: getInvestigationCaseCourtSections(workingCase, user)
                  .children[5].onClick,
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
        ? getRestrictionCaseProsecutorSection(workingCase || ({} as Case), user)
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
          )
        : getInvestigationCaseExtenstionSections(
            workingCase || ({} as Case),
            user,
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
