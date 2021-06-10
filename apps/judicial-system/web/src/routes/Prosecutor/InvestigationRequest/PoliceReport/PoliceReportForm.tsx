import React, { useState } from 'react'
import { Box, Checkbox, Input, Text, Tooltip } from '@island.is/island-ui/core'
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
import {
  FormSettings,
  useCaseFormHelper,
} from '@island.is/judicial-system-web/src/utils/useFormHelper'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
  isLoading: boolean
}

const PoliceReportForm: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase, isLoading } = props
  const validations: FormSettings = {
    caseFacts: {
      validations: ['empty'],
    },
    legalArguments: {
      validations: ['empty'],
    },
  }
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
            <Text>{workingCase.demands}</Text>
          </BlueBox>
        </Box>
        <Box component="section" marginBottom={5}>
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
        <Box component="section" marginBottom={5}>
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
          <Box marginBottom={5}>
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
          <Box component="section" marginBottom={5}>
            <BlueBox>
              <Box marginBottom={2}>
                <Checkbox
                  name="request-prosecutor-only-session"
                  label="Beiðni um dómþing að varnaraðila fjarstöddum"
                  tooltip="Hér er hægt að setja fram kröfu um að dómþing fari fram að varnaraðila fjarstöddum, vegna rannsóknarhagsmuna."
                  checked={workingCase.requestProsecutorOnlySession}
                  onChange={(evt) => {
                    setWorkingCase({
                      ...workingCase,
                      requestProsecutorOnlySession: evt.target.checked,
                    })
                    updateCase(workingCase.id, {
                      requestProsecutorOnlySession: evt.target.checked,
                    })
                  }}
                  filled
                  large
                />
              </Box>
              <Input
                name="prosecutor-only-session-request"
                label="Beiðni"
                placeholder="Er þess óskað að varnaraðili sé ekki viðstaddur dómþing?"
                disabled={workingCase.requestProsecutorOnlySession === false}
                defaultValue={workingCase.prosecutorOnlySessionRequest}
                onChange={(event) =>
                  removeTabsValidateAndSet(
                    'prosecutorOnlySessionRequest',
                    event,
                    [],
                    workingCase,
                    setWorkingCase,
                  )
                }
                onBlur={(event) =>
                  validateAndSendToServer(
                    'prosecutorOnlySessionRequest',
                    event.target.value,
                    [],
                    workingCase,
                    updateCase,
                  )
                }
                textarea
                rows={7}
              />
            </BlueBox>
          </Box>
          <Box component="section" marginBottom={10}>
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
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${Constants.R_CASE_POLICE_DEMANDS_ROUTE}/${workingCase.id}`}
          nextUrl={`${Constants.R_CASE_CASE_FILES_ROUTE}/${workingCase.id}`}
          nextIsDisabled={!isValid}
          nextIsLoading={isLoading}
        />
      </FormContentContainer>
    </>
  )
}

export default PoliceReportForm
