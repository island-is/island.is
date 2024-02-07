import React, { useContext, useMemo } from 'react'
import { useIntl } from 'react-intl'
import partition from 'lodash/partition'

import { AlertMessage, Box } from '@island.is/island-ui/core'
import { errors, titles } from '@island.is/judicial-system-web/messages'
import {
  Logo,
  PageHeader,
  SectionHeading,
  SharedPageLayout,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { PastCasesTable } from '@island.is/judicial-system-web/src/components/Table'
import { InstitutionType } from '@island.is/judicial-system-web/src/graphql/schema'

import { usePrisonCasesQuery } from './prisonCases.generated'
import { cases as m } from './Cases.strings'
import * as styles from './Cases.css'

export const PrisonCases: React.FC = () => {
  const { formatMessage } = useIntl()
  const { user } = useContext(UserContext)

  const isPrisonUser = user?.institution?.type === InstitutionType.PRISON

  const { data, error, loading } = usePrisonCasesQuery({
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const resCases = data?.cases

  const [activeCases, pastCases] = useMemo(() => {
    if (!resCases) {
      return [[], []]
    }

    return partition(resCases, (c) => !c.isValidToDateInThePast)
  }, [resCases])

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
              <PastCasesTable cases={activeCases} loading={loading} />
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
