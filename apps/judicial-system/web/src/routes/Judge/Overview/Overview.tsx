import React, { useEffect, useState } from 'react'
import {
  GridContainer,
  GridRow,
  Box,
  GridColumn,
  Text,
  Accordion,
  AccordionItem,
  Input,
} from '@island.is/island-ui/core'
import { JudgeLogo } from '../../../shared-components/Logos'
import {
  formatDate,
  capitalize,
  formatCustodyRestrictions,
  laws,
} from '@island.is/judicial-system/formatters'
import { autoSave, renderFormStepper } from '../../../utils/stepHelper'
import { FormFooter } from '../../../shared-components/FormFooter'
import { useParams } from 'react-router-dom'
import * as api from '../../../api'
import { validate } from '../../../utils/validate'
import useWorkingCase from '../../../utils/hooks/useWorkingCase'
import * as Constants from '../../../utils/constants'
import { TIME_FORMAT } from '@island.is/judicial-system/formatters'
import { Case } from '@island.is/judicial-system-web/src/types'
import { CaseCustodyProvisions } from '@island.is/judicial-system/types'

export const JudgeOverview: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [
    courtCaseNumberErrorMessage,
    setCourtCaseNumberErrorMessage,
  ] = useState('')
  const [workingCase, setWorkingCase] = useWorkingCase()

  useEffect(() => {
    document.title = 'Yfirlit kröfu - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    let mounted = true

    const getCurrentCase = async () => {
      const currentCase = await api.getCaseById(id)
      window.localStorage.setItem(
        'workingCase',
        JSON.stringify(currentCase.case),
      )

      if (mounted && !workingCase) {
        setWorkingCase(currentCase.case)
      }
    }

    if (id) {
      getCurrentCase()
    }

    return () => {
      mounted = false
    }
  }, [id, workingCase, setWorkingCase])

  return workingCase ? (
    <Box marginTop={7} marginBottom={30}>
      <GridContainer>
        <Box marginBottom={7}>
          <GridRow>
            <GridColumn span={'3/12'}>
              <JudgeLogo />
            </GridColumn>
            <GridColumn span={'8/12'} offset={'1/12'}>
              <Text as="h1" variant="h1">
                Krafa um gæsluvarðhald
              </Text>
            </GridColumn>
          </GridRow>
        </Box>
        <GridRow>
          <GridColumn span={['12/12', '3/12']}>
            {renderFormStepper(1, 0)}
          </GridColumn>
          <GridColumn span={['12/12', '7/12']} offset={['0', '1/12']}>
            <Box component="section" marginBottom={8}>
              <Box marginBottom={2}>
                <Text as="h3" variant="h3">
                  Málsnúmer héraðsdóms
                </Text>
              </Box>
              <Box marginBottom={1}>
                <Input
                  data-testid="courtCaseNumber"
                  name="courtCaseNumber"
                  label="Slá inn málsnúmer"
                  defaultValue={workingCase?.courtCaseNumber}
                  errorMessage={courtCaseNumberErrorMessage}
                  hasError={courtCaseNumberErrorMessage !== ''}
                  onBlur={(evt) => {
                    const validateField = validate(evt.target.value, 'empty')

                    if (validateField.isValid) {
                      autoSave(
                        workingCase,
                        'courtCaseNumber',
                        evt.target.value,
                        setWorkingCase,
                      )
                    } else {
                      setCourtCaseNumberErrorMessage(validateField.errorMessage)
                    }
                  }}
                  onFocus={() => setCourtCaseNumberErrorMessage('')}
                  required
                />
              </Box>
              <Box>
                <Text
                  variant="small"
                  fontWeight="semiBold"
                >{`LÖKE málsnr. ${workingCase?.policeCaseNumber}`}</Text>
              </Box>
            </Box>
            <Box component="section" marginBottom={5}>
              <Box marginBottom={1}>
                <Text variant="eyebrow" color="blue400">
                  Fullt nafn
                </Text>
              </Box>
              <Text>{workingCase?.accusedName}</Text>
            </Box>
            <Box component="section" marginBottom={5}>
              <Box marginBottom={1}>
                <Text variant="eyebrow" color="blue400">
                  Lögheimili/dvalarstaður
                </Text>
              </Box>
              <Text>{workingCase?.accusedAddress}</Text>
            </Box>
            <Box component="section" marginBottom={5}>
              <Box marginBottom={1}>
                <Text variant="eyebrow" color="blue400">
                  Dómstóll
                </Text>
              </Box>
              <Text>{workingCase?.court}</Text>
            </Box>
            <Box component="section" marginBottom={5}>
              <Box marginBottom={1}>
                <Text variant="eyebrow" color="blue400">
                  Tími handtöku
                </Text>
              </Box>
              <Text>
                {workingCase?.arrestDate &&
                  `${capitalize(
                    formatDate(workingCase?.arrestDate, 'PPPP'),
                  )} kl. ${formatDate(workingCase?.arrestDate, TIME_FORMAT)}`}
              </Text>
            </Box>
            {workingCase?.requestedCourtDate && (
              <Box component="section" marginBottom={5}>
                <Box marginBottom={1}>
                  <Text variant="eyebrow" color="blue400">
                    Ósk um fyrirtökudag og tíma
                  </Text>
                </Box>
                <Text>
                  {`${capitalize(
                    formatDate(workingCase?.requestedCourtDate, 'PPPP'),
                  )} kl. ${formatDate(
                    workingCase?.requestedCourtDate,
                    TIME_FORMAT,
                  )}`}
                </Text>
              </Box>
            )}
            <Box component="section" marginBottom={5}>
              <Accordion singleExpand={false}>
                <AccordionItem
                  id="id_1"
                  label="Dómkröfur"
                  startExpanded
                  labelVariant="h3"
                >
                  <Text>
                    Gæsluvarðhald til
                    <strong>
                      {workingCase?.requestedCustodyEndDate &&
                        ` ${formatDate(
                          workingCase?.requestedCustodyEndDate,
                          'PPP',
                        )} kl. ${formatDate(
                          workingCase.requestedCustodyEndDate,
                          TIME_FORMAT,
                        )}`}
                    </strong>
                  </Text>
                </AccordionItem>
                <AccordionItem
                  id="id_2"
                  label="Lagaákvæði"
                  startExpanded
                  labelVariant="h3"
                >
                  <Box marginBottom={2}>
                    <Box marginBottom={2}>
                      <Text as="h4" variant="h4">
                        Lagaákvæði sem brot varða við
                      </Text>
                    </Box>
                    <Text>{workingCase?.lawsBroken}</Text>
                  </Box>
                  <Box marginBottom={2}>
                    <Box marginBottom={2}>
                      <Text as="h4" variant="h4">
                        Lagaákvæði sem krafan er byggð á
                      </Text>
                    </Box>
                    <Text>
                      {workingCase?.custodyProvisions.map(
                        (custodyProvision: CaseCustodyProvisions, index) => {
                          return <div key={index}>{laws[custodyProvision]}</div>
                        },
                      )}
                    </Text>
                  </Box>
                </AccordionItem>
                <AccordionItem
                  id="id_3"
                  label="Takmarkanir á gæslu"
                  startExpanded
                  labelVariant="h3"
                >
                  <Text>
                    {formatCustodyRestrictions(
                      workingCase.requestedCustodyRestrictions,
                    )}
                  </Text>
                </AccordionItem>
                <AccordionItem
                  id="id_4"
                  label="Greinagerð um málsatvik og lagarök"
                  startExpanded
                  labelVariant="h3"
                >
                  {workingCase?.caseFacts && (
                    <Box marginBottom={2}>
                      <Box marginBottom={2}>
                        <Text variant="h5">Málsatvik rakin</Text>
                      </Box>
                      <Text>{workingCase?.caseFacts}</Text>
                    </Box>
                  )}
                  {workingCase?.witnessAccounts && (
                    <Box marginBottom={2}>
                      <Box marginBottom={2}>
                        <Text variant="h5">Framburður</Text>
                      </Box>
                      <Text>{workingCase?.witnessAccounts}</Text>
                    </Box>
                  )}
                  {workingCase?.investigationProgress && (
                    <Box marginBottom={2}>
                      <Box marginBottom={2}>
                        <Text variant="h5">
                          Staða rannsóknar og næstu skref
                        </Text>
                      </Box>
                      <Text>{workingCase?.investigationProgress}</Text>
                    </Box>
                  )}
                  {workingCase?.legalArguments && (
                    <Box marginBottom={2}>
                      <Box marginBottom={2}>
                        <Text variant="h5">Lagarök</Text>
                      </Box>
                      <Text>{workingCase?.legalArguments}</Text>
                    </Box>
                  )}
                </AccordionItem>
              </Accordion>
            </Box>
            <FormFooter
              nextUrl={Constants.COURT_DOCUMENT_ROUTE}
              nextIsDisabled={workingCase?.courtCaseNumber === ''}
            />
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Box>
  ) : null
}

export default JudgeOverview
