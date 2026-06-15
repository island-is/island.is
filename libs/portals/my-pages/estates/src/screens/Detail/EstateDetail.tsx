import { useParams } from 'react-router-dom'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  m,
  IntroWrapper,
  LinkButton,
  SYSLUMENN_SLUG,
} from '@island.is/portals/my-pages/core'
import { estatesMessages as em } from '../../lib/messages'
import {
  AccordionItem,
  ActionCard,
  AlertMessage,
  Box,
  Button,
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
import { Problem } from '@island.is/react-spa/shared'
import { EstatesPaths } from '../../lib/paths'
import * as styles from './EstateDetail.css'
import { useEstateDetailQuery } from './EstateDetail.generated'

export const EstateDetail = () => {
  useNamespaces('sp.estates')
  const { formatMessage, lang } = useLocale()
  const { id } = useParams<{ id: string }>()

  const { data, loading, error } = useEstateDetailQuery({
    variables: { input: { caseId: id ?? '' } },
    skip: !id,
  })

  const estate = data?.estate
  const isFinished = estate?.status?.isOpen === false

  const formatDate = (date?: string | null) =>
    date ? new Date(date).toLocaleDateString(lang) : undefined

  const agents = [
    estate?.representative?.name,
    estate?.estateManager?.name,
  ].filter(Boolean)

  return (
    <IntroWrapper
      title={estate?.deceased?.name ?? formatMessage(em.detailFallbackTitle)}
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
          <Button
            key="authorize"
            disabled
            variant="utility"
            icon="person"
            iconType="outline"
          >
            {/* TODO: wire up URL when available */}
            {formatMessage(em.grantAuthorization)}
          </Button>,
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
          <Text variant="eyebrow" color="purple400" marginBottom={2}>
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
              {/* Left column */}
              <Box flexGrow={1}>
                <Stack space={3}>
                  <Box className={styles.fieldWithDivider}>
                    <Text variant="small" color="dark400">
                      {formatMessage(em.deceasedName)}
                    </Text>
                    <Text variant="medium" fontWeight="semiBold" marginTop={1}>
                      {estate.deceased?.name}
                    </Text>
                  </Box>
                  <Box className={styles.fieldWithDivider}>
                    <Text variant="small" color="dark400">
                      {formatMessage(em.deceasedNationalId)}
                    </Text>
                    <Text variant="medium" fontWeight="semiBold" marginTop={1}>
                      {estate.deceased?.nationalId}
                    </Text>
                  </Box>
                  {agents.length > 0 && (
                    <Box className={styles.fieldWithDivider}>
                      <Text variant="small" color="dark400">
                        {formatMessage(em.estateAgent)}
                      </Text>
                      {agents.map((agent) => (
                        <Text key={agent} fontWeight="semiBold" marginTop={1}>
                          {agent}
                        </Text>
                      ))}
                    </Box>
                  )}
                </Stack>
              </Box>

              {/* Right column */}
              <Box flexGrow={1} paddingLeft={[0, 3]} paddingTop={[3, 0]}>
                <Stack space={3}>
                  <Box>
                    <Text variant="small" color="dark400">
                      {formatMessage(em.caseNumber)}
                    </Text>
                    <Text variant="medium" fontWeight="semiBold" marginTop={1}>
                      {estate.caseId}
                    </Text>
                  </Box>
                  {estate.deceased?.dateOfDeath && (
                    <Box>
                      <Text variant="small" color="dark400">
                        {formatMessage(em.dateOfDeath)}
                      </Text>
                      <Text
                        variant="medium"
                        fontWeight="semiBold"
                        marginTop={1}
                      >
                        {formatDate(estate.deceased.dateOfDeath)}
                      </Text>
                    </Box>
                  )}
                  <Box>
                    <Text variant="small" color="dark400">
                      {formatMessage(m.status)}
                    </Text>
                    <Box marginTop={1}>
                      <Tag
                        variant={isFinished ? 'mint' : 'blue'}
                        outlined
                        disabled
                      >
                        {formatMessage(
                          isFinished ? em.statusFinished : em.statusInProgress,
                        )}
                      </Tag>
                    </Box>
                  </Box>
                </Stack>
              </Box>

              {/* TODO: replace with dove illustration once asset is added */}
              <Box
                display={['none', 'flex']}
                alignItems="flexStart"
                justifyContent="flexEnd"
                paddingLeft={3}
                className={styles.illustrationWrapper}
              >
                <img
                  src="./assets/images/bench.svg"
                  alt=""
                  className={styles.illustrationImg}
                />
              </Box>
            </Box>
          </Box>

          {/* Section 2 — Næstu skref + Frestur */}
          {(estate.nextSteps?.length || estate.deadline) && (
            <Box marginBottom={4}>
              <GridRow>
                {estate.nextSteps?.[0] && (
                  <GridColumn span={['12/12', '6/12']}>
                    <Text variant="eyebrow" color="purple400" marginBottom={1}>
                      {formatMessage(em.nextSteps)}
                    </Text>
                    <Box border="standard" borderRadius="large" padding={3}>
                      {estate.nextSteps[0].description && (
                        <Text variant="h4" marginBottom={2}>
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
                          <Tag variant="blue" outlined disabled>
                            {estate.nextSteps[0].stepStatus.text}
                          </Tag>
                        )}
                        {estate.nextSteps[0].action?.url && (
                          <LinkButton
                            to={estate.nextSteps[0].action.url}
                            text={
                              estate.nextSteps[0].action.label ??
                              formatMessage(em.sendApplication)
                            }
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
                    <Text variant="eyebrow" color="purple400" marginBottom={1}>
                      {formatMessage(em.deadline)}
                    </Text>
                    <Box border="standard" borderRadius="large" padding={3}>
                      {estate.deadline.description && (
                        <Text variant="h4" marginBottom={2}>
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
                          {`${estate.deadline.daysRemaining} ${formatMessage(em.daysLeft)}`}
                        </Tag>
                      )}
                    </Box>
                  </GridColumn>
                )}
              </GridRow>
            </Box>
          )}

          {/* Section 3 — Framvinda skipta */}
          {estate.progress?.steps?.length && (
            <>
              <Text variant="eyebrow" color="purple400" marginBottom={2}>
                {formatMessage(em.progressTimeline)}
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
                        isLast={
                          i === (estate.progress?.steps?.length ?? 0) - 1
                        }
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
          {estate.inheritors?.length && (
            <>
              <Text variant="eyebrow" color="purple400" marginBottom={2}>
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
                        <T.Data>
                          <Text variant="small">{heir.name}</Text>
                        </T.Data>
                        <T.Data>
                          <Text variant="small">{heir.nationalId}</Text>
                        </T.Data>
                        <T.Data>
                          <Text variant="small">{heir.relation?.text}</Text>
                        </T.Data>
                      </T.Row>
                    ))}
                  </T.Body>
                </T.Table>
              </Box>
            </>
          )}

          {/* Section 5 — Skjöl preview */}
          {estate.documents?.length && (
            <>
              <Text variant="eyebrow" color="purple400" marginBottom={2}>
                {formatMessage(em.filesTitle)}
              </Text>
              <Box border="standard" borderRadius="large" padding={3}>
                <Stack space={2}>
                  {estate.documents.map((doc, i) => (
                    <ActionCard
                      key={i}
                      heading={doc.name ?? ''}
                      headingVariant="h4"
                      text={formatDate(doc.documentDate)}
                      tag={
                        doc.availability
                          ? {
                              label: doc.availability,
                              variant: 'blue',
                              outlined: true,
                            }
                          : undefined
                      }
                      cta={
                        doc.requestAction?.url
                          ? {
                              label: formatMessage(em.viewFile),
                              variant: 'text',
                              icon: 'arrowForward',
                              onClick: () =>
                                window.open(doc.requestAction!.url!, '_blank'),
                            }
                          : undefined
                      }
                    />
                  ))}
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
