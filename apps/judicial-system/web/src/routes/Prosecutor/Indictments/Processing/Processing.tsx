import { FC, useCallback, useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import useSWR from 'swr'

import {
  Box,
  Button,
  Checkbox,
  RadioButton,
  Text,
} from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { isTrafficViolationCase } from '@island.is/judicial-system/types'
import { titles } from '@island.is/judicial-system-web/messages'
import {
  BlueBox,
  CommentsInput,
  FormContentContainer,
  FormContext,
  FormFooter,
  PageHeader,
  PageLayout,
  ProsecutorCaseInfo,
  SectionHeading,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import InputName from '@island.is/judicial-system-web/src/components/Inputs/InputName'
import InputNationalId from '@island.is/judicial-system-web/src/components/Inputs/InputNationalId'
import RequiredStar from '@island.is/judicial-system-web/src/components/RequiredStar/RequiredStar'
import {
  CaseState,
  CaseTransition,
  CivilClaimant,
  DefendantPlea,
  UpdateCivilClaimantInput,
  UpdateDefendantInput,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { NationalRegistryResponsePerson } from '@island.is/judicial-system-web/src/types'
import {
  useCase,
  useDefendants,
  useOnceOn,
} from '@island.is/judicial-system-web/src/utils/hooks'
import useCivilClaimants from '@island.is/judicial-system-web/src/utils/hooks/useCivilClaimants'
import { isProcessingStepValidIndictments } from '@island.is/judicial-system-web/src/utils/validate'

import { ProsecutorSection, SelectCourt } from '../../components'
import { strings } from './processing.strings'
import * as styles from './Processing.css'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const Processing: FC = () => {
  const { user } = useContext(UserContext)
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
    isCaseUpToDate,
    refreshCase,
  } = useContext(FormContext)
  const { updateCase, transitionCase, setAndSendCaseToServer } = useCase()
  const { formatMessage } = useIntl()
  const { updateDefendant, updateDefendantState } = useDefendants()
  const {
    updateCivilClaimant,
    updateCivilClaimantState,
    createCivilClaimant,
    deleteCivilClaimant,
  } = useCivilClaimants()
  const router = useRouter()
  const isTrafficViolationCaseCheck = isTrafficViolationCase(workingCase)
  const [nID, setNID] = useState<string>()
  const [claimantHasDefender, setClaimantHasDefender] = useState<boolean>(false)
  const [defenderType, setDefenderType] = useState<'L' | 'R'>('L')
  const [hasCivilClaimantChoice, setHasCivilClaimantChoice] =
    useState<boolean>()

  const initialize = useCallback(async () => {
    if (!workingCase.court) {
      await updateCase(workingCase.id, {
        courtId: user?.institution?.defaultCourtId,
      })
      refreshCase()
    }
  }, [
    refreshCase,
    updateCase,
    user?.institution?.defaultCourtId,
    workingCase.court,
    workingCase.id,
  ])

  useOnceOn(isCaseUpToDate, initialize)

  const handleNavigationTo = useCallback(
    async (destination: string) => {
      if (workingCase.state === CaseState.NEW) {
        await transitionCase(
          workingCase.id,
          CaseTransition.OPEN,
          setWorkingCase,
        )
      }

      router.push(`${destination}/${workingCase.id}`)
    },
    [router, setWorkingCase, transitionCase, workingCase],
  )
  const stepIsValid = isProcessingStepValidIndictments(workingCase)

  const handleUpdateDefendant = useCallback(
    (updatedDefendant: UpdateDefendantInput) => {
      updateDefendantState(updatedDefendant, setWorkingCase)
      updateDefendant(updatedDefendant)
    },
    [updateDefendantState, setWorkingCase, updateDefendant],
  )

  const handleUpdateCivilClaimant = useCallback(
    (updatedCivilClaimant: UpdateCivilClaimantInput) => {
      updateCivilClaimantState(updatedCivilClaimant, setWorkingCase)
      updateCivilClaimant(updatedCivilClaimant)
    },
    [updateCivilClaimant, setWorkingCase, updateCivilClaimantState],
  )

  const { mutate } = useSWR<NationalRegistryResponsePerson>(
    nID
      ? `/api/nationalRegistry/getPersonByNationalId?nationalId=${nID}`
      : null,
    fetcher,
  )

  const handleCreateCivilClaimantClick = async () => {
    addCivilClaimant()

    window.scrollTo(0, document.body.scrollHeight)
  }

  const addCivilClaimant = useCallback(async () => {
    const civilClaimantId = await createCivilClaimant({
      caseId: workingCase.id,
    })

    setWorkingCase((prevWorkingCase) => ({
      ...prevWorkingCase,
      civilClaimants: prevWorkingCase.civilClaimants && [
        ...prevWorkingCase.civilClaimants,
        {
          id: civilClaimantId,
          name: '',
          nationalId: '',
        } as CivilClaimant,
      ],
    }))
  }, [createCivilClaimant, setWorkingCase, workingCase.id])

  const handleHasCivilClaimsChange = async (hasCivilClaims: boolean) => {
    setHasCivilClaimantChoice(hasCivilClaims)

    setAndSendCaseToServer(
      [{ hasCivilClaims, force: true }],
      workingCase,
      setWorkingCase,
    )

    if (hasCivilClaims) {
      addCivilClaimant()
    } else {
      removeAllCivilClaimants()
    }
  }

  const handleCivilClaimantNationalIdBlur = async (
    nationalId: string,
    civilClaimantId?: string | null,
  ) => {
    setNID(nationalId.replace('=', ''))
    const newData = await mutate()
    console.log(newData)
    if (!newData || !newData.items || !civilClaimantId) {
      return
    }

    handleUpdateCivilClaimant({
      caseId: workingCase.id,
      civilClaimantId,
      name: newData.items[0].name,
    })
  }

  const removeAllCivilClaimants = useCallback(async () => {
    const promises: Promise<boolean>[] = []

    if (!workingCase.civilClaimants) {
      return
    }

    for (const civilClaimant of workingCase.civilClaimants) {
      if (!civilClaimant.id) {
        return
      }

      promises.push(deleteCivilClaimant(workingCase.id, civilClaimant.id))
    }

    const allCivilClaimantsDeleted = await Promise.all(promises)

    if (allCivilClaimantsDeleted) {
      setWorkingCase((prev) => ({ ...prev, civilClaimants: [] }))
    }
  }, [
    deleteCivilClaimant,
    setWorkingCase,
    workingCase.civilClaimants,
    workingCase.id,
  ])

  useEffect(() => {
    /* 
    If the user has selected "Yes" to hasCivilClaims but has not added a civil claimant,
    this will add one for them when the page is loaded.
    */
    if (
      workingCase.hasCivilClaims &&
      workingCase.civilClaimants?.length === 0
    ) {
      addCivilClaimant()
    }
  }, [addCivilClaimant, workingCase.civilClaimants, workingCase.hasCivilClaims])

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      onNavigationTo={handleNavigationTo}
      isValid={stepIsValid}
    >
      <PageHeader
        title={formatMessage(titles.prosecutor.indictments.processing)}
      />
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(strings.heading)}
          </Text>
        </Box>
        <ProsecutorCaseInfo workingCase={workingCase} hideCourt />
        <ProsecutorSection />
        <Box component="section" marginBottom={5}>
          <SelectCourt />
        </Box>
        {workingCase.defendants && (
          <Box component="section" marginBottom={5}>
            <SectionHeading
              title={formatMessage(strings.defendantPlea, {
                defendantCount: workingCase.defendants.length,
              })}
            />
            {workingCase.defendants.map((defendant) => (
              <Box marginBottom={2} key={defendant.id}>
                <BlueBox>
                  <Text variant="h4" marginBottom={3}>
                    {`${formatMessage(strings.defendantName, {
                      name: defendant.name,
                    })} `}
                    <RequiredStar />
                  </Text>
                  <div className={styles.grid}>
                    <RadioButton
                      id={`defendant-${defendant.id}-plea-decision-guilty`}
                      name={`defendant-${defendant.id}-plea-decision`}
                      checked={defendant.defendantPlea === DefendantPlea.GUILTY}
                      onChange={() => {
                        handleUpdateDefendant({
                          defendantId: defendant.id,
                          caseId: workingCase.id,
                          defendantPlea: DefendantPlea.GUILTY,
                        })
                      }}
                      large
                      backgroundColor="white"
                      label={formatMessage(strings.pleaGuilty)}
                    />
                    <RadioButton
                      id={`defendant-${defendant.id}-plea-decision-not-guilty`}
                      name={`defendant-${defendant.id}-plea-decision`}
                      checked={
                        defendant.defendantPlea === DefendantPlea.NOT_GUILTY
                      }
                      onChange={() => {
                        handleUpdateDefendant({
                          defendantId: defendant.id,
                          caseId: workingCase.id,
                          defendantPlea: DefendantPlea.NOT_GUILTY,
                        })
                      }}
                      large
                      backgroundColor="white"
                      label={formatMessage(strings.pleaNotGuilty)}
                    />
                    <RadioButton
                      id={`defendant-${defendant.id}-plea-decision-no-plea`}
                      name={`defendant-${defendant.id}-plea-decision`}
                      checked={
                        defendant.defendantPlea === DefendantPlea.NO_PLEA
                      }
                      onChange={() => {
                        handleUpdateDefendant({
                          defendantId: defendant.id,
                          caseId: workingCase.id,
                          defendantPlea: DefendantPlea.NO_PLEA,
                        })
                      }}
                      large
                      backgroundColor="white"
                      label={formatMessage(strings.pleaNoPlea)}
                    />
                  </div>
                </BlueBox>
              </Box>
            ))}
          </Box>
        )}
        <Box component="section" marginBottom={5}>
          <CommentsInput
            workingCase={workingCase}
            setWorkingCase={setWorkingCase}
          />
        </Box>
        <Box
          component="section"
          marginBottom={workingCase.hasCivilClaims === true ? 5 : 10}
        >
          <BlueBox>
            <SectionHeading
              title={formatMessage(strings.isCivilClaim)}
              marginBottom={2}
              heading="h4"
              required
            />
            <Box display="flex">
              <Box width="half" marginRight={1}>
                <RadioButton
                  name="isCivilClaim"
                  id="civil_caim_yes"
                  label={formatMessage(strings.yes)}
                  large
                  backgroundColor="white"
                  onChange={() => handleHasCivilClaimsChange(true)}
                  checked={
                    hasCivilClaimantChoice === true ||
                    (hasCivilClaimantChoice === undefined &&
                      workingCase.hasCivilClaims === true)
                  }
                />
              </Box>
              <Box width="half" marginLeft={1}>
                <RadioButton
                  name="isCivilClaim"
                  id="civil_caim_no"
                  label={formatMessage(strings.no)}
                  large
                  backgroundColor="white"
                  onChange={() => handleHasCivilClaimsChange(false)}
                  checked={
                    hasCivilClaimantChoice === false ||
                    (hasCivilClaimantChoice === undefined &&
                      workingCase.hasCivilClaims === false)
                  }
                />
              </Box>
            </Box>
          </BlueBox>
        </Box>
        {workingCase.hasCivilClaims && (
          <>
            {workingCase.civilClaimants?.map((civilClaimant) => (
              <Box component="section" marginBottom={5}>
                <SectionHeading title={formatMessage(strings.civilClaimant)} />
                <BlueBox>
                  <Box marginBottom={2}>
                    <Checkbox
                      name="isCivilClaimantForeign"
                      label={formatMessage(strings.isCivilClaimantForeign)}
                      checked={false}
                      backgroundColor="white"
                      large
                      filled
                    />
                  </Box>
                  <Box marginBottom={2}>
                    <InputNationalId
                      isDateOfBirth={false}
                      value={civilClaimant.nationalId ?? undefined}
                      onChange={(val) => console.log('change', val)}
                      onBlur={(val) =>
                        handleCivilClaimantNationalIdBlur(val, civilClaimant.id)
                      }
                    />
                  </Box>
                  <InputName
                    value={civilClaimant.name ?? undefined}
                    onChange={(val) => console.log('change', val)}
                    onBlur={(val) => console.log('blur', val)}
                  />
                  <Box display="flex" justifyContent="flexEnd" marginTop={2}>
                    <Button
                      variant="text"
                      colorScheme={
                        claimantHasDefender ? 'destructive' : 'default'
                      }
                      onClick={() =>
                        setClaimantHasDefender(!claimantHasDefender)
                      }
                    >
                      {formatMessage(
                        claimantHasDefender
                          ? strings.removeDefender
                          : strings.addDefender,
                      )}
                    </Button>
                  </Box>
                  {claimantHasDefender && (
                    <>
                      <Box display="flex" marginY={2}>
                        <Box width="half" marginRight={1}>
                          <RadioButton
                            name="defenderType"
                            id="defender_type_L"
                            label={formatMessage(strings.lawyer)}
                            large
                            backgroundColor="white"
                            onChange={() => setDefenderType('L')}
                            checked={defenderType === 'L'}
                          />
                        </Box>
                        <Box width="half" marginLeft={1}>
                          <RadioButton
                            name="defenderType"
                            id="defender_type_R"
                            label={formatMessage(strings.legalRightsProtector)}
                            large
                            backgroundColor="white"
                            onChange={() => setDefenderType('R')}
                            checked={defenderType === 'R'}
                          />
                        </Box>
                      </Box>
                      {/* <DefenderInput
                    onDefenderNotFound={function (
                      defenderNotFound: boolean,
                      ): void {
                        throw new Error('Function not implemented.')
                        }}
                        defendantId={'1212'}
                        /> */}
                    </>
                  )}
                </BlueBox>
              </Box>
            ))}
            <Box display="flex" justifyContent="flexEnd" marginBottom={10}>
              <Button
                variant="ghost"
                icon="add"
                onClick={handleCreateCivilClaimantClick}
              >
                {formatMessage(strings.addCivilClaimant)}
              </Button>
            </Box>
          </>
        )}
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          nextButtonIcon="arrowForward"
          previousUrl={`${constants.INDICTMENTS_CASE_FILE_ROUTE}/${workingCase.id}`}
          nextIsDisabled={!stepIsValid}
          onNextButtonClick={() =>
            handleNavigationTo(
              isTrafficViolationCaseCheck
                ? constants.INDICTMENTS_TRAFFIC_VIOLATION_ROUTE
                : constants.INDICTMENTS_CASE_FILES_ROUTE,
            )
          }
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default Processing
