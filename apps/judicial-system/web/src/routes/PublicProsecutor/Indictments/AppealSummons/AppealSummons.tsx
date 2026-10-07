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
import DateLabel from '@island.is/judicial-system-web/src/components/DateLabel/DateLabel'
import { hasStandingVerdictAppeal } from '@island.is/judicial-system-web/src/components/VerdictAppealFiles/VerdictAppealFiles.logic'
import useAppealSummons from '@island.is/judicial-system-web/src/utils/hooks/useAppealSummons'

import {
  type AppealSummonsFormSection,
  appellantSideLabel,
  buildAppealSummonsFormSections,
  getEarliestStandingAppealDate,
  getStandingAppealSummonsDefendants,
  isAppealSummonsFormReady,
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
  const existingSummons = workingCase.appealSummonses?.find(
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
  const mayAccess = hasStandingAppeal && (isEdit ? mayEdit : mayIssue)

  const [sections, setSections] = useState<AppealSummonsFormSection[]>([])
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
    if (isLoadingWorkingCase || !hasStandingAppeal || hasInitialized) {
      return
    }

    if (appealSummonsId && !existingSummons) {
      return
    }

    const standing = getStandingAppealSummonsDefendants(workingCase)

    setSections(
      buildAppealSummonsFormSections(
        standing,
        workingCase.civilClaimants ?? [],
        existingSummons,
      ),
    )
    setHasInitialized(true)
  }, [
    isLoadingWorkingCase,
    hasStandingAppeal,
    workingCase,
    appealSummonsId,
    existingSummons,
    hasInitialized,
  ])

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

  const handlePreview = useCallback(async () => {
    const defendants = toAppealSummonsDefendantInputs(sections)

    if (defendants.length === 0) {
      return
    }

    await previewAppealSummons(workingCase.id, defendants)
  }, [previewAppealSummons, sections, workingCase.id])

  const handleSave = useCallback(async () => {
    const defendants = toAppealSummonsDefendantInputs(sections)

    if (defendants.length === 0) {
      return
    }

    const result = appealSummonsId
      ? await updateAppealSummons(workingCase.id, appealSummonsId, defendants)
      : await createAppealSummons(workingCase.id, defendants)

    if (!result) {
      return
    }

    refreshCase()
    router.push(overviewUrl)
  }, [
    appealSummonsId,
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
            <Box component="section" marginBottom={5}>
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
            {sections.map((section) =>
              section.included ? (
                <Box
                  key={section.defendantId}
                  component="section"
                  marginBottom={5}
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
                  <SectionHeading title="Kröfur áfrýjanda" required />
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
                  marginBottom={3}
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
                disabled={!isAppealSummonsFormReady(sections)}
                handleClick={handlePreview}
              />
            </Box>
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
                  disabled: !isAppealSummonsFormReady(sections) || isSaving,
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
