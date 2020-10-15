import React, { useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom'

import {
  GridContainer,
  GridRow,
  Box,
  GridColumn,
  Text,
  Accordion,
  AccordionItem,
} from '@island.is/island-ui/core'
import {
  CaseCustodyProvisions,
  CaseTransition,
} from '@island.is/judicial-system/types'

import { ProsecutorLogo } from '../../../shared-components/Logos'
import Modal from '../../../shared-components/Modal/Modal'
import {
  formatDate,
  capitalize,
  formatNationalId,
  laws,
} from '@island.is/judicial-system/formatters'
import { parseTransition } from '../../../utils/formatters'
import { FormFooter } from '../../../shared-components/FormFooter'
import * as Constants from '../../../utils/constants'
import {
  TIME_FORMAT,
  formatCustodyRestrictions,
} from '@island.is/judicial-system/formatters'
import * as api from '../../../api'
import { Case } from '@island.is/judicial-system-web/src/types'
import { userContext } from '../../../utils/userContext'
import { renderFormStepper } from '@island.is/judicial-system-web/src/utils/stepHelper'

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
          <Box marginBottom={7}>
            <GridRow>
              <GridColumn span={'3/12'}>
                <ProsecutorLogo />
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
              {renderFormStepper(0, 2)}
            </GridColumn>
            <GridColumn span={['12/12', '7/12']} offset={['0', '1/12']}>
              <Box component="section" marginBottom={5}>
                <Box marginBottom={1}>
                  <Text variant="eyebrow" color="blue400">
                    LÖKE málsnúmer
                  </Text>
                </Box>
                <Text>{workingCase.policeCaseNumber}</Text>
              </Box>
              <Box component="section" marginBottom={5}>
                <Box marginBottom={1}>
                  <Text variant="eyebrow" color="blue400">
                    Kennitala
                  </Text>
                </Box>
                <Text>{formatNationalId(workingCase.accusedNationalId)}</Text>
              </Box>
              <Box component="section" marginBottom={5}>
                <Box marginBottom={1}>
                  <Text variant="eyebrow" color="blue400">
                    Fullt nafn
                  </Text>
                </Box>
                <Text>{workingCase.accusedName}</Text>
              </Box>
              <Box component="section" marginBottom={5}>
                <Box marginBottom={1}>
                  <Text variant="eyebrow" color="blue400">
                    Lögheimili/dvalarstaður
                  </Text>
                </Box>
                <Text>{workingCase.accusedAddress}</Text>
              </Box>
              <Box component="section" marginBottom={5}>
                <Box marginBottom={1}>
                  <Text variant="eyebrow" color="blue400">
                    Dómstóll
                  </Text>
                </Box>
                <Text>{workingCase.court}</Text>
              </Box>
              <Box component="section" marginBottom={5}>
                <Box marginBottom={1}>
                  <Text variant="eyebrow" color="blue400">
                    Tími handtöku
                  </Text>
                </Box>
                <Text>
                  {`${capitalize(
                    formatDate(workingCase.arrestDate, 'PPPP'),
                  )} kl. ${formatDate(workingCase?.arrestDate, TIME_FORMAT)}`}
                </Text>
              </Box>
              {workingCase.requestedCourtDate && (
                <Box component="section" marginBottom={5}>
                  <Box marginBottom={1}>
                    <Text variant="eyebrow" color="blue400">
                      Ósk um fyrirtökudag og tíma
                    </Text>
                  </Box>
                  <Text>
                    {`${capitalize(
                      formatDate(workingCase.requestedCourtDate, 'PPPP'),
                    )} kl. ${formatDate(
                      workingCase?.requestedCourtDate,
                      TIME_FORMAT,
                    )}`}
                  </Text>
                </Box>
              )}
              <Box component="section" marginBottom={10}>
                <Accordion>
                  <AccordionItem labelVariant="h3" id="id_1" label="Dómkröfur">
                    <Text>
                      Gæsluvarðhald til
                      <Text as="span" fontWeight="semiBold">
                        {` ${formatDate(
                          workingCase?.requestedCustodyEndDate,
                          'PPP',
                        )} kl. ${formatDate(
                          workingCase?.requestedCustodyEndDate,
                          TIME_FORMAT,
                        )}`}
                      </Text>
                    </Text>
                  </AccordionItem>
                  <AccordionItem labelVariant="h3" id="id_2" label="Lagaákvæði">
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
                      {workingCase?.custodyProvisions.map(
                        (custodyProvision: CaseCustodyProvisions, index) => {
                          return (
                            <div key={index}>
                              <Text>{laws[custodyProvision]}</Text>
                            </div>
                          )
                        },
                      )}
                    </Box>
                  </AccordionItem>
                  <AccordionItem
                    labelVariant="h3"
                    id="id_3"
                    label="Takmarkanir á gæslu"
                  >
                    <Text>
                      {formatCustodyRestrictions(
                        workingCase.requestedCustodyRestrictions,
                      )}
                    </Text>
                  </AccordionItem>
                  <AccordionItem
                    labelVariant="h3"
                    id="id_4"
                    label="Greinagerð um málsatvik og lagarök"
                  >
                    {workingCase.caseFacts && (
                      <Box marginBottom={2}>
                        <Box marginBottom={2}>
                          <Text variant="h5">Málsatvik rakin</Text>
                        </Box>
                        <Text>{workingCase.caseFacts}</Text>
                      </Box>
                    )}
                    {workingCase.witnessAccounts && (
                      <Box marginBottom={2}>
                        <Box marginBottom={2}>
                          <Text variant="h5">Framburður</Text>
                        </Box>
                        <Text>{workingCase.witnessAccounts}</Text>
                      </Box>
                    )}
                    {workingCase.investigationProgress && (
                      <Box marginBottom={2}>
                        <Box marginBottom={2}>
                          <Text variant="h5">
                            Staða rannsóknar og næstu skref
                          </Text>
                        </Box>
                        <Text>{workingCase.investigationProgress}</Text>
                      </Box>
                    )}
                    {workingCase.legalArguments && (
                      <Box marginBottom={2}>
                        <Box marginBottom={2}>
                          <Text variant="h5">Lagarök</Text>
                        </Box>
                        <Text>{workingCase.legalArguments}</Text>
                      </Box>
                    )}
                  </AccordionItem>
                </Accordion>
              </Box>
              <Box marginBottom={15}>
                <Box marginBottom={1}>
                  <Text>F.h.l</Text>
                </Box>
                <Text variant="h3">
                  {workingCase?.prosecutor
                    ? `${workingCase?.prosecutor.name}, ${workingCase?.prosecutor.title}`
                    : `${uContext?.user?.name}, ${uContext?.user?.title}`}{' '}
                </Text>
              </Box>
              <FormFooter
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
