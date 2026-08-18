import { FC, useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import { motion } from 'motion/react'
import { useRouter } from 'next/router'
import { Tooltip, TooltipAnchor, TooltipProvider } from '@ariakit/react'

import { Box, Icon, Text } from '@island.is/island-ui/core'
import {
  DISTRICT_COURT_INDICTMENT_CASE_COURT_RECORD_ROUTE,
  DISTRICT_COURT_INDICTMENT_CASE_SUBPOENA_ROUTE,
} from '@island.is/judicial-system/consts'
import { core, titles } from '@island.is/judicial-system-web/messages'
import {
  CourtCaseInfo,
  FormContentContainer,
  FormContext,
  FormFooter,
  PageHeader,
  PageLayout,
  PageTitle,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import { grid } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'
import { isDefenderStepValid } from '@island.is/judicial-system-web/src/utils/validate'

import SelectCivilClaimantAdvocate from './SelectCivilClaimantAdvocate'
import SelectDefender from './SelectDefender'
import { strings } from './Advocates.strings'

// The warning stays mounted and animates via visibility so the lazily
// loaded icon svg is fetched before the warning is first shown — otherwise
// the entrance animation plays around an empty placeholder.
const ConfirmationPendingWarning: FC<{
  visible: boolean
  tooltipText: string
}> = ({ visible, tooltipText }) => (
  <motion.div
    initial="hidden"
    animate={visible ? 'visible' : 'hidden'}
    variants={{
      visible: { opacity: 1, scale: 1, visibility: 'visible' },
      hidden: {
        opacity: 0,
        scale: 0,
        transitionEnd: { visibility: 'hidden' },
      },
    }}
  >
    <TooltipProvider timeout={0}>
      <TooltipAnchor
        tabIndex={0}
        aria-label={tooltipText}
        render={
          <Box display="flex">
            <Icon icon="warning" size="large" color="red300" type="outline" />
          </Box>
        }
      />
      <Tooltip unmountOnHide>
        <motion.div
          initial={{ opacity: 0, y: 4, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <Box background="dark400" borderRadius="full" padding={1}>
            <Text color="white" variant="small">
              {tooltipText}
            </Text>
          </Box>
        </motion.div>
      </Tooltip>
    </TooltipProvider>
  </motion.div>
)

const Advocates = () => {
  const { workingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const router = useRouter()

  const { formatMessage } = useIntl()

  const handleNavigationTo = useCallback(
    async (destination: string) => {
      router.push(`${destination}/${workingCase.id}`)
    },
    [workingCase.id, router],
  )

  const stepIsValid = isDefenderStepValid(workingCase)
  const hasCivilClaimants = (workingCase.civilClaimants?.length ?? 0) > 0
  const allDefendersHaveBeenConfirmed =
    workingCase.defendants?.every(
      (defendant) => defendant.isDefenderChoiceConfirmed,
    ) || false
  const allSpokespersonsHaveBeenConfirmed =
    workingCase.civilClaimants?.every(
      (civilClaimant) =>
        !civilClaimant.hasSpokesperson || civilClaimant.isSpokespersonConfirmed,
    ) || false

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isValid={stepIsValid}
      onNavigationTo={handleNavigationTo}
    >
      <PageHeader title={formatMessage(titles.court.indictments.defender)} />
      <FormContentContainer>
        <PageTitle>{formatMessage(strings.title)}</PageTitle>
        <CourtCaseInfo workingCase={workingCase} />

        <Box display="flex" columnGap={1} alignItems="center" marginBottom={3}>
          <SectionHeading title="Verjendur varnaraðila" marginBottom={0} />
          <ConfirmationPendingWarning
            visible={!allDefendersHaveBeenConfirmed}
            tooltipText="Ákærunni hefur ekki verið deilt með öllum verjendum"
          />
        </Box>
        <div className={grid({ gap: 5, marginBottom: 10 })}>
          {workingCase.defendants?.map((defendant) => (
            <SelectDefender defendant={defendant} key={defendant.id} />
          ))}
          {hasCivilClaimants && (
            <Box component="section">
              <Box
                display="flex"
                columnGap={1}
                alignItems="center"
                marginBottom={3}
              >
                <SectionHeading
                  title={formatMessage(strings.civilClaimants)}
                  marginBottom={0}
                />
                <ConfirmationPendingWarning
                  visible={!allSpokespersonsHaveBeenConfirmed}
                  tooltipText="Ákærunni hefur ekki verið deilt með öllum talsmönnum kröfuhafa"
                />
              </Box>
              <div className={grid({ gap: 5 })}>
                {workingCase.civilClaimants?.map((civilClaimant) => (
                  <Box component="section" key={civilClaimant.id}>
                    <SelectCivilClaimantAdvocate
                      civilClaimant={civilClaimant}
                    />
                  </Box>
                ))}
              </div>
            </Box>
          )}
        </div>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${DISTRICT_COURT_INDICTMENT_CASE_SUBPOENA_ROUTE}/${workingCase.id}`}
          actions={[
            {
              text: formatMessage(core.continue),
              icon: 'arrowForward',
              onClick: () =>
                handleNavigationTo(
                  DISTRICT_COURT_INDICTMENT_CASE_COURT_RECORD_ROUTE,
                ),
              disabled: !stepIsValid,
              loading: isLoadingWorkingCase,
              testId: 'continueButton',
            },
          ]}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default Advocates
