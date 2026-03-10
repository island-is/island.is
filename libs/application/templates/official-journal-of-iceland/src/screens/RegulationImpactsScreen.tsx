import { useLocale } from '@island.is/localization'
import { FormScreen } from '../components/form/FormScreen'
import { regulation } from '../lib/messages'
import { InputFields, OJOIFieldBaseProps } from '../lib/types'
import {
  Box,
  Button,
  Divider,
  Inline,
  SkeletonLoader,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRegulationImpacts } from '../hooks/useRegulationImpacts'
import { useRegulationSearch } from '../hooks/useRegulationSearch'
import { RegulationImpactSchema } from '../lib/dataSchema'
import {
  ImpactList,
  ImpactBaseSelection,
  ImpactAmendingSelection,
  EditChange,
  EditCancellation,
} from '../components/regulations'
import type { SelRegOption as BaseSelRegOption } from '../components/regulations/ImpactBaseSelection'
import type { SelRegOption as AmendingSelRegOption } from '../components/regulations/ImpactAmendingSelection'
import { findAffectedRegulationsInText } from '../utils/regulationGuessers'
import type { HTMLText, PlainText } from '@island.is/regulations'
import {
  formatAmendingBodyWithArticlePrefix,
  formatAmendingRegTitle,
} from '../utils/formatAmendingRegulation'
import { useApplication } from '../hooks/useUpdateApplication'
import { useRegulationDraft } from '../hooks/useRegulationDraft'

export const RegulationImpactsScreen = (props: OJOIFieldBaseProps) => {
  const { formatMessage: f } = useLocale()
  const { application } = props
  const applicationType = application.answers?.applicationType
  const isAmending = applicationType === 'amending_regulation'

  const { draftId } = useRegulationDraft({
    applicationId: application.id,
    answers: application.answers as unknown as Record<string, unknown>,
  })

  // Impacts are loaded from DB (single source of truth)
  const {
    impacts,
    groupedImpacts,
    impactsLoaded,
    addImpact,
    updateImpact,
    removeImpact,
    generateImpactId,
  } = useRegulationImpacts({ draftId })

  // updateApplicationV2 is still needed for advert text generation
  // (advert title/html are OJOI answer fields, not regulation DB fields)
  const { updateApplicationV2 } = useApplication({
    applicationId: application.id,
  })

  /**
   * Generate amending regulation body text from all impact diffs,
   * then persist it as the default advert HTML content (base64-encoded)
   * and set the advert title.
   *
   * Mirrors the regulations-admin "Uppfæra texta" flow.
   */
  const generateAdvertText = useCallback(
    async (allImpacts: RegulationImpactSchema[]) => {
      if (allImpacts.length === 0) {
        await updateApplicationV2({
          path: InputFields.advert.html,
          value: '',
        })
        await updateApplicationV2({
          path: InputFields.advert.title,
          value: '',
        })
        return
      }

      // Generate body text from diffs
      const additions = formatAmendingBodyWithArticlePrefix(allImpacts)
      const bodyHtml = additions.join('') as HTMLText
      const base64Body = Buffer.from(bodyHtml).toString('base64')

      // Generate amending title (without "Reglugerð" prefix in OJOI flow)
      const title = formatAmendingRegTitle(allImpacts, { skipRegulationPrefix: true })

      // Persist both to application answers
      await updateApplicationV2({
        path: InputFields.advert.html,
        value: base64Body,
      })
      await updateApplicationV2({
        path: InputFields.advert.title,
        value: title,
      })
    },
    [updateApplicationV2],
  )

  // Selected regulation for new impact
  const [selRegOption, setSelRegOption] = useState<
    (BaseSelRegOption | AmendingSelRegOption) | undefined
  >()
  const [chooseType, setChooseType] = useState<
    'cancel' | 'change' | undefined
  >()

  // Escape key handler
  const escClick = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setChooseType(undefined)
    }
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', escClick, false)
    return () => {
      document.removeEventListener('keydown', escClick, false)
    }
  }, [escClick])

  const closeModal = () => {
    setChooseType(undefined)
  }

  const handleSaveNewImpact = async (impact: RegulationImpactSchema) => {
    await addImpact(impact)
    const allImpacts = [...impacts, impact]
    await generateAdvertText(allImpacts)
    setChooseType(undefined)
    setSelRegOption(undefined)
  }

  const handleSaveExistingImpact = async (impact: RegulationImpactSchema) => {
    await updateImpact(impact.id, impact)
    const allImpacts = impacts.map((i) =>
      i.id === impact.id ? { ...i, ...impact } : i,
    )
    await generateAdvertText(allImpacts)
  }

  const handleDeleteImpact = async (id: string) => {
    await removeImpact(id)
    const allImpacts = impacts.filter((i) => i.id !== id)
    await generateAdvertText(allImpacts)
  }

  // Regulation search hook (replaces Phase 3 mock)
  const {
    search: executeRegulationSearch,
    results: searchResults,
    loading: searchLoading,
  } = useRegulationSearch()

  const handleRegulationSearch = (query: string) => {
    executeRegulationSearch(query)
  }

  // Extract mentioned regulations from draft HTML for base regulation flow
  const mentionedOptions = useMemo(() => {
    const title = (application.answers?.advert?.title ?? '') as PlainText
    const html = (application.answers?.advert?.html ?? '') as HTMLText
    if (!title && !html) return []
    const regNames = findAffectedRegulationsInText(title, html)
    return regNames.map((name) => ({
      value: String(name),
      label: String(name),
    }))
  }, [application.answers?.advert?.title, application.answers?.advert?.html])

  return (
    <FormScreen
      goToScreen={props.goToScreen}
      title={f(regulation.impacts.general.title)}
      intro={f(regulation.impacts.general.intro)}
    >
      <Stack space={[2, 2, 3]}>
        {/* Regulation selection */}
        <Box marginBottom={4}>
          {!isAmending ? (
            <ImpactBaseSelection
              mentionedOptions={mentionedOptions}
              onSelect={(option) => setSelRegOption(option)}
            />
          ) : (
            <ImpactAmendingSelection
              onSelect={(option) => setSelRegOption(option)}
              onSearch={handleRegulationSearch}
              searchResults={searchResults}
              loading={searchLoading}
            />
          )}
        </Box>

        {/* Impact type selection */}
        {selRegOption && (
          <Box marginBottom={[4, 4, 8]}>
            <Box marginBottom={2}>
              <Divider weight="regular" />
            </Box>
            <Text variant="h4" as="h4" marginBottom={[2, 2, 3, 4]}>
              Hvað viltu gera við reglugerðina?
            </Text>
            <Inline space={[2, 2, 3, 4]} align="center" alignY="center">
              <Button
                variant="ghost"
                icon="document"
                iconType="outline"
                onClick={() => setChooseType('change')}
              >
                Gera textabreytingar
              </Button>
              <span>eða</span>
              <Button
                variant="ghost"
                icon="fileTrayFull"
                iconType="outline"
                onClick={() => setChooseType('cancel')}
              >
                Fella hana brott
              </Button>
            </Inline>

            {chooseType === 'cancel' && (
              <EditCancellation
                cancellation={{
                  id: generateImpactId(),
                  type: 'repeal',
                  name: selRegOption.value as string,
                  regTitle:
                    'title' in selRegOption
                      ? (selRegOption.title as string)
                      : selRegOption.label,
                }}
                onSave={handleSaveNewImpact}
                onClose={closeModal}
              />
            )}

            {chooseType === 'change' && (
              <EditChange
                change={{
                  id: generateImpactId(),
                  type: 'amend',
                  name: selRegOption.value as string,
                  regTitle:
                    'title' in selRegOption
                      ? (selRegOption.title as string)
                      : selRegOption.label,
                }}
                draftTitle={application.answers?.advert?.title}
                draftHtml={application.answers?.advert?.html as string}
                isBase={applicationType === 'base_regulation'}
                applicationId={application.id}
                onSave={handleSaveNewImpact}
                onClose={closeModal}
              />
            )}
          </Box>
        )}

        {/* Impact list */}
        {!impactsLoaded ? (
          <SkeletonLoader height={80} borderRadius="large" />
        ) : (
          <ImpactList
            groupedImpacts={groupedImpacts}
            draftTitle={application.answers?.advert?.title}
            draftHtml={application.answers?.advert?.html as string}
            isBase={applicationType === 'base_regulation'}
            applicationId={application.id}
            onSaveImpact={handleSaveExistingImpact}
            onDeleteImpact={handleDeleteImpact}
          />
        )}
      </Stack>
    </FormScreen>
  )
}

export default RegulationImpactsScreen
