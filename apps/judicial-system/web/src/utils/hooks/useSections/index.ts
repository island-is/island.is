import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import * as constants from '@island.is/judicial-system/consts'
import {
  capitalize,
  getAppealResultTextByValue,
} from '@island.is/judicial-system/formatters'
import {
  isCompletedCase,
  isCourtOfAppealsUser,
  isDefenceUser,
  isDistrictCourtUser,
  isIndictmentCase,
  isInvestigationCase,
  isProsecutionUser,
  isProsecutorsOffice,
  isRestrictionCase,
} from '@island.is/judicial-system/types'
import { core, sections } from '@island.is/judicial-system-web/messages'
import { RouteSection } from '@island.is/judicial-system-web/src/components/PageLayout/PageLayout'
import { formatCaseResult } from '@island.is/judicial-system-web/src/components/PageLayout/utils'
import {
  Case,
  CaseAppealState,
  CaseState,
  CaseType,
  Gender,
  IndictmentDecision,
  InstitutionType,
  User,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { stepValidations, stepValidationsType } from '../../formHelper'
import { shouldUseAppealWithdrawnRoutes } from '../../utils'

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
  const isActive = (pathname: string) =>
    router.pathname.replace(/\/\[\w+\]/g, '') === pathname

  const getRestrictionCaseProsecutorSection = (
    workingCase: Case,
    user?: User,
  ): RouteSection => {
    const { type, id, parentCase, state } = workingCase

    return {
      name: formatMessage(sections.restrictionCaseProsecutorSection.caseTitle, {
        caseType: type,
      }),
      isActive:
        isProsecutionUser(user) &&
        isRestrictionCase(type) &&
        !isCompletedCase(state) &&
        !parentCase,
      children: !isProsecutorsOffice(user?.institution?.type)
        ? []
        : [
            {
              name: capitalize(
                formatMessage(core.defendant, {
                  suffix: 'i',
                }),
              ),
              isActive:
                isActive(constants.RESTRICTION_CASE_DEFENDANT_ROUTE) ||
                isActive(constants.CREATE_RESTRICTION_CASE_ROUTE) ||
                isActive(constants.CREATE_TRAVEL_BAN_ROUTE),
              href: `${constants.RESTRICTION_CASE_DEFENDANT_ROUTE}/${id}`,
            },
            {
              name: formatMessage(
                sections.restrictionCaseProsecutorSection.hearingArrangements,
              ),
              href: `${constants.RESTRICTION_CASE_HEARING_ARRANGEMENTS_ROUTE}/${id}`,
              isActive: isActive(
                constants.RESTRICTION_CASE_HEARING_ARRANGEMENTS_ROUTE,
              ),
              onClick:
                !isActive(
                  constants.RESTRICTION_CASE_HEARING_ARRANGEMENTS_ROUTE,
                ) &&
                validateFormStepper(
                  isValid,
                  [
                    type === CaseType.CUSTODY
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
              isActive: isActive(
                constants.RESTRICTION_CASE_POLICE_DEMANDS_ROUTE,
              ),
              onClick:
                !isActive(constants.RESTRICTION_CASE_POLICE_DEMANDS_ROUTE) &&
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
              isActive: isActive(
                constants.RESTRICTION_CASE_POLICE_REPORT_ROUTE,
              ),
              onClick:
                !isActive(constants.RESTRICTION_CASE_POLICE_REPORT_ROUTE) &&
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
              isActive: isActive(constants.RESTRICTION_CASE_CASE_FILES_ROUTE),
              onClick:
                !isActive(constants.RESTRICTION_CASE_CASE_FILES_ROUTE) &&
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
              isActive: isActive(constants.RESTRICTION_CASE_OVERVIEW_ROUTE),
              onClick:
                !isActive(constants.RESTRICTION_CASE_COURT_OVERVIEW_ROUTE) &&
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
    const { id, type, parentCase, state } = workingCase

    return {
      name: formatMessage(sections.investigationCaseProsecutorSection.title),
      isActive:
        isProsecutionUser(user) &&
        isInvestigationCase(type) &&
        !isCompletedCase(state) &&
        !parentCase,
      children: !isProsecutorsOffice(user?.institution?.type)
        ? []
        : [
            {
              name: 'Efni kröfu',
              isActive:
                isActive(constants.CREATE_INVESTIGATION_CASE_ROUTE) ||
                isActive(constants.INVESTIGATION_CASE_REGISTRATION_ROUTE),
              href: `${constants.INVESTIGATION_CASE_REGISTRATION_ROUTE}/${id}`,
            },
            {
              name: capitalize(formatMessage(core.defendant, { suffix: 'i' })),
              isActive: isActive(constants.INVESTIGATION_CASE_DEFENDANT_ROUTE),
              href: `${constants.INVESTIGATION_CASE_DEFENDANT_ROUTE}/${id}`,
              onClick:
                !isActive(constants.INVESTIGATION_CASE_DEFENDANT_ROUTE) &&
                validateFormStepper(
                  isValid,
                  [constants.INVESTIGATION_CASE_REGISTRATION_ROUTE],
                  workingCase,
                ) &&
                onNavigationTo
                  ? async () =>
                      await onNavigationTo(
                        constants.INVESTIGATION_CASE_DEFENDANT_ROUTE,
                      )
                  : undefined,
            },
            {
              name: formatMessage(
                sections.investigationCaseProsecutorSection.hearingArrangements,
              ),
              isActive: isActive(
                constants.INVESTIGATION_CASE_HEARING_ARRANGEMENTS_ROUTE,
              ),
              href: `${constants.INVESTIGATION_CASE_HEARING_ARRANGEMENTS_ROUTE}/${id}`,
              onClick:
                !isActive(
                  constants.INVESTIGATION_CASE_HEARING_ARRANGEMENTS_ROUTE,
                ) &&
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
              isActive: isActive(
                constants.INVESTIGATION_CASE_POLICE_DEMANDS_ROUTE,
              ),
              href: `${constants.INVESTIGATION_CASE_POLICE_DEMANDS_ROUTE}/${id}`,
              onClick:
                !isActive(constants.INVESTIGATION_CASE_POLICE_DEMANDS_ROUTE) &&
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
              isActive: isActive(
                constants.INVESTIGATION_CASE_POLICE_REPORT_ROUTE,
              ),
              onClick:
                !isActive(constants.INVESTIGATION_CASE_POLICE_REPORT_ROUTE) &&
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
              isActive: isActive(constants.INVESTIGATION_CASE_CASE_FILES_ROUTE),
              onClick:
                !isActive(constants.INVESTIGATION_CASE_CASE_FILES_ROUTE) &&
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
              isActive: isActive(
                constants.INVESTIGATION_CASE_POLICE_CONFIRMATION_ROUTE,
              ),
              onClick:
                !isActive(
                  constants.INVESTIGATION_CASE_POLICE_CONFIRMATION_ROUTE,
                ) &&
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
    const { id, type, state } = workingCase
    const substepsShouldBeHidden =
      state === CaseState.RECEIVED ||
      state === CaseState.WAITING_FOR_CANCELLATION ||
      router.pathname === `${constants.INDICTMENTS_ADD_FILES_ROUTE}/[id]`

    return {
      name: formatMessage(sections.indictmentCaseProsecutorSection.title),
      isActive:
        isProsecutionUser(user) &&
        isIndictmentCase(type) &&
        state !== CaseState.RECEIVED &&
        !isCompletedCase(state),
      // Prosecutor can only view the overview when case has been received by court
      children: substepsShouldBeHidden
        ? []
        : [
            {
              name: capitalize(
                formatMessage(core.indictmentDefendant, {
                  gender: Gender.MALE,
                }),
              ),
              isActive:
                isActive(constants.CREATE_INDICTMENT_ROUTE) ||
                isActive(constants.INDICTMENTS_DEFENDANT_ROUTE),
              href: `${constants.INDICTMENTS_DEFENDANT_ROUTE}/${id}`,
            },
            {
              name: capitalize(
                formatMessage(
                  sections.indictmentCaseProsecutorSection.policeCaseFiles,
                ),
              ),
              isActive: isActive(constants.INDICTMENTS_POLICE_CASE_FILES_ROUTE),
              href: `${constants.INDICTMENTS_POLICE_CASE_FILES_ROUTE}/${id}`,
              onClick:
                !isActive(constants.INDICTMENTS_POLICE_CASE_FILES_ROUTE) &&
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
              isActive: isActive(constants.INDICTMENTS_CASE_FILE_ROUTE),
              href: `${constants.INDICTMENTS_CASE_FILE_ROUTE}/${id}`,
              onClick:
                !isActive(constants.INDICTMENTS_CASE_FILE_ROUTE) &&
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
                  sections.indictmentCaseProsecutorSection.caseFiles,
                ),
              ),
              href: `${constants.INDICTMENTS_CASE_FILES_ROUTE}/${id}`,
              isActive: substepsShouldBeHidden
                ? false
                : isActive(constants.INDICTMENTS_CASE_FILES_ROUTE),
              onClick:
                !isActive(constants.INDICTMENTS_CASE_FILES_ROUTE) &&
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
                        constants.INDICTMENTS_CASE_FILES_ROUTE,
                      )
                  : undefined,
            },
            {
              name: capitalize(
                formatMessage(
                  sections.indictmentCaseProsecutorSection.processing,
                ),
              ),
              isActive: isActive(constants.INDICTMENTS_PROCESSING_ROUTE),
              href: `${constants.INDICTMENTS_PROCESSING_ROUTE}/${id}`,
              onClick:
                !isActive(constants.INDICTMENTS_PROCESSING_ROUTE) &&
                validateFormStepper(
                  isValid,
                  [
                    constants.INDICTMENTS_DEFENDANT_ROUTE,
                    constants.INDICTMENTS_POLICE_CASE_FILES_ROUTE,
                    constants.INDICTMENTS_CASE_FILE_ROUTE,
                    constants.INDICTMENTS_CASE_FILES_ROUTE,
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
            {
              name: formatMessage(
                sections.indictmentCaseProsecutorSection.indictment,
              ),
              href: `${constants.INDICTMENTS_INDICTMENT_ROUTE}/${id}`,
              isActive: isActive(constants.INDICTMENTS_INDICTMENT_ROUTE),
              onClick:
                !isActive(constants.INDICTMENTS_INDICTMENT_ROUTE) &&
                validateFormStepper(
                  isValid,
                  [
                    constants.INDICTMENTS_DEFENDANT_ROUTE,
                    constants.INDICTMENTS_POLICE_CASE_FILES_ROUTE,
                    constants.INDICTMENTS_CASE_FILE_ROUTE,
                    constants.INDICTMENTS_CASE_FILES_ROUTE,
                    constants.INDICTMENTS_PROCESSING_ROUTE,
                  ],
                  workingCase,
                ) &&
                onNavigationTo
                  ? async () =>
                      await onNavigationTo(
                        constants.INDICTMENTS_INDICTMENT_ROUTE,
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
              isActive: isActive(constants.INDICTMENTS_OVERVIEW_ROUTE),
              onClick:
                !isActive(constants.INDICTMENTS_OVERVIEW_ROUTE) &&
                validateFormStepper(
                  isValid,
                  [
                    constants.INDICTMENTS_DEFENDANT_ROUTE,
                    constants.INDICTMENTS_POLICE_CASE_FILES_ROUTE,
                    constants.INDICTMENTS_CASE_FILE_ROUTE,
                    constants.INDICTMENTS_CASE_FILES_ROUTE,
                    constants.INDICTMENTS_PROCESSING_ROUTE,
                    constants.INDICTMENTS_INDICTMENT_ROUTE,
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
    const { id, parentCase, state } = workingCase
    return {
      name: formatMessage(sections.courtSection.title),
      isActive:
        (isDistrictCourtUser(user) || isDefenceUser(user)) &&
        !isCompletedCase(state) &&
        !parentCase,
      children:
        user?.institution?.type !== InstitutionType.DISTRICT_COURT
          ? []
          : [
              {
                name: formatMessage(
                  sections.courtSection.receptionAndAssignment,
                ),
                isActive: isActive(
                  constants.RESTRICTION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE,
                ),
                href: `${constants.RESTRICTION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE}/${id}`,
              },
              {
                name: formatMessage(sections.courtSection.overview),
                isActive: isActive(
                  constants.RESTRICTION_CASE_COURT_OVERVIEW_ROUTE,
                ),
                href: `${constants.RESTRICTION_CASE_COURT_OVERVIEW_ROUTE}/${id}`,
                onClick:
                  !isActive(constants.RESTRICTION_CASE_COURT_OVERVIEW_ROUTE) &&
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
                isActive: isActive(
                  constants.RESTRICTION_CASE_COURT_HEARING_ARRANGEMENTS_ROUTE,
                ),
                href: `${constants.RESTRICTION_CASE_COURT_HEARING_ARRANGEMENTS_ROUTE}/${id}`,
                onClick:
                  !isActive(
                    constants.RESTRICTION_CASE_COURT_HEARING_ARRANGEMENTS_ROUTE,
                  ) &&
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
                isActive: isActive(constants.RESTRICTION_CASE_RULING_ROUTE),
                href: `${constants.RESTRICTION_CASE_RULING_ROUTE}/${id}`,
                onClick:
                  !isActive(constants.RESTRICTION_CASE_RULING_ROUTE) &&
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
                isActive: isActive(
                  constants.RESTRICTION_CASE_COURT_RECORD_ROUTE,
                ),
                href: `${constants.RESTRICTION_CASE_COURT_RECORD_ROUTE}/${id}`,
                onClick:
                  !isActive(constants.RESTRICTION_CASE_COURT_RECORD_ROUTE) &&
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
                isActive: isActive(
                  constants.RESTRICTION_CASE_CONFIRMATION_ROUTE,
                ),
                href: `${constants.RESTRICTION_CASE_CONFIRMATION_ROUTE}/${id}`,
                onClick:
                  !isActive(constants.RESTRICTION_CASE_CONFIRMATION_ROUTE) &&
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
    const { id, parentCase, state } = workingCase

    return {
      name: formatMessage(sections.investigationCaseCourtSection.title),
      isActive:
        (isDistrictCourtUser(user) || isDefenceUser(user)) &&
        !isCompletedCase(state) &&
        !parentCase,
      children:
        user?.institution?.type !== InstitutionType.DISTRICT_COURT
          ? []
          : [
              {
                name: formatMessage(
                  sections.courtSection.receptionAndAssignment,
                ),
                isActive: isActive(
                  constants.INVESTIGATION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE,
                ),
                href: `${constants.INVESTIGATION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE}/${id}`,
              },
              {
                name: formatMessage(
                  sections.investigationCaseCourtSection.overview,
                ),
                isActive: isActive(constants.INVESTIGATION_CASE_OVERVIEW_ROUTE),
                href: `${constants.INVESTIGATION_CASE_OVERVIEW_ROUTE}/${id}`,
                onClick:
                  !isActive(constants.INVESTIGATION_CASE_OVERVIEW_ROUTE) &&
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
                isActive: isActive(
                  constants.INVESTIGATION_CASE_COURT_HEARING_ARRANGEMENTS_ROUTE,
                ),
                href: `${constants.INVESTIGATION_CASE_COURT_HEARING_ARRANGEMENTS_ROUTE}/${id}`,
                onClick:
                  !isActive(
                    constants.INVESTIGATION_CASE_COURT_HEARING_ARRANGEMENTS_ROUTE,
                  ) &&
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
                isActive: isActive(constants.INVESTIGATION_CASE_RULING_ROUTE),
                href: `${constants.INVESTIGATION_CASE_RULING_ROUTE}/${id}`,
                onClick:
                  !isActive(constants.INVESTIGATION_CASE_RULING_ROUTE) &&
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
                isActive: isActive(
                  constants.INVESTIGATION_CASE_COURT_RECORD_ROUTE,
                ),
                href: `${constants.INVESTIGATION_CASE_COURT_RECORD_ROUTE}/${id}`,
                onClick:
                  !isActive(constants.INVESTIGATION_CASE_COURT_RECORD_ROUTE) &&
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
                isActive: isActive(
                  constants.INVESTIGATION_CASE_CONFIRMATION_ROUTE,
                ),
                href: `${constants.INVESTIGATION_CASE_CONFIRMATION_ROUTE}/${id}`,
                onClick:
                  !isActive(constants.INVESTIGATION_CASE_CONFIRMATION_ROUTE) &&
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
    const { id, state, indictmentDecision } = workingCase

    return {
      name: formatMessage(sections.indictmentsCourtSection.title),
      isActive:
        (isProsecutionUser(user) && state === CaseState.RECEIVED) ||
        ((isDistrictCourtUser(user) || isDefenceUser(user)) &&
          !isCompletedCase(state)),
      children: isDistrictCourtUser(user)
        ? [
            {
              name: formatMessage(sections.indictmentsCourtSection.overview),
              isActive: isActive(constants.INDICTMENTS_COURT_OVERVIEW_ROUTE),
              href: `${constants.INDICTMENTS_COURT_OVERVIEW_ROUTE}/${id}`,
            },
            {
              name: formatMessage(
                sections.indictmentsCourtSection.receptionAndAssignment,
              ),
              isActive: isActive(
                constants.INDICTMENTS_RECEPTION_AND_ASSIGNMENT_ROUTE,
              ),
              href: `${constants.INDICTMENTS_RECEPTION_AND_ASSIGNMENT_ROUTE}/${id}`,
              onClick:
                !isActive(
                  constants.INDICTMENTS_RECEPTION_AND_ASSIGNMENT_ROUTE,
                ) &&
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
              isActive: isActive(constants.INDICTMENTS_SUBPOENA_ROUTE),
              href: `${constants.INDICTMENTS_SUBPOENA_ROUTE}/${id}`,
              onClick:
                !isActive(constants.INDICTMENTS_SUBPOENA_ROUTE) &&
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
              isActive: isActive(constants.INDICTMENTS_DEFENDER_ROUTE),
              href: `${constants.INDICTMENTS_DEFENDER_ROUTE}/${id}`,
              onClick:
                !isActive(constants.INDICTMENTS_DEFENDER_ROUTE) &&
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
              name: formatMessage(sections.indictmentsCourtSection.conclusion),
              isActive: isActive(constants.INDICTMENTS_CONCLUSION_ROUTE),
              href: `${constants.INDICTMENTS_CONCLUSION_ROUTE}/${id}`,
              onClick:
                !isActive(constants.INDICTMENTS_CONCLUSION_ROUTE) &&
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
                      await onNavigationTo(
                        constants.INDICTMENTS_CONCLUSION_ROUTE,
                      )
                  : undefined,
            },
            {
              name: formatMessage(sections.indictmentsCourtSection.summary),
              isActive: isActive(constants.INDICTMENTS_SUMMARY_ROUTE),
              href: `${constants.INDICTMENTS_SUMMARY_ROUTE}/${id}`,
              onClick:
                !isActive(constants.INDICTMENTS_SUMMARY_ROUTE) &&
                /**
                 * This is a special case where we need to check the intent of the judge
                 * because this last step should only be clicable if the judge intends to
                 * close the case.
                 */
                indictmentDecision === IndictmentDecision.COMPLETING &&
                validateFormStepper(
                  isValid,
                  [
                    constants.INDICTMENTS_OVERVIEW_ROUTE,
                    constants.INDICTMENTS_RECEPTION_AND_ASSIGNMENT_ROUTE,
                    constants.INDICTMENTS_SUBPOENA_ROUTE,
                    constants.INDICTMENTS_DEFENDER_ROUTE,
                    constants.INDICTMENTS_CONCLUSION_ROUTE,
                  ],
                  workingCase,
                ) &&
                onNavigationTo
                  ? async () =>
                      await onNavigationTo(constants.INDICTMENTS_SUMMARY_ROUTE)
                  : undefined,
            },
          ]
        : [],
    }
  }

  const getRestrictionCaseExtensionSections = (
    workingCase: Case,
    user?: User,
  ): RouteSection => {
    const section = getRestrictionCaseProsecutorSection(workingCase, user)
    const { id, type, parentCase, state } = workingCase

    return {
      name: formatMessage(sections.extensionSection.title),
      isActive:
        isProsecutionUser(user) &&
        isRestrictionCase(type) &&
        Boolean(parentCase) &&
        !isCompletedCase(state),
      children:
        !isProsecutorsOffice(user?.institution?.type) ||
        section.children.length === 0
          ? []
          : [
              {
                name: capitalize(
                  formatMessage(core.defendant, { suffix: 'i' }),
                ),
                isActive: isActive(constants.RESTRICTION_CASE_DEFENDANT_ROUTE),
                href: `${constants.RESTRICTION_CASE_DEFENDANT_ROUTE}/${id}`,
              },
              {
                name: formatMessage(
                  sections.extensionSection.hearingArrangements,
                ),
                isActive: isActive(
                  constants.RESTRICTION_CASE_HEARING_ARRANGEMENTS_ROUTE,
                ),
                href: `${constants.RESTRICTION_CASE_HEARING_ARRANGEMENTS_ROUTE}/${id}`,
                onClick:
                  (!isActive(
                    constants.RESTRICTION_CASE_HEARING_ARRANGEMENTS_ROUTE,
                  ) &&
                    section.children.length > 0 &&
                    section.children[1].onClick) ||
                  undefined,
              },
              {
                name: formatMessage(sections.extensionSection.policeDemands),
                isActive: isActive(
                  constants.RESTRICTION_CASE_POLICE_DEMANDS_ROUTE,
                ),
                href: `${constants.RESTRICTION_CASE_POLICE_DEMANDS_ROUTE}/${id}`,
                onClick:
                  (!isActive(constants.RESTRICTION_CASE_POLICE_DEMANDS_ROUTE) &&
                    section.children.length > 0 &&
                    section.children[2].onClick) ||
                  undefined,
              },
              {
                name: formatMessage(sections.extensionSection.policeReport),
                isActive: isActive(
                  constants.RESTRICTION_CASE_POLICE_REPORT_ROUTE,
                ),
                href: `${constants.RESTRICTION_CASE_POLICE_REPORT_ROUTE}/${id}`,
                onClick:
                  (!isActive(constants.RESTRICTION_CASE_POLICE_REPORT_ROUTE) &&
                    section.children.length > 0 &&
                    section.children[3].onClick) ||
                  undefined,
              },
              {
                name: formatMessage(sections.extensionSection.caseFiles),
                isActive: isActive(constants.RESTRICTION_CASE_CASE_FILES_ROUTE),
                href: `${constants.RESTRICTION_CASE_CASE_FILES_ROUTE}/${id}`,
                onClick:
                  (!isActive(constants.RESTRICTION_CASE_CASE_FILES_ROUTE) &&
                    section.children.length > 0 &&
                    section.children[4].onClick) ||
                  undefined,
              },
              {
                name: formatMessage(sections.extensionSection.overview),
                isActive: isActive(constants.RESTRICTION_CASE_OVERVIEW_ROUTE),
                href: `${constants.RESTRICTION_CASE_OVERVIEW_ROUTE}/${id}`,
                onClick:
                  (!isActive(constants.RESTRICTION_CASE_OVERVIEW_ROUTE) &&
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
    const { id, type, parentCase, state } = workingCase

    return {
      name: formatMessage(sections.investigationCaseExtensionSection.title),
      isActive:
        isProsecutionUser(user) &&
        isInvestigationCase(type) &&
        Boolean(parentCase) &&
        !isCompletedCase(state),
      children: !isProsecutorsOffice(user?.institution?.type)
        ? []
        : [
            {
              name: capitalize(formatMessage(core.defendant, { suffix: 'i' })),
              isActive: isActive(constants.INVESTIGATION_CASE_DEFENDANT_ROUTE),
              href: `${constants.INVESTIGATION_CASE_DEFENDANT_ROUTE}/${id}`,
            },
            {
              name: formatMessage(
                sections.investigationCaseExtensionSection.hearingArrangements,
              ),
              isActive: isActive(
                constants.INVESTIGATION_CASE_HEARING_ARRANGEMENTS_ROUTE,
              ),
              href: `${constants.INVESTIGATION_CASE_HEARING_ARRANGEMENTS_ROUTE}/${id}`,
              onClick:
                (!isActive(
                  constants.INVESTIGATION_CASE_HEARING_ARRANGEMENTS_ROUTE,
                ) &&
                  section.children[1].onClick) ||
                undefined,
            },
            {
              name: formatMessage(
                sections.investigationCaseExtensionSection.policeDemands,
              ),
              isActive: isActive(
                constants.INVESTIGATION_CASE_POLICE_DEMANDS_ROUTE,
              ),
              href: `${constants.INVESTIGATION_CASE_POLICE_DEMANDS_ROUTE}/${id}`,
              onClick:
                (!isActive(constants.INVESTIGATION_CASE_POLICE_DEMANDS_ROUTE) &&
                  section.children[2].onClick) ||
                undefined,
            },
            {
              name: formatMessage(
                sections.investigationCaseExtensionSection.policeReport,
              ),
              isActive: isActive(
                constants.INVESTIGATION_CASE_POLICE_REPORT_ROUTE,
              ),
              href: `${constants.INVESTIGATION_CASE_POLICE_REPORT_ROUTE}/${id}`,
              onClick:
                (!isActive(constants.INVESTIGATION_CASE_POLICE_REPORT_ROUTE) &&
                  section.children[3].onClick) ||
                undefined,
            },
            {
              name: formatMessage(
                sections.investigationCaseExtensionSection.caseFiles,
              ),
              isActive: isActive(constants.INVESTIGATION_CASE_CASE_FILES_ROUTE),
              href: `${constants.INVESTIGATION_CASE_CASE_FILES_ROUTE}/${id}`,
              onClick:
                (!isActive(constants.INVESTIGATION_CASE_CASE_FILES_ROUTE) &&
                  section.children[4].onClick) ||
                undefined,
            },
            {
              name: formatMessage(
                sections.investigationCaseExtensionSection.overview,
              ),
              isActive: isActive(
                constants.INVESTIGATION_CASE_POLICE_CONFIRMATION_ROUTE,
              ),
              href: `${constants.INVESTIGATION_CASE_POLICE_CONFIRMATION_ROUTE}/${id}`,
              onClick:
                (!isActive(
                  constants.INVESTIGATION_CASE_POLICE_CONFIRMATION_ROUTE,
                ) &&
                  section.children[5].onClick) ||
                undefined,
            },
          ],
    }
  }

  const getCourtOfAppealSections = (workingCase: Case, user?: User) => {
    const { id, appealRulingDecision, appealState } = workingCase
    const useAppealWithdrawnSections =
      shouldUseAppealWithdrawnRoutes(workingCase)

    return [
      {
        name: formatMessage(sections.courtOfAppealSection.appealed),
        isActive:
          !isCourtOfAppealsUser(user) &&
          appealState === CaseAppealState.APPEALED,
        children: [],
      },
      {
        name: formatMessage(sections.courtOfAppealSection.result),
        isActive:
          appealState === CaseAppealState.RECEIVED ||
          appealState === CaseAppealState.WITHDRAWN,
        children: isCourtOfAppealsUser(user)
          ? [
              {
                name: formatMessage(sections.courtOfAppealSection.overview),
                isActive: isActive(constants.COURT_OF_APPEAL_OVERVIEW_ROUTE),
                href: `${constants.COURT_OF_APPEAL_OVERVIEW_ROUTE}/${id}`,
              },
              ...(!useAppealWithdrawnSections
                ? [
                    {
                      name: formatMessage(
                        sections.courtOfAppealSection.reception,
                      ),
                      isActive: isActive(constants.COURT_OF_APPEAL_CASE_ROUTE),
                      href: `${constants.COURT_OF_APPEAL_CASE_ROUTE}/${id}`,
                      onClick:
                        !isActive(constants.COURT_OF_APPEAL_CASE_ROUTE) &&
                        validateFormStepper(
                          isValid,
                          [constants.COURT_OF_APPEAL_OVERVIEW_ROUTE],
                          workingCase,
                        ) &&
                        onNavigationTo
                          ? async () =>
                              await onNavigationTo(
                                constants.COURT_OF_APPEAL_CASE_ROUTE,
                              )
                          : undefined,
                    },
                    {
                      name: formatMessage(sections.courtOfAppealSection.ruling),
                      isActive: isActive(
                        constants.COURT_OF_APPEAL_RULING_ROUTE,
                      ),
                      href: `${constants.COURT_OF_APPEAL_RULING_ROUTE}/${id}`,
                      onClick:
                        !isActive(constants.COURT_OF_APPEAL_RULING_ROUTE) &&
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
                              await onNavigationTo(
                                constants.COURT_OF_APPEAL_RULING_ROUTE,
                              )
                          : undefined,
                    },
                  ]
                : []),
              ...(useAppealWithdrawnSections
                ? [
                    {
                      name: formatMessage(
                        sections.courtOfAppealSection.withdrawal,
                      ),
                      isActive: isActive(
                        constants.COURT_OF_APPEAL_CASE_WITHDRAWN_ROUTE,
                      ),
                      href: `${constants.COURT_OF_APPEAL_CASE_WITHDRAWN_ROUTE}/${id}`,
                      onClick:
                        !isActive(
                          constants.COURT_OF_APPEAL_CASE_WITHDRAWN_ROUTE,
                        ) &&
                        validateFormStepper(
                          isValid,
                          [constants.COURT_OF_APPEAL_OVERVIEW_ROUTE],
                          workingCase,
                        ) &&
                        onNavigationTo
                          ? async () =>
                              await onNavigationTo(
                                constants.COURT_OF_APPEAL_SUMMARY_ROUTE,
                              )
                          : undefined,
                    },
                  ]
                : []),
              {
                name: formatMessage(sections.courtOfAppealSection.summary),
                isActive: isActive(constants.COURT_OF_APPEAL_SUMMARY_ROUTE),
                href: `${constants.COURT_OF_APPEAL_SUMMARY_ROUTE}/${id}`,
                onClick:
                  !isActive(constants.COURT_OF_APPEAL_SUMMARY_ROUTE) &&
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
            ]
          : [],
      },
      {
        name:
          appealState === CaseAppealState.COMPLETED
            ? getAppealResultTextByValue(appealRulingDecision)
            : formatMessage(sections.caseResults.result),
        isActive: appealState === CaseAppealState.COMPLETED,
        children: [],
      },
    ]
  }

  const getRestrictionCaseExtensionCourtSections = (
    workingCase: Case,
    user?: User,
  ) => {
    return {
      ...getRestrictionCaseCourtSections(workingCase, user),
      isActive:
        !isCompletedCase(workingCase.state) && isDistrictCourtUser(user),
    }
  }

  const getInvestigationCaseExtensionCourtSections = (
    workingCase: Case,
    user?: User,
  ) => {
    return {
      ...getInvestigationCaseCourtSections(workingCase, user),
      isActive:
        !isCompletedCase(workingCase.state) && isDistrictCourtUser(user),
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
          (workingCase.appealState === CaseAppealState.WITHDRAWN &&
            !workingCase.appealReceivedByCourtDate) ||
          (!workingCase.parentCase &&
            isCompletedCase(workingCase.state) &&
            !workingCase.prosecutorPostponedAppealDate &&
            !workingCase.accusedPostponedAppealDate &&
            workingCase.appealState !== CaseAppealState.COMPLETED),
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
                isCompletedCase(workingCase.state) &&
                !workingCase.prosecutorPostponedAppealDate &&
                !workingCase.accusedPostponedAppealDate &&
                workingCase.appealState !== CaseAppealState.COMPLETED,
              children: [],
            },
          ]
        : []),
      ...(!workingCase.appealState ||
      (workingCase.appealState === CaseAppealState.WITHDRAWN &&
        !workingCase.appealReceivedByCourtDate)
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
