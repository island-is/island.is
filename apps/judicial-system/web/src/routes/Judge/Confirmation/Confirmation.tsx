import {
  Accordion,
  AccordionItem,
  Box,
  Bullet,
  BulletList,
  GridColumn,
  GridContainer,
  GridRow,
  Typography,
} from '@island.is/island-ui/core'
import React, { useContext, useEffect, useState } from 'react'
import { FormFooter } from '../../../shared-components/FormFooter'
import { JudgeLogo } from '../../../shared-components/Logos'
import Modal from '../../../shared-components/Modal/Modal'
import {
  AppealDecitionRole,
  Case,
  ConfirmSignatureResponse,
  RequestSignatureResponse,
} from '../../../types'
import useWorkingCase from '../../../utils/hooks/useWorkingCase'
import {
  constructConclusion,
  getAppealDecitionText,
  renderFormStepper,
} from '../../../utils/stepHelper'
import * as Constants from '../../../utils/constants'
import {
  TIME_FORMAT,
  formatDate,
  formatCustodyRestrictions,
} from '@island.is/judicial-system/formatters'
import { parseTransition } from '../../../utils/formatters'
import { capitalize } from 'lodash'
import AccordionListItem from '@island.is/judicial-system-web/src/shared-components/AccordionListItem/AccordionListItem'
import { CaseState, CaseTransition } from '@island.is/judicial-system/types'
import * as api from '../../../api'
import { userContext } from '@island.is/judicial-system-web/src/utils/userContext'
import { useHistory } from 'react-router-dom'

export const Confirmation: React.FC = () => {
  const [workingCase, setWorkingCase] = useWorkingCase()
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [signatureResponse, setSignatureResponse] = useState<
    RequestSignatureResponse
  >()
  const [confirmSignatureResponse, setConfirmSignatureResponse] = useState<
    ConfirmSignatureResponse
  >()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const uContext = useContext(userContext)
  const history = useHistory()

  useEffect(() => {
    document.title = 'Yfirlit úrskurðar - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    const wc: Case = JSON.parse(window.localStorage.getItem('workingCase'))
    if (wc && !workingCase) {
      setWorkingCase(wc)
    }
  }, [workingCase, setWorkingCase])

  useEffect(() => {
    if (!modalVisible) {
      setSignatureResponse(null)
      setConfirmSignatureResponse(null)
    }
  }, [modalVisible, setSignatureResponse, setConfirmSignatureResponse])

  const handleNextButtonClick = async () => {
    try {
      if (workingCase.state === CaseState.SUBMITTED) {
        // Parse the transition request
        const transitionRequest = parseTransition(
          workingCase.modified,
          workingCase.rejecting ? CaseTransition.REJECT : CaseTransition.ACCEPT,
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

        return true
      }
    } catch (e) {
      return false
    }
  }

  const renderContolCode = () => {
    return (
      <>
        <Box marginBottom={2}>
          <Typography variant="h2" color="blue400">
            {`Öryggistala: ${signatureResponse.response.controlCode}`}
          </Typography>
        </Box>
        <Typography>
          Þetta er ekki pin-númerið. Staðfestu aðeins innskráningu ef sama
          öryggistala birtist í símanum þínum.
        </Typography>
      </>
    )
  }

  return workingCase ? (
    <>
      <Box marginTop={7} marginBottom={30}>
        <GridContainer>
          <Box marginBottom={7}>
            <GridRow>
              <GridColumn span={'3/12'}>
                <JudgeLogo />
              </GridColumn>
              <GridColumn span={'8/12'} offset={'1/12'}>
                <Box marginBottom={10}>
                  <Typography as="h1" variant="h1">
                    Krafa um gæsluvarðhald
                  </Typography>
                  <Box display="flex" marginTop={1}>
                    <Box marginRight={2}>
                      <Typography variant="pSmall">{`Krafa stofnuð: ${formatDate(
                        workingCase.created,
                        'P',
                      )}`}</Typography>
                    </Box>
                    <Typography variant="pSmall">{`Þinghald: ${formatDate(
                      workingCase.courtStartTime,
                      'P',
                    )}`}</Typography>
                  </Box>
                </Box>
              </GridColumn>
            </GridRow>
          </Box>
          <GridRow>
            <GridColumn span={['12/12', '3/12']}>
              {renderFormStepper(1, 3)}
            </GridColumn>
            <GridColumn span={['12/12', '7/12']} offset={['0', '1/12']}>
              <Box component="section" marginBottom={7}>
                <Typography
                  variant="h2"
                  as="h2"
                >{`Mál nr. ${workingCase.courtCaseNumber}`}</Typography>
                <Typography fontWeight="semiBold">{`LÖKE málsnr. ${workingCase.policeCaseNumber}`}</Typography>
              </Box>
              <Box marginBottom={9}>
                <Accordion>
                  <AccordionItem
                    id="id_1"
                    label="Krafan um gæsluvarðhald frá Lögreglu"
                  >
                    <Box marginBottom={2}>
                      <Typography variant="h4" as="h4">
                        Grunnupplýsingar
                      </Typography>
                    </Box>
                    <Box marginBottom={1}>
                      <Typography>
                        Kennitala: {workingCase.accusedNationalId}
                      </Typography>
                    </Box>
                    <Box marginBottom={1}>
                      <Typography>
                        Fullt nafn: {workingCase.accusedName}
                      </Typography>
                    </Box>
                    <Box marginBottom={3}>
                      <Typography>
                        Lögheimili: {workingCase.accusedAddress}
                      </Typography>
                    </Box>
                    <AccordionListItem title="Tími handtöku">
                      {`${capitalize(
                        formatDate(workingCase.arrestDate, 'PPPP'),
                      )} kl. ${formatDate(
                        workingCase.arrestDate,
                        TIME_FORMAT,
                      )}`}
                    </AccordionListItem>
                    <AccordionListItem title="Ósk um fyrirtökudag og tíma">
                      {`${capitalize(
                        formatDate(workingCase.requestedCourtDate, 'PPPP'),
                      )} kl. ${formatDate(
                        workingCase.requestedCourtDate,
                        TIME_FORMAT,
                      )}`}
                    </AccordionListItem>
                    <AccordionListItem title="Dómkröfur">
                      {`Gæsluvarðhald til ${capitalize(
                        formatDate(workingCase.custodyEndDate, 'PPP'),
                      )} kl. ${formatDate(
                        workingCase.custodyEndDate,
                        TIME_FORMAT,
                      )}`}
                    </AccordionListItem>
                    <AccordionListItem title="Lagaákvæði">
                      {workingCase.lawsBroken}
                    </AccordionListItem>
                    <Box marginBottom={1}>
                      <Typography variant="h5">Takmarkanir á gæslu</Typography>
                    </Box>
                    <Box marginBottom={4}>
                      <Typography>
                        {formatCustodyRestrictions(
                          workingCase.custodyRestrictions,
                        )}
                      </Typography>
                    </Box>
                    <Box marginBottom={2}>
                      <Typography variant="h4" as="h4">
                        Greinargerð um málsatvik og lagarök
                      </Typography>
                    </Box>
                    <AccordionListItem title="Málsatvik rakin">
                      {workingCase.caseFacts}
                    </AccordionListItem>
                    <AccordionListItem title="Framburðir">
                      {workingCase.witnessAccounts}
                    </AccordionListItem>
                    <AccordionListItem title="Staða rannsóknar og næstu skref">
                      {workingCase.investigationProgress}
                    </AccordionListItem>
                    <AccordionListItem title="Lagarök">
                      {workingCase.legalArguments}
                    </AccordionListItem>
                  </AccordionItem>
                  <AccordionItem id="id_2" label="Þingbók">
                    <Box marginBottom={2}>
                      <Typography variant="h4" as="h4">
                        Upplýsingar
                      </Typography>
                    </Box>
                    <Box marginBottom={1}>
                      <Typography>
                        {`Þinghald frá kl. ${formatDate(
                          workingCase.courtStartTime,
                          TIME_FORMAT,
                        )} til kl. ${formatDate(
                          workingCase.courtEndTime,
                          TIME_FORMAT,
                        )} ${formatDate(workingCase.courtEndTime, 'PP')}`}
                      </Typography>
                    </Box>
                    <AccordionListItem title="Krafa lögreglu">
                      {workingCase.policeDemands}
                    </AccordionListItem>
                    <AccordionListItem title="Viðstaddir">
                      {workingCase.courtAttendees}
                    </AccordionListItem>
                    <AccordionListItem title="Dómskjöl">
                      Rannsóknargögn málsins liggja frammi. Krafa lögreglu
                      þingmerkt nr. 1.
                    </AccordionListItem>
                    <AccordionListItem title="Réttindi kærða">
                      Kærða er bent á að honum sé óskylt að svara spurningum er
                      varða brot það sem honum er gefið að sök, sbr. 2. mgr.
                      113. gr. laga nr. 88/2008. Kærði er enn fremur áminntur um
                      sannsögli kjósi hann að tjá sig um sakarefnið, sbr. 1.
                      mgr. 114. gr. sömu laga.
                    </AccordionListItem>
                    <AccordionListItem title="Afstaða kærða">
                      {workingCase.accusedPlea}
                    </AccordionListItem>
                    <AccordionListItem title="Málflutningur">
                      {workingCase.litigationPresentations}
                    </AccordionListItem>
                    <Box marginBottom={2}>
                      <Typography variant="h4" as="h4">
                        Úrskurður
                      </Typography>
                    </Box>
                    <Box marginBottom={1}>
                      <Typography>{workingCase.ruling}</Typography>
                    </Box>
                    <AccordionListItem title="Úrskurðarorð">
                      {constructConclusion(workingCase)}
                    </AccordionListItem>
                    <AccordionListItem title="Ákvörðun um kæru">
                      Dómari leiðbeinir málsaðilum um rétt þeirra til að kæra
                      úrskurð þennan til Landsréttar innan þriggja sólarhringa.
                      Dómari bendir kærða á að honum sé heimilt að bera atriði
                      er lúta að framkvæmd gæsluvarðhaldsins undir dómara.
                    </AccordionListItem>
                    <Box marginBottom={5}>
                      <BulletList>
                        <Bullet>
                          {getAppealDecitionText(
                            AppealDecitionRole.ACCUSED,
                            workingCase.accusedAppealDecision,
                          )}
                        </Bullet>
                        <Bullet>
                          {getAppealDecitionText(
                            AppealDecitionRole.PROSECUTOR,
                            workingCase.prosecutorAppealDecision,
                          )}
                        </Bullet>
                      </BulletList>
                    </Box>
                  </AccordionItem>
                </Accordion>
              </Box>
              <Box component="section" marginBottom={8}>
                <Box marginBottom={2}>
                  <Typography as="h4" variant="h4">
                    Úrskurður Héraðsdóms
                  </Typography>
                </Box>
                <Box marginBottom={7}>
                  <Typography variant="tag" color="blue400">
                    Niðurstaða úrskurðar
                  </Typography>
                  <Typography>{workingCase.ruling}</Typography>
                </Box>
              </Box>
              <Box component="section" marginBottom={8}>
                <Box marginBottom={10}>
                  <Box marginBottom={2}>
                    <Typography as="h4" variant="h4">
                      Ákvörðun um kæru
                    </Typography>
                  </Box>
                  <Box marginBottom={1}>
                    <Typography>
                      {getAppealDecitionText(
                        AppealDecitionRole.ACCUSED,
                        workingCase.accusedAppealDecision,
                      )}
                    </Typography>
                  </Box>
                  <Typography>
                    {getAppealDecitionText(
                      AppealDecitionRole.PROSECUTOR,
                      workingCase.prosecutorAppealDecision,
                    )}
                  </Typography>
                </Box>
              </Box>
              <Box component="section" marginBottom={8}>
                <Box marginBottom={10}>
                  <Box marginBottom={2}>
                    <Typography as="h4" variant="h4">
                      Úrskurðarorð
                    </Typography>
                  </Box>
                  <Box marginBottom={1}>
                    <Typography>{constructConclusion(workingCase)}</Typography>
                  </Box>
                </Box>
              </Box>
              {uContext?.user && (
                <Box marginBottom={15}>
                  <Typography variant="h3">
                    {`${uContext.user.name}, ${uContext.user.title}`}
                  </Typography>
                </Box>
              )}
              <FormFooter
                nextUrl={Constants.DETENTION_REQUESTS_ROUTE}
                nextButtonText="Staðfesta úrskurð"
                onNextButtonClick={async () => {
                  // Set loading indicator on the Continue button in the footer
                  setIsLoading(true)

                  // Accept or reject case
                  await handleNextButtonClick()

                  // Request signature to get control code
                  const signature = await api.requestSignature(workingCase.id)

                  if (
                    signature.httpStatusCode >= 200 &&
                    signature.httpStatusCode < 300
                  ) {
                    setSignatureResponse(signature)
                    setModalVisible(true)
                    setIsLoading(false)

                    // Confirm requested signature
                    const confirmSignature = await api.confirmSignature(
                      workingCase.id,
                      signature.response.documentToken,
                    )

                    setConfirmSignatureResponse(confirmSignature)
                  }
                }}
                nextIsLoading={isLoading}
              />
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Box>
      {modalVisible && (
        <Modal
          title={
            confirmSignatureResponse?.httpStatusCode >= 400
              ? confirmSignatureResponse?.code === 7023
                ? 'Notandi hætti við undirritun'
                : 'Undirritun tókst ekki'
              : confirmSignatureResponse?.httpStatusCode >= 200 &&
                confirmSignatureResponse?.httpStatusCode < 300
              ? 'Úrskurður hefur verið staðfestur og undirritaður'
              : 'Rafræn undirritun'
          }
          text={
            confirmSignatureResponse?.httpStatusCode >= 400
              ? 'Vinsamlegast reynið aftur svo hægt sé að senda úrskurðinn með undirritun.'
              : confirmSignatureResponse?.httpStatusCode >= 200 &&
                confirmSignatureResponse?.httpStatusCode < 300
              ? 'Tilkynning um úrskurð hefur verið send á ákæranda, verjanda og fangelsi.'
              : renderContolCode()
          }
          primaryButtonText={
            !confirmSignatureResponse
              ? null
              : confirmSignatureResponse.httpStatusCode >= 200 &&
                confirmSignatureResponse.httpStatusCode < 300
              ? 'Loka glugga og fara í yfirlit krafna'
              : 'Loka og reyna aftur'
          }
          handlePrimaryButtonClick={async () => {
            if (
              confirmSignatureResponse.httpStatusCode >= 200 &&
              confirmSignatureResponse.httpStatusCode < 300
            ) {
              history.push(Constants.DETENTION_REQUESTS_ROUTE)
            } else {
              setModalVisible(false)
            }
          }}
        />
      )}
    </>
  ) : null
}

export default Confirmation
