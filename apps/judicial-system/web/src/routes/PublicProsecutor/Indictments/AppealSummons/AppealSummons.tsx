import { useCallback, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { Box, Button, Input, Text } from '@island.is/island-ui/core'
import { PUBLIC_PROSECUTOR_STAFF_INDICTMENT_CASE_OVERVIEW_ROUTE } from '@island.is/judicial-system/consts'
import {
  AppealSummonsAction,
  canIssueAppealSummons,
  canPerformAppealSummonsAction,
  Feature,
} from '@island.is/judicial-system/types'
import {
  DateLabel,
  FeatureContext,
  FormContentContainer,
  FormContext,
  FormFooter,
  PageHeader,
  PageLayout,
  PageTitle,
  PdfButton,
  SectionHeading,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { hasStandingVerdictAppeal } from '@island.is/judicial-system-web/src/components/VerdictAppealFiles/VerdictAppealFiles.logic'
import useAppealSummons from '@island.is/judicial-system-web/src/utils/hooks/useAppealSummons'
import { stack } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'

import {
  type AppealSummonsFormSection,
  appellantSideLabel,
  buildAppealSummonsFormSections,
  getEarliestStandingAppealDate,
  getStandingAppealSummonsDefendants,
  isAppealSummonsFormReady,
  prefillAppealCaseName,
  resolveAppealSummonsCaseName,
  toAppealSummonsDefendantInputs,
} from './AppealSummons.logic'

/**
 * Staff issue or edit an áfrýjunarstefna for a standing verdict appeal. One
 * section per defendant with a standing appeal; removed defendants collapse to
 * a Bæta við row. Preview POSTs the unsaved form; save creates or replaces the
 * draft and returns to the Overview.
 */
const AppealSummons = () => {
  const { workingCase, isLoadingWorkingCase, caseNotFound, refreshCase } =
    useContext(FormContext)
  const { user } = useContext(UserContext)
  const { features, isLoading: isLoadingFeatures } = useContext(FeatureContext)
  const router = useRouter()
  const {
    createAppealSummons,
    updateAppealSummons,
    previewAppealSummons,
    isCreatingAppealSummons,
    isUpdatingAppealSummons,
  } = useAppealSummons()

  const appealSummonsId = router.query.appealSummonsId?.toString()
  const overviewUrl = `${PUBLIC_PROSECUTOR_STAFF_INDICTMENT_CASE_OVERVIEW_ROUTE}/${workingCase.id}`
  const existingSummons = workingCase.verdictAppealCase?.appealSummonses?.find(
    (summons) => summons.id === appealSummonsId,
  )

  const isFeatureEnabled = features.includes(Feature.INDICTMENT_APPEAL)
  const isEdit = Boolean(appealSummonsId)
  const hasStandingAppeal = hasStandingVerdictAppeal(
    workingCase.verdictAppealCase,
  )
  const mayIssue = canIssueAppealSummons(user, hasStandingAppeal)
  const mayEdit =
    existingSummons !== undefined &&
    canPerformAppealSummonsAction(
      AppealSummonsAction.EDIT,
      existingSummons,
      user,
    )
  // Issue still needs a standing appeal (via mayIssue). Edit is allowed on an
  // existing draft/confirmed summons even when every appeal was later withdrawn.
  const mayAccess = isEdit ? mayEdit : mayIssue

  const [sections, setSections] = useState<AppealSummonsFormSection[]>([])
  const [caseName, setCaseName] = useState('')
  // Once the user edits Heiti máls (or a stored name was loaded), keep it
  // even when defendants are added or removed from the summons.
  const [caseNameEdited, setCaseNameEdited] = useState(false)
  const [hasInitialized, setHasInitialized] = useState(false)

  useEffect(() => {
    if (isLoadingWorkingCase || isLoadingFeatures || caseNotFound) {
      return
    }

    if (!isFeatureEnabled) {
      router.replace(overviewUrl)
      return
    }

    if (!mayAccess) {
      router.replace(overviewUrl)
    }
  }, [
    isLoadingWorkingCase,
    isLoadingFeatures,
    caseNotFound,
    isFeatureEnabled,
    mayAccess,
    router,
    overviewUrl,
  ])

  useEffect(() => {
    if (isLoadingWorkingCase || hasInitialized) {
      return
    }

    if (appealSummonsId && !existingSummons) {
      return
    }

    // New issue needs standing defendants; edit can build from the saved
    // summons alone when appeals were withdrawn.
    if (isEdit ? !mayEdit : !hasStandingAppeal) {
      return
    }

    const standing = getStandingAppealSummonsDefendants(workingCase)
    const nextSections = buildAppealSummonsFormSections(
      standing,
      workingCase.civilClaimants ?? [],
      existingSummons,
      workingCase.defendants ?? [],
    )

    setSections(nextSections)
    // Prefill from defendants included on this summons only, not every
    // defendant on the case (a partial appeal must not name the others).
    const storedCaseName = workingCase.verdictAppealCase?.caseName
    setCaseName(
      resolveAppealSummonsCaseName(
        storedCaseName,
        nextSections
          .filter((section) => section.included)
          .map((section) => section.name),
      ),
    )
    setCaseNameEdited(Boolean(storedCaseName?.trim()))
    setHasInitialized(true)
  }, [
    isLoadingWorkingCase,
    hasStandingAppeal,
    hasInitialized,
    isEdit,
    mayEdit,
    workingCase,
    appealSummonsId,
    existingSummons,
  ])

  const includedDefendantKey = sections
    .filter((section) => section.included)
    .map((section) => section.defendantId)
    .join(',')

  // Refresh an untouched generated prefill when included defendants change.
  useEffect(() => {
    if (!hasInitialized || caseNameEdited) {
      return
    }

    setCaseName(
      prefillAppealCaseName(
        sections
          .filter((section) => section.included)
          .map((section) => section.name),
      ),
    )
  }, [includedDefendantKey, hasInitialized, caseNameEdited, sections])

  const standing = getStandingAppealSummonsDefendants(workingCase)
  const earliestAppealDate = getEarliestStandingAppealDate(standing)
  const isSaving = isCreatingAppealSummons || isUpdatingAppealSummons
  const isReady = !isLoadingWorkingCase && !isLoadingFeatures && hasInitialized

  const updateSection = (
    defendantId: string,
    patch: Partial<AppealSummonsFormSection>,
  ) => {
    setSections((current) =>
      current.map((section) =>
        section.defendantId === defendantId
          ? { ...section, ...patch }
          : section,
      ),
    )
  }

  const formReady = isAppealSummonsFormReady(sections, caseName)

  const handlePreview = useCallback(async () => {
    const defendants = toAppealSummonsDefendantInputs(sections)

    if (defendants.length === 0 || !caseName.trim()) {
      return
    }

    await previewAppealSummons(
      workingCase.id,
      caseName.trim(),
      defendants,
      appealSummonsId,
    )
  }, [
    appealSummonsId,
    caseName,
    previewAppealSummons,
    sections,
    workingCase.id,
  ])

  const handleSave = useCallback(async () => {
    const defendants = toAppealSummonsDefendantInputs(sections)
    const trimmedCaseName = caseName.trim()

    if (defendants.length === 0 || !trimmedCaseName) {
      return
    }

    const result = appealSummonsId
      ? await updateAppealSummons(
          workingCase.id,
          appealSummonsId,
          trimmedCaseName,
          defendants,
        )
      : await createAppealSummons(workingCase.id, trimmedCaseName, defendants)

    if (!result) {
      return
    }

    refreshCase()
    router.push(overviewUrl)
  }, [
    appealSummonsId,
    caseName,
    createAppealSummons,
    overviewUrl,
    refreshCase,
    router,
    sections,
    updateAppealSummons,
    workingCase.id,
  ])

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={!isReady}
      notFound={caseNotFound}
    >
      <PageHeader title="Áfrýjunarstefna - Réttarvörslugátt" />
      {isReady && isFeatureEnabled && mayAccess && (
        <>
          <FormContentContainer>
            <PageTitle>Áfrýjunarstefna</PageTitle>
            <div className={stack({ gap: 5 })}>
              <Box component="section">
                <Text variant="h2" as="h2">
                  {`Mál nr. ${workingCase.courtCaseNumber}`}
                </Text>
                {earliestAppealDate && (
                  <DateLabel
                    text="Dómi áfrýjað"
                    date={earliestAppealDate}
                    hideTime
                    as="h3"
                  />
                )}
              </Box>
              <Box component="section">
                <SectionHeading title="Heiti máls" />
                <Input
                  name="caseName"
                  label="Heiti máls"
                  value={caseName}
                  onChange={(event) => {
                    setCaseName(event.target.value)
                    setCaseNameEdited(true)
                  }}
                  required
                  tooltip="Heiti máls kemur fram í áfrýjunarstefnu og skilar sér í viðmót Landsréttar."
                />
              </Box>
              {sections.map((section) =>
                section.included ? (
                  <Box
                    key={section.defendantId}
                    component="section"
                    data-testid={`appealSummonsSection-${section.defendantId}`}
                  >
                    <Box
                      display="flex"
                      justifyContent="spaceBetween"
                      alignItems="center"
                      marginBottom={1}
                    >
                      <Text variant="h3" as="h3">
                        {section.name}
                      </Text>
                      <Button
                        variant="text"
                        size="small"
                        onClick={() =>
                          updateSection(section.defendantId, {
                            included: false,
                          })
                        }
                      >
                        Fjarlægja
                      </Button>
                    </Box>
                    <Text marginBottom={3}>
                      {appellantSideLabel(section.appellantSide)}
                    </Text>
                    <SectionHeading title="Kröfur áfrýjanda" />
                    <Input
                      name={`claims-${section.defendantId}`}
                      label="Kröfur áfrýjanda"
                      value={section.claims}
                      onChange={(event) =>
                        updateSection(section.defendantId, {
                          claims: event.target.value,
                        })
                      }
                      textarea
                      rows={10}
                      required
                    />
                  </Box>
                ) : (
                  <Box
                    key={section.defendantId}
                    display="flex"
                    justifyContent="spaceBetween"
                    alignItems="center"
                    data-testid={`appealSummonsAdd-${section.defendantId}`}
                  >
                    <Text>{section.name}</Text>
                    <Button
                      variant="text"
                      size="small"
                      onClick={() =>
                        updateSection(section.defendantId, { included: true })
                      }
                    >
                      Bæta við
                    </Button>
                  </Box>
                ),
              )}
              <Box marginBottom={10}>
                <PdfButton
                  title="Áfrýjunarstefna.pdf"
                  disabled={!formReady}
                  handleClick={handlePreview}
                />
              </Box>
            </div>
          </FormContentContainer>
          <FormContentContainer isFooter>
            <FormFooter
              previousUrl={overviewUrl}
              actions={[
                {
                  text: isEdit
                    ? 'Vista áfrýjunarstefnu'
                    : 'Gefa út áfrýjunarstefnu',
                  onClick: handleSave,
                  disabled: !formReady || isSaving,
                  loading: isSaving,
                  testId: 'continueButton',
                },
              ]}
            />
          </FormContentContainer>
        </>
      )}
    </PageLayout>
  )
}

export default AppealSummons
