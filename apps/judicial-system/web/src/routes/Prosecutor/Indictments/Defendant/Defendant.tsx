import { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Box } from '@island.is/island-ui/core'
import {
  getStandardUserDashboardRoute,
  PROSECUTION_INDICTMENT_CASE_POLICE_CASE_FILES_ROUTE,
} from '@island.is/judicial-system/consts'
import { core, titles } from '@island.is/judicial-system-web/messages'
import {
  FormContentContainer,
  FormContext,
  FormFooter,
  PageHeader,
  PageLayout,
  PageTitle,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { ProsecutorSection } from '@island.is/judicial-system-web/src/routes/Prosecutor/components'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { isDefendantStepValidIndictments } from '@island.is/judicial-system-web/src/utils/validate'

import { DefendantList } from './DefendantList/DefendantList'
import { PoliceCaseList } from './PoliceCaseList/PoliceCaseList'
import { strings } from './Defendant.strings'

const Defendant = () => {
  const router = useRouter()
  const { formatMessage } = useIntl()

  const { user } = useContext(UserContext)
  const { workingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const { createCase, isCreatingCase } = useCase()

  const handleNavigationTo = useCallback(
    async (destination: string) => {
      if (workingCase.id) {
        if (!workingCase.defendants || workingCase.defendants.length === 0) {
          return
        }
        router.push(`${destination}/${workingCase.id}`)

        return
      }

      // The defendants are created together with the case, so either the
      // whole case exists afterwards or nothing does. A failed creation has
      // been reported and leaves the form as it was, ready to try again.
      const createdCase = await createCase(workingCase)

      if (!createdCase) {
        return
      }

      router.push(`${destination}/${createdCase.id}`)
    },
    [createCase, router, workingCase],
  )

  const stepIsValid = isDefendantStepValidIndictments(workingCase)

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isValid={stepIsValid}
      onNavigationTo={handleNavigationTo}
    >
      <PageHeader
        title={formatMessage(titles.prosecutor.indictments.defendant)}
      />
      <FormContentContainer>
        <PageTitle>{formatMessage(strings.heading)}</PageTitle>
        <Box component="section" marginBottom={5}>
          <ProsecutorSection />
        </Box>
        <PoliceCaseList />
        <Box component="section">
          <DefendantList />
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={getStandardUserDashboardRoute(user)}
          actions={[
            {
              text: formatMessage(
                workingCase.id === '' ? core.createCase : core.continue,
              ),
              icon: 'arrowForward',
              onClick: () =>
                handleNavigationTo(
                  PROSECUTION_INDICTMENT_CASE_POLICE_CASE_FILES_ROUTE,
                ),
              disabled: !stepIsValid,
              loading: isCreatingCase,
              testId: 'continueButton',
            },
          ]}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default Defendant
