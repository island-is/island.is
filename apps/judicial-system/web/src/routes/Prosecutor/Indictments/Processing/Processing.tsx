import {
  FC,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import {
  Box,
  Button,
  Checkbox,
  InputFileUpload,
  RadioButton,
  Text,
} from '@island.is/island-ui/core'
import { fileExtensionWhitelist } from '@island.is/island-ui/core/types'
import * as constants from '@island.is/judicial-system/consts'
import { core, titles } from '@island.is/judicial-system-web/messages'
import {
  BlueBox,
  CommentsInput,
  FormContentContainer,
  FormContext,
  FormFooter,
  InputAdvocate,
  InputName,
  InputNationalId,
  PageHeader,
  PageLayout,
  PageTitle,
  ProsecutorCaseInfo,
  SectionHeading,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import {
  Case,
  CaseFileCategory,
  CaseState,
  CaseTransition,
  CivilClaimant,
  DefendantPlea,
  UpdateCivilClaimantInput,
  UpdateDefendantInput,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  useCase,
  useCivilClaimants,
  useDefendants,
  useNationalRegistry,
  useOnceOn,
  useS3Upload,
  useUploadFiles,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { isProcessingStepValidIndictments } from '@island.is/judicial-system-web/src/utils/validate'

import { SelectCourt } from '../../components'
import { strings } from './processing.strings'
import * as styles from './Processing.css'

interface UpdateCivilClaimant
  extends Omit<UpdateCivilClaimantInput, 'caseId'> {}

interface UpdateDefendant extends Omit<UpdateDefendantInput, 'caseId'> {}

const Processing: FC = () => {
  const { user } = useContext(UserContext)
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
    isCaseUpToDate,
  } = useContext(FormContext)
  const { updateCase, transitionCase, updateUnlimitedAccessCase } = useCase()
  const { formatMessage } = useIntl()
  const { setAndSendDefendantToServer } = useDefendants()
  const {
    updateCivilClaimant,
    updateCivilClaimantState,
    createCivilClaimant,
    deleteCivilClaimant,
    setAndSendCivilClaimantToServer,
  } = useCivilClaimants()
  const {
    uploadFiles,
    allFilesDoneOrError,
    addUploadFiles,
    updateUploadFile,
    removeUploadFile,
  } = useUploadFiles(workingCase.caseFiles)
  const { handleUpload, handleRetry, handleRemove } = useS3Upload(
    workingCase.id,
  )
  const router = useRouter()

  const [civilClaimantNationalIdUpdate, setCivilClaimantNationalIdUpdate] =
    useState<{ nationalId: string | null; civilClaimantId: string }>()
  const [hasCivilClaimantChoice, setHasCivilClaimantChoice] =
    useState<boolean>()
  const [nationalIdNotFound, setNationalIdNotFound] = useState<boolean>(false)

  const initialize = useCallback(async () => {
    if (!workingCase.court) {
      const updatedCase = await updateCase(workingCase.id, {
        courtId: user?.institution?.defaultCourtId,
      })

      if (!updatedCase) {
        return
      }

      setWorkingCase((prevWorkingCase) => ({
        ...prevWorkingCase,
        court: updatedCase?.court,
      }))
    }
  }, [
    setWorkingCase,
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

  const { personData } = useNationalRegistry(
    civilClaimantNationalIdUpdate?.nationalId,
  )

  const stepIsValid =
    isProcessingStepValidIndictments(workingCase) && allFilesDoneOrError

  const handleSetAndSendDefendantToServer = (update: UpdateDefendant) => {
    setAndSendDefendantToServer(
      { caseId: workingCase.id, ...update },
      setWorkingCase,
    )
  }

  const handleCreateCivilClaimantClick = () => {
    addCivilClaimant()

    window.scrollTo(0, document.body.scrollHeight)
  }

  const addCivilClaimant = async () => {
    const civilClaimantId = await createCivilClaimant({
      caseId: workingCase.id,
    })

    setWorkingCase((prev) => ({
      ...prev,
      civilClaimants: [
        ...(prev.civilClaimants || []),
        {
          id: civilClaimantId,
          name: '',
          nationalId: '',
        } as CivilClaimant,
      ],
    }))
  }

  const removeCivilClaimantById = async (civilClaimantId: string) => {
    const deleteSuccess = await deleteCivilClaimant(
      workingCase.id,
      civilClaimantId,
    )

    if (!deleteSuccess) {
      return
    }

    setWorkingCase((prev) => ({
      ...prev,
      civilClaimants: prev.civilClaimants?.filter(
        (civilClaimant) => civilClaimant.id !== civilClaimantId,
      ),
    }))
  }

  const handleUpdateCivilClaimantState = (update: UpdateCivilClaimant) => {
    updateCivilClaimantState(
      { caseId: workingCase.id, ...update },
      setWorkingCase,
    )
  }

  const handleUpdateCivilClaimant = (update: UpdateCivilClaimant) => {
    updateCivilClaimant({ caseId: workingCase.id, ...update })
  }

  const handleSetAndSendCivilClaimantToServer = (
    update: UpdateCivilClaimant,
  ) => {
    setAndSendCivilClaimantToServer(
      { caseId: workingCase.id, ...update },
      setWorkingCase,
    )
  }

  const handleHasCivilClaimsChange = async (hasCivilClaims: boolean) => {
    setHasCivilClaimantChoice(hasCivilClaims)

    const res = await updateUnlimitedAccessCase(workingCase.id, {
      hasCivilClaims,
    })

    if (!res) {
      return
    }

    setWorkingCase((prev) => ({
      ...prev,
      hasCivilClaims,
      civilClaimants:
        hasCivilClaims && res.civilClaimants
          ? [
              {
                id: res.civilClaimants[0].id,
                name: res.civilClaimants[0].name,
                nationalId: res.civilClaimants[0].nationalId,
              },
            ]
          : [],
    }))
  }

  const handleCivilClaimantNationalIdBlur = (
    nationalId: string,
    noNationalId?: boolean | null,
    civilClaimantId?: string | null,
  ) => {
    if (!civilClaimantId) {
      return
    }

    if (noNationalId) {
      handleSetAndSendCivilClaimantToServer({
        civilClaimantId,
        nationalId: nationalId || null,
      })
    } else {
      const cleanNationalId = nationalId ? nationalId.replace('-', '') : ''
      setCivilClaimantNationalIdUpdate({
        nationalId: cleanNationalId || null,
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

    updateCivilClaimant({ name, civilClaimantId, caseId: workingCase.id })
  }

  useEffect(() => {
    if (!civilClaimantNationalIdUpdate) {
      return
    }

    const items = personData?.items || []
    const person = items[0]

    setNationalIdNotFound(items.length === 0)

    const update: UpdateCivilClaimant = {
      civilClaimantId: civilClaimantNationalIdUpdate.civilClaimantId || '',
      nationalId: civilClaimantNationalIdUpdate.nationalId,
      ...(person?.name ? { name: person.name } : {}),
    }

    handleSetAndSendCivilClaimantToServer(update)

    // We want this hook to run exclusively when personData changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personData])

  console.log(workingCase)

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
        <PageTitle>{formatMessage(strings.heading)}</PageTitle>
        <ProsecutorCaseInfo workingCase={workingCase} hideCourt />
        <Box component="section" marginBottom={5}>
          <SelectCourt />
        </Box>
        {workingCase.defendants && (
          <Box component="section" marginBottom={5}>
            <SectionHeading
              title={formatMessage(strings.defendantPlea, {
                defendantCount: workingCase.defendants.length,
              })}
              heading="h2"
            />
            {workingCase.defendants.map((defendant) => (
              <Box marginBottom={2} key={defendant.id}>
                <BlueBox>
                  <SectionHeading
                    title={formatMessage(strings.defendantName, {
                      name: defendant.name,
                    })}
                    heading="h3"
                    variant="h4"
                    required
                  />
                  <div className={styles.grid}>
                    <RadioButton
                      id={`defendant-${defendant.id}-plea-decision-guilty`}
                      name={`defendant-${defendant.id}-plea-decision`}
                      checked={defendant.defendantPlea === DefendantPlea.GUILTY}
                      onChange={() => {
                        handleSetAndSendDefendantToServer({
                          defendantId: defendant.id,
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
                        handleSetAndSendDefendantToServer({
                          defendantId: defendant.id,
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
                        handleSetAndSendDefendantToServer({
                          defendantId: defendant.id,
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
          <SectionHeading
            title={formatMessage(strings.civilDemandsTitle)}
            heading="h2"
          />
          <BlueBox>
            <SectionHeading
              title={formatMessage(strings.isCivilClaim)}
              marginBottom={2}
              heading="h3"
              variant="h4"
              required
            />
            <Box display="flex">
              <Box width="half" marginRight={1}>
                <RadioButton
                  name="isCivilClaim"
                  id="civil_claim_yes"
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
                  id="civil_claim_no"
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
            <Box component="section" marginBottom={5}>
              <SectionHeading
                title={formatMessage(strings.civilClaimant)}
                heading="h2"
              />
              {workingCase.civilClaimants?.map((civilClaimant, index) => (
                <Fragment key={civilClaimant.id}>
                  <Box marginBottom={3}>
                    <BlueBox>
                      {index > 0 && (
                        <Box
                          display="flex"
                          justifyContent="flexEnd"
                          marginBottom={2}
                        >
                          <Button
                            variant="text"
                            colorScheme="destructive"
                            onClick={() => {
                              removeCivilClaimantById(civilClaimant.id)
                            }}
                          >
                            {formatMessage(strings.remove)}
                          </Button>
                        </Box>
                      )}
                      <Box marginBottom={2}>
                        <Checkbox
                          name={`civilClaimantNoNationalId-${civilClaimant.id}`}
                          label={formatMessage(
                            strings.civilClaimantNoNationalId,
                          )}
                          checked={Boolean(civilClaimant.noNationalId)}
                          onChange={() => {
                            handleSetAndSendCivilClaimantToServer({
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
                          required={Boolean(!civilClaimant.noNationalId)}
                          onChange={(val) => {
                            if (val.length < 11) {
                              setNationalIdNotFound(false)
                            } else if (val.length === 11) {
                              handleCivilClaimantNationalIdBlur(
                                val,
                                civilClaimant.noNationalId,
                                civilClaimant.id,
                              )
                            }

                            handleUpdateCivilClaimantState({
                              civilClaimantId: civilClaimant.id ?? '',
                              nationalId: val,
                            })
                          }}
                          onBlur={(val) =>
                            handleCivilClaimantNationalIdBlur(
                              val,
                              civilClaimant.noNationalId,
                              civilClaimant.id,
                            )
                          }
                        />
                        {civilClaimant.nationalId?.length === 11 &&
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
                      <InputName
                        value={civilClaimant.name ?? undefined}
                        onChange={(val) =>
                          handleUpdateCivilClaimantState({
                            civilClaimantId: civilClaimant.id ?? '',
                            name: val,
                          })
                        }
                        onBlur={(val) =>
                          handleCivilClaimantNameBlur(val, civilClaimant.id)
                        }
                        required
                      />
                      <Box
                        display="flex"
                        justifyContent="flexEnd"
                        marginTop={2}
                      >
                        <Button
                          variant="text"
                          colorScheme={
                            civilClaimant.hasSpokesperson
                              ? 'destructive'
                              : 'default'
                          }
                          onClick={() => {
                            handleSetAndSendCivilClaimantToServer({
                              civilClaimantId: civilClaimant.id,
                              hasSpokesperson: !civilClaimant.hasSpokesperson,
                              spokespersonEmail: null,
                              spokespersonPhoneNumber: null,
                              spokespersonName: null,
                              spokespersonIsLawyer: null,
                              spokespersonNationalId: null,
                              caseFilesSharedWithSpokesperson: null,
                            })
                          }}
                        >
                          {formatMessage(
                            civilClaimant.hasSpokesperson
                              ? strings.removeDefender
                              : strings.addDefender,
                          )}
                        </Button>
                      </Box>
                      {civilClaimant.hasSpokesperson && (
                        <>
                          <Box display="flex" marginY={2}>
                            <Box width="half" marginRight={1}>
                              <RadioButton
                                name="defenderType"
                                id={`defender_type_lawyer-${civilClaimant.id}`}
                                label={formatMessage(strings.lawyer)}
                                large
                                backgroundColor="white"
                                onChange={() =>
                                  handleSetAndSendCivilClaimantToServer({
                                    civilClaimantId: civilClaimant.id,
                                    spokespersonIsLawyer: true,
                                  })
                                }
                                checked={Boolean(
                                  civilClaimant.spokespersonIsLawyer,
                                )}
                              />
                            </Box>
                            <Box width="half" marginLeft={1}>
                              <RadioButton
                                name="defenderType"
                                id={`defender_type_legal_rights_protector-${civilClaimant.id}`}
                                label={formatMessage(
                                  strings.legalRightsProtector,
                                )}
                                large
                                backgroundColor="white"
                                onChange={() =>
                                  handleSetAndSendCivilClaimantToServer({
                                    civilClaimantId: civilClaimant.id,
                                    spokespersonIsLawyer: false,
                                  })
                                }
                                checked={
                                  civilClaimant.spokespersonIsLawyer === false
                                }
                              />
                            </Box>
                          </Box>
                          <Box marginBottom={2}>
                            <InputAdvocate
                              advocateType={
                                civilClaimant.spokespersonIsLawyer
                                  ? 'lawyer'
                                  : 'legalRightsProtector'
                              }
                              name={civilClaimant.spokespersonName}
                              email={civilClaimant.spokespersonEmail}
                              phoneNumber={
                                civilClaimant.spokespersonPhoneNumber
                              }
                              onAdvocateChange={(
                                spokespersonName: string | null,
                                spokespersonNationalId: string | null,
                                spokespersonEmail: string | null,
                                spokespersonPhoneNumber: string | null,
                              ) => {
                                handleSetAndSendCivilClaimantToServer({
                                  civilClaimantId: civilClaimant.id,
                                  spokespersonName,
                                  spokespersonNationalId,
                                  spokespersonEmail,
                                  spokespersonPhoneNumber,
                                  caseFilesSharedWithSpokesperson:
                                    spokespersonNationalId
                                      ? civilClaimant.caseFilesSharedWithSpokesperson
                                      : null,
                                })
                              }}
                              onEmailChange={(
                                spokespersonEmail: string | null,
                              ) =>
                                handleUpdateCivilClaimantState({
                                  civilClaimantId: civilClaimant.id,
                                  spokespersonEmail,
                                })
                              }
                              onEmailSave={(spokespersonEmail: string | null) =>
                                handleUpdateCivilClaimant({
                                  civilClaimantId: civilClaimant.id,
                                  spokespersonEmail,
                                })
                              }
                              onPhoneNumberChange={(
                                spokespersonPhoneNumber: string | null,
                              ) =>
                                handleUpdateCivilClaimantState({
                                  civilClaimantId: civilClaimant.id,
                                  spokespersonPhoneNumber,
                                })
                              }
                              onPhoneNumberSave={(
                                spokespersonPhoneNumber: string | null,
                              ) =>
                                handleUpdateCivilClaimant({
                                  civilClaimantId: civilClaimant.id,
                                  spokespersonPhoneNumber,
                                })
                              }
                              disabled={
                                civilClaimant.spokespersonIsLawyer === null ||
                                civilClaimant.spokespersonIsLawyer === undefined
                              }
                            />
                          </Box>
                          <Checkbox
                            name={`civilClaimantShareFilesWithDefender-${civilClaimant.id}`}
                            label={formatMessage(
                              strings.civilClaimantShareFilesWithDefender,
                              {
                                defenderIsLawyer:
                                  civilClaimant.spokespersonIsLawyer,
                              },
                            )}
                            checked={Boolean(
                              civilClaimant.caseFilesSharedWithSpokesperson,
                            )}
                            onChange={() => {
                              handleSetAndSendCivilClaimantToServer({
                                civilClaimantId: civilClaimant.id,
                                caseFilesSharedWithSpokesperson:
                                  !civilClaimant.caseFilesSharedWithSpokesperson,
                              })
                            }}
                            disabled={
                              civilClaimant.spokespersonIsLawyer === null ||
                              civilClaimant.spokespersonIsLawyer === undefined
                            }
                            tooltip={formatMessage(
                              strings.civilClaimantShareFilesWithDefenderTooltip,
                              {
                                defenderIsLawyer:
                                  civilClaimant.spokespersonIsLawyer,
                              },
                            )}
                            backgroundColor="white"
                            large
                            filled
                          />
                        </>
                      )}
                    </BlueBox>
                  </Box>
                  <Box display="flex" justifyContent="flexEnd" marginBottom={5}>
                    <Button
                      variant="ghost"
                      icon="add"
                      onClick={handleCreateCivilClaimantClick}
                    >
                      {formatMessage(strings.addCivilClaimant)}
                    </Button>
                  </Box>
                </Fragment>
              ))}
            </Box>
            <Box component="section" marginBottom={10}>
              <SectionHeading title="Bótakrafa" heading="h2" />
              <InputFileUpload
                name="civilClaim"
                files={uploadFiles.filter(
                  (file) => file.category === CaseFileCategory.CIVIL_CLAIM,
                )}
                accept={Object.values(fileExtensionWhitelist)}
                title="Dragðu gögn hingað til að hlaða upp"
                buttonLabel="Velja gögn til að hlaða upp"
                onChange={(files) =>
                  handleUpload(
                    addUploadFiles(files, {
                      category: CaseFileCategory.CIVIL_CLAIM,
                    }),
                    updateUploadFile,
                  )
                }
                onRemove={(file) => handleRemove(file, removeUploadFile)}
                onRetry={(file) => handleRetry(file, updateUploadFile)}
              />
            </Box>
          </>
        )}
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          nextButtonIcon="arrowForward"
          previousUrl={`${constants.INDICTMENTS_CASE_FILES_ROUTE}/${workingCase.id}`}
          nextIsDisabled={!stepIsValid}
          nextUrl={`${constants.INDICTMENTS_INDICTMENT_ROUTE}/${workingCase.id}`}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default Processing
