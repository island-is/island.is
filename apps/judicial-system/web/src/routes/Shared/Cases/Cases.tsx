import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import partition from 'lodash/partition'

import { AlertMessage, Box, Select } from '@island.is/island-ui/core'
import {
  DropdownMenu,
  Logo,
  SectionHeading,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import {
  CaseState,
  CaseTransition,
  Feature,
  isIndictmentCase,
  completedCaseStates,
} from '@island.is/judicial-system/types'
import { CasesQuery } from '@island.is/judicial-system-web/src/utils/mutations'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { TempCaseListEntry as CaseListEntry } from '@island.is/judicial-system-web/src/types'
import { core, titles } from '@island.is/judicial-system-web/messages'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import { capitalize } from '@island.is/judicial-system/formatters'
import { FeatureContext } from '@island.is/judicial-system-web/src/components/FeatureProvider/FeatureProvider'
import {
  InstitutionType,
  User,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import SharedPageLayout from '@island.is/judicial-system-web/src/components/SharedPageLayout/SharedPageLayout'
import * as constants from '@island.is/judicial-system/consts'

import ActiveCases from './ActiveCases'
import PastCases from './PastCases'
import TableSkeleton from './TableSkeleton'
import { FilterOption, useFilter } from './useFilter'
import { cases as m } from './Cases.strings'
import * as styles from './Cases.css'

const CreateCaseButton: React.FC<{
  features: Feature[]
  user: User
}> = ({ features, user }) => {
  const { formatMessage } = useIntl()

  const items = useMemo(() => {
    if (user.role === UserRole.Representative) {
      return [
        {
          href: constants.CREATE_INDICTMENT_ROUTE,
          title: capitalize(formatMessage(core.indictment)),
        },
      ]
    }

    if (user.role === UserRole.Prosecutor) {
      return [
        {
          href: constants.CREATE_INDICTMENT_ROUTE,
          title: capitalize(formatMessage(core.indictment)),
        },
        {
          href: constants.CREATE_RESTRICTION_CASE_ROUTE,
          title: capitalize(formatMessage(core.restrictionCase)),
        },
        {
          href: constants.CREATE_TRAVEL_BAN_ROUTE,
          title: capitalize(formatMessage(core.travelBan)),
        },
        {
          href: constants.CREATE_INVESTIGATION_CASE_ROUTE,
          title: capitalize(formatMessage(core.investigationCase)),
        },
      ]
    }

    return []
  }, [formatMessage, user?.role])

  // TODO Remove prosecutor office id check when indictments are ready
  const itemsFiltered = useMemo(() => {
    if (
      features.includes(Feature.INDICTMENTS) ||
      user.name === 'Ásmundur Jónsson' ||
      [
        '1c45b4c5-e5d3-45ba-96f8-219568982268', // Lögreglustjórinn á Austurlandi
        '26136a67-c3d6-4b73-82e2-3265669a36d3', // Lögreglustjórinn á Suðurlandi
        'a4b204f3-b072-41b6-853c-42ec4b263bd6', // Lögreglustjórinn á Norðurlandi eystra
        '53581d7b-0591-45e5-9cbe-c96b2f82da85', // Lögreglustjórinn á höfuðborgarsvæðinu
      ].includes(user.institution?.id ?? '')
    ) {
      return items
    }

    return items.filter(
      (item) => item.href !== constants.CREATE_INDICTMENT_ROUTE,
    )
  }, [features, user, items])

  return (
    <Box display={['none', 'none', 'block']}>
      <DropdownMenu
        dataTestId="createCaseDropdown"
        menuLabel="Tegund kröfu"
        icon="add"
        items={itemsFiltered}
        title={formatMessage(m.createCaseButton)}
      />
    </Box>
  )
}

// Credit for sorting solution: https://www.smashingmagazine.com/2020/03/sortable-tables-react/
export const Cases: React.FC = () => {
  const { formatMessage } = useIntl()
  const { user } = useContext(UserContext)
  const { features } = useContext(FeatureContext)
  const [isFiltering, setIsFiltering] = useState<boolean>(false)

  const isProsecutor = user?.role === UserRole.Prosecutor
  const isRepresentative = user?.role === UserRole.Representative
  const isHighCourtUser = user?.institution?.type === InstitutionType.HighCourt
  const isPrisonAdminUser =
    user?.institution?.type === InstitutionType.PrisonAdmin
  const isPrisonUser = user?.institution?.type === InstitutionType.Prison

  const {
    transitionCase,
    isTransitioningCase,
    isSendingNotification,
    getCaseToOpen,
  } = useCase()

  const { data, error, loading, refetch } = useQuery<{
    cases?: CaseListEntry[]
  }>(CasesQuery, {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      setIsFiltering(false)
    }, 250)

    return () => {
      clearTimeout(loadingTimeout)
    }
  }, [isFiltering])

  const resCases = data?.cases

  const [allActiveCases, allPastCases]: [
    CaseListEntry[],
    CaseListEntry[],
  ] = useMemo(() => {
    if (!resCases) {
      return [[], []]
    }

    const casesWithoutDeleted = resCases.filter((c: CaseListEntry) => {
      return c.state !== CaseState.DELETED
    })

    return partition(casesWithoutDeleted, (c) => {
      if (isIndictmentCase(c.type)) {
        return !completedCaseStates.includes(c.state)
      } else if (isPrisonAdminUser || isPrisonUser) {
        return !c.isValidToDateInThePast
      } else {
        return !(completedCaseStates.includes(c.state) && c.rulingDate)
      }
    })
  }, [resCases, isPrisonAdminUser, isPrisonUser])

  const {
    filter,
    setFilter,
    options: filterOptions,
    activeCases,
    pastCases,
  } = useFilter(allActiveCases, allPastCases, user)

  const deleteCase = async (caseToDelete: CaseListEntry) => {
    if (
      caseToDelete.state === CaseState.NEW ||
      caseToDelete.state === CaseState.DRAFT ||
      caseToDelete.state === CaseState.SUBMITTED ||
      caseToDelete.state === CaseState.RECEIVED
    ) {
      await transitionCase(caseToDelete.id, CaseTransition.DELETE)
      refetch()
    }
  }

  const handleRowClick = (id: string) => {
    getCaseToOpen({
      variables: { input: { id } },
    })
  }

  return (
    <SharedPageLayout>
      <PageHeader title={formatMessage(titles.shared.cases)} />
      <div className={styles.logoContainer}>
        <Logo />
        {isProsecutor || isRepresentative ? (
          <CreateCaseButton user={user} features={features} />
        ) : null}
      </div>
      {user?.role !== UserRole.Staff && (
        <Box marginBottom={[2, 5, 5]} className={styles.filterContainer}>
          <Select
            name="filter-cases"
            options={filterOptions}
            label={formatMessage(m.filter.label)}
            onChange={(value) => {
              setIsFiltering(true)
              setFilter(value as FilterOption)
            }}
            value={filter}
          />
        </Box>
      )}
      {error ? (
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
      ) : loading || isFiltering || !user ? (
        <TableSkeleton />
      ) : (
        !isHighCourtUser && (
          <>
            <SectionHeading
              title={formatMessage(
                isPrisonUser
                  ? m.activeRequests.prisonStaffUsers.title
                  : isPrisonAdminUser
                  ? m.activeRequests.prisonStaffUsers.prisonAdminTitle
                  : m.activeRequests.title,
              )}
            />
            <Box marginBottom={[5, 5, 12]}>
              {activeCases.length > 0 ? (
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
                  />
                )
              ) : (
                <div className={styles.infoContainer}>
                  <AlertMessage
                    type="info"
                    title={formatMessage(
                      isPrisonUser || isPrisonAdminUser
                        ? m.activeRequests.prisonStaffUsers.infoContainerTitle
                        : m.activeRequests.infoContainerTitle,
                    )}
                    message={formatMessage(
                      isPrisonUser || isPrisonAdminUser
                        ? m.activeRequests.prisonStaffUsers.infoContainerText
                        : m.activeRequests.infoContainerText,
                    )}
                  />
                </div>
              )}
            </Box>
          </>
        )
      )}
      <SectionHeading
        title={formatMessage(
          isHighCourtUser
            ? m.pastRequests.highCourtUsers.title
            : isPrisonUser
            ? m.pastRequests.prisonStaffUsers.title
            : isPrisonAdminUser
            ? m.pastRequests.prisonStaffUsers.prisonAdminTitle
            : m.pastRequests.title,
        )}
      />
      {pastCases.length > 0 ? (
        <PastCases
          cases={pastCases}
          onRowClick={handleRowClick}
          isHighCourtUser={isHighCourtUser}
        />
      ) : (
        <div className={styles.infoContainer}>
          <AlertMessage
            type="info"
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
          />
        </div>
      )}
    </SharedPageLayout>
  )
}

export default Cases
