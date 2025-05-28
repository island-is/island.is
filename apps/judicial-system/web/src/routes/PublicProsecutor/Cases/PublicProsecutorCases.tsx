import { FC, useMemo } from 'react'
import { useIntl } from 'react-intl'

import { AlertMessage } from '@island.is/island-ui/core'
import { isCompletedCase } from '@island.is/judicial-system/types'
import { errors, titles } from '@island.is/judicial-system-web/messages'
import {
  CasesLayout,
  Logo,
  PageHeader,
} from '@island.is/judicial-system-web/src/components'
import {
  CaseIndictmentRulingDecision,
  CaseListEntry,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { useCasesQuery } from '../../Shared/Cases/cases.generated'
import CasesForReview from '../Tables/CasesForReview'
import CasesReviewComplete from '../Tables/CasesReviewed'
import * as styles from '../../Shared/Cases/Cases.css'

export const PublicProsecutorCases: FC = () => {
  const { formatMessage } = useIntl()

  const { data, error, loading } = useCasesQuery({
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const resCases = data?.cases

  const { casesForReview, reviewedCases } = useMemo(() => {
    return (resCases || []).reduce(
      (acc, c) => {
        if (
          c.state &&
          isCompletedCase(c.state) &&
          !c.indictmentReviewDecision &&
          c.indictmentRulingDecision &&
          [
            CaseIndictmentRulingDecision.RULING,
            CaseIndictmentRulingDecision.FINE,
          ].includes(c.indictmentRulingDecision)
        ) {
          acc.casesForReview.push(c)
        } else if (c.indictmentReviewDecision) {
          acc.reviewedCases.push(c)
        }
        return acc
      },
      { casesForReview: [], reviewedCases: [] } as {
        casesForReview: CaseListEntry[]
        reviewedCases: CaseListEntry[]
      },
    )
  }, [resCases])

  return (
    <CasesLayout>
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
        <>
          <CasesForReview cases={casesForReview} loading={loading} />
          <CasesReviewComplete cases={reviewedCases} loading={loading} />
        </>
      )}
    </CasesLayout>
  )
}

export default PublicProsecutorCases
