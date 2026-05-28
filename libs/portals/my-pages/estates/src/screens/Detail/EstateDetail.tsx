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

// TODO: Replace with real GraphQL data once estate(id) resolver is available
const DUMMY_ESTATE = {
  id: 'D-2026-000001',
  caseNumber: '2026-000001',
  deceasedName: 'Guðrún Hannesardóttir',
  deceasedNationalId: '010149-2399',
  dateOfDeath: '3. febrúar 2026',
  agents: ['Guðmundur Erik Guðjónsson', 'Benjamín Rúnarsson'],
  isFinished: false,
  daysLeft: 95,
  heirs: [
    { name: 'Lisa Jónsdóttir', nationalId: '220482-4859', relation: 'Dóttir' },
    {
      name: 'Sigrún Sigurlína Gunnarsdóttir\nForráðamaður Lisa Jónsdóttir',
      nationalId: '120310-4589',
      relation: 'Dótturdóttir',
    },
    {
      name: 'Jens Pétur Jóhannsson',
      nationalId: '020273-4589',
      relation: 'Sonur',
    },
    {
      name: 'Kristján Óli Jóhannsson',
      nationalId: '231172-4589',
      relation: 'Sonur',
    },
  ],
  timelineSteps: [
    {
      title: 'Dánarvottorð móttekið hjá Sýslumanni',
      date: '05.01.2026',
      completed: true,
      alertText: 'Dánarvottorð berst Sýslumanni rafrænt frá lækni.',
      alertLinkText: 'Sækja um vottorð',
      alertLinkUrl: 'https://island.is',
    },
    {
      title: 'Andlátstilkynning til Sýslumanns',
      date: '08.01.2026',
      completed: true,
    },
    {
      title: 'Útfararheimild veitt',
      date: '09.01.2026',
      completed: true,
    },
    {
      title: 'Ákvörðun um skipti á dánarbúi',
      date: '18.01.2026',
      completed: false,
      alertText:
        'Senda þarf inn umsókn um leyfi til einkaskipta eða opinberra skipta til sýslumanns.',
      alertLinkText: 'Senda umsókn',
      alertLinkUrl: 'https://island.is',
    },
    {
      title: 'Leyfi til einkaskipta',
      date: '23.04.2022',
      completed: false,
    },
    {
      title: 'Erfðafjárskýrslu skilað',
      date: '23.04.2022',
      completed: false,
    },
    {
      title: 'Erfðafjárskattur greiddur',
      date: '23.04.2022',
      completed: false,
    },
    {
      title: 'Skiptalok',
      date: '23.04.2022',
      completed: false,
    },
  ],
  files: [
    {
      id: '1',
      name: 'Skattframtal 2024',
      date: '30. janúar 2026',
      status: 'pending',
      documentUrl: undefined as string | undefined,
    },
    {
      id: '2',
      name: 'Skattframtal 2026',
      date: '22. janúar 2026',
      status: 'received',
      documentUrl: 'https://island.is',
    },
  ],
}

export const EstateDetail = () => {
  useNamespaces('sp.estates')
  const { formatMessage } = useLocale()
  const { id } = useParams<{ id: string }>()

  // TODO: Replace with real query once `estate(id)` GraphQL resolver is available.
  const loading = false
  const error = undefined

  return (
    <IntroWrapper
      title={DUMMY_ESTATE.deceasedName}
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
                  {DUMMY_ESTATE.deceasedName}
                </Text>
              </Box>
              <Box className={styles.fieldWithDivider}>
                <Text variant="small" color="dark400">
                  {formatMessage(em.deceasedNationalId)}
                </Text>
                <Text variant="medium" fontWeight="semiBold" marginTop={1}>
                  {DUMMY_ESTATE.deceasedNationalId}
                </Text>
              </Box>
              <Box className={styles.fieldWithDivider}>
                <Text variant="small" color="dark400">
                  {formatMessage(em.estateAgent)}
                </Text>
                {DUMMY_ESTATE.agents.map((agent) => (
                  <Text key={agent} fontWeight="semiBold" marginTop={1}>
                    {agent}
                  </Text>
                ))}
              </Box>
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
                  {DUMMY_ESTATE.caseNumber}
                </Text>
              </Box>
              <Box>
                <Text variant="small" color="dark400">
                  {formatMessage(em.dateOfDeath)}
                </Text>
                <Text variant="medium" fontWeight="semiBold" marginTop={1}>
                  {DUMMY_ESTATE.dateOfDeath}
                </Text>
              </Box>
              <Box>
                <Text variant="small" color="dark400">
                  {formatMessage(m.status)}
                </Text>
                <Box marginTop={1}>
                  <Tag
                    variant={DUMMY_ESTATE.isFinished ? 'mint' : 'blue'}
                    outlined
                    disabled
                  >
                    {formatMessage(
                      DUMMY_ESTATE.isFinished
                        ? em.statusFinished
                        : em.statusInProgress,
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
      <Box marginBottom={4}>
        <GridRow>
          <GridColumn span={['12/12', '6/12']}>
            <Text variant="eyebrow" color="purple400" marginBottom={1}>
              {formatMessage(em.nextSteps)}
            </Text>
            <Box border="standard" borderRadius="large" padding={3}>
              <Text variant="h4" marginBottom={2}>
                {formatMessage(em.nextStepsTitle)}
              </Text>
              <Text variant="medium" marginBottom={3}>
                {formatMessage(em.nextStepsDescription)}
              </Text>
              <Box
                display="flex"
                justifyContent="spaceBetween"
                alignItems="center"
              >
                <Tag variant="red" outlined disabled>
                  {formatMessage(em.applicationNotSubmitted)}
                </Tag>
                <LinkButton
                  to="https://island.is"
                  text={formatMessage(em.sendApplication)}
                  icon="arrowForward"
                  variant="text"
                />
              </Box>
            </Box>
          </GridColumn>
          <GridColumn span={['12/12', '6/12']} paddingTop={[2, 0]}>
            <Text variant="eyebrow" color="purple400" marginBottom={1}>
              {formatMessage(em.deadline)}
            </Text>
            <Box border="standard" borderRadius="large" padding={3}>
              <Text variant="h4" marginBottom={2}>
                {formatMessage(em.deadlineTitle)}
              </Text>
              <Text variant="medium" marginBottom={3}>
                {formatMessage(em.deadlineDescription)}
              </Text>
              <Tag variant="purple" outlined disabled>
                {`${DUMMY_ESTATE.daysLeft} ${formatMessage(em.daysLeft)}`}
              </Tag>
            </Box>
          </GridColumn>
        </GridRow>
      </Box>

      {/* Section 3 — Framvinda skipta */}
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
          sections={DUMMY_ESTATE.timelineSteps.map((step, i) => (
            <HistorySection
              key={i}
              theme={FormStepperThemes.BLUE}
              section={step.title}
              sectionIndex={i}
              date={step.date}
              isComplete={step.completed}
              isLast={i === DUMMY_ESTATE.timelineSteps.length - 1}
              customSection={
                step.alertText ? (
                  <AccordionItem
                    id={`timeline-step-${i}`}
                    label={
                      <Text fontWeight="semiBold" as="span">
                        {step.title}
                      </Text>
                    }
                    iconVariant="small"
                  >
                    <AlertMessage
                      type="info"
                      message={step.alertText}
                      action={
                        step.alertLinkUrl ? (
                          <LinkButton
                            to={step.alertLinkUrl}
                            text={step.alertLinkText ?? ''}
                            variant="text"
                            icon="open"
                          />
                        ) : undefined
                      }
                    />
                  </AccordionItem>
                ) : (
                  <Text fontWeight="semiBold" lineHeight="lg">
                    {step.title}
                  </Text>
                )
              }
            />
          ))}
        />
      </Box>

      {/* Section 4 — Erfingjar */}
      <Text variant="eyebrow" color="purple400" marginBottom={2}>
        {formatMessage(em.tabHeirs)}
      </Text>
      <Box marginBottom={4}>
        <T.Table>
          <T.Head>
            <T.Row>
              <T.HeadData>{formatMessage(em.heirName)}</T.HeadData>
              <T.HeadData>{formatMessage(em.heirNationalId)}</T.HeadData>
              <T.HeadData>{formatMessage(em.heirRelation)}</T.HeadData>
            </T.Row>
          </T.Head>
          <T.Body>
            {DUMMY_ESTATE.heirs.map((heir, i) => (
              <T.Row key={i}>
                <T.Data>
                  <Text variant="small">
                    {heir.name.split('\n').map((line, j) => (
                      <span key={j}>
                        {line}
                        {j < heir.name.split('\n').length - 1 && <br />}
                      </span>
                    ))}
                  </Text>
                </T.Data>
                <T.Data>
                  <Text variant="small">{heir.nationalId}</Text>
                </T.Data>
                <T.Data>
                  <Text variant="small">{heir.relation}</Text>
                </T.Data>
              </T.Row>
            ))}
          </T.Body>
        </T.Table>
      </Box>

      {/* Section 5 — Skjöl preview */}
      <Text variant="eyebrow" color="purple400" marginBottom={2}>
        {formatMessage(em.filesTitle)}
      </Text>
      <Box border="standard" borderRadius="large" padding={3}>
        <Stack space={2}>
          {DUMMY_ESTATE.files.map((file) => (
            <ActionCard
              key={file.id}
              heading={file.name}
              headingVariant="h4"
              text={file.date}
              tag={{
                label: formatMessage(
                  file.status === 'received'
                    ? em.fileStatusReceived
                    : em.fileStatusPending,
                ),
                variant: file.status === 'received' ? 'mint' : 'blue',
                outlined: true,
              }}
              cta={
                file.documentUrl
                  ? {
                      label: formatMessage(em.viewFile),
                      variant: 'text',
                      icon: 'arrowForward',
                      onClick: () => window.open(file.documentUrl, '_blank'),
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
    </IntroWrapper>
  )
}

export default EstateDetail
