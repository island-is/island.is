import {
  HistorySection,
  HistoryStepper,
  Stack,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import {
  IntroWrapper,
  m as coreMessages,
  RIKISLOGREGLUSTJORI_SLUG,
  InfoLineStack,
  InfoLine,
  formatDate,
  LinkButton,
  CardLoader,
} from '@island.is/portals/my-pages/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Problem } from '@island.is/react-spa/shared'
import { useGetPoliceCaseDetailQuery } from './PoliceCaseDetail.generated'
import { messages as m } from '../../lib/messages'
import { useParams } from 'react-router-dom'
import { Markdown } from '@island.is/shared/components'

type UseParams = {
  id: string
}

const PoliceCaseDetail = () => {
  useNamespaces('sp.law-and-order')
  const { formatMessage, locale } = useLocale()
  const { id: policeCaseNumber } = useParams() as UseParams

  const { data, loading, error } = useGetPoliceCaseDetailQuery({
    variables: {
      input: {
        caseNumber: policeCaseNumber,
      },
      locale,
    },
  })

  const policeCase = data?.lawAndOrderPoliceCase ?? null
  const currentCaseProgress = policeCase?.status?.timelineStep ?? -1
  return (
    <>
      <IntroWrapper
        title={formatMessage(m.policeCaseDetailTitle, {
          arg: policeCaseNumber,
        })}
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

      {!error && !loading && !policeCase && (
        <Problem
          type="no_data"
          noBorder={false}
          title={formatMessage(coreMessages.noData)}
          message={formatMessage(coreMessages.noDataFoundDetail)}
          imgSrc="./assets/images/nodata.svg"
        />
      )}
      <Stack space={3}>
        {!error && (loading || policeCase) && (
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
                policeCase?.status?.headerDisplayString ? (
                  <Tag variant="blue" outlined disabled>
                    {policeCase.status.headerDisplayString}
                  </Tag>
                ) : undefined
              }
              button={{
                type: 'link',
                to: formatMessage(m.caseStatusLinkUrl),
                label: m.caseStatusLink,
              }}
            />
            <InfoLine
              loading={loading}
              label={coreMessages.type}
              content={policeCase?.type ?? ''}
            />
          </InfoLineStack>
        )}
        {!error && loading && <CardLoader />}
        {!error &&
          !loading &&
          policeCase &&
          data?.lawAndOrderPoliceCaseTimelineStructure?.milestones && (
            <>
              <Text variant="eyebrow" color="purple600">
                {formatMessage(m.timeline)}
              </Text>
              <HistoryStepper
                sections={data?.lawAndOrderPoliceCaseTimelineStructure?.milestones.map(
                  ({ label, step }) => {
                    const isActiveStep = currentCaseProgress === step
                    const stepIsCompleted = step <= currentCaseProgress

                    const firstStepDate =
                      step === 1 && policeCase?.received
                        ? formatDate(policeCase.received)
                        : undefined
                    const lastActiveStepDate =
                      step === currentCaseProgress && policeCase?.modified
                        ? formatDate(policeCase.modified)
                        : undefined

                    const section = stepIsCompleted ? (
                      <Text lineHeight="lg" fontWeight="semiBold">
                        {formatMessage(label)}
                      </Text>
                    ) : (
                      <Text lineHeight="lg" color="foregroundPrimaryMinimal">
                        {formatMessage(label)}
                      </Text>
                    )
                    return (
                      <HistorySection
                        key={`milestone-${step}`}
                        section={formatMessage(label)}
                        customSection={section}
                        sectionIndex={step}
                        isComplete={stepIsCompleted}
                        description={
                          isActiveStep &&
                          policeCase?.status?.descriptionDisplayString ? (
                            <Markdown>
                              {policeCase?.status?.descriptionDisplayString}
                            </Markdown>
                          ) : undefined
                        }
                        date={firstStepDate ?? lastActiveStepDate}
                        forceRightAlignedDate
                      />
                    )
                  },
                )}
              />
            </>
          )}
      </Stack>
    </>
  )
}
export default PoliceCaseDetail
