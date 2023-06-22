import React, { useContext, useMemo } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import partition from 'lodash/partition'

import { AlertMessage, Box } from '@island.is/island-ui/core'
import {
  Logo,
  SectionHeading,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import {
  CaseState,
  isIndictmentCase,
  completedCaseStates,
} from '@island.is/judicial-system/types'
import { CasesQuery } from '@island.is/judicial-system-web/src/utils/mutations'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { TempCaseListEntry as CaseListEntry } from '@island.is/judicial-system-web/src/types'
import { titles, errors } from '@island.is/judicial-system-web/messages'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'

import { InstitutionType } from '@island.is/judicial-system-web/src/graphql/schema'
import SharedPageLayout from '@island.is/judicial-system-web/src/components/SharedPageLayout/SharedPageLayout'
import PastCasesTable from '@island.is/judicial-system-web/src/components/Table/PastCasesTable/PastCasesTable'

import { useFilter } from './useFilter'
import { cases as m } from './Cases.strings'
import * as styles from './Cases.css'

export const PrisonCases: React.FC = () => {
  const { formatMessage } = useIntl()
  const { user } = useContext(UserContext)

  const isPrisonUser = user?.institution?.type === InstitutionType.PRISON

  const { getCaseToOpen } = useCase()

  const { data, error, loading } = useQuery<{
    cases?: CaseListEntry[]
  }>(CasesQuery, {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

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
      } else {
        return !c.isValidToDateInThePast
      }
    })
  }, [resCases])

  const { activeCases, pastCases } = useFilter(
    allActiveCases,
    allPastCases,
    user,
  )

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
      </div>

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
          <SectionHeading
            title={formatMessage(
              isPrisonUser
                ? m.activeRequests.prisonStaffUsers.title
                : m.activeRequests.prisonStaffUsers.prisonAdminTitle,
            )}
          />
          <Box marginBottom={[5, 5, 12]}>
            {loading || !user || activeCases.length > 0 ? (
              <PastCasesTable
                cases={activeCases}
                onRowClick={handleRowClick}
                loading={loading}
              />
            ) : (
              <div className={styles.infoContainer}>
                <AlertMessage
                  type="info"
                  title={formatMessage(
                    m.activeRequests.prisonStaffUsers.infoContainerTitle,
                  )}
                  message={formatMessage(
                    m.activeRequests.prisonStaffUsers.infoContainerText,
                  )}
                />
              </div>
            )}
          </Box>
        </>
      )}

      <SectionHeading
        title={formatMessage(
          isPrisonUser
            ? m.pastRequests.prisonStaffUsers.title
            : m.pastRequests.prisonStaffUsers.prisonAdminTitle,
        )}
      />

      {loading || pastCases.length > 0 ? (
        <PastCasesTable
          cases={pastCases}
          onRowClick={handleRowClick}
          loading={loading}
          testid="pastCasesTable"
        />
      ) : (
        <div className={styles.infoContainer}>
          <AlertMessage
            type="info"
            title={formatMessage(
              m.activeRequests.prisonStaffUsers.infoContainerTitle,
            )}
            message={formatMessage(
              m.activeRequests.prisonStaffUsers.infoContainerText,
            )}
          />
        </div>
      )}
    </SharedPageLayout>
  )
}

export default PrisonCases
