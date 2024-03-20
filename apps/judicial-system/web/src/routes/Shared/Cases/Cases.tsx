import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence, motion } from 'framer-motion'

import { AlertMessage, Box, Select } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { capitalize } from '@island.is/judicial-system/formatters'
import {
  isCompletedCase,
  isDistrictCourtUser,
  isIndictmentCase,
  isProsecutionUser,
} from '@island.is/judicial-system/types'
import {
  core,
  errors,
  tables,
  titles,
} from '@island.is/judicial-system-web/messages'
import {
  ContextMenu,
  Logo,
  PageHeader,
  SectionHeading,
  SharedPageLayout,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import {
  PastCasesTable,
  TableSkeleton,
} from '@island.is/judicial-system-web/src/components/Table'
import {
  CaseListEntry,
  CaseState,
  CaseTransition,
  User,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'

import ActiveCases from './ActiveCases'
import { useCasesQuery } from './cases.generated'
import { FilterOption, useFilter } from './useFilter'
import { cases as m } from './Cases.strings'
import * as styles from './Cases.css'

const CreateCaseButton: React.FC<
  React.PropsWithChildren<{
    user: User
  }>
> = ({ user }) => {
  const { formatMessage } = useIntl()

  const items = useMemo(() => {
    if (user.role === UserRole.PROSECUTOR_REPRESENTATIVE) {
      return [
        {
          href: constants.CREATE_INDICTMENT_ROUTE,
          title: capitalize(formatMessage(core.indictment)),
        },
      ]
    } else if (user.role === UserRole.PROSECUTOR) {
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
    } else {
      return []
    }
  }, [formatMessage, user?.role])

  return (
    <Box marginTop={[2, 2, 0]}>
      <ContextMenu
        dataTestId="createCaseDropdown"
        menuLabel="Tegund kröfu"
        items={items}
        title={formatMessage(m.createCaseButton)}
        offset={[0, 8]}
      />
    </Box>
  )
}

export const Cases: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { formatMessage } = useIntl()
  const { user } = useContext(UserContext)
  const [isFiltering, setIsFiltering] = useState<boolean>(false)

  const { transitionCase, isTransitioningCase, isSendingNotification } =
    useCase()

  const { data, error, loading, refetch } = useCasesQuery({
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const resCases = data?.cases

  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      setIsFiltering(false)
    }, 250)

    return () => {
      clearTimeout(loadingTimeout)
    }
  }, [isFiltering])

  const [casesAwaitingConfirmation, allActiveCases, allPastCases] =
    useMemo(() => {
      if (!resCases) {
        return [[], [], []]
      }

      const filterCases = (predicate: (c: CaseListEntry) => boolean) =>
        resCases.filter(predicate)

      const casesAwaitingConfirmation = filterCases(
        (c) => c.state === CaseState.WAITING_FOR_CONFIRMATION,
      )

      const activeCases = filterCases((c) => {
        if (
          c.state === CaseState.DELETED ||
          c.state === CaseState.WAITING_FOR_CONFIRMATION
        ) {
          return false
        }
        if (isIndictmentCase(c.type) || !isDistrictCourtUser(user)) {
          return !isCompletedCase(c.state)
        } else {
          return !(isCompletedCase(c.state) && c.rulingSignatureDate)
        }
      })

      const pastCases = filterCases((c) => !activeCases.includes(c))

      return [
        casesAwaitingConfirmation as CaseListEntry[],
        activeCases as CaseListEntry[],
        pastCases as CaseListEntry[],
      ]
    }, [resCases, user])

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
      caseToDelete.state === CaseState.RECEIVED ||
      caseToDelete.state === CaseState.WAITING_FOR_CONFIRMATION
    ) {
      await transitionCase(caseToDelete.id, CaseTransition.DELETE)
      refetch()
    }
  }

  return (
    <SharedPageLayout>
      <PageHeader title={formatMessage(titles.shared.cases)} />
      <div className={styles.logoContainer}>
        <Logo />
        {user && isProsecutionUser(user) ? (
          <CreateCaseButton user={user} />
        ) : null}
      </div>
      <Box marginBottom={[2, 2, 5]} className={styles.filterContainer}>
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
      {error ? (
        <div
          className={styles.infoContainer}
          data-testid="custody-requests-error"
        >
          <AlertMessage
            title={formatMessage(errors.failedToFetchDataFromDbTitle)}
            message={formatMessage(errors.failedToFetchDataFromDbMessage)}
            type="error"
          />
        </div>
      ) : (
        <>
          {isProsecutionUser(user) && (
            <>
              <SectionHeading
                title={formatMessage(
                  m.activeRequests.casesAwaitingConfirmationTitle,
                )}
              />
              <AnimatePresence initial={false}>
                <Box marginBottom={[5, 5, 12]}>
                  {loading || isFiltering ? (
                    <TableSkeleton />
                  ) : casesAwaitingConfirmation.length > 0 ? (
                    <ActiveCases
                      cases={casesAwaitingConfirmation}
                      isDeletingCase={
                        isTransitioningCase || isSendingNotification
                      }
                      onDeleteCase={deleteCase}
                      caseState={CaseState.WAITING_FOR_CONFIRMATION}
                    />
                  ) : (
                    <motion.div
                      className={styles.infoContainer}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <AlertMessage
                        type="info"
                        title={formatMessage(
                          m.activeRequests
                            .casesAwaitingConfirmationInfoContainerTitle,
                        )}
                        message={formatMessage(
                          m.activeRequests
                            .casesAwaitingConfirmationInfoContainerText,
                        )}
                      />
                    </motion.div>
                  )}
                </Box>
              </AnimatePresence>
            </>
          )}
          <SectionHeading title={formatMessage(m.activeRequests.title)} />
          <Box marginBottom={[5, 5, 12]}>
            {loading || isFiltering ? (
              <TableSkeleton />
            ) : activeCases.length > 0 ? (
              <ActiveCases
                cases={activeCases}
                isDeletingCase={isTransitioningCase || isSendingNotification}
                onDeleteCase={deleteCase}
              />
            ) : (
              <div className={styles.infoContainer}>
                <AlertMessage
                  type="info"
                  title={formatMessage(m.activeRequests.infoContainerTitle)}
                  message={formatMessage(m.activeRequests.infoContainerText)}
                />
              </div>
            )}
          </Box>
          <SectionHeading title={formatMessage(tables.completedCasesTitle)} />
          {loading || pastCases.length > 0 ? (
            <PastCasesTable
              cases={pastCases}
              loading={loading || isFiltering}
              testid="pastCasesTable"
            />
          ) : (
            <div className={styles.infoContainer}>
              <AlertMessage
                type="info"
                title={formatMessage(m.pastRequests.infoContainerTitle)}
                message={formatMessage(m.pastRequests.infoContainerText)}
              />
            </div>
          )}
        </>
      )}
    </SharedPageLayout>
  )
}

export default Cases
