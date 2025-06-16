import { FC, useContext, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'

import { AlertMessage, Box, Select } from '@island.is/island-ui/core'
import {
  isCompletedCase,
  isDistrictCourtUser,
  isIndictmentCase,
  isProsecutionUser,
  isPublicProsecutionUser,
  isRequestCase,
} from '@island.is/judicial-system/types'
import { errors, titles } from '@island.is/judicial-system-web/messages'
import {
  CasesLayout,
  Logo,
  Modal,
  PageHeader,
  SectionHeading,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { PastCasesTable } from '@island.is/judicial-system-web/src/components/Table'
import { TableWrapper } from '@island.is/judicial-system-web/src/components/Table/Table'
import {
  CaseIndictmentRulingDecision,
  CaseListEntry,
  CaseState,
  CaseTransition,
  EventType,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'

import CasesAwaitingAssignmentTable from '../../Court/components/CasesAwaitingAssignmentTable/CasesAwaitingAssignmentTable'
import CasesInProgressTable from '../../Court/components/CasesInProgressTable/CasesInProgressTable'
import CasesAwaitingConfirmationTable from '../../Prosecutor/components/CasesAwaitingConfirmationTable/CasesAwaitingConfirmationTable'
import CasesAwaitingReview from '../../PublicProsecutor/Tables/CasesAwaitingReview'
import { CreateCaseButton } from '../CreateCaseButton/CreateCaseButton'
import ActiveCases from './ActiveCases'
import { useCasesQuery } from './cases.generated'
import { FilterOption, useFilter } from './useFilter'
import { cases as m } from './Cases.strings'
import * as styles from './Cases.css'

export const Cases: FC = () => {
  const { formatMessage } = useIntl()
  const { user } = useContext(UserContext)
  const { transitionCase, isTransitioningCase, isSendingNotification } =
    useCase()

  const [isFiltering, setIsFiltering] = useState<boolean>(false)
  const [modalVisible, setVisibleModal] = useState<string>()

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

  const [
    casesAwaitingConfirmation,
    allActiveCases,
    allPastCases,
    casesAwaitingAssignment,
    casesAwaitingReview,
  ] = useMemo(() => {
    if (!resCases) {
      return [[], [], [], [], []]
    }

    const filterCases = (predicate: (c: CaseListEntry) => boolean) =>
      resCases.filter(predicate)

    const casesAwaitingConfirmation = filterCases(
      (c) => c.state === CaseState.WAITING_FOR_CONFIRMATION,
    )

    const casesAwaitingAssignment = filterCases(
      (c) =>
        isIndictmentCase(c.type) &&
        (c.state === CaseState.SUBMITTED || c.state === CaseState.RECEIVED) &&
        !c.judge,
    )

    const casesAwaitingReview = filterCases(
      (c) =>
        c.indictmentReviewer?.id === user?.id && !c.indictmentReviewDecision,
    )

    const activeCases = filterCases((c) => {
      if (
        c.state === CaseState.DELETED ||
        c.state === CaseState.WAITING_FOR_CONFIRMATION ||
        (isDistrictCourtUser(user) && casesAwaitingAssignment.includes(c))
      ) {
        return false
      }

      if (isDistrictCourtUser(user)) {
        if (isIndictmentCase(c.type)) {
          const sentToPublicProsecutor = c.eventLogs?.some(
            (log) =>
              log.eventType === EventType.INDICTMENT_SENT_TO_PUBLIC_PROSECUTOR,
          )
          const isFineOrRuling =
            c.indictmentRulingDecision === CaseIndictmentRulingDecision.FINE ||
            c.indictmentRulingDecision === CaseIndictmentRulingDecision.RULING

          return (
            !isCompletedCase(c.state) ||
            (isFineOrRuling && !sentToPublicProsecutor)
          )
        } else {
          return !(
            isCompletedCase(c.state) &&
            (c.rulingSignatureDate || c.isCompletedWithoutRuling)
          )
        }
      }

      if (isProsecutionUser(user)) {
        if (isIndictmentCase(c.type)) {
          return !(
            isCompletedCase(c.state) ||
            c.state === CaseState.WAITING_FOR_CANCELLATION
          )
        } else {
          return !isCompletedCase(c.state)
        }
      }

      // This component is only used for prosecution and district court users
      return false
    })

    const pastCases = filterCases(
      (c) =>
        !activeCases.includes(c) &&
        !casesAwaitingAssignment.includes(c) &&
        !casesAwaitingReview.includes(c) &&
        !casesAwaitingConfirmation.includes(c),
    )

    return [
      casesAwaitingConfirmation as CaseListEntry[],
      activeCases as CaseListEntry[],
      pastCases as CaseListEntry[],
      casesAwaitingAssignment as CaseListEntry[],
      casesAwaitingReview as CaseListEntry[],
    ]
  }, [resCases, user])

  const {
    filter,
    setFilter,
    options: filterOptions,
    activeCases,
    pastCases,
  } = useFilter(allActiveCases, allPastCases, user)

  const canDeleteCase = (caseToDelete: CaseListEntry) =>
    (isRequestCase(caseToDelete.type) &&
      (caseToDelete.state === CaseState.NEW ||
        caseToDelete.state === CaseState.DRAFT ||
        caseToDelete.state === CaseState.SUBMITTED ||
        caseToDelete.state === CaseState.RECEIVED)) ||
    (isIndictmentCase(caseToDelete.type) &&
      (caseToDelete.state === CaseState.DRAFT ||
        caseToDelete.state === CaseState.WAITING_FOR_CONFIRMATION))

  const deleteCase = async (caseToDelete: CaseListEntry) => {
    if (canDeleteCase(caseToDelete)) {
      await transitionCase(caseToDelete.id, CaseTransition.DELETE)

      refetch()
    }
  }

  const handlePrimaryButtonClick = async () => {
    const caseToDelete = [...allActiveCases, ...casesAwaitingConfirmation].find(
      (c) => c.id === modalVisible,
    )

    if (!caseToDelete) {
      return
    }

    await deleteCase(caseToDelete)

    setVisibleModal(undefined)
  }

  const handleSecondaryButtonClick = () => {
    setVisibleModal(undefined)
  }

  return (
    <>
      <CasesLayout>
        <PageHeader title={formatMessage(titles.shared.cases)} />
        <div className={styles.logoContainer}>
          <Logo />
          {isProsecutionUser(user) ? <CreateCaseButton /> : null}
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
                {filter.value !== 'INVESTIGATION' && (
                  <>
                    <CasesAwaitingConfirmationTable
                      loading={loading}
                      isFiltering={isFiltering}
                      cases={casesAwaitingConfirmation}
                      onContextMenuDeleteClick={setVisibleModal}
                      canDeleteCase={canDeleteCase}
                    />
                    {isPublicProsecutionUser(user) && (
                      <CasesAwaitingReview
                        loading={loading}
                        cases={casesAwaitingReview}
                      />
                    )}
                  </>
                )}
                <section>
                  <SectionHeading
                    title={formatMessage(m.activeRequests.title)}
                  />
                  <TableWrapper loading={loading || isFiltering}>
                    {activeCases.length > 0 ? (
                      <ActiveCases
                        cases={activeCases}
                        onContextMenuDeleteClick={setVisibleModal}
                        canDeleteCase={canDeleteCase}
                      />
                    ) : (
                      <div className={styles.infoContainer}>
                        <AlertMessage
                          type="info"
                          title={formatMessage(
                            m.activeRequests.infoContainerTitle,
                          )}
                          message={formatMessage(
                            m.activeRequests.infoContainerText,
                          )}
                        />
                      </div>
                    )}
                  </TableWrapper>
                </section>
              </>
            )}
            {isDistrictCourtUser(user) && (
              <>
                {filter.value !== 'INVESTIGATION' && (
                  <CasesAwaitingAssignmentTable
                    cases={casesAwaitingAssignment}
                    loading={loading || isFiltering}
                    isFiltering={isFiltering}
                  />
                )}
                <CasesInProgressTable
                  loading={loading}
                  isFiltering={isFiltering}
                  cases={activeCases}
                  refetch={refetch}
                />
              </>
            )}
            {loading || pastCases.length > 0 ? (
              <PastCasesTable
                cases={pastCases}
                loading={loading}
                isFiltering={isFiltering}
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
      </CasesLayout>
      {modalVisible !== undefined && (
        <Modal
          title={formatMessage(m.activeRequests.deleteCaseModal.title)}
          text={formatMessage(m.activeRequests.deleteCaseModal.text)}
          onPrimaryButtonClick={handlePrimaryButtonClick}
          onSecondaryButtonClick={handleSecondaryButtonClick}
          primaryButtonText={formatMessage(
            m.activeRequests.deleteCaseModal.primaryButtonText,
          )}
          primaryButtonColorScheme="destructive"
          secondaryButtonText={formatMessage(
            m.activeRequests.deleteCaseModal.secondaryButtonText,
          )}
          isPrimaryButtonLoading={isTransitioningCase || isSendingNotification}
        />
      )}
    </>
  )
}

export default Cases
