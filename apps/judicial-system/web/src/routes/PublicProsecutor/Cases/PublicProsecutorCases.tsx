import React, { useMemo } from 'react'
import { useIntl } from 'react-intl'

import { AlertMessage } from '@island.is/island-ui/core'
import { isCompletedCase } from '@island.is/judicial-system/types'
import { errors, titles } from '@island.is/judicial-system-web/messages'
import {
  Logo,
  PageHeader,
  SharedPageLayout,
} from '@island.is/judicial-system-web/src/components'

import { useCasesQuery } from '../../Shared/Cases/cases.generated'
import CasesForReview from '../Tables/CasesForReview'
import * as styles from '../../Shared/Cases/Cases.css'

export const PublicProsecutorCases: React.FC = () => {
  const { formatMessage } = useIntl()

  const { data, error, loading } = useCasesQuery({
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const resCases = data?.cases

  const casesForReview = useMemo(() => {
    return resCases?.filter((c) => c.state && isCompletedCase(c.state)) || []
  }, [resCases])

  return (
    <SharedPageLayout>
      <PageHeader title={formatMessage(titles.shared.cases)} />
      <div className={styles.logoContainer}>
        <Logo />
      </div>

      {error ? (
        <div className={styles.infoContainer}>
          <AlertMessage
            title={formatMessage(errors.failedToFetchDataFromDbTitle)}
            message={formatMessage(errors.failedToFetchDataFromDbMessage)}
            type="error"
          />
        </div>
      ) : (
        <CasesForReview cases={casesForReview} loading={loading} />
      )}
    </SharedPageLayout>
  )
}

export default PublicProsecutorCases
