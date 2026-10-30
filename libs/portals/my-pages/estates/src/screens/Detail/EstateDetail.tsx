import { ReactNode } from 'react'
import { useParams } from 'react-router-dom'

import {
  AccordionItem,
  ActionCard,
  AlertMessage,
  Box,
  FormStepperThemes,
  GridColumn,
  GridRow,
  HistorySection,
  HistoryStepper,
  Stack,
  Table as T,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  formatDateOnly,
  formSubmit,
  IntroWrapper,
  LinkButton,
  m,
  SYSLUMENN_SLUG,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'

import { estatesMessages as em } from '../../lib/messages'
import { EstatesPaths } from '../../lib/paths'
import { useEstateDetailQuery } from './EstateDetail.generated'
import * as styles from './EstateDetail.css'

const DetailField = ({
  label,
  children,
}: {
  label?: string | null
  children: ReactNode
}) => (
  <Box>
    <Box component="dt">
      <Text as="span" variant="medium">
        {label}
      </Text>
    </Box>
    <Box component="dd" marginTop={1}>
      {children}
    </Box>
  </Box>
)

export const EstateDetail = () => {
  useNamespaces('sp.estates')
  const { formatMessage } = useLocale()
  const { id } = useParams<{ id: string }>()

  const { data, loading, error } = useEstateDetailQuery({
    variables: { input: { caseId: id ?? '' } },
    skip: !id,
  })

  const estate = data?.estate
  const isFinished = estate?.status?.isOpen === false

  const formatDate = (date?: string | null) =>
    date ? formatDateOnly(date) : undefined

  // TODO: confirm representative vs. estateManager priority with Sýslumenn
  const agentName = estate?.representative?.name ?? estate?.estateManager?.name

  const latestDocuments = [...(estate?.documents ?? [])]
    .sort((a, b) => (b.documentDate ?? '').localeCompare(a.documentDate ?? ''))
    .slice(0, 3)

  return (
    <IntroWrapper
      title={estate?.deceased?.name?.value ?? formatMessage(m.estatesDetail)}
      intro={em.intro}
      marginBottom={6}
      serviceProvider={{
        slug: SYSLUMENN_SLUG,
        tooltip: formatMessage(m.estatesTooltip),
      }}
      buttonGroup={{
        actions: [
          <LinkButton
            key="submit"
            to={formatMessage(em.filesButtonUrl)}
            text={formatMessage(em.submitDocuments)}
            icon="open"
            variant="utility"
          />,
          // TODO: add the "Veita umboð" (em.grantAuthorization) button once its URL is available
        ],
      }}
    >
      {loading && <CardLoader />}
      {error && <Problem error={error} noBorder={false} />}
      {!loading && !error && !estate && (
        <Problem type="no_data" noBorder={false} />
      )}

      {estate && (
        <>
          {/* Section 1 — Grunnupplýsingar */}
          <Text as="h2" variant="eyebrow" color="purple400" marginBottom={2}>
            {formatMessage(em.basicInfoTitle)}
          </Text>
          <Box
            background="white"
            border="standard"
            borderRadius="large"
            padding={3}
            marginBottom={4}
          >
            <Box display="flex" flexDirection={['column', 'row']}>
              <Box
                component="dl"
                flexGrow={1}
                className={[styles.fieldList, styles.fieldWithDivider]}
              >
                <DetailField label={estate.deceased?.name?.label}>
                  <Text variant="h5">{estate.deceased?.name?.value}</Text>
                </DetailField>
                <DetailField label={estate.deceased?.nationalId?.label}>
                  <Text variant="h5">{estate.deceased?.nationalId?.value}</Text>
                </DetailField>
                {agentName && (
                  <DetailField label={estate.representative?.text}>
                    <Text variant="h5">{agentName}</Text>
                  </DetailField>
                )}
              </Box>

              <Box
                component="dl"
                flexGrow={1}
                paddingLeft={[0, 3]}
                paddingTop={[3, 0]}
                className={styles.fieldList}
              >
                <DetailField label={estate.caseId?.label}>
                  <Text variant="h5">{estate.caseId?.value}</Text>
                </DetailField>
                {estate.deceased?.dateOfDeath && (
                  <DetailField label={estate.deceased.dateOfDeath.label}>
                    <Text variant="h5">
                      {formatDate(estate.deceased.dateOfDeath.value)}
                    </Text>
                  </DetailField>
                )}
                <DetailField label={formatMessage(m.status)}>
                  <Tag variant={isFinished ? 'mint' : 'blue'} outlined disabled>
                    {formatMessage(
                      isFinished ? em.statusFinished : em.statusInProgress,
                    )}
                  </Tag>
                </DetailField>
              </Box>

              <Box
                display={['none', 'flex']}
                alignItems="flexStart"
                justifyContent="flexEnd"
                paddingLeft={3}
                className={styles.illustrationWrapper}
              >
                <img
                  src="./assets/images/grieving.svg"
                  alt=""
                  className={styles.illustrationImg}
                />
              </Box>
            </Box>
          </Box>

          {/* Section 2 — Næstu skref + Frestur */}
          {(!!estate.nextSteps?.length || !!estate.deadline) && (
            <Box marginBottom={4}>
              <GridRow>
                {estate.nextSteps?.[0] && (
                  <GridColumn span={['12/12', '6/12']}>
                    <Text
                      as="h2"
                      variant="eyebrow"
                      color="purple400"
                      marginBottom={1}
                    >
                      {formatMessage(em.nextSteps)}
                    </Text>
                    <Box border="standard" borderRadius="large" padding={3}>
                      {estate.nextSteps[0].description && (
                        <Text as="h3" variant="h4" marginBottom={2}>
                          {estate.nextSteps[0].description}
                        </Text>
                      )}
                      {estate.nextSteps[0].detailedDescription && (
                        <Text variant="medium" marginBottom={3}>
                          {estate.nextSteps[0].detailedDescription}
                        </Text>
                      )}
                      <Box
                        display="flex"
                        justifyContent="spaceBetween"
                        alignItems="center"
                      >
                        {estate.nextSteps[0].stepStatus?.text && (
                          // TODO: map stepStatus.code to tag variant once the codes are known (e.g. red for "Umsókn ekki send inn")
                          <Tag variant="blue" outlined disabled>
                            {estate.nextSteps[0].stepStatus.text}
                          </Tag>
                        )}
                        {estate.nextSteps[0].action?.url && (
                          <LinkButton
                            to={estate.nextSteps[0].action.url}
                            text={estate.nextSteps[0].action.label ?? ''}
                            icon="arrowForward"
                            variant="text"
                          />
                        )}
                      </Box>
                    </Box>
                  </GridColumn>
                )}
                {estate.deadline && (
                  <GridColumn
                    span={['12/12', '6/12']}
                    paddingTop={[estate.nextSteps?.[0] ? 2 : 0, 0]}
                  >
                    <Text
                      as="h2"
                      variant="eyebrow"
                      color="purple400"
                      marginBottom={1}
                    >
                      {formatMessage(em.deadline)}
                    </Text>
                    <Box border="standard" borderRadius="large" padding={3}>
                      {estate.deadline.description && (
                        <Text as="h3" variant="h4" marginBottom={2}>
                          {estate.deadline.description}
                        </Text>
                      )}
                      {estate.deadline.detailedDescription && (
                        <Text variant="medium" marginBottom={3}>
                          {estate.deadline.detailedDescription}
                        </Text>
                      )}
                      {estate.deadline.daysRemaining != null && (
                        <Tag variant="purple" outlined disabled>
                          {formatMessage(em.daysLeft, {
                            count: estate.deadline.daysRemaining,
                          })}
                        </Tag>
                      )}
                    </Box>
                  </GridColumn>
                )}
              </GridRow>
            </Box>
          )}

          {/* Section 3 — Framvinda skipta */}
          {!!estate.progress?.steps?.length && (
            <>
              <Text
                as="h2"
                variant="eyebrow"
                color="purple400"
                marginBottom={2}
              >
                {estate.progress?.title}
              </Text>
              <Box
                border="standard"
                borderRadius="large"
                padding={[2, 3, 4]}
                marginBottom={4}
              >
                <HistoryStepper
                  sections={estate.progress.steps.map((step, i) => {
                    const isComplete = step.completedDate != null
                    const title = step.description ?? ''
                    const date = formatDate(step.completedDate)
                    const hasDetail = !!(step.information || step.action?.url)

                    return (
                      <HistorySection
                        key={i}
                        theme={FormStepperThemes.BLUE}
                        section={title}
                        sectionIndex={i}
                        date={date}
                        isComplete={isComplete}
                        isLast={i === (estate.progress?.steps?.length ?? 0) - 1}
                        customSection={
                          hasDetail ? (
                            <AccordionItem
                              id={`timeline-step-${i}`}
                              label={
                                <Text fontWeight="semiBold" as="span">
                                  {title}
                                </Text>
                              }
                              iconVariant="small"
                            >
                              <AlertMessage
                                type="info"
                                message={step.information ?? ''}
                                action={
                                  step.action?.url ? (
                                    <LinkButton
                                      to={step.action.url}
                                      text={step.action.label ?? ''}
                                      variant="text"
                                      icon="open"
                                    />
                                  ) : undefined
                                }
                              />
                            </AccordionItem>
                          ) : (
                            <Text fontWeight="semiBold" lineHeight="lg">
                              {title}
                            </Text>
                          )
                        }
                      />
                    )
                  })}
                />
              </Box>
            </>
          )}

          {/* Section 4 — Erfingjar */}
          {!!estate.inheritors?.length && (
            <>
              <Text
                as="h2"
                variant="eyebrow"
                color="purple400"
                marginBottom={2}
              >
                {formatMessage(em.tabHeirs)}
              </Text>
              <Box marginBottom={4}>
                <T.Table>
                  <T.Head>
                    <T.Row>
                      <T.HeadData>{formatMessage(em.heirName)}</T.HeadData>
                      <T.HeadData>
                        {formatMessage(em.heirNationalId)}
                      </T.HeadData>
                      <T.HeadData>{formatMessage(em.heirRelation)}</T.HeadData>
                    </T.Row>
                  </T.Head>
                  <T.Body>
                    {estate.inheritors.map((heir, i) => (
                      <T.Row key={i}>
                        <T.Data>{heir.name}</T.Data>
                        <T.Data>{heir.nationalId}</T.Data>
                        <T.Data>{heir.relation?.text}</T.Data>
                      </T.Row>
                    ))}
                  </T.Body>
                </T.Table>
              </Box>
            </>
          )}

          {/* Section 5 — Skjöl preview */}
          {latestDocuments.length > 0 && (
            <>
              <Text
                as="h2"
                variant="eyebrow"
                color="purple400"
                marginBottom={2}
              >
                {formatMessage(m.estatesFiles)}
              </Text>
              <Box border="standard" borderRadius="large" padding={3}>
                <Stack space={2}>
                  {latestDocuments.map((doc, i) => {
                    const downloadUrl = doc.downloadServiceUrl
                    const url = doc.requestAction?.url
                    const label = doc.requestAction?.label ?? ''
                    return (
                      <ActionCard
                        key={doc.islandIsDocumentId ?? i}
                        heading={doc.name ?? ''}
                        text={formatDate(doc.documentDate)}
                        tag={
                          doc.availability
                            ? // TODO: map availability to tag variant once the values are known (Vantar red, Beðið yellow, Móttekið mint)
                              {
                                label: doc.availability,
                                variant: 'blue',
                                outlined: true,
                              }
                            : undefined
                        }
                        cta={
                          downloadUrl
                            ? {
                                label: formatMessage(m.view),
                                ariaLabel: `${formatMessage(m.view)}: ${
                                  doc.name ?? ''
                                }`,
                                variant: 'text',
                                icon: 'open',
                                iconType: 'outline',
                                onClick: () => formSubmit(downloadUrl),
                              }
                            : url
                            ? {
                                label,
                                ariaLabel: `${label}: ${doc.name ?? ''}`,
                                variant: 'text',
                                icon: 'arrowForward',
                                onClick: () =>
                                  window.open(
                                    url,
                                    '_blank',
                                    'noopener,noreferrer',
                                  ),
                              }
                            : undefined
                        }
                      />
                    )
                  })}
                </Stack>
                <Box marginTop={3} display="flex" justifyContent="center">
                  <LinkButton
                    to={EstatesPaths.EstatesFiles.replace(':id', id ?? '')}
                    text={formatMessage(em.seeFiles)}
                    icon="arrowForward"
                    variant="text"
                  />
                </Box>
              </Box>
            </>
          )}
        </>
      )}
    </IntroWrapper>
  )
}

export default EstateDetail
