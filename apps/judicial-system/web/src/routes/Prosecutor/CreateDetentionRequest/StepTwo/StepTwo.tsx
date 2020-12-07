import React, { useEffect, useState, useRef } from 'react'
import {
  Text,
  GridContainer,
  GridRow,
  GridColumn,
  Box,
  DatePicker,
  Input,
  Checkbox,
  Tooltip,
  Select
} from '@island.is/island-ui/core'
import {
  Case,
  CaseCustodyProvisions,
  CaseCustodyRestrictions,
  CaseState,
  CaseTransition,
  NotificationType,
  UpdateCase,
} from '@island.is/judicial-system/types'
import { isNextDisabled } from '../../../../utils/stepHelper'
import {
  validate,
  Validation,
} from '@island.is/judicial-system-web/src/utils/validate'
import isValid from 'date-fns/isValid'
import parseISO from 'date-fns/parseISO'
import formatISO from 'date-fns/formatISO'
import isNull from 'lodash/isNull'
import { FormFooter } from '../../../../shared-components/FormFooter'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  padTimeWithZero,
  parseArray,
  parseString,
  parseTime,
  parseTransition,
  replaceTabsOnChange,
} from '@island.is/judicial-system-web/src/utils/formatters'
import * as Constants from '../../../../utils/constants'
import { TIME_FORMAT } from '@island.is/judicial-system/formatters'
import { PageLayout } from '@island.is/judicial-system-web/src/shared-components/PageLayout/PageLayout'
import { useHistory, useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@apollo/client'
import {
  CaseQuery,
  SendNotificationMutation,
  TransitionCaseMutation,
  UpdateCaseMutation,
} from '@island.is/judicial-system-web/src/graphql'
import {
  ProsecutorSubsections,
  ReactSelectOption,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import TimeInputField from '@island.is/judicial-system-web/src/shared-components/TimeInputField/TimeInputField'
import {
  setAndSendDateToServer,
  validateAndSendTimeToServer,
  validateAndSendToServer,
  removeTabsValidateAndSet,
  validateAndSetTime,
  setAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { ValueType } from 'react-select/src/types'
import Modal from '../../../../shared-components/Modal/Modal'

export const StepTwo: React.FC = () => {
  const history = useHistory()
  const [workingCase, setWorkingCase] = useState<Case>()
  const [isStepIllegal, setIsStepIllegal] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const arrestTimeRef = useRef<HTMLInputElement>(null)
  const requestedCourtTimeRef = useRef<HTMLInputElement>(null)
  const requestedCustodyEndTimeRef = useRef<HTMLInputElement>(null)
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const { id } = useParams<{ id: string }>()

  const [arrestDateErrorMessage, setArrestDateErrorMessage] = useState<string>(
    '',
  )

  const [arrestTimeErrorMessage, setArrestTimeErrorMessage] = useState<string>(
    '',
  )

  const [
    requestedCourtDateErrorMessage,
    setRequestedCourtDateErrorMessage,
  ] = useState<string>('')

  const [
    requestedCourtTimeErrorMessage,
    setRequestedCourtTimeErrorMessage,
  ] = useState<string>('')

  const [
    requestedCustodyEndDateErrorMessage,
    setRequestedCustodyEndDateErrorMessage,
  ] = useState<string>('')
  const [
    requestedCustodyEndTimeErrorMessage,
    setRequestedCustodyEndTimeErrorMessage,
  ] = useState<string>('')
  const [lawsBrokenErrorMessage, setLawsBrokenErrorMessage] = useState<string>(
    '',
  )
  const [caseFactsErrorMessage, setCaseFactsErrorMessage] = useState<string>('')
  const [legalArgumentsErrorMessage, setLegalArgumentsErrorMessage] = useState<
    string
  >('')

  const [, setCheckboxOne] = useState<boolean>()
  const [, setCheckboxTwo] = useState<boolean>()
  const [, setCheckboxThree] = useState<boolean>()
  const [, setCheckboxFour] = useState<boolean>()
  const [, setCheckboxFive] = useState<boolean>()
  const [, setCheckboxSix] = useState<boolean>()
  const [, setRestrictionCheckboxOne] = useState<boolean>()
  const [, setRestrictionCheckboxTwo] = useState<boolean>()
  const [, setRestrictionCheckboxThree] = useState<boolean>()
  const [, setRestrictionCheckboxFour] = useState<boolean>()

  const { data } = useQuery(CaseQuery, {
    variables: { input: { id: id } },
    fetchPolicy: 'no-cache',
  })

  const resCase = data?.case

  const [
    sendNotificationMutation,
    { loading: isSendingNotification },
  ] = useMutation(SendNotificationMutation)

  const sendNotification = async (id: string) => {
    const { data } = await sendNotificationMutation({
      variables: {
        input: {
          caseId: id,
          type: NotificationType.HEADS_UP,
        },
      },
    })

    return data?.sendNotification?.notificationSent
  }

  const caseCustodyProvisions = [
    {
      brokenLaw: 'a-lið 1. mgr. 95. gr.',
      value: CaseCustodyProvisions._95_1_A,
      setCheckbox: setCheckboxOne,
      explination:
        'Að ætla megi að sakborningur muni torvelda rannsókn málsins, svo sem með því að afmá merki eftir brot, skjóta undan munum ellegar hafa áhrif á samseka eða vitni.',
    },
    {
      brokenLaw: 'b-lið 1. mgr. 95. gr.',
      value: CaseCustodyProvisions._95_1_B,
      setCheckbox: setCheckboxTwo,
      explination:
        'Að ætla megi að hann muni reyna að komast úr landi eða leynast ellegar koma sér með öðrum hætti undan málsókn eða fullnustu refsingar.',
    },
    {
      brokenLaw: 'c-lið 1. mgr. 95. gr.',
      value: CaseCustodyProvisions._95_1_C,
      setCheckbox: setCheckboxThree,
      explination:
        'Að ætla megi að hann muni halda áfram brotum meðan máli hans er ekki lokið eða rökstuddur grunur leiki á að hann hafi rofið í verulegum atriðum skilyrði sem honum hafa verið sett í skilorðsbundnum dómi.',
    },
    {
      brokenLaw: 'd-lið 1. mgr. 95. gr.',
      value: CaseCustodyProvisions._95_1_D,
      setCheckbox: setCheckboxFour,
      explination:
        'Að telja megi gæsluvarðhald nauðsynlegt til að verja aðra fyrir árásum sakbornings ellegar hann sjálfan fyrir árásum eða áhrifum annarra manna.',
    },
    {
      brokenLaw: '2. mgr. 95. gr.',
      value: CaseCustodyProvisions._95_2,
      setCheckbox: setCheckboxFive,
      explination:
        'Einnig má úrskurða sakborning í gæsluvarðhald þótt skilyrði a–d-liðar 1. mgr. séu ekki fyrir hendi ef sterkur grunur leikur á að hann hafi framið afbrot sem að lögum getur varðað 10 ára fangelsi, enda sé brotið þess eðlis að ætla megi varðhald nauðsynlegt með tilliti til almannahagsmuna.',
    },
    {
      brokenLaw: 'b-lið 1. mgr. 99. gr.',
      value: CaseCustodyProvisions._99_1_B,
      setCheckbox: setCheckboxSix,
      explination:
        'Gæslufangar skulu aðeins látnir vera í einrúmi samkvæmt úrskurði dómara en þó skulu þeir ekki gegn vilja sínum hafðir með öðrum föngum.',
    },
  ]

  const restrictions = [
    {
      restriction: 'B - Einangrun',
      value: CaseCustodyRestrictions.ISOLATION,
      setCheckbox: setRestrictionCheckboxOne,
      explination:
        'Gæslufangar skulu aðeins látnir vera í einrúmi samkvæmt úrskurði dómara en þó skulu þeir ekki gegn vilja sínum hafðir með öðrum föngum.',
    },
    {
      restriction: 'C - Heimsóknarbann',
      value: CaseCustodyRestrictions.VISITAION,
      setCheckbox: setRestrictionCheckboxTwo,
      explination:
        'Gæslufangar eiga rétt á heimsóknum. Þó getur sá sem rannsókn stýrir bannað heimsóknir ef nauðsyn ber til í þágu hennar en skylt er að verða við óskum gæslufanga um að hafa samband við verjanda og ræða við hann einslega, sbr. 1. mgr. 36. gr., og rétt að verða við óskum hans um að hafa samband við lækni eða prest, ef þess er kostur.',
    },
    {
      restriction: 'D - Bréfskoðun, símabann',
      value: CaseCustodyRestrictions.COMMUNICATION,
      setCheckbox: setRestrictionCheckboxThree,
      explination:
        'Gæslufangar mega nota síma eða önnur fjarskiptatæki og senda og taka við bréfum og öðrum skjölum. Þó getur sá sem rannsókn stýrir bannað notkun síma eða annarra fjarskiptatækja og látið athuga efni bréfa eða annarra skjala og kyrrsett þau ef nauðsyn ber til í þágu hennar en gera skal sendanda viðvart um kyrrsetningu, ef því er að skipta.',
    },
    {
      restriction: 'E - Fjölmiðlabann',
      value: CaseCustodyRestrictions.MEDIA,
      setCheckbox: setRestrictionCheckboxFour,
      explination:
        'Gæslufangar mega lesa dagblöð og bækur, svo og fylgjast með hljóðvarpi og sjónvarpi. Þó getur sá sem rannsókn stýrir takmarkað aðgang gæslufanga að fjölmiðlum ef nauðsyn ber til í þágu rannsóknar.',
    },
  ]

  const courts = [
    {
      label: 'Héraðsdómur Reykjavíkur',
      value: 0,
    },
    {
      label: 'Héraðsdómur Vesturlands',
      value: 1,
    },
    {
      label: 'Héraðsdómur Vestfjarða',
      value: 2,
    },
    {
      label: 'Héraðsdómur Norðurlands vestra',
      value: 3,
    },
    {
      label: 'Héraðsdómur Norðurlands eystra',
      value: 4,
    },
    {
      label: 'Héraðsdómur Austurlands',
      value: 5,
    },
    {
      label: 'Héraðsdómur Reykjaness',
      value: 6,
    },
  ]

  const defaultCourt = courts.filter(
    (court) => court.label === workingCase?.court,
  )

  const handleNextButtonClick = async () => {
    
    
    
    if (!workingCase) {
      return
    }
    
    const transitionSuccess = await transitionCase()

    console.log("transitionSuccess:", transitionSuccess)
    
    if(transitionSuccess) {
      if (
        workingCase.notifications?.find(
          (notification) =>
            notification.type === NotificationType.HEADS_UP,
        )
      ) {
        history.push(
          `${Constants.STEP_TWO_ROUTE}/${workingCase.id}`,
        )
      } else {
        setModalVisible(true)
      }
    } else {
      // TODO: Handle error
    }
  }

  useEffect(() => {
    document.title = 'Málsatvik og lagarök - Réttarvörslugátt'
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

  useEffect(() => {

    const requiredFields: { value: string; validations: Validation[] }[] = [
      {
        value: workingCase?.arrestDate || '',
        validations: ['empty'],
      },
      {
        value: arrestTimeRef.current?.value || '',
        validations: ['empty', 'time-format'],
      },
      {
        value: workingCase?.requestedCourtDate || '',
        validations: ['empty'],
      },
      {
        value: requestedCourtTimeRef.current?.value || '',
        validations: ['empty', 'time-format'],
      },
      {
        value: workingCase?.requestedCustodyEndDate || '',
        validations: ['empty'],
      },
      {
        value: requestedCustodyEndTimeRef.current?.value || '',
        validations: ['empty', 'time-format'],
      }
    ]

    if (workingCase) {
      setIsStepIllegal(isNextDisabled(requiredFields))
    }
  }, [workingCase, setIsStepIllegal, requestedCustodyEndTimeRef.current?.value])

  const [updateCaseMutation] = useMutation(UpdateCaseMutation)

  const updateCase = async (id: string, updateCase: UpdateCase) => {
    const { data } = await updateCaseMutation({
      variables: { input: { id, ...updateCase } },
    })

    const resCase = data?.updateCase

    if (resCase) {
      // Do smoething with the result. In particular, we want th modified timestamp passed between
      // the client and the backend so that we can handle multiple simultanious updates.
    }

    return resCase
  }

  const [transitionCaseMutation, { loading: transitionLoading }] = useMutation(TransitionCaseMutation)

  const transitionCase = async () => {
    if (!workingCase) {
      return false
    }
    
    switch (workingCase.state) {
      case CaseState.NEW:
        try {
          // Parse the transition request
          const transitionRequest = parseTransition(
            workingCase.modified,
            CaseTransition.OPEN,
          )

          const { data } = await transitionCaseMutation({
            variables: { input: { id: workingCase.id, ...transitionRequest } },
          })

          if (!data) {
            return false
          }

          console.log(data);

          setWorkingCase({
            ...workingCase,
            state: data.transitionCase.state,
          })

          return true
        } catch (e) {
          console.log(e)

          return false
        }
      case CaseState.DRAFT:
      case CaseState.SUBMITTED:
        return true
      default:
        return false
    }
  }

  return (
    <PageLayout
      activeSection={Sections.PROSECUTOR}
      activeSubSection={ProsecutorSubsections.CREATE_DETENTION_REQUEST_STEP_TWO}
      isLoading={isLoading}
      notFound={data?.case === undefined}
    >
      {workingCase ? (
        <>
          <Box marginBottom={10}>
            <Text as="h1" variant="h1">
              Krafa um gæsluvarðhald
            </Text>
          </Box>

          <Box component="section" marginBottom={7}>
          <Box marginBottom={2}>
            <Text as="h3" variant="h3">
              Dómstóll
            </Text>
          </Box>
          <Select
            name="court"
            label="Veldu dómstól"
            defaultValue={{
              label:
                defaultCourt.length > 0
                  ? defaultCourt[0].label
                  : courts[0].label,
              value:
                defaultCourt.length > 0
                  ? defaultCourt[0].value
                  : courts[0].value,
            }}
            options={courts}
            onChange={(selectedOption: ValueType<ReactSelectOption>) =>
              setAndSendToServer(
                'court',
                (selectedOption as ReactSelectOption).label,
                workingCase,
                setWorkingCase,
                updateCase,
              )
            }
          />
        </Box>
        <Box component="section" marginBottom={7}>
          <Box marginBottom={2}>
            <Text as="h3" variant="h3">
              Tími handtöku
            </Text>
          </Box>
          <GridRow>
            <GridColumn span="5/8">
              <DatePicker
                id="arrestDate"
                label="Veldu dagsetningu"
                placeholderText="Veldu dagsetningu"
                locale="is"
                errorMessage={arrestDateErrorMessage}
                hasError={arrestDateErrorMessage !== ''}
                selected={
                  workingCase.arrestDate
                    ? new Date(workingCase.arrestDate)
                    : null
                }
                handleChange={(date) =>
                  setAndSendDateToServer(
                    'arrestDate',
                    workingCase.arrestDate,
                    date,
                    workingCase,
                    setWorkingCase,
                    updateCase,
                    setArrestDateErrorMessage,
                  )
                }
                handleCloseCalendar={(date: Date | null) => {
                  if (date === null || !isValid(date)) {
                    setArrestDateErrorMessage('Reitur má ekki vera tómur')
                  }
                }}
                required
              />
            </GridColumn>
            <GridColumn span="3/8">
              <TimeInputField
                disabled={!workingCase.arrestDate}
                onChange={(evt) =>
                  validateAndSetTime(
                    'arrestDate',
                    workingCase.arrestDate,
                    evt.target.value,
                    ['empty', 'time-format'],
                    workingCase,
                    setWorkingCase,
                    arrestTimeErrorMessage,
                    setArrestTimeErrorMessage,
                  )
                }
                onBlur={(evt) =>
                  validateAndSendTimeToServer(
                    'arrestDate',
                    workingCase.arrestDate,
                    evt.target.value,
                    ['empty', 'time-format'],
                    workingCase,
                    updateCase,
                    setArrestTimeErrorMessage,
                  )
                }
              >
                <Input
                  data-testid="arrestTime"
                  name="arrestTime"
                  label="Tímasetning"
                  placeholder="Settu inn tíma"
                  ref={arrestTimeRef}
                  errorMessage={arrestTimeErrorMessage}
                  hasError={arrestTimeErrorMessage !== ''}
                  defaultValue={
                    workingCase.arrestDate?.includes('T')
                      ? formatDate(workingCase.arrestDate, TIME_FORMAT)
                      : undefined
                  }
                  required
                />
              </TimeInputField>
            </GridColumn>
          </GridRow>
        </Box>
        <Box component="section" marginBottom={7}>
          <Box marginBottom={2}>
            <Text as="h3" variant="h3">
              Ósk um fyrirtökudag og tíma{' '}
              <Tooltip text='Vinsamlegast sláðu tímann sem þú óskar eftir að málið verður tekið fyrir. Gáttin birtir tímann sem: "Eftir kl." tíminn sem þú slærð inn. Það þarf því ekki að velja nákvæma tímasetningu hvenær óskað er eftir fyrirtöku, heldur bara eftir hvaða tíma myndi henta að taka málið fyrir.' />
            </Text>
          </Box>
          <GridRow>
            <GridColumn span="5/8">
              <DatePicker
                id="reqCourtDate"
                label="Veldu dagsetningu"
                placeholderText="Veldu dagsetningu"
                locale="is"
                errorMessage={requestedCourtDateErrorMessage}
                icon={workingCase.courtDate ? 'lockClosed' : undefined}
                minDate={new Date()}
                selected={
                  workingCase.requestedCourtDate
                    ? parseISO(workingCase.requestedCourtDate.toString())
                    : null
                }
                disabled={Boolean(workingCase.courtDate)}
                handleChange={(date) =>
                  setAndSendDateToServer(
                    'requestedCourtDate',
                    workingCase.requestedCourtDate,
                    date,
                    workingCase,
                    setWorkingCase,
                    updateCase,
                    setRequestedCourtDateErrorMessage,
                  )
                }
                handleCloseCalendar={(date: Date | null) => {
                  if (date === null || !isValid(date)) {
                    setRequestedCourtDateErrorMessage(
                      'Reitur má ekki vera tómur',
                    )
                  }
                }}
                required
              />
            </GridColumn>
            <GridColumn span="3/8">
              <TimeInputField
                disabled={
                  !workingCase.requestedCourtDate ||
                  Boolean(workingCase.courtDate)
                }
                onChange={(evt) =>
                  validateAndSetTime(
                    'requestedCourtDate',
                    workingCase.requestedCourtDate,
                    evt.target.value,
                    ['empty', 'time-format'],
                    workingCase,
                    setWorkingCase,
                    requestedCourtTimeErrorMessage,
                    setRequestedCourtTimeErrorMessage,
                  )
                }
                onBlur={(evt) =>
                  validateAndSendTimeToServer(
                    'requestedCourtDate',
                    workingCase.requestedCourtDate,
                    evt.target.value,
                    ['empty', 'time-format'],
                    workingCase,
                    updateCase,
                    setRequestedCourtTimeErrorMessage,
                  )
                }
              >
                <Input
                  data-testid="requestedCourtDate"
                  name="requestedCourtDate"
                  label="Ósk um tíma"
                  placeholder="Settu inn tíma dags"
                  errorMessage={requestedCourtTimeErrorMessage}
                  hasError={requestedCourtTimeErrorMessage !== ''}
                  defaultValue={
                    workingCase.requestedCourtDate?.includes('T')
                      ? formatDate(
                          workingCase.requestedCourtDate,
                          TIME_FORMAT,
                        )
                      : undefined
                  }
                  icon={workingCase.courtDate ? 'lockClosed' : undefined}
                  iconType="outline"
                  ref={requestedCourtTimeRef}
                  required
                />
              </TimeInputField>
            </GridColumn>
          </GridRow>
          {workingCase.courtDate && (
            <Box marginTop={1}>
              <Text variant="eyebrow">
                Fyrirtökudegi og tíma hefur verið úthlutað
              </Text>
            </Box>
          )}
        </Box>
          <Box component="section" marginBottom={7}>
            <Box marginBottom={2}>
              <Text as="h3" variant="h3">
                Dómkröfur
              </Text>
            </Box>
            <GridRow>
              <GridColumn span="5/8">
                <DatePicker
                  label="Gæsluvarðhald til"
                  placeholderText="Veldu dagsetningu"
                  selected={
                    workingCase.requestedCustodyEndDate
                      ? parseISO(
                          workingCase.requestedCustodyEndDate?.toString(),
                        )
                      : null
                  }
                  locale="is"
                  minDate={new Date()}
                  hasError={requestedCustodyEndDateErrorMessage !== ''}
                  errorMessage={requestedCustodyEndDateErrorMessage}
                  handleChange={(date) =>
                    setAndSendDateToServer(
                      'requestedCustodyEndDate',
                      workingCase.requestedCustodyEndDate,
                      date,
                      workingCase,
                      setWorkingCase,
                      updateCase,
                      setRequestedCustodyEndDateErrorMessage,
                    )
                  }
                  handleCloseCalendar={(date: Date | null) => {
                    if (isNull(date) || !isValid(date)) {
                      setRequestedCustodyEndDateErrorMessage(
                        'Reitur má ekki vera tómur',
                      )
                    }
                  }}
                  required
                />
              </GridColumn>
              <GridColumn span="3/8">
                <TimeInputField
                  disabled={!workingCase?.requestedCustodyEndDate}
                  onChange={(evt) =>
                    validateAndSetTime(
                      'requestedCustodyEndDate',
                      workingCase.requestedCustodyEndDate,
                      evt.target.value,
                      ['empty', 'time-format'],
                      workingCase,
                      setWorkingCase,
                      requestedCustodyEndTimeErrorMessage,
                      setRequestedCustodyEndTimeErrorMessage,
                    )
                  }
                  onBlur={(evt) =>
                    validateAndSendTimeToServer(
                      'requestedCustodyEndDate',
                      workingCase.arrestDate,
                      evt.target.value,
                      ['empty', 'time-format'],
                      workingCase,
                      updateCase,
                      setRequestedCustodyEndTimeErrorMessage,
                    )
                  }
                >
                  <Input
                    data-testid="requestedCustodyEndTime"
                    name="requestedCustodyEndTime"
                    label="Tímasetning"
                    placeholder="Settu inn tíma"
                    ref={requestedCustodyEndTimeRef}
                    defaultValue={
                      workingCase.requestedCustodyEndDate?.includes('T')
                        ? formatDate(
                            workingCase.requestedCustodyEndDate,
                            TIME_FORMAT,
                          )
                        : undefined
                    }
                    errorMessage={requestedCustodyEndTimeErrorMessage}
                    hasError={requestedCustodyEndTimeErrorMessage !== ''}
                    required
                  />
                </TimeInputField>
              </GridColumn>
            </GridRow>
          </Box>
          <FormFooter
            onNextButtonClick={async () => await handleNextButtonClick()}
            nextIsDisabled={isStepIllegal || transitionLoading}
            nextIsLoading={transitionLoading}
          />
          {modalVisible && (
            <Modal
              title="Viltu senda tilkynningu?"
              text="Með því að senda tilkynningu á dómara á vakt um að krafa um gæsluvarðhald sé í vinnslu flýtir það fyrir málsmeðferð og allir aðilar eru upplýstir um stöðu mála."
              primaryButtonText="Senda tilkynningu"
              secondaryButtonText="Halda áfram með kröfu"
              handleClose={() => setModalVisible(false)}
              handleSecondaryButtonClick={() =>
                history.push(
                  `${Constants.STEP_THREE_ROUTE}/${workingCase.id}`,
                )
              }
              handlePrimaryButtonClick={async () => {
                const notificationSent = await sendNotification(
                  workingCase.id ?? id,
                )

                if (notificationSent) {
                  history.push(
                    `${Constants.STEP_TWO_ROUTE}/${workingCase.id}`,
                  )
                }
              }}
              isPrimaryButtonLoading={isSendingNotification}
            />
          )}
        </>
      ) : null}
    </PageLayout>
  )
}

export default StepTwo
