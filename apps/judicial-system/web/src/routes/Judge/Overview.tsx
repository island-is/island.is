import React, { useEffect, useState } from 'react'
import {
  GridContainer,
  GridRow,
  Box,
  GridColumn,
  Typography,
  Accordion,
  AccordionItem,
  Input,
} from '@island.is/island-ui/core'
import { Logo } from '../../shared-components/Logo/Logo'
import { formatDate, capitalize } from '../../utils/formatters'
import is from 'date-fns/locale/is'
import { autoSave, getRestrictionByValue } from '../../utils/stepHelper'
import { Case, CustodyRestrictions } from '../../types'
import { FormFooter } from '../../shared-components/FormFooter'
import { useParams } from 'react-router-dom'
import * as api from '../../api'
import { validate } from '../../utils/validate'
import useWorkingCase from '../../utils/hooks/useWorkingCase'
import * as Constants from '../../utils/constants'

export const JudgeOverview: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [accordionItemOneExpanded, setAccordionItemOneExpanded] = useState(true)
  const [accordionItemTwoExpanded, setAccordionItemTwoExpanded] = useState(true)
  const [accordionItemThreeExpanded, setAccordionItemThreeExpanded] = useState(
    true,
  )
  const [accordionItemFourExpanded, setAccordionItemFourExpanded] = useState(
    true,
  )
  const [
    courtCaseNumberErrorMessage,
    setCourtCaseNumberErrorMessage,
  ] = useState('')
  const [workingCase, setWorkingCase] = useWorkingCase()

  useEffect(() => {
    const getCurrentCase = async () => {
      const currentCase = await api.getCaseById(id)
      window.localStorage.setItem('workingCase', JSON.stringify(currentCase))
      setWorkingCase(currentCase.case)
    }

    if (id) {
      getCurrentCase()
    }
  }, [])

  return workingCase ? (
    <Box marginTop={7} marginBottom={30}>
      <GridContainer>
        <GridRow>
          <GridColumn span={'3/12'}>
            <Logo />
          </GridColumn>
          <GridColumn span={'8/12'} offset={'1/12'}>
            <Typography as="h1" variant="h1">
              Krafa um gæsluvarðhald
            </Typography>
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn span={['12/12', '3/12']}>
            <Typography>Hliðarstika</Typography>
          </GridColumn>
          <GridColumn span={['12/12', '7/12']} offset={['0', '1/12']}>
            <Box component="section" marginBottom={8}>
              <Box marginBottom={2}>
                <Typography as="h3" variant="h3">
                  Málsnúmer héraðsdóms
                </Typography>
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
                <Typography
                  variant="pSmall"
                  fontWeight="semiBold"
                >{`LÖKE málsnr. ${workingCase?.policeCaseNumber}`}</Typography>
              </Box>
            </Box>
            <Box component="section" marginBottom={5}>
              <Box marginBottom={1}>
                <Typography variant="eyebrow" color="blue400">
                  Fullt nafn kærða
                </Typography>
              </Box>
              <Typography>{workingCase?.suspectName}</Typography>
            </Box>
            <Box component="section" marginBottom={5}>
              <Box marginBottom={1}>
                <Typography variant="eyebrow" color="blue400">
                  Lögheimili/dvalarstaður
                </Typography>
              </Box>
              <Typography>{workingCase?.suspectAddress}</Typography>
            </Box>
            <Box component="section" marginBottom={5}>
              <Box marginBottom={1}>
                <Typography variant="eyebrow" color="blue400">
                  Dómstóll
                </Typography>
              </Box>
              <Typography>{workingCase?.court}</Typography>
            </Box>
            <Box component="section" marginBottom={5}>
              <Box marginBottom={1}>
                <Typography variant="eyebrow" color="blue400">
                  Tími handtöku
                </Typography>
              </Box>
              <Typography>
                {workingCase?.arrestDate &&
                  `${capitalize(
                    formatDate(workingCase?.arrestDate, 'PPPP', {
                      locale: is,
                    }),
                  )} kl. ${formatDate(
                    workingCase?.arrestDate,
                    Constants.TIME_FORMAT,
                  )}`}
              </Typography>
            </Box>
            {workingCase?.requestedCourtDate && (
              <Box component="section" marginBottom={5}>
                <Box marginBottom={1}>
                  <Typography variant="eyebrow" color="blue400">
                    Ósk um fyrirtökudag og tíma
                  </Typography>
                </Box>
                <Typography>
                  {`${capitalize(
                    formatDate(workingCase?.requestedCourtDate, 'PPPP', {
                      locale: is,
                    }),
                  )} kl. ${formatDate(
                    workingCase?.requestedCourtDate,
                    Constants.TIME_FORMAT,
                  )}`}
                </Typography>
              </Box>
            )}
            <Box component="section" marginBottom={5}>
              <Accordion>
                <AccordionItem
                  id="id_1"
                  label="Dómkröfur"
                  expanded={accordionItemOneExpanded}
                  onToggle={() => setAccordionItemOneExpanded(false)}
                >
                  <Typography variant="p" as="p">
                    Gæsluvarðhald til
                    <strong>
                      {workingCase?.requestedCustodyEndDate &&
                        ` ${formatDate(
                          workingCase?.requestedCustodyEndDate,
                          'PPP',
                          { locale: is },
                        )} kl. ${formatDate(
                          workingCase.requestedCustodyEndDate,
                          Constants.TIME_FORMAT,
                        )}`}
                    </strong>
                  </Typography>
                </AccordionItem>
                <AccordionItem
                  id="id_2"
                  label="Lagaákvæði"
                  expanded={accordionItemTwoExpanded}
                  onToggle={() => setAccordionItemTwoExpanded(false)}
                >
                  <Typography variant="p" as="p">
                    {workingCase?.lawsBroken}
                  </Typography>
                </AccordionItem>
                <AccordionItem
                  id="id_3"
                  label="Takmarkanir á gæslu"
                  expanded={accordionItemThreeExpanded}
                  onToggle={() => setAccordionItemThreeExpanded(false)}
                >
                  <Typography variant="p" as="p">
                    {workingCase?.custodyRestrictions?.length > 0 &&
                      workingCase?.custodyRestrictions
                        .map(
                          (restriction: CustodyRestrictions) =>
                            `${getRestrictionByValue(restriction)}`,
                        )
                        .toString()
                        .replace(',', ', ')}
                  </Typography>
                </AccordionItem>
                <AccordionItem
                  id="id_4"
                  label="Greinagerð um málsatvik og lagarök"
                  expanded={accordionItemFourExpanded}
                  onToggle={() => setAccordionItemFourExpanded(false)}
                >
                  {workingCase?.caseFacts && (
                    <Box marginBottom={2}>
                      <Box marginBottom={2}>
                        <Typography variant="h5">Málsatvik rakin</Typography>
                      </Box>
                      <Typography>{workingCase?.caseFacts}</Typography>
                    </Box>
                  )}
                  {workingCase?.witnessAccounts && (
                    <Box marginBottom={2}>
                      <Box marginBottom={2}>
                        <Typography variant="h5">Framburður</Typography>
                      </Box>
                      <Typography>{workingCase?.witnessAccounts}</Typography>
                    </Box>
                  )}
                  {workingCase?.investigationProgress && (
                    <Box marginBottom={2}>
                      <Box marginBottom={2}>
                        <Typography variant="h5">
                          Staða rannsóknar og næstu skref
                        </Typography>
                      </Box>
                      <Typography>
                        {workingCase?.investigationProgress}
                      </Typography>
                    </Box>
                  )}
                  {workingCase?.legalArguments && (
                    <Box marginBottom={2}>
                      <Box marginBottom={2}>
                        <Typography variant="h5">Lagarök</Typography>
                      </Box>
                      <Typography>{workingCase?.legalArguments}</Typography>
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
