import React, { useState, useEffect, useContext } from 'react'
import { useHistory, useParams } from 'react-router-dom'

import { Box, Text, Accordion, AccordionItem } from '@island.is/island-ui/core'
import {
  Case,
  CaseCustodyProvisions,
  CaseTransition,
  NotificationType,
  TransitionCase,
  CaseState,
} from '@island.is/judicial-system/types'

import Modal from '../../../shared-components/Modal/Modal'
import {
  formatDate,
  capitalize,
  formatNationalId,
  laws,
  formatGender,
} from '@island.is/judicial-system/formatters'
import { parseTransition } from '../../../utils/formatters'
import { FormFooter } from '../../../shared-components/FormFooter'
import * as Constants from '../../../utils/constants'
import {
  TIME_FORMAT,
  formatCustodyRestrictions,
} from '@island.is/judicial-system/formatters'
import { PageLayout } from '@island.is/judicial-system-web/src/shared-components/PageLayout/PageLayout'
import * as styles from './Overview.treat'
import { useMutation, useQuery } from '@apollo/client'
import {
  CaseQuery,
  SendNotificationMutation,
  TransitionCaseMutation,
} from '@island.is/judicial-system-web/src/graphql'
import {
  ProsecutorSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { UserContext } from '@island.is/judicial-system-web/src/shared-components/UserProvider/UserProvider'
import { constructProsecutorDemands } from '@island.is/judicial-system-web/src/utils/stepHelper'

export const Overview: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [workingCase, setWorkingCase] = useState<Case>()

  const { id } = useParams<{ id: string }>()
  const history = useHistory()
  const { user } = useContext(UserContext)
  const { data, loading } = useQuery(CaseQuery, {
    variables: { input: { id: id } },
    fetchPolicy: 'no-cache',
  })

  const [transitionCaseMutation] = useMutation(TransitionCaseMutation)

  const transitionCase = async (id: string, transitionCase: TransitionCase) => {
    const { data } = await transitionCaseMutation({
      variables: { input: { id, ...transitionCase } },
    })

    return data?.transitionCase
  }

  const [
    sendNotificationMutation,
    { loading: isSendingNotification },
  ] = useMutation(SendNotificationMutation)

  const sendNotification = async (id: string) => {
    const { data } = await sendNotificationMutation({
      variables: {
        input: {
          caseId: id,
          type: NotificationType.READY_FOR_COURT,
        },
      },
    })

    return data?.sendNotification?.notificationSent
  }

  const handleNextButtonClick: () => Promise<boolean> = async () => {
    if (!workingCase) {
      return false
    }

    switch (workingCase.state) {
      case CaseState.DRAFT:
        try {
          // Parse the transition request
          const transitionRequest = parseTransition(
            workingCase.modified,
            CaseTransition.SUBMIT,
          )

          // Transition the case
          const resCase = await transitionCase(
            workingCase.id,
            transitionRequest,
          )

          if (!resCase) {
            return false
          }

          setWorkingCase({
            ...workingCase,
            state: resCase.state,
            prosecutor: resCase.prosecutor,
          })
        } catch (e) {
          console.log(e)

          return false
        }
        break
      case CaseState.SUBMITTED:
      case CaseState.RECEIVED:
        break
      default:
        return false
    }

    return sendNotification(workingCase.id)
  }

  useEffect(() => {
    document.title = 'Yfirlit kröfu - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    if (!workingCase && data?.case) {
      setWorkingCase(data.case)
    }
  }, [workingCase, setWorkingCase, data])

  return (
    <PageLayout
      activeSection={Sections.PROSECUTOR}
      activeSubSection={ProsecutorSubsections.PROSECUTOR_OVERVIEW}
      isLoading={loading}
      notFound={data?.case === undefined}
    >
      {workingCase ? (
        <>
          <Box marginBottom={10}>
            <Text as="h1" variant="h1">
              Krafa um gæsluvarðhald
            </Text>
          </Box>
          <Box component="section">
            <Box marginBottom={5}>
              <Box marginBottom={1}>
                <Text variant="eyebrow" color="blue400">
                  LÖKE málsnúmer
                </Text>
              </Box>
              <Text variant="h3">{workingCase.policeCaseNumber}</Text>
            </Box>
            <Box marginBottom={5}>
              <Box marginBottom={1}>
                <Text variant="eyebrow" color="blue400">
                  Kennitala
                </Text>
              </Box>
              <Text variant="h3">
                {formatNationalId(workingCase.accusedNationalId)}
              </Text>
            </Box>
            <Box marginBottom={5}>
              <Box marginBottom={1}>
                <Text variant="eyebrow" color="blue400">
                  Fullt nafn
                </Text>
              </Box>
              <Text variant="h3"> {workingCase.accusedName}</Text>
            </Box>
            <Box marginBottom={5}>
              <Box marginBottom={1}>
                <Text variant="eyebrow" color="blue400">
                  Lögheimili/dvalarstaður
                </Text>
              </Box>
              <Text variant="h3">{workingCase.accusedAddress}</Text>
            </Box>
            {workingCase.accusedGender && (
              <Box marginBottom={5}>
                <Box marginBottom={1}>
                  <Text variant="eyebrow" color="blue400">
                    Kyn
                  </Text>
                </Box>
                <Text variant="h3">
                  {capitalize(formatGender(workingCase.accusedGender))}
                </Text>
              </Box>
            )}
            {workingCase.requestedDefenderName && (
              <Box marginBottom={5}>
                <Box marginBottom={1}>
                  <Text variant="eyebrow" color="blue400">
                    Nafn verjanda
                  </Text>
                </Box>
                <Text variant="h3">{workingCase.requestedDefenderName}</Text>
              </Box>
            )}
            {workingCase.requestedDefenderEmail && (
              <Box marginBottom={5}>
                <Box marginBottom={1}>
                  <Text variant="eyebrow" color="blue400">
                    Netfang verjanda
                  </Text>
                </Box>
                <Text variant="h3">{workingCase.requestedDefenderEmail}</Text>
              </Box>
            )}
            <Box marginBottom={5}>
              <Box marginBottom={1}>
                <Text variant="eyebrow" color="blue400">
                  Dómstóll
                </Text>
              </Box>
              <Text variant="h3">{workingCase.court}</Text>
            </Box>
            {workingCase.arrestDate && (
              <Box marginBottom={5}>
                <Box marginBottom={1}>
                  <Text variant="eyebrow" color="blue400">
                    Tími handtöku
                  </Text>
                </Box>
                <Text variant="h3">
                  {`${capitalize(
                    formatDate(workingCase.arrestDate, 'PPPP') || '',
                  )} kl. ${formatDate(workingCase.arrestDate, TIME_FORMAT)}`}
                </Text>
              </Box>
            )}
            {workingCase.requestedCourtDate && (
              <Box marginBottom={9}>
                <Box marginBottom={1}>
                  <Text variant="eyebrow" color="blue400">
                    Ósk um fyrirtökudag og tíma
                  </Text>
                </Box>
                <Text variant="h3">
                  {`${capitalize(
                    formatDate(workingCase.requestedCourtDate, 'PPPP') || '',
                  )} eftir kl. ${formatDate(
                    workingCase.requestedCourtDate,
                    TIME_FORMAT,
                  )}`}
                </Text>
              </Box>
            )}
          </Box>
          <Box component="section" marginBottom={10}>
            <Accordion>
              <AccordionItem labelVariant="h3" id="id_1" label="Dómkröfur">
                {constructProsecutorDemands(workingCase)}
              </AccordionItem>
              <AccordionItem labelVariant="h3" id="id_2" label="Lagaákvæði">
                <Box marginBottom={2}>
                  <Box marginBottom={2}>
                    <Text as="h4" variant="h4">
                      Lagaákvæði sem brot varða við
                    </Text>
                  </Box>
                  <Text>
                    <span className={styles.breakSpaces}>
                      {workingCase.lawsBroken}
                    </span>
                  </Text>
                </Box>
                <Box marginBottom={2}>
                  <Box marginBottom={2}>
                    <Text as="h4" variant="h4">
                      Lagaákvæði sem krafan er byggð á
                    </Text>
                  </Box>
                  {workingCase.custodyProvisions &&
                    workingCase.custodyProvisions.map(
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
                label="Greinargerð um málsatvik og lagarök"
              >
                {workingCase.caseFacts && (
                  <Box marginBottom={2}>
                    <Box marginBottom={2}>
                      <Text variant="h5">Málsatvik rakin</Text>
                    </Box>
                    <Text>
                      <span className={styles.breakSpaces}>
                        {workingCase.caseFacts}
                      </span>
                    </Text>
                  </Box>
                )}
                {workingCase.legalArguments && (
                  <Box marginBottom={2}>
                    <Box marginBottom={2}>
                      <Text variant="h5">Lagarök</Text>
                    </Box>
                    <Text>
                      <span className={styles.breakSpaces}>
                        {workingCase.legalArguments}
                      </span>
                    </Text>
                  </Box>
                )}
              </AccordionItem>
              <AccordionItem
                id="id_5"
                label="Athugasemdir vegna málsmeðferðar"
                labelVariant="h3"
              >
                <Text>
                  <span className={styles.breakSpaces}>
                    {workingCase.comments}
                  </span>
                </Text>
              </AccordionItem>
            </Accordion>
          </Box>
          <Box marginBottom={15}>
            <Box marginBottom={1}>
              <Text>F.h.l</Text>
            </Box>
            <Text variant="h3">
              {workingCase.prosecutor
                ? `${workingCase.prosecutor?.name} ${workingCase.prosecutor?.title}`
                : `${user?.name} ${user?.title}`}
            </Text>
          </Box>
          <FormFooter
            nextButtonText="Staðfesta kröfu fyrir héraðsdóm"
            nextIsLoading={isSendingNotification}
            onNextButtonClick={async () => {
              const notificationSent = await handleNextButtonClick()

              if (notificationSent) {
                setModalVisible(true)
              } else {
                // TODO: Handle error
              }
            }}
          />

          {modalVisible && (
            <Modal
              title="Krafa um gæsluvarðhald hefur verið staðfest"
              text="Tilkynning hefur verið send á dómara og dómritara á vakt."
              handleClose={() =>
                history.push(Constants.DETENTION_REQUESTS_ROUTE)
              }
              handlePrimaryButtonClick={() => {
                history.push(Constants.FEEDBACK_FORM_ROUTE)
              }}
              handleSecondaryButtonClick={() => {
                history.push(Constants.DETENTION_REQUESTS_ROUTE)
              }}
              primaryButtonText="Gefa endurgjöf á gáttina"
              secondaryButtonText="Loka glugga"
            />
          )}
        </>
      ) : null}
    </PageLayout>
  )
}

export default Overview
