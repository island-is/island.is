import React, { useState } from 'react'
import { Box, Input, Text, Tooltip } from '@island.is/island-ui/core'
import {
  BlueBox,
  FormContentContainer,
  FormFooter,
} from '@island.is/judicial-system-web/src/shared-components'
import { Case } from '@island.is/judicial-system/types'
import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import useCase from '@island.is/judicial-system-web/src/utils/hooks/useCase'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import {
  FormSettings,
  useCaseFormHelper,
} from '@island.is/judicial-system-web/src/utils/useFormHelper'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
}

const PoliceReportForm: React.FC<Props> = (props) => {
  const validations: FormSettings = {
    caseFacts: {
      validations: ['empty'],
    },
    legalArguments: {
      validations: ['empty'],
    },
  }
  const { workingCase, setWorkingCase } = props
  const { updateCase } = useCase()
  const [caseFactsEM, setCaseFactsEM] = useState<string>('')
  const [legalArgumentsEM, setLegalArgumentsEM] = useState<string>('')
  const { isValid } = useCaseFormHelper(
    workingCase,
    setWorkingCase,
    validations,
  )

  return (
    <>
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            Greinargerð
          </Text>
        </Box>
        <Box marginBottom={5}>
          <BlueBox>
            <Text>
              {workingCase.policeDemands ||
                // TODO: REMOVE
                'Þess er krafist að Héraðsdómur Reykjavíkur heimili lögreglustjóranum á höfuðborgarsvæðinu leit í bifreiðinni Í-53, í eigu Matthíasar Jochumssonar, kt. 121201-2119. Þess er krafist að heimildin nái til leitar í læstum hirslum bifreiðarinnar.'}
            </Text>
          </BlueBox>
        </Box>
        <Box component="section" marginBottom={7}>
          <Box marginBottom={2}>
            <Text as="h3" variant="h3">
              Greinargerð um málsatvik{' '}
              <Tooltip
                placement="right"
                as="span"
                text="Málsatvik, hvernig meðferð þessa máls hófst, skal skrá hér ásamt framburðum vitna og sakborninga ef til eru. Einnig er gott að taka fram stöðu rannsóknar og næstu skref."
              />
            </Text>
          </Box>
          <Box marginBottom={3}>
            <Input
              data-testid="caseFacts"
              name="caseFacts"
              label="Málsatvik"
              placeholder="Hvað hefur átt sér stað hingað til? Hver er framburður sakborninga og vitna? Hver er staða rannsóknar og næstu skref?"
              errorMessage={caseFactsEM}
              hasError={caseFactsEM !== ''}
              defaultValue={workingCase?.caseFacts}
              onChange={(event) =>
                removeTabsValidateAndSet(
                  'caseFacts',
                  event,
                  ['empty'],
                  workingCase,
                  setWorkingCase,
                  caseFactsEM,
                  setCaseFactsEM,
                )
              }
              onBlur={(event) =>
                validateAndSendToServer(
                  'caseFacts',
                  event.target.value,
                  ['empty'],
                  workingCase,
                  updateCase,
                  setCaseFactsEM,
                )
              }
              required
              rows={14}
              textarea
            />
          </Box>
        </Box>
        <Box component="section" marginBottom={7}>
          <Box marginBottom={2}>
            <Text as="h3" variant="h3">
              Greinargerð um lagarök{' '}
              <Tooltip
                placement="right"
                as="span"
                text="Lagarök og lagaákvæði sem eiga við brotið og kröfuna skal taka fram hér."
              />
            </Text>
          </Box>
          <Box marginBottom={7}>
            <Input
              data-testid="legalArguments"
              name="legalArguments"
              label="Lagarök"
              placeholder="Hver eru lagarökin fyrir kröfu um gæsluvarðhald?"
              defaultValue={workingCase?.legalArguments}
              errorMessage={legalArgumentsEM}
              hasError={legalArgumentsEM !== ''}
              onChange={(event) =>
                removeTabsValidateAndSet(
                  'legalArguments',
                  event,
                  ['empty'],
                  workingCase,
                  setWorkingCase,
                  legalArgumentsEM,
                  setLegalArgumentsEM,
                )
              }
              onBlur={(event) =>
                validateAndSendToServer(
                  'legalArguments',
                  event.target.value,
                  ['empty'],
                  workingCase,
                  updateCase,
                  setLegalArgumentsEM,
                )
              }
              required
              textarea
              rows={14}
            />
          </Box>
          <Box component="section" marginBottom={7}>
            <Box marginBottom={2}>
              <Text as="h3" variant="h3">
                Athugasemdir vegna málsmeðferðar{' '}
                <Tooltip
                  placement="right"
                  as="span"
                  text="Hér er hægt að skrá athugasemdir til dómara og dómritara um hagnýt atriði sem tengjast fyrirtökunni eða málsmeðferðinni, og eru ekki hluti af sjálfri kröfunni."
                />
              </Text>
            </Box>
            <Box marginBottom={3}>
              <Input
                name="comments"
                label="Athugasemdir"
                placeholder="Er eitthvað sem þú vilt koma á framfæri við dómstólinn varðandi fyrirtökuna eða málsmeðferðina?"
                defaultValue={workingCase?.comments}
                onChange={(event) =>
                  removeTabsValidateAndSet(
                    'comments',
                    event,
                    [],
                    workingCase,
                    setWorkingCase,
                  )
                }
                onBlur={(event) =>
                  validateAndSendToServer(
                    'comments',
                    event.target.value,
                    [],
                    workingCase,
                    updateCase,
                  )
                }
                textarea
                rows={7}
              />
            </Box>
          </Box>
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${Constants.R_CASE_POLICE_DEMANDS_ROUTE}/${workingCase.id}`}
          nextUrl={`${Constants.R_CASE_CASE_FILES_ROUTE}/${workingCase.id}`}
          nextIsDisabled={!isValid}
        />
      </FormContentContainer>
    </>
  )
}

export default PoliceReportForm
