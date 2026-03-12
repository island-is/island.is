import { FC, useCallback, useContext, useRef } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import {
  Box,
  Button,
  InputFileUpload,
  RadioButton,
} from '@island.is/island-ui/core'
import { fileExtensionWhitelist } from '@island.is/island-ui/core/types'
import * as constants from '@island.is/judicial-system/consts'
import { titles } from '@island.is/judicial-system-web/messages'
import {
  BlueBox,
  CommentsInput,
  FormContentContainer,
  FormContext,
  FormFooter,
  PageHeader,
  PageLayout,
  PageTitle,
  ProsecutorCaseInfo,
  SectionHeading,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import {
  CaseFileCategory,
  CaseState,
  CaseTransition,
  CivilClaimant,
  DefendantPlea,
  UpdateDefendantInput,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  useCase,
  useCivilClaimants,
  useDefendants,
  useFileList,
  useOnceOn,
  useS3Upload,
  useUploadFiles,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { isProcessingStepValidIndictments } from '@island.is/judicial-system-web/src/utils/validate'

import { SelectCourt } from '../../components'
import { CivilClaimantFields } from './CivilClaimantFields'
import { strings } from './processing.strings'
import * as styles from './Processing.css'

interface UpdateDefendant extends Omit<UpdateDefendantInput, 'caseId'> {}
const addCivilClaimantFileSectionId = 'addCivilClaimantFileSection'

const Processing: FC = () => {
  const { user } = useContext(UserContext)
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
    isCaseUpToDate,
  } = useContext(FormContext)
  const civilClaimRef = useRef<HTMLElement>(null)
  const { updateCase, transitionCase, updateUnlimitedAccessCase } = useCase()
  const { formatMessage } = useIntl()
  const { setAndSendDefendantToServer } = useDefendants()
  const { createCivilClaimant, deleteCivilClaimant } = useCivilClaimants()
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
  const { onOpenFile } = useFileList({
    caseId: workingCase.id,
  })

  const router = useRouter()

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

  const stepIsValid =
    isProcessingStepValidIndictments(workingCase) && allFilesDoneOrError

  const handleSetAndSendDefendantToServer = (update: UpdateDefendant) => {
    setAndSendDefendantToServer(
      { caseId: workingCase.id, ...update },
      setWorkingCase,
    )
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

  const handleCreateCivilClaimantClick = () => {
    addCivilClaimant()

    const element = document.getElementById(addCivilClaimantFileSectionId)
    element?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    })
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

  const handleHasCivilClaimsChange = async (hasCivilClaims: boolean) => {
    const res = await updateUnlimitedAccessCase(workingCase.id, {
      hasCivilClaims,
    })

    if (!res) {
      return
    }

    setWorkingCase((prev) => ({
      ...prev,
      hasCivilClaims,
      civilClaimants: res.civilClaimants,
    }))

    if (hasCivilClaims) {
      requestAnimationFrame(() => {
        civilClaimRef.current?.scrollIntoView({
          block: 'start',
          behavior: 'smooth',
        })
      })
    }
  }

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
        <Box marginBottom={5}>
          <ProsecutorCaseInfo workingCase={workingCase} hideCourt />
        </Box>
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
              tooltip="Hægt er að velja afstöðu sakbornings til að flýta fyrir úthlutun máls"
            />
            {workingCase.defendants.map((defendant) => (
              <Box marginBottom={2} key={defendant.id}>
                <BlueBox>
                  <SectionHeading
                    title={`Ákærði ${defendant.name}`}
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
                      label="Játar sök"
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
                      label="Neitar sök í einu eða fleiri sakarefnum"
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
                      label="Tjáir sig ekki / óljóst"
                    />
                  </div>
                </BlueBox>
              </Box>
            ))}
          </Box>
        )}
        <Box component="section" marginBottom={5}>
          <CommentsInput />
        </Box>
        <Box
          component="section"
          marginBottom={workingCase.hasCivilClaims === true ? 5 : 10}
          ref={civilClaimRef}
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
                  onChange={() => {
                    handleHasCivilClaimsChange(true)
                  }}
                  checked={workingCase.hasCivilClaims === true}
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
                  checked={workingCase.hasCivilClaims === false}
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
                <Box marginBottom={3} key={civilClaimant.id}>
                  <BlueBox>
                    <CivilClaimantFields
                      caseId={workingCase.id}
                      civilClaimant={civilClaimant}
                      civilClaimantIndex={index}
                      removeCivilClaimantById={removeCivilClaimantById}
                    />
                  </BlueBox>
                </Box>
              ))}
              <Box display="flex" justifyContent="flexEnd" marginBottom={5}>
                <Button
                  variant="ghost"
                  icon="add"
                  onClick={handleCreateCivilClaimantClick}
                >
                  {formatMessage(strings.addCivilClaimant)}
                </Button>
              </Box>
            </Box>
            <Box
              id={addCivilClaimantFileSectionId}
              component="section"
              marginBottom={10}
            >
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
                onOpenFile={(file) => onOpenFile(file)}
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
