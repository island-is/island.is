import { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Box } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { getStandardUserDashboardRoute } from '@island.is/judicial-system/consts'
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
import {
  useCase,
  useDefendants,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { isDefendantStepValidIndictments } from '@island.is/judicial-system-web/src/utils/validate'

import { ProsecutorSection } from '../../components'
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
  const { createDefendant, updateDefendant } = useDefendants()

  const handleNavigationTo = useCallback(
    async (destination: string) => {
      if (workingCase.id) {
        router.push(`${destination}/${workingCase.id}`)

        return
      }

      const createdCase = await createCase(workingCase)

      if (!createdCase || !workingCase.defendants) {
        return
      }

      // Using for instead of forEach to await each defendant creation
      // TODO: Handle errors in defendant creation and update
      for (const [index, defendant] of workingCase.defendants.entries()) {
        if (
          index === 0 &&
          createdCase.defendants &&
          createdCase.defendants.length > 0
        ) {
          await updateDefendant({
            caseId: createdCase.id,
            defendantId: createdCase.defendants[0].id,
            gender: defendant.gender,
            name: defendant.name,
            address: defendant.address,
            nationalId: defendant.nationalId || null,
            noNationalId: defendant.noNationalId,
            citizenship: defendant.citizenship,
          })
        } else {
          await createDefendant({
            caseId: createdCase.id,
            gender: defendant.gender,
            name: defendant.name,
            address: defendant.address,
            nationalId: defendant.nationalId || null,
            noNationalId: defendant.noNationalId,
            citizenship: defendant.citizenship,
          })
        }
      }

      router.push(`${destination}/${createdCase.id}`)
    },
    [createCase, createDefendant, router, updateDefendant, workingCase],
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
        <DefendantList />
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          nextButtonIcon="arrowForward"
          previousUrl={getStandardUserDashboardRoute(user)}
          onNextButtonClick={() =>
            handleNavigationTo(constants.INDICTMENTS_POLICE_CASE_FILES_ROUTE)
          }
          nextIsDisabled={!stepIsValid}
          nextIsLoading={isCreatingCase}
          nextButtonText={formatMessage(
            workingCase.id === '' ? core.createCase : core.continue,
          )}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default Defendant
