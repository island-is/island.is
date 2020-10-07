import React, { useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom'

import {
  GridContainer,
  GridRow,
  Box,
  GridColumn,
  Typography,
  Accordion,
  AccordionItem,
} from '@island.is/island-ui/core'
import { CaseTransition } from '@island.is/judicial-system/types'

import { ProsecutorLogo } from '../../../shared-components/Logos'
import Modal from '../../../shared-components/Modal/Modal'
import {
  formatDate,
  capitalize,
  parseTransition,
} from '../../../utils/formatters'
import { renderFormStepper, renderRestrictons } from '../../../utils/stepHelper'
import { FormFooter } from '../../../shared-components/FormFooter'
import * as Constants from '../../../utils/constants'
import * as api from '../../../api'
import { Case } from '@island.is/judicial-system-web/src/types'
import { userContext } from '../../../utils/userContext'

export const Overview: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [, setIsSendingNotification] = useState(false)
  const [workingCase, setWorkingCase] = useState<Case>(null)

  const history = useHistory()
  const uContext = useContext(userContext)

  const handleNextButtonClick = async () => {
    try {
      // Parse the transition request
      const transitionRequest = parseTransition(
        workingCase.modified,
        CaseTransition.SUBMIT,
      )

      // Transition the case
      const response = await api.transitionCase(
        workingCase.id,
        transitionRequest,
      )

      if (response !== 200) {
        // Improve error handling at some point
        return false
      }

      setIsSendingNotification(true)
      await api.sendNotification(workingCase.id)
      setIsSendingNotification(false)
      return true
    } catch (e) {
      return false
    }
  }

  useEffect(() => {
    document.title = 'Yfirlit kröfu - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    const caseDraft = window.localStorage.getItem('workingCase')
    const caseDraftJSON = JSON.parse(caseDraft)

    if (!workingCase) {
      setWorkingCase(caseDraftJSON)
    }
  }, [workingCase, setWorkingCase])

  return workingCase ? (
    <>
      <Box marginTop={7} marginBottom={30}>
        <GridContainer>
          <GridRow>
            <GridColumn span={'3/12'}>
              <ProsecutorLogo />
            </GridColumn>
            <GridColumn span={'8/12'} offset={'1/12'}>
              <Typography as="h1" variant="h1">
                Krafa um gæsluvarðhald
              </Typography>
            </GridColumn>
          </GridRow>
          <GridRow>
            <GridColumn span={['12/12', '3/12']}>
              {renderFormStepper(0, 2)}
            </GridColumn>
            <GridColumn span={['12/12', '7/12']} offset={['0', '1/12']}>
              <Box component="section" marginBottom={5}>
                <Box marginBottom={1}>
                  <Typography variant="eyebrow" color="blue400">
                    LÖKE málsnúmer
                  </Typography>
                </Box>
                <Typography>{workingCase.policeCaseNumber}</Typography>
              </Box>
              <Box component="section" marginBottom={5}>
                <Box marginBottom={1}>
                  <Typography variant="eyebrow" color="blue400">
                    Kennitala
                  </Typography>
                </Box>
                <Typography>{workingCase.accusedNationalId}</Typography>
              </Box>
              <Box component="section" marginBottom={5}>
                <Box marginBottom={1}>
                  <Typography variant="eyebrow" color="blue400">
                    Fullt nafn
                  </Typography>
                </Box>
                <Typography>{workingCase.accusedName}</Typography>
              </Box>
              <Box component="section" marginBottom={5}>
                <Box marginBottom={1}>
                  <Typography variant="eyebrow" color="blue400">
                    Lögheimili/dvalarstaður
                  </Typography>
                </Box>
                <Typography>{workingCase.accusedAddress}</Typography>
              </Box>
              <Box component="section" marginBottom={5}>
                <Box marginBottom={1}>
                  <Typography variant="eyebrow" color="blue400">
                    Dómstóll
                  </Typography>
                </Box>
                <Typography>{workingCase.court}</Typography>
              </Box>
              <Box component="section" marginBottom={5}>
                <Box marginBottom={1}>
                  <Typography variant="eyebrow" color="blue400">
                    Tími handtöku
                  </Typography>
                </Box>
                <Typography>
                  {`${capitalize(
                    formatDate(workingCase.arrestDate, 'PPPP'),
                  )} kl. ${formatDate(
                    workingCase?.arrestDate,
                    Constants.TIME_FORMAT,
                  )}`}
                </Typography>
              </Box>
              {workingCase.requestedCourtDate && (
                <Box component="section" marginBottom={5}>
                  <Box marginBottom={1}>
                    <Typography variant="eyebrow" color="blue400">
                      Ósk um fyrirtökudag og tíma
                    </Typography>
                  </Box>
                  <Typography>
                    {`${capitalize(
                      formatDate(workingCase.requestedCourtDate, 'PPPP'),
                    )} kl. ${formatDate(
                      workingCase?.requestedCourtDate,
                      Constants.TIME_FORMAT,
                    )}`}
                  </Typography>
                </Box>
              )}
              <Box component="section" marginBottom={10}>
                <Accordion>
                  <AccordionItem id="id_1" label="Dómkröfur">
                    <Typography variant="p" as="p">
                      Gæsluvarðhald til
                      <strong>
                        {` ${formatDate(
                          workingCase?.requestedCustodyEndDate,
                          'PPP',
                        )} kl. ${formatDate(
                          workingCase?.requestedCustodyEndDate,
                          Constants.TIME_FORMAT,
                        )}`}
                      </strong>
                    </Typography>
                  </AccordionItem>
                  <AccordionItem id="id_2" label="Lagaákvæði">
                    <Typography variant="p" as="p">
                      {workingCase.lawsBroken}
                    </Typography>
                  </AccordionItem>
                  <AccordionItem id="id_3" label="Takmarkanir á gæslu">
                    <Typography variant="p" as="p">
                      {renderRestrictons(
                        workingCase.requestedCustodyRestrictions,
                      )}
                    </Typography>
                  </AccordionItem>
                  <AccordionItem
                    id="id_4"
                    label="Greinagerð um málsatvik og lagarök"
                  >
                    {workingCase.caseFacts && (
                      <Box marginBottom={2}>
                        <Box marginBottom={2}>
                          <Typography variant="h5">Málsatvik rakin</Typography>
                        </Box>
                        <Typography>{workingCase.caseFacts}</Typography>
                      </Box>
                    )}
                    {workingCase.witnessAccounts && (
                      <Box marginBottom={2}>
                        <Box marginBottom={2}>
                          <Typography variant="h5">Framburður</Typography>
                        </Box>
                        <Typography>{workingCase.witnessAccounts}</Typography>
                      </Box>
                    )}
                    {workingCase.investigationProgress && (
                      <Box marginBottom={2}>
                        <Box marginBottom={2}>
                          <Typography variant="h5">
                            Staða rannsóknar og næstu skref
                          </Typography>
                        </Box>
                        <Typography>
                          {workingCase.investigationProgress}
                        </Typography>
                      </Box>
                    )}
                    {workingCase.legalArguments && (
                      <Box marginBottom={2}>
                        <Box marginBottom={2}>
                          <Typography variant="h5">Lagarök</Typography>
                        </Box>
                        <Typography>{workingCase.legalArguments}</Typography>
                      </Box>
                    )}
                  </AccordionItem>
                </Accordion>
              </Box>
              {uContext?.user && (
                <Box marginBottom={15}>
                  <Box marginBottom={1}>
                    <Typography>F.h.l</Typography>
                  </Box>
                  <Typography variant="h3">
                    {`${uContext.user.name}, ${uContext.user.title}`}
                  </Typography>
                </Box>
              )}
              <FormFooter
                previousUrl={Constants.STEP_TWO_ROUTE}
                nextUrl="/"
                nextButtonText="Staðfesta kröfu fyrir héraðsdóm"
                onNextButtonClick={() => {
                  const didSendNotification = handleNextButtonClick()
                  if (didSendNotification) {
                    setModalVisible(true)
                  } else {
                    // TODO: Handle error
                  }
                }}
              />
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Box>
      {modalVisible && (
        <Modal
          title="Krafa um gæsluvarðhald hefur verið staðfest"
          text="Tilkynning hefur verið send á dómara og dómritara á vakt."
          handleClose={() => history.push(Constants.DETENTION_REQUESTS_ROUTE)}
          handlePrimaryButtonClick={async () => {
            history.push(Constants.DETENTION_REQUESTS_ROUTE)
          }}
          primaryButtonText="Loka glugga og fara í yfirlit krafna"
        />
      )}
    </>
  ) : null
}

export default Overview
