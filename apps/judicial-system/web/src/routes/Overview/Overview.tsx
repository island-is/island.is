import React, { useState } from 'react'
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
import { Logo } from '../../shared-components/Logo/Logo'
import Modal from '../../shared-components/Modal/Modal'
import { formatDate, capitalize } from '../../utils/formatters'
import is from 'date-fns/locale/is'
import { getRestrictionByValue } from '../../utils/stepHelper'
import { CaseCustodyRestrictions } from '../../types'
import { FormFooter } from '../../shared-components/FormFooter'
import * as Constants from '../../utils/constants'
import * as api from '../../api'
import * as styles from './Overview.treat'

export const Overview: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [isSendingNotification, setIsSendingNotification] = useState(false)

  const caseDraft = window.localStorage.getItem('workingCase')
  const caseDraftJSON = JSON.parse(caseDraft)
  const history = useHistory()

  const renderSuspectName = () => (
    <Typography>
      Tilkynning hefur verið send á dómara á vakt.
      <br />
      Dómstóll: {caseDraftJSON.case.court}.
      <br />
      Sakborningur:
      <span className={styles.suspectName}>
        {` ${caseDraftJSON.case.suspectName}`}
      </span>
      .
    </Typography>
  )

  const handleNextButtonClick = async () => {
    try {
      setIsSendingNotification(true)
      await api.sendNotification(caseDraftJSON.id)
      setIsSendingNotification(false)
      return true
    } catch (e) {
      return false
    }
  }

  return (
    <>
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
              <Box component="section" marginBottom={5}>
                <Box marginBottom={1}>
                  <Typography variant="eyebrow" color="blue400">
                    LÖKE málsnúmer
                  </Typography>
                </Box>
                <Typography>{caseDraftJSON.case.policeCaseNumber}</Typography>
              </Box>
              <Box component="section" marginBottom={5}>
                <Box marginBottom={1}>
                  <Typography variant="eyebrow" color="blue400">
                    Fullt nafn kærða
                  </Typography>
                </Box>
                <Typography>{caseDraftJSON.case.suspectName}</Typography>
              </Box>
              <Box component="section" marginBottom={5}>
                <Box marginBottom={1}>
                  <Typography variant="eyebrow" color="blue400">
                    Lögheimili/dvalarstaður
                  </Typography>
                </Box>
                <Typography>{caseDraftJSON.case.suspectAddress}</Typography>
              </Box>
              <Box component="section" marginBottom={5}>
                <Box marginBottom={1}>
                  <Typography variant="eyebrow" color="blue400">
                    Dómstóll
                  </Typography>
                </Box>
                <Typography>{caseDraftJSON.case.court}</Typography>
              </Box>
              <Box component="section" marginBottom={5}>
                <Box marginBottom={1}>
                  <Typography variant="eyebrow" color="blue400">
                    Tími handtöku
                  </Typography>
                </Box>
                <Typography>
                  {`${capitalize(
                    formatDate(caseDraftJSON.case.arrestDate, 'PPPP', {
                      locale: is,
                    }),
                  )} kl. ${caseDraftJSON.case.arrestTime}`}
                </Typography>
              </Box>
              {caseDraftJSON.case.requestedCourtDate &&
                caseDraftJSON.case.requestedCourtTime && (
                  <Box component="section" marginBottom={5}>
                    <Box marginBottom={1}>
                      <Typography variant="eyebrow" color="blue400">
                        Ósk um fyrirtökudag og tíma
                      </Typography>
                    </Box>
                    <Typography>
                      {`${capitalize(
                        formatDate(
                          caseDraftJSON.case.requestedCourtDate,
                          'PPPP',
                          {
                            locale: is,
                          },
                        ),
                      )} kl. ${caseDraftJSON.case.requestedCourtTime}`}
                    </Typography>
                  </Box>
                )}
              <Box component="section" marginBottom={5}>
                <Accordion>
                  <AccordionItem id="id_1" label="Dómkröfur">
                    <Typography variant="p" as="p">
                      Gæsluvarðhald til
                      <strong>
                        {` ${formatDate(
                          caseDraftJSON.case.requestedCustodyEndDate,
                          'PPP',
                          { locale: is },
                        )} kl. ${caseDraftJSON.case.requestedCustodyEndTime}`}
                      </strong>
                    </Typography>
                  </AccordionItem>
                  <AccordionItem id="id_2" label="Lagaákvæði">
                    <Typography variant="p" as="p">
                      {caseDraftJSON.case.lawsBroken}
                    </Typography>
                  </AccordionItem>
                  <AccordionItem id="id_3" label="Takmarkanir á gæslu">
                    <Typography variant="p" as="p">
                      {caseDraftJSON.case.restrictions
                        .map(
                          (restriction: CaseCustodyRestrictions) =>
                            `${getRestrictionByValue(restriction)}`,
                        )
                        .toString()
                        .replace(',', ', ')}
                    </Typography>
                  </AccordionItem>
                  <AccordionItem
                    id="id_4"
                    label="Greinagerð um málsatvik og lagarök"
                  >
                    {caseDraftJSON.case.caseFacts && (
                      <Box marginBottom={2}>
                        <Box marginBottom={2}>
                          <Typography variant="h5">Málsatvik rakin</Typography>
                        </Box>
                        <Typography>{caseDraftJSON.case.caseFacts}</Typography>
                      </Box>
                    )}
                    {caseDraftJSON.case.witnessAccount && (
                      <Box marginBottom={2}>
                        <Box marginBottom={2}>
                          <Typography variant="h5">Framburður</Typography>
                        </Box>
                        <Typography>
                          {caseDraftJSON.case.witnessAccount}
                        </Typography>
                      </Box>
                    )}
                    {caseDraftJSON.case.investigationProgress && (
                      <Box marginBottom={2}>
                        <Box marginBottom={2}>
                          <Typography variant="h5">
                            Staða rannsóknar og næstu skref
                          </Typography>
                        </Box>
                        <Typography>
                          {caseDraftJSON.case.investigationProgress}
                        </Typography>
                      </Box>
                    )}
                    {caseDraftJSON.case.legalArguments && (
                      <Box marginBottom={2}>
                        <Box marginBottom={2}>
                          <Typography variant="h5">Lagarök</Typography>
                        </Box>
                        <Typography>
                          {caseDraftJSON.case.legalArguments}
                        </Typography>
                      </Box>
                    )}
                  </AccordionItem>
                </Accordion>
              </Box>
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
                confirmationText="Með því að ýta á þennan hnapp fær dómari á vakt tilkynningu um að krafan sé tilbúin."
              />
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Box>
      {modalVisible && (
        <Modal
          title="Krafa um gæsluvarðhald hefur verið staðfest"
          text={renderSuspectName() as JSX.Element}
          handleClose={() => history.push(Constants.DETENTION_REQUESTS_ROUTE)}
          handlePrimaryButtonClick={async () => {
            history.push(Constants.DETENTION_REQUESTS_ROUTE)
          }}
          primaryButtonText="Loka glugga og fara í yfirlit krafna"
        />
      )}
    </>
  )
}

export default Overview
