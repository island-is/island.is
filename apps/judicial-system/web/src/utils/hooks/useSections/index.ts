import { useContext } from 'react'
import { useIntl } from 'react-intl'

import {
  CaseState,
  completedCaseStates,
  Gender,
  isCourtRole,
  isIndictmentCase,
  isInvestigationCase,
  isRestrictionCase,
} from '@island.is/judicial-system/types'
import { core, sections } from '@island.is/judicial-system-web/messages'
import { caseResult } from '@island.is/judicial-system-web/src/components/PageLayout/utils'
import { capitalize } from '@island.is/judicial-system/formatters'
import { RouteSection } from '@island.is/judicial-system-web/src/components/PageLayout/PageLayout'
import {
  CaseType,
  InstitutionType,
  User,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { FeatureContext } from '@island.is/judicial-system-web/src/components/FeatureProvider/FeatureProvider'
import { TempCase as Case } from '@island.is/judicial-system-web/src/types'
import * as constants from '@island.is/judicial-system/consts'

import { stepValidations, stepValidationsType } from '../../formHelper'
import { isTrafficViolationCase } from '../../stepHelper'
import { useRouter } from 'next/router'
import {
  courtIndictmentRoutes,
  courtInvestigationCasesRoutes,
  courtRestrictionCasesRoutes,
  prosecutorIndictmentRoutes,
  prosecutorInvestigationCasesRoutes,
  prosecutorRestrictionCasesRoutes,
} from '@island.is/judicial-system/consts'

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
  const { features } = useContext(FeatureContext)
  const router = useRouter()

  const getRestrictionCaseProsecutorSection = (
    workingCase: Case,
    user?: User,
  ): RouteSection => {
    const { type, id, parentCase } = workingCase
    const routeIndex = prosecutorRestrictionCasesRoutes.findIndex(
      /**
       * We do .slice here because router.pathname is /something/[:id]
       * and we want to remove the /[:id] part
       */
      (route) => route === router.pathname.slice(0, -5),
    )

    return {
      name: formatMessage(sections.restrictionCaseProsecutorSection.caseTitle, {
        caseType: type,
      }),
      isActive:
        user?.role === UserRole.Prosecutor &&
        isRestrictionCase(type) &&
        !completedCaseStates.includes(workingCase.state) &&
        !parentCase,
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
                isActive: routeIndex === 0,
                href: `${constants.RESTRICTION_CASE_DEFENDANT_ROUTE}/${id}`,
              },
              {
                name: formatMessage(
                  sections.restrictionCaseProsecutorSection.hearingArrangements,
                ),
                href: `${constants.RESTRICTION_CASE_HEARING_ARRANGEMENTS_ROUTE}/${id}`,
                isActive: routeIndex === 1,
                onClick:
                  validateFormStepper(
                    isValid,
                    [
                      workingCase.type === CaseType.Custody
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
                isActive: routeIndex === 2,
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
                isActive: routeIndex === 3,
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
                isActive: routeIndex === 4,
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
                isActive: routeIndex === 5,
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
    const { id, type, parentCase } = workingCase
    const routeIndex = prosecutorInvestigationCasesRoutes.findIndex(
      /**
       * We do .slice here because router.pathname is /something/[:id]
       * and we want to remove the /[:id] part
       */
      (route) => route === router.pathname.slice(0, -5),
    )

    return {
      name: formatMessage(sections.investigationCaseProsecutorSection.title),
      isActive:
        user?.role === UserRole.Prosecutor &&
        isInvestigationCase(type) &&
        !completedCaseStates.includes(workingCase.state) &&
        !parentCase,
      children:
        user?.institution?.type !== InstitutionType.ProsecutorsOffice
          ? []
          : [
              {
                name: capitalize(
                  formatMessage(core.defendant, { suffix: 'i' }),
                ),
                isActive: routeIndex === 0,
                href: `${constants.INVESTIGATION_CASE_DEFENDANT_ROUTE}/${id}`,
              },
              {
                name: formatMessage(
                  sections.investigationCaseProsecutorSection
                    .hearingArrangements,
                ),
                isActive: routeIndex === 1,
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
                isActive: routeIndex === 2,
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
                isActive: routeIndex === 3,
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
                isActive: routeIndex === 4,
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
                isActive: routeIndex === 5,
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
    user?: User,
  ): RouteSection => {
    const { id, type } = workingCase
    const caseHasBeenReceivedByCourt = workingCase.state === CaseState.RECEIVED
    const isTrafficViolation =
      workingCase.type === CaseType.Indictment &&
      isTrafficViolationCase(workingCase, features, user)
    const indictmentRoutes = isTrafficViolation
      ? prosecutorIndictmentRoutes.splice(
          4,
          0,
          constants.INDICTMENTS_TRAFFIC_VIOLATION_ROUTE,
        )
      : prosecutorIndictmentRoutes
    const routeIndex = indictmentRoutes.findIndex(
      /**
       * We do .slice here because router.pathname is /something/[:id]
       * and we want to remove the /[:id] part
       */
      (route) => route === router.pathname.slice(0, -5),
    )

    return {
      name: formatMessage(sections.indictmentCaseProsecutorSection.title),
      isActive:
        user?.role === UserRole.Prosecutor &&
        isIndictmentCase(type) &&
        !completedCaseStates.includes(workingCase.state),
      // Prosecutor can only view the overview when case has been received by court
      children: caseHasBeenReceivedByCourt
        ? []
        : [
            {
              name: capitalize(
                formatMessage(core.indictmentDefendant, {
                  gender: Gender.MALE,
                }),
              ),
              isActive: routeIndex === 0,
              href: `${constants.INDICTMENTS_DEFENDANT_ROUTE}/${id}`,
            },
            {
              name: capitalize(
                formatMessage(
                  sections.indictmentCaseProsecutorSection.policeCaseFiles,
                ),
              ),
              isActive: routeIndex === 1,
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
              isActive: routeIndex === 2,
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
              isActive: routeIndex === 3,
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
            ...(isTrafficViolation
              ? [
                  {
                    name: formatMessage(
                      sections.indictmentCaseProsecutorSection.indictment,
                    ),
                    href: `${constants.INDICTMENTS_TRAFFIC_VIOLATION_ROUTE}/${id}`,
                    isActive: routeIndex === 4,
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
                              constants.INDICTMENTS_TRAFFIC_VIOLATION_ROUTE,
                            )
                        : undefined,
                  },
                ]
              : []),
            {
              name: capitalize(
                formatMessage(
                  sections.indictmentCaseProsecutorSection.caseFiles,
                ),
              ),
              href: `${constants.INDICTMENTS_CASE_FILES_ROUTE}/${id}`,
              isActive: routeIndex === (isTrafficViolation ? 5 : 4),
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
              isActive: routeIndex === (isTrafficViolation ? 6 : 5),
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
    const { id, type, parentCase } = workingCase
    const routeIndex = courtRestrictionCasesRoutes.findIndex(
      /**
       * We do .slice here because router.pathname is /something/[:id]
       * and we want to remove the /[:id] part
       */
      (route) => route === router.pathname.slice(0, -5),
    )
    return {
      name: formatMessage(sections.courtSection.title),
      isActive:
        isCourtRole(user?.role) &&
        isRestrictionCase(type) &&
        !completedCaseStates.includes(workingCase.state) &&
        !parentCase,
      children:
        user?.institution?.type !== InstitutionType.Court
          ? []
          : [
              {
                name: formatMessage(
                  sections.courtSection.receptionAndAssignment,
                ),
                isActive: routeIndex === 0,
                href: `${constants.RESTRICTION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE}/${id}`,
              },
              {
                name: formatMessage(sections.courtSection.overview),
                href: `${constants.RESTRICTION_CASE_COURT_OVERVIEW_ROUTE}/${id}`,
                isActive: routeIndex === 1,
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
                isActive: routeIndex === 2,
                href: `${constants.RESTRICTION_CASE_COURT_HEARING_ARRANGEMENTS_ROUTE}/${id}`,
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
                isActive: routeIndex === 3,
                href: `${constants.RESTRICTION_CASE_RULING_ROUTE}/${id}`,
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
                isActive: routeIndex === 4,
                href: `${constants.RESTRICTION_CASE_COURT_RECORD_ROUTE}/${id}`,
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
                isActive: routeIndex === 5,
                href: `${constants.RESTRICTION_CASE_CONFIRMATION_ROUTE}/${id}`,
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
    const { id, type, parentCase } = workingCase
    const routeIndex = courtInvestigationCasesRoutes.findIndex(
      /**
       * We do .slice here because router.pathname is /something/[:id]
       * and we want to remove the /[:id] part
       */
      (route) => route === router.pathname.slice(0, -5),
    )

    return {
      name: formatMessage(sections.investigationCaseCourtSection.title),
      isActive:
        isCourtRole(user?.role) &&
        isInvestigationCase(type) &&
        !completedCaseStates.includes(workingCase.state) &&
        !parentCase,
      children:
        user?.institution?.type !== InstitutionType.Court
          ? []
          : [
              {
                name: formatMessage(
                  sections.courtSection.receptionAndAssignment,
                ),
                isActive: routeIndex === 0,
                href: `${constants.INVESTIGATION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE}/${id}`,
              },
              {
                name: formatMessage(
                  sections.investigationCaseCourtSection.overview,
                ),
                isActive: routeIndex === 1,
                href: `${constants.INVESTIGATION_CASE_OVERVIEW_ROUTE}/${id}`,
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
                isActive: routeIndex === 2,
                href: `${constants.INVESTIGATION_CASE_COURT_HEARING_ARRANGEMENTS_ROUTE}/${id}`,
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
                isActive: routeIndex === 3,
                href: `${constants.INVESTIGATION_CASE_RULING_ROUTE}/${id}`,
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
                isActive: routeIndex === 4,
                href: `${constants.INVESTIGATION_CASE_COURT_RECORD_ROUTE}/${id}`,
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
                isActive: routeIndex === 5,
                href: `${constants.INVESTIGATION_CASE_CONFIRMATION_ROUTE}/${id}`,
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

  const getIndictmentsCourtSections = (workingCase: Case, user?: User) => {
    const { id, type } = workingCase
    const routeIndex = courtIndictmentRoutes.findIndex(
      /**
       * We do .slice here because router.pathname is /something/[:id]
       * and we want to remove the /[:id] part
       */
      (route) => route === router.pathname.slice(0, -5),
    )

    return {
      name: formatMessage(sections.indictmentsCourtSection.title),
      isActive:
        isCourtRole(user?.role) &&
        isIndictmentCase(type) &&
        !completedCaseStates.includes(workingCase.state),
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
    const { type, parentCase } = workingCase

    return {
      name: formatMessage(sections.extensionSection.title),
      isActive:
        user?.role === UserRole.Prosecutor &&
        isRestrictionCase(type) &&
        parentCase !== undefined,
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
    const { type, parentCase } = workingCase

    return {
      name: formatMessage(sections.investigationCaseExtensionSection.title),
      isActive:
        user?.role === UserRole.Prosecutor &&
        isInvestigationCase(type) &&
        parentCase !== undefined,
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

  const getRestrictionCaseExtensionCourtSections = (
    workingCase: Case,
    user?: User,
  ) => {
    const { type } = workingCase

    return {
      ...getRestrictionCaseCourtSections(workingCase, user),
      isActive: isRestrictionCase(type) && isCourtRole(user?.role),
    }
  }

  const getInvestigationCaseExtensionCourtSections = (
    workingCase: Case,
    user?: User,
  ) => {
    const { type } = workingCase

    return {
      ...getInvestigationCaseCourtSections(workingCase, user),
      isActive: isInvestigationCase(type) && isCourtRole(user?.role),
    }
  }

  const getSections = (workingCase: Case, user?: User): RouteSection[] => {
    return [
      isRestrictionCase(workingCase.type)
        ? getRestrictionCaseProsecutorSection(workingCase, user)
        : isInvestigationCase(workingCase.type)
        ? getInvestigationCaseProsecutorSection(workingCase, user)
        : getIndictmentCaseProsecutorSection(workingCase, user),
      isRestrictionCase(workingCase.type)
        ? getRestrictionCaseCourtSections(workingCase, user)
        : isInvestigationCase(workingCase.type)
        ? getInvestigationCaseCourtSections(workingCase, user)
        : getIndictmentsCourtSections(workingCase, user),
      {
        name: caseResult(formatMessage, workingCase),
        isActive:
          completedCaseStates.includes(workingCase.state) &&
          !workingCase.prosecutorPostponedAppealDate &&
          !workingCase.accusedPostponedAppealDate,
        children: [],
      },
      ...(workingCase.accusedPostponedAppealDate ||
      workingCase.prosecutorPostponedAppealDate
        ? [
            {
              name: formatMessage(sections.caseResults.appealed),
              isActive: true, // Whenever this is shown, it is active
              children: [],
            },
          ]
        : []),
      ...(workingCase.parentCase
        ? [
            isRestrictionCase(workingCase.type)
              ? getRestrictionCaseExtenstionSections(workingCase, user)
              : getInvestigationCaseExtenstionSections(workingCase, user),
            isRestrictionCase(workingCase.type)
              ? getRestrictionCaseExtensionCourtSections(workingCase, user)
              : getInvestigationCaseExtensionCourtSections(workingCase, user),
          ]
        : []),
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
