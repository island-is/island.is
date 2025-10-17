import { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence, motion } from 'motion/react'
import { useRouter } from 'next/router'
import { Tooltip, TooltipAnchor, TooltipProvider } from '@ariakit/react'

import { Box, Icon, Text } from '@island.is/island-ui/core'
import {
  INDICTMENTS_COURT_RECORD_ROUTE,
  INDICTMENTS_SUBPOENA_ROUTE,
} from '@island.is/judicial-system/consts'
import { titles } from '@island.is/judicial-system-web/messages'
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
import { isDefenderStepValid } from '@island.is/judicial-system-web/src/utils/validate'

import SelectCivilClaimantAdvocate from './SelectCivilClaimantAdvocate'
import SelectDefender from './SelectDefender'
import { strings } from './Advocates.strings'

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
        <Box component="section" marginBottom={hasCivilClaimants ? 5 : 10}>
          <Box
            display="flex"
            columnGap={1}
            alignItems="center"
            marginBottom={3}
          >
            <SectionHeading title="Verjendur varnaraðila" marginBottom={0} />
            <AnimatePresence>
              {!allDefendersHaveBeenConfirmed && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0,
                  }}
                >
                  <TooltipProvider timeout={0}>
                    <TooltipAnchor
                      render={
                        <Box display="flex">
                          <Icon
                            icon="warning"
                            size="large"
                            color="red300"
                            type="outline"
                          />
                        </Box>
                      }
                    />
                    <Tooltip>
                      <Box background="dark400" borderRadius="full" padding={1}>
                        <Text color="white" variant="small">
                          Ákærunni hefur ekki verið deilt með öllum verjendum
                        </Text>
                      </Box>
                    </Tooltip>
                  </TooltipProvider>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
          {workingCase.defendants?.map((defendant, index) => (
            <SelectDefender defendant={defendant} key={index} />
          ))}
        </Box>
        {hasCivilClaimants && (
          <Box component="section" marginBottom={10}>
            <SectionHeading title={formatMessage(strings.civilClaimants)} />
            {workingCase.civilClaimants?.map((civilClaimant) => (
              <Box component="section" marginBottom={5} key={civilClaimant.id}>
                <SelectCivilClaimantAdvocate civilClaimant={civilClaimant} />
              </Box>
            ))}
          </Box>
        )}
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          nextButtonIcon="arrowForward"
          previousUrl={`${INDICTMENTS_SUBPOENA_ROUTE}/${workingCase.id}`}
          nextIsLoading={isLoadingWorkingCase}
          nextUrl={`${INDICTMENTS_COURT_RECORD_ROUTE}/${workingCase.id}`}
          nextIsDisabled={!stepIsValid}
          onNextButtonClick={() =>
            handleNavigationTo(INDICTMENTS_COURT_RECORD_ROUTE)
          }
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default Advocates
