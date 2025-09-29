import { Box } from '@island.is/island-ui/core'
import {
  CardLoader,
  IntroWrapper,
  m as coreMessages,
  RIKISLOGREGLUSTJORI_SLUG,
  InfoLineStack,
  InfoLine,
} from '@island.is/portals/my-pages/core'
import { messages } from '../../lib/messages'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Problem } from '@island.is/react-spa/shared'
import { useGetPoliceCaseQuery } from './PoliceCase.generated'
import { messages as m } from '../../lib/messages'
import { useParams } from 'react-router-dom'

type UseParams = {
  id: string
}

const PoliceCaseDetail = () => {
  useNamespaces('sp.law-and-order')
  const { formatMessage } = useLocale()

  const { id } = useParams() as UseParams

  const { data, loading, error } = useGetPoliceCaseQuery({
    variables: {
      input: {
        caseNumber: id,
      },
    },
  })

  const policeCase = data?.lawAndOrderPoliceCase ?? null

  if (!loading && !error && !policeCase) {
    return (
      <Problem
        type="no_data"
        noBorder={false}
        title={formatMessage(coreMessages.noData)}
        message={formatMessage(coreMessages.noDataFoundDetail)}
        imgSrc="./assets/images/sofa.svg"
      />
    )
  }

  if (error && !loading) {
    return <Problem error={error} noBorder={false} />
  }

  const policeCaseNumber = policeCase?.number ?? ''

  return (
    <>
      <IntroWrapper
        title={formatMessage(m.policeCaseTitle, { arg: policeCaseNumber })}
        intro={messages.policeCasesDescription}
        serviceProviderSlug={RIKISLOGREGLUSTJORI_SLUG}
        serviceProviderTooltip={formatMessage(
          coreMessages.nationalPoliceCommissionerTooltip,
        )}
      />
      {loading && !error && (
        <Box width="full">
          <CardLoader />
        </Box>
      )}

      {error && !loading && <Problem error={error} noBorder={false} />}

      <InfoLineStack label={m.caseData}>
        <InfoLine
          loading={loading}
          label={m.caseNumber}
          content={policeCase?.number}
        />
        <InfoLine
          loading={loading}
          label={coreMessages.type}
          content={policeCase?.type ?? ''}
        />
        <InfoLine
          loading={loading}
          label={m.caseNumber}
          content={policeCase?.number}
        />
        <InfoLine
          loading={loading}
          label={m.receivedDate}
          content={policeCase?.received ?? ''}
        />
        <InfoLine
          loading={loading}
          label={m.contact}
          content={policeCase?.contact ?? ''}
        />
        <InfoLine
          loading={loading}
          label={m.receivedDate}
          content={policeCase?.received ?? ''}
        />
        <InfoLine
          loading={loading}
          label={m.legalAdvisor}
          content={policeCase?.courtAdvocate ?? ''}
        />
        <InfoLine
          loading={loading}
          label={m.caseStatus}
          content={policeCase?.status ?? ''}
        />
      </InfoLineStack>
    </>
  )
}
export default PoliceCaseDetail
