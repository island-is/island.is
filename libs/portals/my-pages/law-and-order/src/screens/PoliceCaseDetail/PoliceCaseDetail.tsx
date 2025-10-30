import { Box, HistorySection, HistoryStepper, Stack, Tag, Text } from '@island.is/island-ui/core'
import {
  CardLoader,
  IntroWrapper,
  m as coreMessages,
  RIKISLOGREGLUSTJORI_SLUG,
  InfoLineStack,
  InfoLine,
  formatDate,
  LinkButton,
} from '@island.is/portals/my-pages/core'
import {
  useLocale,
  useNamespaces,
} from '@island.is/localization'
import { Problem } from '@island.is/react-spa/shared'
import { useGetPoliceCaseDetailQuery } from './PoliceCaseDetail.generated'
import { messages as m } from '../../lib/messages'
import { useParams } from 'react-router-dom'
import { LawAndOrderPoliceCaseStatusValueGroup } from '@island.is/api/schema'

const POLICE_CASE_STATUS_TIMELINE_MILESTONES = [
  {
    group: LawAndOrderPoliceCaseStatusValueGroup.POLICE_ANALYSIS,
    label: m.analysis,
  },
  {
    group: LawAndOrderPoliceCaseStatusValueGroup.CRIMINAL_INVESTIGATION,
    label: m.investigation,
  },
  {
    group: LawAndOrderPoliceCaseStatusValueGroup.POST_INVESTIGATION,
    label: m.investigationFinished,
  },
  {
    group: LawAndOrderPoliceCaseStatusValueGroup.INDICTMENT,
    label: m.indictment,
  },
  {
    group: LawAndOrderPoliceCaseStatusValueGroup.SENT_TO_COURT,
    label: m.caseForwarded,
  },
]

type UseParams = {
  id: string
}

const PoliceCaseDetail = () => {
  useNamespaces('sp.law-and-order')
  const { formatMessage } = useLocale()
  const { id: policeCaseNumber } = useParams() as UseParams

  const { data, loading, error } = useGetPoliceCaseDetailQuery({
    variables: {
      input: {
        caseNumber: policeCaseNumber,
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

  const currentCaseProgress = POLICE_CASE_STATUS_TIMELINE_MILESTONES.findIndex(milestone => milestone.group === policeCase?.status?.statusGroup) ?? -1
  return (
    <>
      <IntroWrapper
        title={formatMessage(m.policeCaseDetailTitle, { arg: policeCaseNumber })}
        intro={m.policeCaseDetailDescription}
        serviceProviderSlug={RIKISLOGREGLUSTJORI_SLUG}
        serviceProviderTooltip={formatMessage(
          coreMessages.nationalPoliceCommissionerTooltip,
        )}
        buttonGroup={[
          <LinkButton
            key="detail-link-button-1"
            to={formatMessage(m.policeCasesDetailHeaderLinkButton1Url)}
            text={formatMessage(m.policeCasesDetailHeaderLinkButton1Text)}
            icon="open"
            variant="utility"
          />,
          <LinkButton
            key="detail-link-button-2"
            to={formatMessage(m.policeCasesDetailHeaderLinkButton2Url)}
            text={formatMessage(m.policeCasesDetailHeaderLinkButton2Text)}
            icon="open"
            variant="utility"
          />,
        ]}
      />
      {error && !loading && <Problem error={error} noBorder={false} />}

      <Stack space={3}>
        <InfoLineStack label={formatMessage(m.caseInformation)}>
          <InfoLine
            loading={loading}
            label={m.caseNumber}
            content={policeCase?.number}
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
          <InfoLine
            loading={loading}
            label={m.caseStatus}
            content={
              policeCase?.status?.headerDisplayString ?
                <Tag variant="blue" outlined disabled>{policeCase.status.headerDisplayString}</Tag>  : undefined}
          />
          <InfoLine
            loading={loading}
            label={coreMessages.type}
            content={policeCase?.type ?? ''}
          />
        </InfoLineStack>
        <Text variant='eyebrow' color='purple600'>Ferill</Text>
        <HistoryStepper
          sections={POLICE_CASE_STATUS_TIMELINE_MILESTONES.map(({label}, index) => {
          const shouldDisplayText = currentCaseProgress === index;
          const isComplete = index <= currentCaseProgress
          const section = isComplete ? <Text lineHeight='lg' fontWeight='semiBold'>{formatMessage(label)}</Text> : <Text lineHeight='lg' color="foregroundPrimaryMinimal">{formatMessage(label)}</Text>
          return (
            <HistorySection
              key={`milestone-${index}`}
              section={formatMessage(label)}
              customSection={section}
              sectionIndex={index}
              isComplete={isComplete}
              isLast={index === POLICE_CASE_STATUS_TIMELINE_MILESTONES.length - 1}
              description={shouldDisplayText ? <Text>Lorem ipsum dolor sit amet</Text> : undefined}
              date={isComplete && policeCase?.modified ? formatDate(policeCase.modified): undefined}
              forceRightAlignedDate
            />
            )
          })}
          />
      </Stack>
    </>
  )
}
export default PoliceCaseDetail
