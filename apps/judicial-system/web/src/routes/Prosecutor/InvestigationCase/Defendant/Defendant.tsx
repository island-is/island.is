import { useCallback, useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence, motion } from 'motion/react'
import { useRouter } from 'next/router'
import { uuid } from 'uuidv4'

import {
  Box,
  Button,
  Checkbox,
  Input,
  RadioButton,
  Select,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import * as constants from '@island.is/judicial-system/consts'
import {
  capitalize,
  formatCaseType,
} from '@island.is/judicial-system/formatters'
import {
  core,
  defendant as m,
  errors,
  titles,
} from '@island.is/judicial-system-web/messages'
import {
  BlueBox,
  DefenderInfo,
  DefenderNotFound,
  FormContentContainer,
  FormContext,
  FormFooter,
  InputAdvocate,
  InputName,
  InputNationalId,
  PageHeader,
  PageLayout,
  PageTitle,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import RequiredStar from '@island.is/judicial-system-web/src/components/RequiredStar/RequiredStar'
import {
  Case,
  CaseOrigin,
  CaseType,
  Defendant as TDefendant,
  RequestSharedWhen,
  UpdateDefendantInput,
  UpdateVictimInput,
  Victim,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { isNonEmptyArray } from '@island.is/judicial-system-web/src/utils/arrayHelpers'
import {
  useCase,
  useDefendants,
  useVictim,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { useNationalRegistry } from '@island.is/judicial-system-web/src/utils/hooks'
import { isBusiness } from '@island.is/judicial-system-web/src/utils/utils'
import { isDefendantStepValidIC } from '@island.is/judicial-system-web/src/utils/validate'

import {
  DefendantInfo,
  PoliceCaseNumbers,
  usePoliceCaseNumbers,
} from '../../components'

interface UpdateVictim extends Omit<UpdateVictimInput, 'caseId'> {}

const Defendant = () => {
  const router = useRouter()
  const { updateDefendant, createDefendant, deleteDefendant } = useDefendants()
  const {
    createVictim,
    updateVictim,
    deleteVictim,
    updateVictimState,
    setAndSendVictimToServer,
  } = useVictim()

  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const { createCase, isCreatingCase, setAndSendCaseToServer } = useCase()
  const { formatMessage } = useIntl()
  // This state is needed because type is initially set to OHTER on the
  // workingCase and we need to validate that the user selects an option
  // from the case type list to allow the user to continue.
  const [caseType, setCaseType] = useState<CaseType | null>()

  const [nationalIdNotFound, setNationalIdNotFound] = useState<boolean>(false)
  const [lawyerNotFound, setLawyerNotFound] = useState<boolean>(false)

  useEffect(() => {
    if (workingCase.id) {
      setCaseType(workingCase.type)
    }
  }, [workingCase.id, workingCase.type])

  const { clientPoliceNumbers, setClientPoliceNumbers } =
    usePoliceCaseNumbers(workingCase)

  const handleNavigationTo = useCallback(
    async (destination: string) => {
      if (!workingCase.id) {
        const createdCase = await createCase(workingCase)

        if (createdCase) {
          workingCase.defendants?.forEach(async (defendant, index) => {
            if (
              index === 0 &&
              createdCase.defendants &&
              createdCase.defendants.length > 0
            ) {
              await updateDefendant({
                caseId: createdCase.id,
                defendantId: createdCase.defendants[0].id,
                gender: defendant.gender,
                name: defendant.name,
                address: defendant.address,
                nationalId: defendant.nationalId || null,
                noNationalId: defendant.noNationalId,
                citizenship: defendant.citizenship,
              })
            } else {
              await createDefendant({
                caseId: createdCase.id,
                gender: defendant.gender,
                name: defendant.name,
                address: defendant.address,
                nationalId: defendant.nationalId || null,
                noNationalId: defendant.noNationalId,
                citizenship: defendant.citizenship,
              })
            }
          })
          router.push(`${destination}/${createdCase.id}`)
        } else {
          toast.error(formatMessage(errors.createCase))
        }
      } else {
        router.push(`${destination}/${workingCase.id}`)
      }
    },
    [
      workingCase,
      createCase,
      router,
      updateDefendant,
      createDefendant,
      formatMessage,
    ],
  )

  const updateDefendantState = useCallback(
    (update: UpdateDefendantInput) => {
      setWorkingCase((prevWorkingCase: Case) => {
        if (!prevWorkingCase.defendants) {
          return prevWorkingCase
        }

        const indexOfDefendantToUpdate = prevWorkingCase.defendants.findIndex(
          (defendant) => defendant.id === update.defendantId,
        )

        const newDefendants = [...prevWorkingCase.defendants]

        newDefendants[indexOfDefendantToUpdate] = {
          ...newDefendants[indexOfDefendantToUpdate],
          ...update,
        } as TDefendant
        return { ...prevWorkingCase, defendants: newDefendants }
      })
    },
    [setWorkingCase],
  )

  const handleUpdateDefendant = useCallback(
    async (updatedDefendant: UpdateDefendantInput) => {
      updateDefendantState(updatedDefendant)

      if (workingCase.id) {
        updateDefendant(updatedDefendant)
      }
    },
    [updateDefendantState, workingCase.id, updateDefendant],
  )

  const handleDeleteDefendant = async (defendant: TDefendant) => {
    if (workingCase.defendants && workingCase.defendants.length > 1) {
      if (workingCase.id) {
        const defendantDeleted = await deleteDefendant(
          workingCase.id,
          defendant.id,
        )

        if (defendantDeleted && workingCase.defendants) {
          removeDefendantFromState(defendant)
        } else {
          // TODO: handle error
        }
      } else {
        removeDefendantFromState(defendant)
      }
    }
  }

  const removeDefendantFromState = (defendant: TDefendant) => {
    setWorkingCase((prevWorkingCase) => ({
      ...prevWorkingCase,
      defendants:
        prevWorkingCase.defendants &&
        [...prevWorkingCase.defendants].filter((d) => d.id !== defendant.id),
    }))
  }

  const handleCreateDefendantClick = async () => {
    if (workingCase.id) {
      const defendantId = await createDefendant({ caseId: workingCase.id })

      createEmptyDefendant(defendantId)
    } else {
      createEmptyDefendant()
    }

    window.scrollTo(0, document.body.scrollHeight)
  }

  const createEmptyDefendant = (defendantId?: string) => {
    setWorkingCase((prevWorkingCase) => ({
      ...prevWorkingCase,
      defendants: prevWorkingCase.defendants && [
        ...prevWorkingCase.defendants,
        { id: defendantId || uuid() },
      ],
    }))
  }

  const handleCreateVictim = async () => {
    const victimId = await createVictim({ caseId: workingCase.id })

    if (victimId) {
      setWorkingCase((prevWorkingCase) => ({
        ...prevWorkingCase,
        victims: prevWorkingCase.victims && [
          ...prevWorkingCase.victims,
          { id: victimId },
        ],
      }))
    }
  }

  const handleDeleteVictim = async (victim: Victim) => {
    if (isNonEmptyArray(workingCase.victims)) {
      const victimDeleted = await deleteVictim(workingCase.id, victim.id)

      if (victimDeleted && workingCase.victims) {
        setWorkingCase((prevWorkingCase) => ({
          ...prevWorkingCase,
          victims:
            prevWorkingCase.victims &&
            [...prevWorkingCase.victims].filter((d) => d.id !== victim.id),
        }))
      }
    }
  }

  const handleUpdateVictimState = (update: UpdateVictim) => {
    updateVictimState({ caseId: workingCase.id, ...update }, setWorkingCase)
  }

  const handleUpdateVictim = (update: UpdateVictim) => {
    updateVictim({ caseId: workingCase.id, ...update })
  }

  const handleSetAndSendVictimToServer = (update: UpdateVictim) => {
    setAndSendVictimToServer(
      { caseId: workingCase.id, ...update },
      setWorkingCase,
    )
  }

  const stepIsValid = isDefendantStepValidIC(
    workingCase,
    caseType,
    clientPoliceNumbers,
  )

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isExtension={!!workingCase.parentCase}
      isValid={stepIsValid}
      onNavigationTo={handleNavigationTo}
    >
      <PageHeader
        title={formatMessage(titles.prosecutor.investigationCases.defendant)}
      />

      <FormContentContainer>
        <Box marginBottom={10}>
          <PageTitle>{formatMessage(m.heading)}</PageTitle>
          <Box component="section" marginBottom={5}>
            <PoliceCaseNumbers
              workingCase={workingCase}
              setWorkingCase={setWorkingCase}
              clientPoliceNumbers={clientPoliceNumbers}
              setClientPoliceNumbers={setClientPoliceNumbers}
            />
          </Box>
          <Box component="section" marginBottom={5}>
            <Box marginBottom={3}>
              <Text as="h3" variant="h3">
                {formatMessage(m.sections.investigationType.heading)}
              </Text>
            </Box>
            <BlueBox>
              <Box marginBottom={3}>
                <Select
                  name="type"
                  options={constants.InvestigationCaseTypes}
                  label={formatMessage(m.sections.investigationType.type.label)}
                  placeholder={formatMessage(
                    m.sections.investigationType.type.placeholder,
                  )}
                  onChange={(selectedOption) => {
                    const type = selectedOption?.value

                    setCaseType(type)
                    setAndSendCaseToServer(
                      [
                        {
                          type,
                          force: true,
                        },
                      ],
                      workingCase,
                      setWorkingCase,
                    )
                  }}
                  value={
                    workingCase.id
                      ? {
                          value: workingCase.type,
                          label: capitalize(formatCaseType(workingCase.type)),
                        }
                      : undefined
                  }
                  formatGroupLabel={() => (
                    <div
                      style={{
                        width: 'calc(100% + 24px)',
                        height: '3px',
                        marginLeft: '-12px',
                        backgroundColor: theme.color.dark300,
                      }}
                    />
                  )}
                  required
                />
              </Box>
              <Input
                data-testid="description"
                name="description"
                label={formatMessage(
                  m.sections.investigationType.description.label,
                )}
                placeholder={formatMessage(
                  m.sections.investigationType.description.placeholder,
                )}
                value={workingCase.description || ''}
                autoComplete="off"
                onChange={(evt) => {
                  setWorkingCase((prevWorkingCase) => ({
                    ...prevWorkingCase,
                    description: evt.target.value,
                  }))
                }}
                onBlur={(evt) =>
                  setAndSendCaseToServer(
                    [
                      {
                        description: evt.target.value.trim(),
                        force: true,
                      },
                    ],
                    workingCase,
                    setWorkingCase,
                  )
                }
                maxLength={255}
              />
            </BlueBox>
          </Box>
          <Box component="section" marginBottom={5}>
            <Box marginBottom={3}>
              <Text as="h3" variant="h3">
                {formatMessage(m.sections.defendantInfo.heading)}
              </Text>
            </Box>
            <AnimatePresence>
              {workingCase.defendants &&
                workingCase.defendants.map((defendant, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <Box
                      marginBottom={
                        index - 1 === workingCase.defendants?.length ? 0 : 3
                      }
                    >
                      <DefendantInfo
                        defendant={defendant}
                        workingCase={workingCase}
                        setWorkingCase={setWorkingCase}
                        onDelete={
                          workingCase.defendants &&
                          workingCase.defendants.length > 1 &&
                          !(
                            workingCase.origin === CaseOrigin.LOKE &&
                            index === 0
                          )
                            ? handleDeleteDefendant
                            : undefined
                        }
                        onChange={handleUpdateDefendant}
                        updateDefendantState={updateDefendantState}
                        nationalIdImmutable={
                          workingCase.origin === CaseOrigin.LOKE && index === 0
                        }
                      />
                    </Box>
                  </motion.div>
                ))}
            </AnimatePresence>
            <Box display="flex" justifyContent="flexEnd" marginTop={3}>
              <Button
                data-testid="addDefendantButton"
                variant="ghost"
                icon="add"
                onClick={handleCreateDefendantClick}
                disabled={workingCase.defendants?.some(
                  (defendant) =>
                    (!isBusiness(defendant.nationalId) && !defendant.gender) ||
                    !defendant.name ||
                    !defendant.address ||
                    (!defendant.noNationalId && !defendant.nationalId),
                )}
              >
                {formatMessage(m.sections.defendantInfo.addDefendantButtonText)}
              </Button>
            </Box>
          </Box>
          <AnimatePresence>
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <DefenderInfo
                workingCase={workingCase}
                setWorkingCase={setWorkingCase}
              />
            </motion.section>
          </AnimatePresence>
        </Box>
        {workingCase.id && (
          <>
            {/* <Box component="section" marginBottom={5}>
              <BlueBox>
                <Box>
                  <Checkbox
                    name="register-victim"
                    label={'Skrá brotaþola'}
                    checked={isNonEmptyArray(workingCase.victims)}
                    onChange={(evt) => {
                      if (evt.target.checked) {
                        handleCreateVictim()
                      }
                    }}
                    disabled={isNonEmptyArray(workingCase.victims)}
                    filled
                    large
                  />
                </Box>
              </BlueBox>
            </Box> */}
            <Box component="section" marginBottom={5}>
              <SectionHeading title="Brotaþoli" />
              {workingCase.victims?.map((victim, index) => (
                <Box
                  marginBottom={
                    index - 1 === workingCase.victims?.length ? 0 : 3
                  }
                >
                  <BlueBox>
                    <Box key={index}>
                      <Box>
                        <Box
                          marginBottom={2}
                          display="flex"
                          justifyContent="flexEnd"
                        >
                          <Button
                            onClick={() => handleDeleteVictim(victim)}
                            colorScheme="destructive"
                            variant="text"
                            size="small"
                            data-testid="deleteDefendantButton"
                          >
                            Eyða
                          </Button>
                        </Box>

                        <Box marginBottom={2}>
                          <Checkbox
                            name={`noNationalId-${victim.id}`}
                            label={'Brotaþoli er ekki með íslenska kennitölu'}
                            checked={victim.hasNationalId === false}
                            onChange={(event) => {
                              setNationalIdNotFound(false)

                              handleSetAndSendVictimToServer({
                                victimId: victim.id,
                                hasNationalId: !event.target.checked,
                                nationalId: null,
                              })
                            }}
                            filled
                            large
                          />
                        </Box>

                        <Box marginBottom={2}>
                          <Box marginBottom={2}>
                            <InputNationalId
                              isDateOfBirth={victim.hasNationalId === false}
                              value={victim.nationalId ?? ''}
                              onBlur={(value) =>
                                handleSetAndSendVictimToServer({
                                  victimId: victim.id,
                                  nationalId: value,
                                })
                              }
                              onChange={(value) =>
                                handleUpdateVictimState({
                                  victimId: victim.id,
                                  nationalId: value,
                                })
                              }
                              required={Boolean(victim.hasNationalId)}
                            />
                            {victim.nationalId?.length === 11 &&
                              nationalIdNotFound && (
                                <Text
                                  color="red600"
                                  variant="eyebrow"
                                  marginTop={1}
                                >
                                  {formatMessage(
                                    core.nationalIdNotFoundInNationalRegistry,
                                  )}
                                </Text>
                              )}
                          </Box>
                          <Box marginBottom={2}>
                            <InputName
                              value={victim.name ?? ''}
                              onBlur={(value) =>
                                handleSetAndSendVictimToServer({
                                  victimId: victim.id,
                                  name: value,
                                })
                              }
                              onChange={(value) => {
                                handleUpdateVictimState({
                                  victimId: victim.id,
                                  name: value,
                                })
                              }}
                              required
                            />
                          </Box>
                        </Box>
                      </Box>
                      <Box marginTop={4}>
                        <Box marginBottom={2}>
                          <Text as="h3" variant="h4">
                            {'Réttargæslumaður'}
                          </Text>
                        </Box>
                        {lawyerNotFound && <DefenderNotFound />}
                        <InputAdvocate
                          advocateType="legalRightsProtector"
                          name={victim.lawyerName}
                          email={victim.lawyerEmail}
                          phoneNumber={victim.lawyerPhoneNumber}
                          onAdvocateChange={(
                            lawyerName: string | null,
                            lawyerNationalId: string | null,
                            lawyerEmail: string | null,
                            lawyerPhoneNumber: string | null,
                          ) =>
                            handleSetAndSendVictimToServer({
                              victimId: victim.id,
                              lawyerName,
                              lawyerNationalId,
                              lawyerEmail,
                              lawyerPhoneNumber,
                            })
                          }
                          onAdvocateNotFound={setLawyerNotFound}
                          onEmailChange={(lawyerEmail: string | null) =>
                            handleUpdateVictimState({
                              victimId: victim.id,
                              lawyerEmail,
                            })
                          }
                          onEmailSave={(lawyerEmail: string | null) =>
                            handleUpdateVictim({
                              victimId: victim.id,
                              lawyerEmail,
                            })
                          }
                          onPhoneNumberChange={(
                            lawyerPhoneNumber: string | null,
                          ) =>
                            handleUpdateVictimState({
                              victimId: victim.id,
                              lawyerPhoneNumber,
                            })
                          }
                          onPhoneNumberSave={(
                            lawyerPhoneNumber: string | null,
                          ) =>
                            handleUpdateVictim({
                              victimId: victim.id,
                              lawyerPhoneNumber,
                            })
                          }
                        />
                        <>
                          <Text variant="h4" marginTop={2} marginBottom={2}>
                            Aðgangur réttargæslumanns að kröfu
                            <RequiredStar />
                          </Text>
                          <Box>
                            <RadioButton
                              name="lawyer-access"
                              id="lawyer-access-ready-for-court"
                              label="Gefa réttargæslumanni aðgang að kröfu þegar krafa er send á dómstól"
                              checked={
                                victim.lawyerAccessToRequest ===
                                RequestSharedWhen.READY_FOR_COURT
                              }
                              onChange={() => {
                                handleSetAndSendVictimToServer({
                                  victimId: victim.id,
                                  lawyerAccessToRequest:
                                    RequestSharedWhen.READY_FOR_COURT,
                                })
                              }}
                              large
                              backgroundColor="white"
                              disabled={!victim.lawyerName}
                            />
                          </Box>
                          <Box marginTop={2}>
                            <RadioButton
                              name="lawyer-access"
                              id="lawyer-access-arraignment_date_assigned"
                              label="Gefa réttargæslumanni aðgang að kröfu við úthlutun fyrirtökutíma"
                              checked={
                                victim.lawyerAccessToRequest ===
                                RequestSharedWhen.ARRAIGNMENT_DATE_ASSIGNED
                              }
                              onChange={() => {
                                handleSetAndSendVictimToServer({
                                  victimId: victim.id,
                                  lawyerAccessToRequest:
                                    RequestSharedWhen.ARRAIGNMENT_DATE_ASSIGNED,
                                })
                              }}
                              large
                              backgroundColor="white"
                              disabled={!victim.lawyerName}
                            />
                          </Box>
                          <Box marginTop={2}>
                            <RadioButton
                              name="lawyer-access-when-obligated"
                              id="lawyer-access-when-obligated"
                              label="Ekki gefa réttargæslumanni aðgang að kröfu"
                              checked={
                                victim.lawyerAccessToRequest ===
                                RequestSharedWhen.OBLIGATED
                              }
                              onChange={() => {
                                handleSetAndSendVictimToServer({
                                  victimId: victim.id,
                                  lawyerAccessToRequest:
                                    RequestSharedWhen.OBLIGATED,
                                })
                              }}
                              large
                              backgroundColor="white"
                              disabled={!victim.lawyerName}
                            />
                          </Box>
                        </>
                      </Box>
                    </Box>
                  </BlueBox>
                </Box>
              ))}

              <Box display="flex" justifyContent="flexEnd" marginTop={2}>
                <Button
                  data-testid="addVictimButton"
                  variant="ghost"
                  icon="add"
                  onClick={handleCreateVictim}
                >
                  Bæta við brotaþola
                </Button>
              </Box>
            </Box>
          </>
        )}
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          nextButtonIcon="arrowForward"
          previousUrl={`${constants.CASES_ROUTE}`}
          onNextButtonClick={() =>
            handleNavigationTo(
              constants.INVESTIGATION_CASE_HEARING_ARRANGEMENTS_ROUTE,
            )
          }
          nextIsDisabled={!stepIsValid}
          nextIsLoading={isCreatingCase}
          nextButtonText={formatMessage(
            workingCase.id === '' ? core.createCase : core.continue,
          )}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default Defendant
