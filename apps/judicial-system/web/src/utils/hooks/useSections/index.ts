import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import {
  CaseType,
  Gender,
  isInvestigationCase,
  isRestrictionCase,
} from '@island.is/judicial-system/types'
import { core, sections } from '@island.is/judicial-system-web/messages'
import { caseResult } from '@island.is/judicial-system-web/src/components/PageLayout/utils'
import { capitalize } from '@island.is/judicial-system/formatters'
import { RouteSection } from '@island.is/judicial-system-web/src/components/PageLayout/PageLayout'
import {
  InstitutionType,
  User,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { TempCase as Case } from '@island.is/judicial-system-web/src/types'
import * as constants from '@island.is/judicial-system/consts'

import { stepValidations, stepValidationsType } from '../../formHelper'

const validateFormStepper = (
  isActiveSubSectionValid: boolean,
  steps: string[],
  workingCase: Case,
) => {
  if (!isActiveSubSectionValid) {
    return false
  }

  const validationForStep = stepValidations()

  return steps.some(
    (step) =>
      validationForStep[step as keyof typeof validationForStep](workingCase) ===
      false,
  )
    ? false
    : true
}

const useSections = (
  isValid = true,
  onNavigationTo?: (destination: keyof stepValidationsType) => Promise<unknown>,
) => {
  const { formatMessage } = useIntl()
  const router = useRouter()

  const getRestrictionCaseProsecutorSection = (
    workingCase: Case,
    user?: User,
  ): RouteSection => {
    const { type, id } = workingCase

    return {
      name: formatMessage(sections.restrictionCaseProsecutorSection.caseTitle, {
        caseType: type,
      }),
      children:
        user?.institution?.type !== InstitutionType.ProsecutorsOffice
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
                href: `${constants.RESTRICTION_CASE_HEARING_ARRANGEMENTS_ROUTE}/${id}`,
                onClick:
                  validateFormStepper(
                    isValid,
                    [
                      workingCase.type === CaseType.CUSTODY
                        ? constants.RESTRICTION_CASE_DEFENDANT_ROUTE
                        : constants.CREATE_TRAVEL_BAN_ROUTE,
                    ],
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
                href: `${constants.RESTRICTION_CASE_POLICE_DEMANDS_ROUTE}/${id}`,
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
                href: `${constants.RESTRICTION_CASE_POLICE_REPORT_ROUTE}/${id}`,
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
                href: `${constants.RESTRICTION_CASE_CASE_FILES_ROUTE}/${id}`,
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
                href: `${constants.RESTRICTION_CASE_OVERVIEW_ROUTE}/${id}`,
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
  ): RouteSection => {
    const { id } = workingCase

    return {
      name: formatMessage(sections.investigationCaseProsecutorSection.title),
      children:
        user?.institution?.type !== InstitutionType.ProsecutorsOffice
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
                href: `${constants.INVESTIGATION_CASE_HEARING_ARRANGEMENTS_ROUTE}/${id}`,
                onClick:
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
                href: `${constants.INVESTIGATION_CASE_POLICE_DEMANDS_ROUTE}/${id}`,
                onClick:
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
                href: `${constants.INVESTIGATION_CASE_POLICE_REPORT_ROUTE}/${id}`,
                onClick:
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
                href: `${constants.INVESTIGATION_CASE_CASE_FILES_ROUTE}/${id}`,
                onClick:
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
                href: `${constants.INVESTIGATION_CASE_POLICE_CONFIRMATION_ROUTE}/${id}`,
                onClick:
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

  const getIndictmentCaseProsecutorSection = (
    workingCase: Case,
  ): RouteSection => {
    const { id } = workingCase

    const caseHasBeenReceivedByCourt =
      workingCase.courtCaseNumber !== undefined &&
      workingCase.courtCaseNumber !== null
    return {
      name: formatMessage(sections.indictmentCaseProsecutorSection.title),
      // Prosecutor can only view the overview when case has been submitted to court
      children: caseHasBeenReceivedByCourt
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
              href: `${constants.INDICTMENTS_POLICE_CASE_FILES_ROUTE}/${id}`,
              onClick:
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
              href: `${constants.INDICTMENTS_CASE_FILE_ROUTE}/${id}`,
              onClick:
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
              href: `${constants.INDICTMENTS_PROCESSING_ROUTE}/${id}`,
              onClick:
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
              href: `${constants.INDICTMENTS_CASE_FILES_ROUTE}/${id}`,

              onClick:
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
              href: `${constants.INDICTMENTS_OVERVIEW_ROUTE}/${id}`,
              onClick:
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
  ): RouteSection => {
    const { id } = workingCase
    const isModifyingRuling = router.pathname.includes(
      constants.RESTRICTION_CASE_MODIFY_RULING_ROUTE,
    )

    return {
      name: formatMessage(sections.courtSection.title),
      children:
        user?.institution?.type !== InstitutionType.Court
          ? []
          : [
              {
                name: formatMessage(
                  sections.courtSection.receptionAndAssignment,
                ),
                href: !isModifyingRuling
                  ? `${constants.RESTRICTION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE}/${id}`
                  : undefined,
              },
              {
                name: formatMessage(sections.courtSection.overview),
                href: !isModifyingRuling
                  ? `${constants.RESTRICTION_CASE_COURT_OVERVIEW_ROUTE}/${id}`
                  : undefined,
                onClick:
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
                href: !isModifyingRuling
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
                href: !isModifyingRuling
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
                href: !isModifyingRuling
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
                href: !isModifyingRuling
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
  ): RouteSection => {
    const { id } = workingCase
    const isModifyingRuling = router.pathname.includes(
      constants.INVESTIGATION_CASE_MODIFY_RULING_ROUTE,
    )

    return {
      name: formatMessage(sections.investigationCaseCourtSection.title),
      children:
        user?.institution?.type !== InstitutionType.Court
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
                href: !isModifyingRuling
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
                href: !isModifyingRuling
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
                href: !isModifyingRuling
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
                href: !isModifyingRuling
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
                href: !isModifyingRuling
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

  const getIndictmentsCourtSections = (workingCase: Case) => {
    const { id } = workingCase

    return {
      name: formatMessage(sections.indictmentsCourtSection.title),
      children: [
        {
          name: formatMessage(sections.indictmentsCourtSection.overview),
          href: `${constants.INDICTMENTS_COURT_OVERVIEW_ROUTE}/${id}`,
        },
        {
          name: formatMessage(
            sections.indictmentsCourtSection.receptionAndAssignment,
          ),
          href: `${constants.INDICTMENTS_RECEPTION_AND_ASSIGNMENT_ROUTE}/${workingCase.id}`,
          onClick:
            validateFormStepper(isValid, [], workingCase) && onNavigationTo
              ? async () =>
                  await onNavigationTo(
                    constants.INDICTMENTS_RECEPTION_AND_ASSIGNMENT_ROUTE,
                  )
              : undefined,
        },
        {
          name: formatMessage(sections.indictmentsCourtSection.subpoena),
          href: `${constants.INDICTMENTS_SUBPOENA_ROUTE}/${workingCase.id}`,
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
                  await onNavigationTo(constants.INDICTMENTS_SUBPOENA_ROUTE)
              : undefined,
        },
        {
          name: formatMessage(
            sections.indictmentsCourtSection.prosecutorAndDefender,
          ),
          href: `${constants.INDICTMENTS_PROSECUTOR_AND_DEFENDER_ROUTE}/${workingCase.id}`,
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
          name: formatMessage(sections.indictmentsCourtSection.courtRecord),
          href: `${constants.INDICTMENTS_COURT_RECORD_ROUTE}/${workingCase.id}`,
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
                  await onNavigationTo(constants.INDICTMENTS_COURT_RECORD_ROUTE)
              : undefined,
        },
      ],
    }
  }

  const getRestrictionCaseExtenstionSections = (
    workingCase: Case,
    user?: User,
  ): RouteSection => {
    const section = getRestrictionCaseProsecutorSection(workingCase, user)

    return {
      name: formatMessage(sections.extensionSection.title),
      children:
        user?.institution?.type !== InstitutionType.ProsecutorsOffice
          ? []
          : [
              {
                name: capitalize(
                  formatMessage(core.defendant, { suffix: 'i' }),
                ),
                href:
                  (section.children.length > 0 && section.children[0].href) ||
                  undefined,
              },
              {
                name: formatMessage(
                  sections.extensionSection.hearingArrangements,
                ),
                href:
                  (section.children.length > 0 && section.children[1].href) ||
                  undefined,
                onClick:
                  (section.children.length > 0 &&
                    section.children[1].onClick) ||
                  undefined,
              },
              {
                name: formatMessage(sections.extensionSection.policeDemands),
                href:
                  (section.children.length > 0 && section.children[2].href) ||
                  undefined,
                onClick:
                  (section.children.length > 0 &&
                    section.children[2].onClick) ||
                  undefined,
              },
              {
                name: formatMessage(sections.extensionSection.policeReport),
                href:
                  (section.children.length > 0 && section.children[3].href) ||
                  undefined,
                onClick:
                  (section.children.length > 0 &&
                    section.children[3].onClick) ||
                  undefined,
              },
              {
                name: formatMessage(sections.extensionSection.caseFiles),
                href:
                  (section.children.length > 0 && section.children[4].href) ||
                  undefined,
                onClick:
                  (section.children.length > 0 &&
                    section.children[4].onClick) ||
                  undefined,
              },
              {
                name: formatMessage(sections.extensionSection.overview),
                href:
                  (section.children.length > 0 && section.children[5].href) ||
                  undefined,
                onClick:
                  (section.children.length > 0 &&
                    section.children[5].onClick) ||
                  undefined,
              },
            ],
    }
  }

  const getInvestigationCaseExtenstionSections = (
    workingCase: Case,
    user?: User,
  ): RouteSection => {
    const section = getInvestigationCaseProsecutorSection(workingCase, user)

    return {
      name: formatMessage(sections.investigationCaseExtensionSection.title),
      children:
        user?.institution?.type !== InstitutionType.ProsecutorsOffice
          ? []
          : [
              {
                name: capitalize(
                  formatMessage(core.defendant, { suffix: 'i' }),
                ),
                href:
                  (section.children.length > 0 && section.children[5].href) ||
                  undefined,
              },
              {
                name: formatMessage(
                  sections.investigationCaseExtensionSection
                    .hearingArrangements,
                ),
                href:
                  (section.children.length > 0 && section.children[1].href) ||
                  undefined,
                onClick: section.children[1].onClick,
              },
              {
                name: formatMessage(
                  sections.investigationCaseExtensionSection.policeDemands,
                ),
                href:
                  (section.children.length > 0 && section.children[2].href) ||
                  undefined,
                onClick: section.children[2].onClick,
              },
              {
                name: formatMessage(
                  sections.investigationCaseExtensionSection.policeReport,
                ),
                href:
                  (section.children.length > 0 && section.children[3].href) ||
                  undefined,
                onClick: section.children[3].onClick,
              },
              {
                name: formatMessage(
                  sections.investigationCaseExtensionSection.caseFiles,
                ),
                href:
                  (section.children.length > 0 && section.children[4].href) ||
                  undefined,
                onClick: section.children[4].onClick,
              },
              {
                name: formatMessage(
                  sections.investigationCaseExtensionSection.overview,
                ),
                href:
                  (section.children.length > 0 && section.children[5].href) ||
                  undefined,
                onClick: section.children[5].onClick,
              },
            ],
    }
  }

  const getSections = (workingCase?: Case, user?: User): RouteSection[] => {
    return [
      isRestrictionCase(workingCase?.type)
        ? getRestrictionCaseProsecutorSection(workingCase || ({} as Case), user)
        : isInvestigationCase(workingCase?.type)
        ? getInvestigationCaseProsecutorSection(
            workingCase || ({} as Case),
            user,
          )
        : getIndictmentCaseProsecutorSection(workingCase || ({} as Case)),
      isRestrictionCase(workingCase?.type)
        ? getRestrictionCaseCourtSections(workingCase || ({} as Case), user)
        : isInvestigationCase(workingCase?.type)
        ? getInvestigationCaseCourtSections(workingCase || ({} as Case), user)
        : getIndictmentsCourtSections(workingCase || ({} as Case)),
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
        ? getRestrictionCaseCourtSections(workingCase || ({} as Case), user)
        : getInvestigationCaseCourtSections(workingCase || ({} as Case), user),
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
  }
}

export default useSections
