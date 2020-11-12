import React, { useState, useEffect, useContext } from 'react'
import { useHistory, useParams } from 'react-router-dom'

import { Box, Text, Accordion, AccordionItem } from '@island.is/island-ui/core'
import {
  Case,
  CaseCustodyProvisions,
  CaseTransition,
  NotificationType,
  TransitionCase,
} from '@island.is/judicial-system/types'

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
import { userContext } from '../../../utils/userContext'
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

export const Overview: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [workingCase, setWorkingCase] = useState<Case>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSendingNotification, setIsSendingNotification] = useState<boolean>(
    false,
  )
  const { id } = useParams<{ id: string }>()
  const history = useHistory()
  const { user } = useContext(userContext)
  const { data } = useQuery(CaseQuery, {
    variables: { input: { id: id } },
    fetchPolicy: 'no-cache',
  })

  const resCase = data?.case

  const [transitionCaseMutation] = useMutation(TransitionCaseMutation)

  const transitionCase = async (id: string, transitionCase: TransitionCase) => {
    const { data } = await transitionCaseMutation({
      variables: { input: { id, ...transitionCase } },
    })

    const resCase = data?.transitionCase

    if (resCase) {
      // Do smoething with the result. In particular, we want the modified timestamp passed between
      // the client and the backend so that we can handle multiple simultanious updates.
    }

    return resCase
  }

  const [sendNotificationMutation] = useMutation(SendNotificationMutation)

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
    if (workingCase) {
      try {
        // Parse the transition request
        const transitionRequest = parseTransition(
          workingCase.modified,
          CaseTransition.SUBMIT,
        )

        // Transition the case
        const resCase = await transitionCase(workingCase.id, transitionRequest)

        if (!resCase) {
          // Improve error handling at some point
          console.log('Transition failing')
          return false
        }
      } catch (e) {
        // Improve error handling at some point
        console.log('Transition failing')
      }

      return sendNotification(workingCase.id)
    }
  }

  useEffect(() => {
    document.title = 'Yfirlit kröfu - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    const getCurrentCase = async () => {
      setIsLoading(true)
      setWorkingCase(resCase)
      setIsLoading(false)
    }
    if (id && !workingCase && resCase) {
      getCurrentCase()
    }
  }, [id, setIsLoading, workingCase, setWorkingCase, resCase])

  return (
    <PageLayout
      activeSection={Sections.PROSECUTOR}
      activeSubSection={ProsecutorSubsections.PROSECUTOR_OVERVIEW}
      isLoading={isLoading}
    >
      {workingCase ? (
        <>
          <Box marginBottom={10}>
            <Text as="h1" variant="h1">
              Krafa um gæsluvarðhald
            </Text>
          </Box>
          <Box component="section" marginBottom={5}>
            <Box marginBottom={1}>
              <Text variant="eyebrow" color="blue400">
                LÖKE málsnúmer
              </Text>
            </Box>
            <Text variant="h3">{workingCase.policeCaseNumber}</Text>
          </Box>
          <Box component="section" marginBottom={5}>
            <Box marginBottom={1}>
              <Text variant="eyebrow" color="blue400">
                Kennitala
              </Text>
            </Box>
            <Text variant="h3">
              {formatNationalId(workingCase.accusedNationalId)}
            </Text>
          </Box>
          <Box component="section" marginBottom={5}>
            <Box marginBottom={1}>
              <Text variant="eyebrow" color="blue400">
                Fullt nafn
              </Text>
            </Box>
            <Text variant="h3"> {workingCase.accusedName}</Text>
          </Box>
          <Box component="section" marginBottom={5}>
            <Box marginBottom={1}>
              <Text variant="eyebrow" color="blue400">
                Lögheimili/dvalarstaður
              </Text>
            </Box>
            <Text variant="h3">{workingCase.accusedAddress}</Text>
          </Box>
          <Box component="section" marginBottom={5}>
            <Box marginBottom={1}>
              <Text variant="eyebrow" color="blue400">
                Dómstóll
              </Text>
            </Box>
            <Text variant="h3">{workingCase.court}</Text>
          </Box>
          <Box component="section" marginBottom={5}>
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
          {workingCase.requestedCourtDate && (
            <Box component="section" marginBottom={9}>
              <Box marginBottom={1}>
                <Text variant="eyebrow" color="blue400">
                  Ósk um fyrirtökudag og tíma
                </Text>
              </Box>
              <Text variant="h3">
                {`${capitalize(
                  formatDate(workingCase.requestedCourtDate, 'PPPP') || '',
                )} eftir kl. ${formatDate(
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
                  <Text>
                    <span className={styles.breakSpaces}>
                      {workingCase?.lawsBroken}
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
                    workingCase?.requestedCustodyRestrictions,
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
                label="Skilaboð til dómara"
                labelVariant="h3"
              >
                <Text>
                  <span className={styles.breakSpaces}>
                    {workingCase?.comments}
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
              {workingCase?.prosecutor
                ? `${workingCase?.prosecutor.name} ${workingCase?.prosecutor.title}`
                : `${user?.name} ${user?.title}`}
            </Text>
          </Box>
          <FormFooter
            nextButtonText="Staðfesta kröfu fyrir héraðsdóm"
            nextIsLoading={isSendingNotification}
            onNextButtonClick={async () => {
              setIsSendingNotification(true)
              const notificationSent = await handleNextButtonClick()
              setIsSendingNotification(false)

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
