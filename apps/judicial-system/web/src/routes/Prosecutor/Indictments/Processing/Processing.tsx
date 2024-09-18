import { FC, useCallback, useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

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
import {
  useCase,
  useDefendants,
  useNationalRegistry,
  useOnceOn,
} from '@island.is/judicial-system-web/src/utils/hooks'
import useCivilClaimants from '@island.is/judicial-system-web/src/utils/hooks/useCivilClaimants'
import { isProcessingStepValidIndictments } from '@island.is/judicial-system-web/src/utils/validate'

import { ProsecutorSection, SelectCourt } from '../../components'
import { strings } from './processing.strings'
import * as styles from './Processing.css'

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
  const [civilClaimantNationalIdUpdate, setCivilClaimantNationalIdUpdate] =
    useState<{ nationalId: string; civilClaimantId: string }>()
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

  const { personData, personError } = useNationalRegistry(
    civilClaimantNationalIdUpdate?.nationalId,
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
    noNationalId?: boolean | null,
    civilClaimantId?: string | null,
  ) => {
    if (!civilClaimantId) {
      return
    }

    if (noNationalId) {
      handleUpdateCivilClaimant({
        caseId: workingCase.id,
        civilClaimantId,
        nationalId,
      })
    } else {
      const cleanNationalId = nationalId.replace('-', '')
      setCivilClaimantNationalIdUpdate({
        nationalId: cleanNationalId,
        civilClaimantId,
      })
    }
  }

  const handleCivilClaimantNameBlur = async (
    name: string,
    civilClaimantId?: string | null,
  ) => {
    if (!civilClaimantId) {
      return
    }

    const civilClaimantToUpdate = workingCase.civilClaimants?.find(
      (c) => c.id === civilClaimantId,
    )

    if (civilClaimantToUpdate?.name === name) {
      return
    }

    updateCivilClaimant({ name, civilClaimantId, caseId: workingCase.id })
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
    if (!personData || !personData.items) {
      return
    }

    const update = {
      caseId: workingCase.id,
      civilClaimantId: civilClaimantNationalIdUpdate?.civilClaimantId || '',
      name: personData?.items[0].name,
      nationalId: personData.items[0].kennitala,
    }

    handleUpdateCivilClaimant(update)
  }, [personData])

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
            <SectionHeading title={formatMessage(strings.civilClaimant)} />
            {workingCase.civilClaimants?.map((civilClaimant) => (
              <Box component="section" marginBottom={5} key={civilClaimant.id}>
                <BlueBox>
                  <Box marginBottom={2}>
                    <Checkbox
                      name="civilClaimantNoNationalId"
                      label={formatMessage(strings.civilClaimantNoNationalId)}
                      checked={Boolean(civilClaimant.noNationalId)}
                      onChange={() => {
                        handleUpdateCivilClaimant({
                          caseId: workingCase.id,
                          civilClaimantId: civilClaimant.id,
                          nationalId: null,
                          noNationalId: !civilClaimant.noNationalId,
                        })
                      }}
                      backgroundColor="white"
                      large
                      filled
                    />
                  </Box>
                  <Box marginBottom={2}>
                    <InputNationalId
                      isDateOfBirth={Boolean(civilClaimant.noNationalId)}
                      value={civilClaimant.nationalId ?? undefined}
                      onChange={(val) => {
                        updateCivilClaimantState(
                          {
                            caseId: workingCase.id,
                            civilClaimantId: civilClaimant.id ?? '',
                            nationalId: val,
                          },
                          setWorkingCase,
                        )
                      }}
                      onBlur={(val) =>
                        handleCivilClaimantNationalIdBlur(
                          val,
                          civilClaimant.noNationalId,
                          civilClaimant.id,
                        )
                      }
                    />
                  </Box>
                  <InputName
                    value={civilClaimant.name ?? undefined}
                    onBlur={(val) =>
                      handleCivilClaimantNameBlur(val, civilClaimant.id)
                    }
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
