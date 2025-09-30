import { AlertMessage, Box, Icon, Stack, Text} from '@island.is/island-ui/core'
import {
  CardLoader,
  IntroWrapper,
  m as coreMessages,
  RIKISLOGREGLUSTJORI_SLUG,
  InfoLineStack,
  InfoLine,
  formatDate,
} from '@island.is/portals/my-pages/core'
import { messages } from '../../lib/messages'
import { FormatMessage, useLocale, useNamespaces } from '@island.is/localization'
import { Problem } from '@island.is/react-spa/shared'
import { useGetPoliceCaseDetailQuery } from './PoliceCaseDetail.generated'
import { messages as m } from '../../lib/messages'
import { useParams } from 'react-router-dom'
import Timeline from '../../components/Timeline/Timeline'
import { LawAndOrderPoliceCase, LawAndOrderPoliceCaseStatusValueGroup } from '@island.is/api/schema'

const POLICE_CASE_STATUS_TIMELINE_MILESTONES = [
  { group: LawAndOrderPoliceCaseStatusValueGroup.POLICE_ANALYSIS, label: m.analysis },
  { group: LawAndOrderPoliceCaseStatusValueGroup.CRIMINAL_INVESTIGATION, label: m.investigation },
  { group: LawAndOrderPoliceCaseStatusValueGroup.POST_INVESTIGATION, label: m.investigationFinished },
  { group: LawAndOrderPoliceCaseStatusValueGroup.INDICTMENT, label: m.indictment },
  { group: LawAndOrderPoliceCaseStatusValueGroup.SENT_TO_COURT, label: m.caseForwarded }

]

const generateTimeline = (data: LawAndOrderPoliceCase, formatMessage: FormatMessage): React.ReactNode | null => {
  const { status, received, modified } = data
  const currentProgress = POLICE_CASE_STATUS_TIMELINE_MILESTONES.findIndex(m => m.group === status?.statusGroup)

  if (currentProgress < 0) {
    return null
  }

  const receivedDate: string | undefined = received ? formatDate(data.received) : undefined
  const mostRecentDate: string | undefined = modified ? formatDate(data.modified): undefined

  const milestones = POLICE_CASE_STATUS_TIMELINE_MILESTONES.map((milestone, index) => {
    if (index === 0 && receivedDate) {
      return <Stack key={index} space={0}><Text variant="small" fontWeight='medium'>{formatMessage(milestone.label)}</Text><Text variant="small">{receivedDate}</Text></Stack>
    }
    if (index === currentProgress && mostRecentDate) {
      return <Stack key={index} space={0}><Text variant="small" fontWeight='medium'>{formatMessage(milestone.label)}</Text><Text variant="small">{mostRecentDate}</Text></Stack>
    }
    return <Text variant="small" fontWeight='medium'>{formatMessage(milestone.label)}</Text>
  })

  if (milestones.length > 0) {
    return (
      <Timeline title={formatMessage(m.timeline)} progress={currentProgress}>
        {milestones}
      </Timeline>
    )
  }
  return null
}

type UseParams = {
  id: string
}

const PoliceCaseDetail = () => {
  useNamespaces('sp.law-and-order')
  const { formatMessage } = useLocale()
  const { id } = useParams() as UseParams

  const { data, loading, error } = useGetPoliceCaseDetailQuery({
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

  const policeCaseNumber = id

  const timeline = policeCase ? generateTimeline(policeCase, formatMessage) : null
  const {headerDisplayString , descriptionDisplayString} = policeCase?.status ?? {}

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

      <Stack space={3}>
        {timeline}
        {headerDisplayString &&
          descriptionDisplayString &&
          policeCase?.modified &&
          <AlertMessage type="info" title={`${formatMessage(m.updated)}: ${formatDate(policeCase.modified)} - ${headerDisplayString}`} message={policeCase?.status?.descriptionDisplayString} />}
        <InfoLineStack>
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
            label={m.receivedDate}
            content={formatDate(policeCase?.received)}
          />
          <InfoLine
            loading={loading}
            label={m.contact}
            content={policeCase?.contact ?? ''}
          />
          <InfoLine
            loading={loading}
            label={m.legalAdvisor}
            content={policeCase?.courtAdvocate ?? ''}
          />
          {policeCase?.status?.headerDisplayString &&
            <InfoLine
              loading={loading}
              label={m.caseStatus}
              content={
                <Box display="flex"
                alignItems="center"
                justifyContent="center" >
                  <Box marginRight={1}><Icon icon="checkmarkCircle" color="blue400" type="filled" /></Box>
                  <Text variant="small" fontWeight='medium'>{policeCase.status.headerDisplayString}</Text>
              </Box>
          } />}
        </InfoLineStack>
      </Stack>
    </>
  )
}
export default PoliceCaseDetail
