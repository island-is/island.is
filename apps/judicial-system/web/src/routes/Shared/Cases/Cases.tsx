import React, { useEffect, useState, useContext } from 'react'
import { useIntl } from 'react-intl'
import { useQuery, useLazyQuery } from '@apollo/client'
import router from 'next/router'
import partition from 'lodash/partition'

import { AlertMessage, Box, Text } from '@island.is/island-ui/core'
import {
  CaseQuery,
  DropdownMenu,
  Logo,
} from '@island.is/judicial-system-web/src/components'
import {
  CaseState,
  CaseTransition,
  InstitutionType,
  NotificationType,
  isRestrictionCase,
  UserRole,
  Feature,
  isInvestigationCase,
  isIndictmentCase,
} from '@island.is/judicial-system/types'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import { CasesQuery } from '@island.is/judicial-system-web/src/utils/mutations'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { CaseData } from '@island.is/judicial-system-web/src/types'
import { core, titles } from '@island.is/judicial-system-web/messages'
import useSections from '@island.is/judicial-system-web/src/utils/hooks/useSections'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import { capitalize } from '@island.is/judicial-system/formatters'
import { FeatureContext } from '@island.is/judicial-system-web/src/components/FeatureProvider/FeatureProvider'
import type { Case } from '@island.is/judicial-system/types'
import * as constants from '@island.is/judicial-system/consts'

import ActiveCases from './ActiveCases'
import PastCases from './PastCases'
import TableSkeleton from './TableSkeleton'
import { cases as m } from './Cases.strings'
import * as styles from './Cases.css'

const SectionTitle: React.FC = ({ children }) => {
  return (
    <>
      <Box marginBottom={3} display={['block', 'block', 'none']}>
        <Text variant="h2" as="h2">
          {children}
        </Text>
      </Box>
      <Box marginBottom={3} display={['none', 'none', 'block']}>
        <Text variant="h3" as="h3">
          {children}
        </Text>
      </Box>
    </>
  )
}

// Credit for sorting solution: https://www.smashingmagazine.com/2020/03/sortable-tables-react/
export const Cases: React.FC = () => {
  const [activeCases, setActiveCases] = useState<Case[]>()
  const [pastCases, setPastCases] = useState<Case[]>()

  const { user } = useContext(UserContext)
  const { features } = useContext(FeatureContext)
  const {
    findLastValidStep,
    getRestrictionCaseCourtSections,
    getInvestigationCaseCourtSections,
    getRestrictionCaseProsecutorSection,
    getInvestigationCaseProsecutorSection,
    getIndictmentCaseProsecutorSection,
    getIndictmentsCourtSections,
  } = useSections()

  const isProsecutor = user?.role === UserRole.PROSECUTOR
  const isJudge = user?.role === UserRole.JUDGE
  const isRegistrar = user?.role === UserRole.REGISTRAR
  const isHighCourtUser = user?.institution?.type === InstitutionType.HIGH_COURT
  const isPrisonAdminUser =
    user?.institution?.type === InstitutionType.PRISON_ADMIN
  const isPrisonUser = user?.institution?.type === InstitutionType.PRISON

  const { data, error, loading } = useQuery(CasesQuery, {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const [getCaseToOpen] = useLazyQuery<CaseData>(CaseQuery, {
    fetchPolicy: 'no-cache',
    onCompleted: (caseData) => {
      if (user?.role && caseData?.case) {
        openCase(caseData.case, user.role)
      }
    },
  })

  const {
    transitionCase,
    isTransitioningCase,
    sendNotification,
    isSendingNotification,
  } = useCase()
  const { formatMessage } = useIntl()

  const resCases = data?.cases

  useEffect(() => {
    if (resCases && !activeCases) {
      const casesWithoutDeleted = resCases.filter((c: Case) => {
        return c.state !== CaseState.DELETED
      })

      const [active, past] = partition(casesWithoutDeleted, (c: Case) => {
        if (isIndictmentCase(c.type) && c.state === CaseState.ACCEPTED) {
          return false
        } else if (isPrisonAdminUser || isPrisonUser) {
          return !c.isValidToDateInThePast && c.rulingDate
        } else {
          return !c.rulingDate
        }
      })

      setActiveCases(active)
      setPastCases(past)
    }
  }, [
    activeCases,
    setActiveCases,
    isProsecutor,
    isJudge,
    isRegistrar,
    resCases,
    isPrisonAdminUser,
    isPrisonUser,
  ])

  const deleteCase = async (caseToDelete: Case) => {
    if (
      caseToDelete.state === CaseState.NEW ||
      caseToDelete.state === CaseState.DRAFT ||
      caseToDelete.state === CaseState.SUBMITTED ||
      caseToDelete.state === CaseState.RECEIVED
    ) {
      await sendNotification(caseToDelete.id, NotificationType.REVOKED)
      await transitionCase(caseToDelete, CaseTransition.DELETE)
    }
  }

  const handleRowClick = (id: string) => {
    getCaseToOpen({
      variables: { input: { id } },
    })
  }

  const openCase = (caseToOpen: Case, role: UserRole) => {
    let routeTo = null

    if (
      caseToOpen.state === CaseState.ACCEPTED ||
      caseToOpen.state === CaseState.REJECTED ||
      caseToOpen.state === CaseState.DISMISSED
    ) {
      if (isIndictmentCase(caseToOpen.type)) {
        routeTo = `${constants.CLOSED_INDICTMENT_OVERVIEW_ROUTE}/${caseToOpen.id}`
      } else {
        routeTo = `${constants.SIGNED_VERDICT_OVERVIEW_ROUTE}/${caseToOpen.id}`
      }
    } else if (role === UserRole.JUDGE || role === UserRole.REGISTRAR) {
      if (isRestrictionCase(caseToOpen.type)) {
        routeTo = findLastValidStep(
          getRestrictionCaseCourtSections(caseToOpen, user),
        ).href
      } else if (isInvestigationCase(caseToOpen.type)) {
        routeTo = findLastValidStep(
          getInvestigationCaseCourtSections(caseToOpen, user),
        ).href
      } else {
        // Route to Indictment Overivew section since it always a valid step and
        // would be skipped if we route to the last valid step
        routeTo = getIndictmentsCourtSections(caseToOpen).children[0].href
      }
    } else {
      if (isRestrictionCase(caseToOpen.type)) {
        routeTo = findLastValidStep(
          getRestrictionCaseProsecutorSection(caseToOpen, user),
        ).href
      } else if (isInvestigationCase(caseToOpen.type)) {
        routeTo = findLastValidStep(
          getInvestigationCaseProsecutorSection(caseToOpen, user),
        ).href
      } else {
        const lastValidStep = findLastValidStep(
          getIndictmentCaseProsecutorSection(caseToOpen),
        )
        routeTo =
          lastValidStep?.href ??
          `${constants.INDICTMENTS_OVERVIEW_ROUTE}/${caseToOpen.id}`
      }
    }

    if (routeTo) router.push(routeTo)
  }

  return (
    <Box paddingX={[2, 2, 4]}>
      <Box
        className={styles.casesContainer}
        marginX={'auto'}
        marginY={[4, 4, 12]}
      >
        <PageHeader title={formatMessage(titles.shared.cases)} />
        {loading ? (
          <TableSkeleton />
        ) : (
          user && (
            <div className={styles.logoContainer}>
              <Logo />
              {isProsecutor && (
                <Box display={['none', 'none', 'block']}>
                  <DropdownMenu
                    dataTestId="createCaseDropdown"
                    menuLabel="Tegund kröfu"
                    icon="add"
                    items={
                      features.includes(Feature.INDICTMENTS)
                        ? [
                            {
                              href: constants.CREATE_INDICTMENT_ROUTE,
                              title: capitalize(formatMessage(core.indictment)),
                            },
                            {
                              href: constants.CREATE_RESTRICTION_CASE_ROUTE,
                              title: capitalize(
                                formatMessage(core.restrictionCase),
                              ),
                            },
                            {
                              href: constants.CREATE_TRAVEL_BAN_ROUTE,
                              title: capitalize(formatMessage(core.travelBan)),
                            },
                            {
                              href: constants.CREATE_INVESTIGATION_CASE_ROUTE,
                              title: capitalize(
                                formatMessage(core.investigationCase),
                              ),
                            },
                          ]
                        : [
                            {
                              href: constants.CREATE_RESTRICTION_CASE_ROUTE,
                              title: capitalize(
                                formatMessage(core.restrictionCase),
                              ),
                            },
                            {
                              href: constants.CREATE_TRAVEL_BAN_ROUTE,
                              title: capitalize(formatMessage(core.travelBan)),
                            },
                            {
                              href: constants.CREATE_INVESTIGATION_CASE_ROUTE,
                              title: capitalize(
                                formatMessage(core.investigationCase),
                              ),
                            },
                          ]
                    }
                    title={formatMessage(m.createCaseButton)}
                  />
                </Box>
              )}
            </div>
          )
        )}
        {activeCases || pastCases ? (
          <>
            {!isHighCourtUser && (
              <>
                {/**
                 * This should be a <caption> tag inside the table but
                 * Safari has a bug that doesn't allow that. See more
                 * https://stackoverflow.com/questions/49855899/solution-for-jumping-safari-table-caption
                 */}
                <SectionTitle>
                  {formatMessage(
                    isPrisonUser
                      ? m.activeRequests.prisonStaffUsers.title
                      : isPrisonAdminUser
                      ? m.activeRequests.prisonStaffUsers.prisonAdminTitle
                      : m.activeRequests.title,
                  )}
                </SectionTitle>
                <Box marginBottom={[5, 5, 12]}>
                  {activeCases && activeCases.length > 0 ? (
                    isPrisonUser || isPrisonAdminUser ? (
                      <PastCases
                        cases={activeCases}
                        onRowClick={handleRowClick}
                        isHighCourtUser={false}
                      />
                    ) : (
                      <ActiveCases
                        cases={activeCases}
                        onRowClick={handleRowClick}
                        isDeletingCase={
                          isTransitioningCase || isSendingNotification
                        }
                        onDeleteCase={deleteCase}
                        setActiveCases={setActiveCases}
                      />
                    )
                  ) : (
                    <div className={styles.infoContainer}>
                      <AlertMessage
                        title={formatMessage(
                          isPrisonUser || isPrisonAdminUser
                            ? m.activeRequests.prisonStaffUsers
                                .infoContainerTitle
                            : m.activeRequests.infoContainerTitle,
                        )}
                        message={formatMessage(
                          isPrisonUser || isPrisonAdminUser
                            ? m.activeRequests.prisonStaffUsers
                                .infoContainerText
                            : m.activeRequests.infoContainerText,
                        )}
                        type="info"
                      />
                    </div>
                  )}
                </Box>
              </>
            )}
            {/**
             * This should be a <caption> tag inside the table but
             * Safari has a bug that doesn't allow that. See more
             * https://stackoverflow.com/questions/49855899/solution-for-jumping-safari-table-caption
             */}
            <SectionTitle>
              {formatMessage(
                isHighCourtUser
                  ? m.pastRequests.highCourtUsers.title
                  : isPrisonUser
                  ? m.pastRequests.prisonStaffUsers.title
                  : isPrisonAdminUser
                  ? m.pastRequests.prisonStaffUsers.prisonAdminTitle
                  : m.pastRequests.title,
              )}
            </SectionTitle>
            {pastCases && pastCases.length > 0 ? (
              <PastCases
                cases={pastCases}
                onRowClick={handleRowClick}
                isHighCourtUser={isHighCourtUser}
              />
            ) : (
              <div className={styles.infoContainer}>
                <AlertMessage
                  title={formatMessage(
                    isPrisonAdminUser || isPrisonUser
                      ? m.activeRequests.prisonStaffUsers.infoContainerTitle
                      : m.pastRequests.infoContainerTitle,
                  )}
                  message={formatMessage(
                    isPrisonAdminUser || isPrisonUser
                      ? m.activeRequests.prisonStaffUsers.infoContainerText
                      : m.pastRequests.infoContainerText,
                  )}
                  type="info"
                />
              </div>
            )}
          </>
        ) : error ? (
          <div
            className={styles.infoContainer}
            data-testid="custody-requests-error"
          >
            <AlertMessage
              title="Ekki tókst að sækja gögn úr gagnagrunni"
              message="Ekki tókst að ná sambandi við gagnagrunn. Málið hefur verið skráð og viðeigandi aðilar látnir vita. Vinsamlega reynið aftur síðar."
              type="error"
            />
          </div>
        ) : null}
      </Box>
    </Box>
  )
}

export default Cases
