import { useLocale, useNamespaces } from '@island.is/localization'
import {
  DOMSMALARADUNEYTID_SLUG,
  IntroWrapper,
  m,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import InfoLines from '../../components/InfoLines/InfoLines'
import { messages } from '../../lib/messages'
import { useGetCourtCaseVerdictQuery } from './Verdict.generated'

type UseParams = {
  id: string
}

const CourtCaseDetail = () => {
  useNamespaces('sp.law-and-order')
  const { formatMessage, lang } = useLocale()

  const { id } = useParams() as UseParams

  const { data, loading, error, refetch } = useGetCourtCaseVerdictQuery({
    variables: {
      input: {
        caseId: id,
      },
      locale: lang,
    },
    skip: !id,
  })
  const verdict = data?.lawAndOrderVerdict

  useEffect(() => {
    refetch()
  }, [lang])

  return (
    <IntroWrapper
      loading={loading}
      title={
        verdict?.title ?? formatMessage(messages.courtCaseNumberNotRegistered)
      }
      intro={messages.courtCasesDescription}
      serviceProviderSlug={DOMSMALARADUNEYTID_SLUG}
      serviceProviderTooltip={formatMessage(m.domsmalaraduneytidTooltip)}
    >
      {error && !loading && <Problem error={error} noBorder={false} />}
      {!error && verdict && verdict?.groups && (
        <InfoLines groups={verdict?.groups} loading={loading} />
      )}

      {!loading && !error && verdict && verdict?.groups?.length === 0 && (
        <Problem
          type="no_data"
          noBorder={false}
          title={formatMessage(m.noData)}
          message={formatMessage(m.noDataFoundDetail)}
          imgSrc="./assets/images/sofa.svg"
        />
      )}
    </IntroWrapper>
  )
}
export default CourtCaseDetail
