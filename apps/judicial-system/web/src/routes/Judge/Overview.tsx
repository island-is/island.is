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

export const JudgeOverview: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const caseDraft = window.localStorage.getItem('workingCase')
  const caseDraftJSON = JSON.parse(caseDraft)
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
  const [workingCase, setWorkingCase] = useState<Case>()

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

  return (
    <Box marginTop={7} marginBottom={30}>
      <GridContainer>
        <GridRow>
          <GridColumn span={'3/12'}>
            <Logo />
          </GridColumn>
          <GridColumn span={'8/12'} offset={'1/12'}>
            <Typography as="h1">Krafa um gæsluvarðhald</Typography>
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn span={['12/12', '3/12']}>
            <Typography>Hliðarstika</Typography>
          </GridColumn>
          <GridColumn span={['12/12', '7/12']} offset={['0', '1/12']}>
            <Box component="section" marginBottom={7}>
              <Box marginBottom={2}>
                <Typography as="h3" variant="h3">
                  Málsnúmer héraðsdóms
                </Typography>
              </Box>
            </Box>
            <Box component="section" marginBottom={5}>
              <Box marginBottom={1}>
                <Typography variant="eyebrow" color="blue400">
                  LÖKE málsnúmer
                </Typography>
              </Box>
              <Typography>{caseDraftJSON.policeCaseNumber}</Typography>
            </Box>
            <Box component="section" marginBottom={5}>
              <Box marginBottom={1}>
                <Typography variant="eyebrow" color="blue400">
                  Fullt nafn kærða
                </Typography>
              </Box>
              <Typography>{caseDraftJSON.suspectName}</Typography>
            </Box>
            <Box component="section" marginBottom={5}>
              <Box marginBottom={1}>
                <Typography variant="eyebrow" color="blue400">
                  Lögheimili/dvalarstaður
                </Typography>
              </Box>
              <Typography>{caseDraftJSON.suspectAddress}</Typography>
            </Box>
            <Box component="section" marginBottom={5}>
              <Box marginBottom={1}>
                <Typography variant="eyebrow" color="blue400">
                  Dómstóll
                </Typography>
              </Box>
              <Typography>{caseDraftJSON.court}</Typography>
            </Box>
            <Box component="section" marginBottom={5}>
              <Box marginBottom={1}>
                <Typography variant="eyebrow" color="blue400">
                  Tími handtöku
                </Typography>
              </Box>
              <Typography>
                {`${capitalize(
                  formatDate(caseDraftJSON.arrestDate, 'PPPP', {
                    locale: is,
                  }),
                )} kl. ${caseDraftJSON.arrestTime}`}
              </Typography>
            </Box>
            {caseDraftJSON.requestedCourtDate &&
              caseDraftJSON.requestedCourtTime && (
                <Box component="section" marginBottom={5}>
                  <Box marginBottom={1}>
                    <Typography variant="eyebrow" color="blue400">
                      Ósk um fyrirtökudag og tíma
                    </Typography>
                  </Box>
                  <Typography>
                    {`${capitalize(
                      formatDate(caseDraftJSON.requestedCourtDate, 'PPPP', {
                        locale: is,
                      }),
                    )} kl. ${caseDraftJSON.requestedCourtTime}`}
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
                      {` ${formatDate(
                        caseDraftJSON.requestedCustodyEndDate,
                        'PPP',
                        { locale: is },
                      )} kl. ${caseDraftJSON.requestedCustodyEndTime}`}
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
                    {caseDraftJSON.lawsBroken}
                  </Typography>
                </AccordionItem>
                <AccordionItem
                  id="id_3"
                  label="Takmarkanir á gæslu"
                  expanded={accordionItemThreeExpanded}
                  onToggle={() => setAccordionItemThreeExpanded(false)}
                >
                  <Typography variant="p" as="p">
                    {caseDraftJSON.custodyRestrictions
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
                  {caseDraftJSON.caseFacts && (
                    <Box marginBottom={2}>
                      <Box marginBottom={2}>
                        <Typography variant="h5">Málsatvik rakin</Typography>
                      </Box>
                      <Typography>{caseDraftJSON.caseFacts}</Typography>
                    </Box>
                  )}
                  {caseDraftJSON.witnessAccount && (
                    <Box marginBottom={2}>
                      <Box marginBottom={2}>
                        <Typography variant="h5">Framburður</Typography>
                      </Box>
                      <Typography>{caseDraftJSON.witnessAccount}</Typography>
                    </Box>
                  )}
                  {caseDraftJSON.investigationProgress && (
                    <Box marginBottom={2}>
                      <Box marginBottom={2}>
                        <Typography variant="h5">
                          Staða rannsóknar og næstu skref
                        </Typography>
                      </Box>
                      <Typography>
                        {caseDraftJSON.investigationProgress}
                      </Typography>
                    </Box>
                  )}
                  {caseDraftJSON.legalArguments && (
                    <Box marginBottom={2}>
                      <Box marginBottom={2}>
                        <Typography variant="h5">Lagarök</Typography>
                      </Box>
                      <Typography>{caseDraftJSON.legalArguments}</Typography>
                    </Box>
                  )}
                </AccordionItem>
              </Accordion>
            </Box>
            <FormFooter
              previousUrl="/stofna-krofu/lagaakvaedi"
              nextUrl="/"
              nextButtonText="Staðfesta kröfu fyrir héraðsdóm"
              confirmationText="Með því að ýta á þennan hnapp fær dómari á vakt tilkynningu um að krafan sé tilbúin."
            />
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Box>
  )
}

export default JudgeOverview
