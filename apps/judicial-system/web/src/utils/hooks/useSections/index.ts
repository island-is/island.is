import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import {
  courtIndictmentRoutes,
  courtInvestigationCasesRoutes,
  courtOfAppealRoutes,
  courtRestrictionCasesRoutes,
  prosecutorIndictmentRoutes,
  prosecutorInvestigationCasesRoutes,
  prosecutorRestrictionCasesRoutes,
} from '@island.is/judicial-system/consts'
import * as constants from '@island.is/judicial-system/consts'
import { capitalize } from '@island.is/judicial-system/formatters'
import {
  CaseAppealState,
  CaseState,
  completedCaseStates,
  isCourtRole,
  isExtendedCourtRole,
  isIndictmentCase,
  isInvestigationCase,
  isRestrictionCase,
} from '@island.is/judicial-system/types'
import { core, sections } from '@island.is/judicial-system-web/messages'
import { RouteSection } from '@island.is/judicial-system-web/src/components/PageLayout/PageLayout'
import { formatCaseResult } from '@island.is/judicial-system-web/src/components/PageLayout/utils'
import {
  CaseType,
  Gender,
  InstitutionType,
  User,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { TempCase as Case } from '@island.is/judicial-system-web/src/types'

import { stepValidations, stepValidationsType } from '../../formHelper'
import { isTrafficViolationCase } from '../../stepHelper'
import useStringHelpers from '../useStringHelpers/useStringHelpers'

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
  const { getAppealResultText } = useStringHelpers()

  const getRestrictionCaseProsecutorSection = (
    workingCase: Case,
    user?: User,
  ): RouteSection => {
    const { type, id, parentCase } = workingCase
    const routeIndex =
      router.pathname.includes(constants.CREATE_RESTRICTION_CASE_ROUTE) ||
      router.pathname.includes(constants.CREATE_TRAVEL_BAN_ROUTE)
        ? 0
        : prosecutorRestrictionCasesRoutes.findIndex(
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
        user?.role === UserRole.PROSECUTOR &&
        isRestrictionCase(type) &&
        !completedCaseStates.includes(workingCase.state) &&
        !parentCase,
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
                  routeIndex !== 1 &&
                  validateFormStepper(
                    isValid,
                    [
                      workingCase.type === CaseType.CUSTODY
                        ? constants.RESTRICTION_CASE_DEFENDANT_ROUTE
                        : constants.CREATE_TRAVEL_BAN_ROUTE,
                    ],
                    workingCase,
                  ) &&
                  onNavigationTo
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
                  routeIndex !== 2 &&
                  validateFormStepper(
                    isValid,
                    [
                      constants.RESTRICTION_CASE_DEFENDANT_ROUTE,
                      constants.RESTRICTION_CASE_HEARING_ARRANGEMENTS_ROUTE,
                    ],
                    workingCase,
                  ) &&
                  onNavigationTo
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
                  routeIndex !== 3 &&
                  validateFormStepper(
                    isValid,
                    [
                      constants.RESTRICTION_CASE_DEFENDANT_ROUTE,
                      constants.RESTRICTION_CASE_HEARING_ARRANGEMENTS_ROUTE,
                      constants.RESTRICTION_CASE_POLICE_DEMANDS_ROUTE,
                    ],
                    workingCase,
                  ) &&
                  onNavigationTo
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
                  routeIndex !== 4 &&
                  validateFormStepper(
                    isValid,
                    [
                      constants.RESTRICTION_CASE_DEFENDANT_ROUTE,
                      constants.RESTRICTION_CASE_HEARING_ARRANGEMENTS_ROUTE,
                      constants.RESTRICTION_CASE_POLICE_DEMANDS_ROUTE,
                      constants.RESTRICTION_CASE_POLICE_REPORT_ROUTE,
                    ],
                    workingCase,
                  ) &&
                  onNavigationTo
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
                  routeIndex !== 5 &&
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
                  ) &&
                  onNavigationTo
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
    const routeIndex = router.pathname.includes(
      constants.CREATE_INVESTIGATION_CASE_ROUTE,
    )
      ? 0
      : prosecutorInvestigationCasesRoutes.findIndex(
          /**
           * We do .slice here because router.pathname is /something/[:id]
           * and we want to remove the /[:id] part
           */
          (route) => route === router.pathname.slice(0, -5),
        )

    return {
      name: formatMessage(sections.investigationCaseProsecutorSection.title),
      isActive:
        user?.role === UserRole.PROSECUTOR &&
        isInvestigationCase(type) &&
        !completedCaseStates.includes(workingCase.state) &&
        !parentCase,
      children:
        user?.institution?.type !== InstitutionType.PROSECUTORS_OFFICE
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
                  routeIndex !== 1 &&
                  validateFormStepper(
                    isValid,
                    [constants.INVESTIGATION_CASE_DEFENDANT_ROUTE],
                    workingCase,
                  ) &&
                  onNavigationTo
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
                  routeIndex !== 2 &&
                  validateFormStepper(
                    isValid,
                    [
                      constants.INVESTIGATION_CASE_DEFENDANT_ROUTE,
                      constants.INVESTIGATION_CASE_HEARING_ARRANGEMENTS_ROUTE,
                    ],
                    workingCase,
                  ) &&
                  onNavigationTo
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
                  routeIndex !== 3 &&
                  validateFormStepper(
                    isValid,
                    [
                      constants.INVESTIGATION_CASE_DEFENDANT_ROUTE,
                      constants.INVESTIGATION_CASE_HEARING_ARRANGEMENTS_ROUTE,
                      constants.INVESTIGATION_CASE_POLICE_DEMANDS_ROUTE,
                    ],
                    workingCase,
                  ) &&
                  onNavigationTo
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
                  routeIndex !== 4 &&
                  validateFormStepper(
                    isValid,
                    [
                      constants.INVESTIGATION_CASE_DEFENDANT_ROUTE,
                      constants.INVESTIGATION_CASE_HEARING_ARRANGEMENTS_ROUTE,
                      constants.INVESTIGATION_CASE_POLICE_DEMANDS_ROUTE,
                      constants.INVESTIGATION_CASE_POLICE_REPORT_ROUTE,
                    ],
                    workingCase,
                  ) &&
                  onNavigationTo
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
                isActive: routeIndex === 5,
                onClick:
                  routeIndex !== 5 &&
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
                  ) &&
                  onNavigationTo
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
    const isTrafficViolation = isTrafficViolationCase(workingCase)

    const routes = prosecutorIndictmentRoutes(isTrafficViolation)

    const routeIndex = router.pathname.includes(
      constants.CREATE_INDICTMENT_ROUTE,
    )
      ? 0
      : routes.findIndex(
          /**
           * We do .slice here because router.pathname is /something/[:id]
           * and we want to remove the /[:id] part
           */
          (route) => route === router.pathname.slice(0, -5),
        )
    return {
      name: formatMessage(sections.indictmentCaseProsecutorSection.title),
      isActive:
        (user?.role === UserRole.PROSECUTOR ||
          user?.role === UserRole.PROSECUTOR_REPRESENTATIVE) &&
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
                routeIndex !== 1 &&
                validateFormStepper(
                  isValid,
                  [constants.INDICTMENTS_DEFENDANT_ROUTE],
                  workingCase,
                ) &&
                onNavigationTo
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
                routeIndex !== 2 &&
                validateFormStepper(
                  isValid,
                  [
                    constants.INDICTMENTS_DEFENDANT_ROUTE,
                    constants.INDICTMENTS_POLICE_CASE_FILES_ROUTE,
                  ],
                  workingCase,
                ) &&
                onNavigationTo
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
                routeIndex !== 3 &&
                validateFormStepper(
                  isValid,
                  [
                    constants.INDICTMENTS_DEFENDANT_ROUTE,
                    constants.INDICTMENTS_POLICE_CASE_FILES_ROUTE,
                    constants.INDICTMENTS_CASE_FILE_ROUTE,
                  ],
                  workingCase,
                ) &&
                onNavigationTo
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
                      routeIndex !== 4 &&
                      validateFormStepper(
                        isValid,
                        [
                          constants.INDICTMENTS_DEFENDANT_ROUTE,
                          constants.INDICTMENTS_POLICE_CASE_FILES_ROUTE,
                          constants.INDICTMENTS_CASE_FILE_ROUTE,
                          constants.INDICTMENTS_PROCESSING_ROUTE,
                        ],
                        workingCase,
                      ) &&
                      onNavigationTo
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
              isActive:
                workingCase.state === CaseState.RECEIVED
                  ? false
                  : routeIndex === (isTrafficViolation ? 5 : 4),
              onClick:
                routeIndex !== (isTrafficViolation ? 5 : 4) &&
                validateFormStepper(
                  isValid,
                  [
                    constants.INDICTMENTS_DEFENDANT_ROUTE,
                    constants.INDICTMENTS_POLICE_CASE_FILES_ROUTE,
                    constants.INDICTMENTS_CASE_FILE_ROUTE,
                    constants.INDICTMENTS_PROCESSING_ROUTE,
                  ],
                  workingCase,
                ) &&
                onNavigationTo
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
                routeIndex !== (isTrafficViolation ? 6 : 5) &&
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
                ) &&
                onNavigationTo
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
        user?.institution?.type !== InstitutionType.DISTRICT_COURT
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
                isActive: routeIndex === 1,
                href: `${constants.RESTRICTION_CASE_COURT_OVERVIEW_ROUTE}/${id}`,
                onClick:
                  routeIndex !== 1 &&
                  validateFormStepper(
                    isValid,
                    [constants.RESTRICTION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE],
                    workingCase,
                  ) &&
                  onNavigationTo
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
                  routeIndex !== 2 &&
                  validateFormStepper(
                    isValid,
                    [
                      constants.RESTRICTION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE,
                      constants.RESTRICTION_CASE_COURT_OVERVIEW_ROUTE,
                    ],
                    workingCase,
                  ) &&
                  onNavigationTo
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
                  routeIndex !== 3 &&
                  validateFormStepper(
                    isValid,
                    [
                      constants.RESTRICTION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE,
                      constants.RESTRICTION_CASE_COURT_OVERVIEW_ROUTE,
                      constants.RESTRICTION_CASE_COURT_HEARING_ARRANGEMENTS_ROUTE,
                    ],
                    workingCase,
                  ) &&
                  onNavigationTo
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
                  routeIndex !== 4 &&
                  validateFormStepper(
                    isValid,
                    [
                      constants.RESTRICTION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE,
                      constants.RESTRICTION_CASE_COURT_OVERVIEW_ROUTE,
                      constants.RESTRICTION_CASE_COURT_HEARING_ARRANGEMENTS_ROUTE,
                      constants.RESTRICTION_CASE_RULING_ROUTE,
                    ],
                    workingCase,
                  ) &&
                  onNavigationTo
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
                  routeIndex !== 5 &&
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
                  ) &&
                  onNavigationTo
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
        user?.institution?.type !== InstitutionType.DISTRICT_COURT
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
                  routeIndex !== 1 &&
                  validateFormStepper(
                    isValid,
                    [
                      constants.INVESTIGATION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE,
                    ],
                    workingCase,
                  ) &&
                  onNavigationTo
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
                  routeIndex !== 2 &&
                  validateFormStepper(
                    isValid,
                    [
                      constants.INVESTIGATION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE,
                      constants.INVESTIGATION_CASE_OVERVIEW_ROUTE,
                    ],
                    workingCase,
                  ) &&
                  onNavigationTo
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
                  routeIndex !== 3 &&
                  validateFormStepper(
                    isValid,
                    [
                      constants.INVESTIGATION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE,
                      constants.INVESTIGATION_CASE_OVERVIEW_ROUTE,
                      constants.INVESTIGATION_CASE_COURT_HEARING_ARRANGEMENTS_ROUTE,
                    ],
                    workingCase,
                  ) &&
                  onNavigationTo
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
                  routeIndex !== 4 &&
                  validateFormStepper(
                    isValid,
                    [
                      constants.INVESTIGATION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE,
                      constants.INVESTIGATION_CASE_OVERVIEW_ROUTE,
                      constants.INVESTIGATION_CASE_COURT_HEARING_ARRANGEMENTS_ROUTE,
                      constants.INVESTIGATION_CASE_RULING_ROUTE,
                    ],
                    workingCase,
                  ) &&
                  onNavigationTo
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
                  routeIndex !== 5 &&
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
                  ) &&
                  onNavigationTo
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
        isExtendedCourtRole(user?.role) &&
        isIndictmentCase(type) &&
        !completedCaseStates.includes(workingCase.state),
      children: [
        {
          name: formatMessage(sections.indictmentsCourtSection.overview),
          isActive: user?.role === UserRole.DEFENDER ? false : routeIndex === 0,
          href: `${constants.INDICTMENTS_COURT_OVERVIEW_ROUTE}/${id}`,
        },
        {
          name: formatMessage(
            sections.indictmentsCourtSection.receptionAndAssignment,
          ),
          isActive: routeIndex === 1,
          href: `${constants.INDICTMENTS_RECEPTION_AND_ASSIGNMENT_ROUTE}/${workingCase.id}`,
          onClick:
            routeIndex !== 1 &&
            validateFormStepper(isValid, [], workingCase) &&
            onNavigationTo
              ? async () =>
                  await onNavigationTo(
                    constants.INDICTMENTS_RECEPTION_AND_ASSIGNMENT_ROUTE,
                  )
              : undefined,
        },
        {
          name: formatMessage(sections.indictmentsCourtSection.subpoena),
          isActive: routeIndex === 2,
          href: `${constants.INDICTMENTS_SUBPOENA_ROUTE}/${workingCase.id}`,
          onClick:
            routeIndex !== 2 &&
            validateFormStepper(
              isValid,
              [
                constants.INDICTMENTS_OVERVIEW_ROUTE,
                constants.INDICTMENTS_RECEPTION_AND_ASSIGNMENT_ROUTE,
              ],
              workingCase,
            ) &&
            onNavigationTo
              ? async () =>
                  await onNavigationTo(constants.INDICTMENTS_SUBPOENA_ROUTE)
              : undefined,
        },
        {
          name: formatMessage(sections.indictmentsCourtSection.defender),
          isActive: routeIndex === 3,
          href: `${constants.INDICTMENTS_DEFENDER_ROUTE}/${workingCase.id}`,
          onClick:
            routeIndex !== 3 &&
            validateFormStepper(
              isValid,
              [
                constants.INDICTMENTS_OVERVIEW_ROUTE,
                constants.INDICTMENTS_RECEPTION_AND_ASSIGNMENT_ROUTE,
                constants.INDICTMENTS_SUBPOENA_ROUTE,
              ],
              workingCase,
            ) &&
            onNavigationTo
              ? async () =>
                  await onNavigationTo(constants.INDICTMENTS_DEFENDER_ROUTE)
              : undefined,
        },
        {
          name: formatMessage(sections.indictmentsCourtSection.courtRecord),
          isActive: routeIndex === 4,
          href: `${constants.INDICTMENTS_COURT_RECORD_ROUTE}/${workingCase.id}`,
          onClick:
            routeIndex !== 4 &&
            validateFormStepper(
              isValid,
              [
                constants.INDICTMENTS_OVERVIEW_ROUTE,
                constants.INDICTMENTS_RECEPTION_AND_ASSIGNMENT_ROUTE,
                constants.INDICTMENTS_SUBPOENA_ROUTE,
                constants.INDICTMENTS_DEFENDER_ROUTE,
              ],
              workingCase,
            ) &&
            onNavigationTo
              ? async () =>
                  await onNavigationTo(constants.INDICTMENTS_COURT_RECORD_ROUTE)
              : undefined,
        },
      ],
    }
  }

  const getRestrictionCaseExtensionSections = (
    workingCase: Case,
    user?: User,
  ): RouteSection => {
    const section = getRestrictionCaseProsecutorSection(workingCase, user)
    const { type, parentCase } = workingCase
    const routeIndex = prosecutorRestrictionCasesRoutes.findIndex(
      /**
       * We do .slice here because router.pathname is /something/[:id]
       * and we want to remove the /[:id] part
       */
      (route) => route === router.pathname.slice(0, -5),
    )

    return {
      name: formatMessage(sections.extensionSection.title),
      isActive:
        user?.role === UserRole.PROSECUTOR &&
        isRestrictionCase(type) &&
        parentCase !== undefined &&
        !completedCaseStates.includes(workingCase.state),
      children:
        user?.institution?.type !== InstitutionType.PROSECUTORS_OFFICE
          ? []
          : [
              {
                name: capitalize(
                  formatMessage(core.defendant, { suffix: 'i' }),
                ),
                isActive: routeIndex === 0,
                href:
                  (section.children.length > 0 && section.children[0].href) ||
                  undefined,
              },
              {
                name: formatMessage(
                  sections.extensionSection.hearingArrangements,
                ),
                isActive: routeIndex === 1,
                href:
                  (section.children.length > 0 && section.children[1].href) ||
                  undefined,
                onClick:
                  (routeIndex !== 1 &&
                    section.children.length > 0 &&
                    section.children[1].onClick) ||
                  undefined,
              },
              {
                name: formatMessage(sections.extensionSection.policeDemands),
                isActive: routeIndex === 2,
                href:
                  (section.children.length > 0 && section.children[2].href) ||
                  undefined,
                onClick:
                  (routeIndex !== 2 &&
                    section.children.length > 0 &&
                    section.children[2].onClick) ||
                  undefined,
              },
              {
                name: formatMessage(sections.extensionSection.policeReport),
                isActive: routeIndex === 3,
                href:
                  (section.children.length > 0 && section.children[3].href) ||
                  undefined,
                onClick:
                  (routeIndex !== 3 &&
                    section.children.length > 0 &&
                    section.children[3].onClick) ||
                  undefined,
              },
              {
                name: formatMessage(sections.extensionSection.caseFiles),
                isActive: routeIndex === 4,
                href:
                  (section.children.length > 0 && section.children[4].href) ||
                  undefined,
                onClick:
                  (routeIndex !== 4 &&
                    section.children.length > 0 &&
                    section.children[4].onClick) ||
                  undefined,
              },
              {
                name: formatMessage(sections.extensionSection.overview),
                isActive: routeIndex === 5,
                href:
                  (section.children.length > 0 && section.children[5].href) ||
                  undefined,
                onClick:
                  (routeIndex !== 5 &&
                    section.children.length > 0 &&
                    section.children[5].onClick) ||
                  undefined,
              },
            ],
    }
  }

  const getInvestigationCaseExtensionSections = (
    workingCase: Case,
    user?: User,
  ): RouteSection => {
    const section = getInvestigationCaseProsecutorSection(workingCase, user)
    const { type, parentCase } = workingCase
    const routeIndex = prosecutorInvestigationCasesRoutes.findIndex(
      /**
       * We do .slice here because router.pathname is /something/[:id]
       * and we want to remove the /[:id] part
       */
      (route) => route === router.pathname.slice(0, -5),
    )

    return {
      name: formatMessage(sections.investigationCaseExtensionSection.title),
      isActive:
        user?.role === UserRole.PROSECUTOR &&
        isInvestigationCase(type) &&
        parentCase !== undefined &&
        !completedCaseStates.includes(workingCase.state),
      children:
        user?.institution?.type !== InstitutionType.PROSECUTORS_OFFICE
          ? []
          : [
              {
                name: capitalize(
                  formatMessage(core.defendant, { suffix: 'i' }),
                ),
                isActive: routeIndex === 0,
                href:
                  (section.children.length > 0 && section.children[0].href) ||
                  undefined,
              },
              {
                name: formatMessage(
                  sections.investigationCaseExtensionSection
                    .hearingArrangements,
                ),
                isActive: routeIndex === 1,
                href:
                  (section.children.length > 0 && section.children[1].href) ||
                  undefined,
                onClick:
                  (routeIndex !== 1 && section.children[1].onClick) ||
                  undefined,
              },
              {
                name: formatMessage(
                  sections.investigationCaseExtensionSection.policeDemands,
                ),
                isActive: routeIndex === 2,
                href:
                  (section.children.length > 0 && section.children[2].href) ||
                  undefined,
                onClick:
                  (routeIndex !== 2 && section.children[2].onClick) ||
                  undefined,
              },
              {
                name: formatMessage(
                  sections.investigationCaseExtensionSection.policeReport,
                ),
                isActive: routeIndex === 3,
                href:
                  (section.children.length > 0 && section.children[3].href) ||
                  undefined,
                onClick:
                  (routeIndex !== 3 && section.children[3].onClick) ||
                  undefined,
              },
              {
                name: formatMessage(
                  sections.investigationCaseExtensionSection.caseFiles,
                ),
                isActive: routeIndex === 4,
                href:
                  (section.children.length > 0 && section.children[4].href) ||
                  undefined,
                onClick:
                  (routeIndex !== 4 && section.children[4].onClick) ||
                  undefined,
              },
              {
                name: formatMessage(
                  sections.investigationCaseExtensionSection.overview,
                ),
                isActive: routeIndex === 5,
                href:
                  (section.children.length > 0 && section.children[5].href) ||
                  undefined,
                onClick:
                  (routeIndex !== 5 && section.children[5].onClick) ||
                  undefined,
              },
            ],
    }
  }

  const getCourtOfAppealSections = (workingCase: Case, user?: User) => {
    const { id, appealRulingDecision, appealState } = workingCase
    const routeIndex = courtOfAppealRoutes.findIndex(
      /**
       * We do .slice here because router.pathname is /something/[:id]
       * and we want to remove the /[:id] part
       */
      (route) => route === router.pathname.slice(0, -5),
    )

    return [
      {
        name: formatMessage(sections.courtOfAppealSection.appealed),
        isActive:
          user?.institution?.type !== InstitutionType.COURT_OF_APPEALS &&
          (workingCase.appealState === CaseAppealState.RECEIVED ||
            workingCase.appealState === CaseAppealState.APPEALED),
        children: [],
      },
      {
        name: formatMessage(sections.courtOfAppealSection.result),
        isActive:
          user?.institution?.type === InstitutionType.COURT_OF_APPEALS &&
          routeIndex !== 4,
        children: [
          {
            name: formatMessage(sections.courtOfAppealSection.overview),
            isActive: routeIndex === 0,
            href: `${constants.COURT_OF_APPEAL_OVERVIEW_ROUTE}/${id}`,
          },
          {
            name: formatMessage(sections.courtOfAppealSection.reception),
            isActive: routeIndex === 1,
            href: `${constants.COURT_OF_APPEAL_CASE_ROUTE}/${id}`,
            onClick:
              routeIndex !== 1 &&
              validateFormStepper(
                isValid,
                [constants.COURT_OF_APPEAL_OVERVIEW_ROUTE],
                workingCase,
              ) &&
              onNavigationTo
                ? async () =>
                    await onNavigationTo(constants.COURT_OF_APPEAL_CASE_ROUTE)
                : undefined,
          },
          {
            name: formatMessage(sections.courtOfAppealSection.ruling),
            isActive: routeIndex === 2,
            href: `${constants.COURT_OF_APPEAL_RULING_ROUTE}/${workingCase.id}`,
            onClick:
              routeIndex !== 2 &&
              validateFormStepper(
                isValid,
                [
                  constants.COURT_OF_APPEAL_OVERVIEW_ROUTE,
                  constants.COURT_OF_APPEAL_CASE_ROUTE,
                ],
                workingCase,
              ) &&
              onNavigationTo
                ? async () =>
                    await onNavigationTo(constants.COURT_OF_APPEAL_RULING_ROUTE)
                : undefined,
          },
          {
            name: formatMessage(sections.courtOfAppealSection.summary),
            isActive: routeIndex === 3,
            href: `${constants.COURT_OF_APPEAL_SUMMARY_ROUTE}/${workingCase.id}`,
            onClick:
              routeIndex !== 3 &&
              validateFormStepper(
                isValid,
                [
                  constants.COURT_OF_APPEAL_OVERVIEW_ROUTE,
                  constants.COURT_OF_APPEAL_CASE_ROUTE,
                  constants.COURT_OF_APPEAL_RULING_ROUTE,
                ],
                workingCase,
              ) &&
              onNavigationTo
                ? async () =>
                    await onNavigationTo(
                      constants.COURT_OF_APPEAL_SUMMARY_ROUTE,
                    )
                : undefined,
          },
        ],
      },
      {
        name:
          appealState === CaseAppealState.COMPLETED
            ? getAppealResultText(appealRulingDecision)
            : formatMessage(sections.caseResults.result),
        isActive:
          routeIndex === 4 ||
          workingCase.appealState === CaseAppealState.COMPLETED,
        children: [],
      },
    ]
  }

  const getRestrictionCaseExtensionCourtSections = (
    workingCase: Case,
    user?: User,
  ) => {
    const { type } = workingCase

    return {
      ...getRestrictionCaseCourtSections(workingCase, user),
      isActive:
        !completedCaseStates.includes(workingCase.state) &&
        isRestrictionCase(type) &&
        isCourtRole(user?.role),
    }
  }

  const getInvestigationCaseExtensionCourtSections = (
    workingCase: Case,
    user?: User,
  ) => {
    const { type } = workingCase

    return {
      ...getInvestigationCaseCourtSections(workingCase, user),
      isActive:
        !completedCaseStates.includes(workingCase.state) &&
        isInvestigationCase(type) &&
        isCourtRole(user?.role),
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
        name: formatCaseResult(
          formatMessage,
          workingCase,
          workingCase.parentCase
            ? workingCase.parentCase.state
            : workingCase.state,
        ),
        isActive:
          !workingCase.parentCase &&
          completedCaseStates.includes(workingCase.state) &&
          !workingCase.prosecutorPostponedAppealDate &&
          !workingCase.accusedPostponedAppealDate &&
          workingCase.appealState !== CaseAppealState.COMPLETED,
        children: [],
      },
      ...(workingCase.parentCase
        ? [
            isRestrictionCase(workingCase.type)
              ? getRestrictionCaseExtensionSections(workingCase, user)
              : getInvestigationCaseExtensionSections(workingCase, user),
            isRestrictionCase(workingCase.type)
              ? getRestrictionCaseExtensionCourtSections(workingCase, user)
              : getInvestigationCaseExtensionCourtSections(workingCase, user),
            {
              name: formatCaseResult(
                formatMessage,
                workingCase,
                workingCase.state,
              ),
              isActive:
                completedCaseStates.includes(workingCase.state) &&
                !workingCase.prosecutorPostponedAppealDate &&
                !workingCase.accusedPostponedAppealDate &&
                workingCase.appealState !== CaseAppealState.COMPLETED,
              children: [],
            },
          ]
        : []),
      ...(!workingCase.appealState
        ? []
        : getCourtOfAppealSections(workingCase, user)),
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
