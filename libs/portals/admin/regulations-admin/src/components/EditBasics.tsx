import React, { useEffect, useState } from 'react'
import {
  Box,
  Accordion,
  AccordionItem,
  Divider,
  Text,
  Button,
  AlertMessage,
  AlertBanner,
  Select,
} from '@island.is/island-ui/core'
import { EditorInput } from './EditorInput'
import { editorMsgs as msg, errorMsgs, m } from '../lib/messages'
import { useLocale } from '@island.is/localization'
import { Appendixes } from './Appendixes'
import { MagicTextarea } from './MagicTextarea'
import { useDraftingState } from '../state/useDraftingState'
import { cleanTitle } from '@dmr.is/regulations-tools/cleanTitle'
import {
  formatAmendingRegTitle,
  formatAmendingBodyWithArticlePrefix,
} from '../utils/formatAmendingRegulation'
import { HTMLText, RegName, Regulation } from '@island.is/regulations'
import { findRegulationType } from '../utils/guessers'
import { RegulationDraftTypes } from '../types'
import ConfirmModal from './ConfirmModal/ConfirmModal'
import { ReferenceText } from './impacts/ReferenceText'
import { DraftChangeForm, DraftImpactForm } from '../state/types'
import { makeDraftAppendixForm } from '../state/makeFields'
import { hasAnyChange } from '../utils/formatAmendingUtils'
import { usePristineRegulations } from '../utils/hooks'

const updateText =
  'Ósamræmi er í texta stofnreglugerðar og breytingareglugerðar. Texti breytingareglugerðar þarf að samræmast breytingum sem gerðar hafa verið á stofnreglugerð, eigi breytingarnar að færast inn með réttum hætti.'

export const EditBasics = () => {
  const t = useLocale().formatMessage
  const { draft, actions, ministries } = useDraftingState()
  const [editorKey, setEditorKey] = useState('initial')
  const [titleError, setTitleError] = useState<string | undefined>(undefined)
  const [hasUpdatedAppendix, setHasUpdatedAppendix] = useState<boolean>(false)
  const [references, setReferences] = useState<DraftImpactForm[]>()
  const [isModalVisible, setIsModalVisible] = useState<boolean>(true)
  const [hasConfirmed, setHasConfirmed] = useState<boolean>(false)
  const [hasSeenModal, setHasSeenModal] = useState<boolean>(false)
  const { removePristineRegulation, isPristineRegulation } =
    usePristineRegulations()

  const { text, appendixes } = draft
  const { updateState } = actions

  const startTextExpanded = true

  const regType =
    draft.type.value &&
    t(
      draft.type.value === RegulationDraftTypes.amending
        ? msg.type_amending
        : msg.type_base,
    )

  useEffect(() => {
    if (!draft.title.value) {
      if (draft.type.value === RegulationDraftTypes.base) {
        updateState('title', 'Reglugerð um ')
      }
      if (draft.type.value === RegulationDraftTypes.amending) {
        updateState('title', formatAmendingRegTitle(draft))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft.type.value])

  // Show error if title and type don't match. Stop the user going forward in useDraftingState (goForward).
  useEffect(() => {
    if (draft.title.showError && draft.title.error) {
      setTitleError(t(draft.title.error))
      return
    }

    const isTitleAmending =
      findRegulationType(draft.title.value) === RegulationDraftTypes.amending
    if (isTitleAmending && draft.type.value === RegulationDraftTypes.base) {
      setTitleError(t(errorMsgs.amendingTitleBaseType))
      return
    }

    if (
      !isTitleAmending &&
      draft.type.value === RegulationDraftTypes.amending
    ) {
      setTitleError(t(errorMsgs.baseTitleAmendingType))
      return
    }

    const isTitleTooLong = draft.title.value.length > 1024
    if (isTitleTooLong) {
      setTitleError(
        `${t(errorMsgs.titleTooLong)} (${draft.title.value.length} / 1024)`,
      )
      return
    }

    if (draft.title.value) {
      setTitleError(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft.title.value])

  useEffect(() => {
    if (!text.value && draft.type.value === RegulationDraftTypes.amending) {
      updateEditorText()
      setEditorKey('newKey')
    }

    if (draft.type.value === RegulationDraftTypes.amending) {
      const impacts = Object.values(draft.impacts).flat() as DraftChangeForm[]
      setReferences(impacts)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft.impacts])

  const updateAppendixes = () => {
    // FORMAT AMENDING REGULATION APPENDIXES
    const impactArray = Object.values(draft.impacts).flat()
    const amendingArray = impactArray.filter(
      (item) => item.type === 'amend',
    ) as DraftChangeForm[]

    if (appendixes?.length > 0) {
      appendixes.splice(0, appendixes.length)
    }

    amendingArray.map((item) => {
      item.appendixes.map((apx, idx) => {
        if (apx.diff?.value && hasAnyChange(apx.diff.value)) {
          const defaultTitle = apx.title.value ?? `Viðauki ${idx + 1}`
          const defaultText = apx.text.value
          if (
            appendixes?.length === 0 ||
            !appendixes.some((ap) => ap.text.value === defaultText)
          ) {
            appendixes.push(
              makeDraftAppendixForm(
                { title: defaultTitle, text: defaultText },
                String(appendixes.length),
              ),
            )
          }
        }
      })
    })
  }

  const updateEditorText = () => {
    const additions = formatAmendingBodyWithArticlePrefix(draft.impacts)

    setEditorKey(Date.now().toString())
    updateState('title', formatAmendingRegTitle(draft))
    const additionString = additions.join('') as HTMLText
    updateState('text', additionString)

    // Update appendixes
    if (!hasUpdatedAppendix) {
      updateAppendixes()
      setHasUpdatedAppendix(true)
    }

    // Remove from session storage
    removePristineRegulation(draft.id)
  }

  const shouldShowModal = isPristineRegulation(draft.id)
  return (
    <>
      <Box marginBottom={3}>
        <MagicTextarea
          label={t(msg.title)}
          name="title"
          value={draft.title.value}
          onChange={(value) => {
            updateState('title', value)
          }}
          onBlur={(value) => {
            updateState('title', cleanTitle(value))
          }}
          error={titleError}
          required={!!draft.title.required}
        />
        <Box
          marginTop={1}
          marginLeft={1}
          display="flex"
          alignItems="center"
          justifyContent="spaceBetween"
        >
          <Text variant="small" color="dark200">
            {regType ? `(${regType})` : ' '}
          </Text>
        </Box>
      </Box>
      <Box marginBottom={[6, 6, 8]}>
        <Accordion>
          <AccordionItem
            id={draft.id}
            label={t(msg.text)}
            startExpanded={startTextExpanded}
          >
            {draft.type.value === RegulationDraftTypes.amending ? (
              <Box marginBottom={3}>
                <AlertBanner
                  description={t(msg.diffPrecisionWarning)}
                  variant="info"
                  dismissable
                />
              </Box>
            ) : undefined}
            <Box marginBottom={3}>
              <EditorInput
                key={editorKey} // Force re-render of TinyMCE
                label={t(msg.text)}
                hiddenLabel
                draftId={draft.id}
                value={draft.text.value}
                onChange={(value) => updateState('text', value)}
                error={text.showError && text.error && t(text.error)}
              />
            </Box>
            {!hasConfirmed && hasSeenModal ? (
              <Box marginBottom={3}>
                <AlertMessage
                  type="default"
                  title="Uppfæra texta"
                  message={
                    <Box
                      display="flex"
                      justifyContent="center"
                      flexDirection="row"
                    >
                      <Text variant="small">{updateText}</Text>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        height="full"
                        flexShrink={0}
                      >
                        <Button
                          icon="reload"
                          onClick={() => setIsModalVisible(true)}
                          variant="text"
                          size="small"
                        >
                          Uppfæra
                        </Button>
                      </Box>
                    </Box>
                  }
                />
              </Box>
            ) : undefined}

            {references &&
            references.length === 1 &&
            references[0].type === 'amend' ? (
              <ReferenceText
                regulation={
                  {
                    title: references[0].regTitle ?? '',
                    text: references[0].diff?.value ?? '',
                    name: (references[0].name as RegName) ?? '',
                    appendixes: references[0].appendixes.map((apx) => ({
                      title: apx.title.value,
                      text: apx.diff?.value,
                    })),
                  } as Regulation
                }
                key={references[0].id}
                asBase
                baseName={'' as RegName}
              />
            ) : undefined}
            <Box>
              <Divider />
              {' '}
            </Box>
            {draft.signedDocumentUrl.value ? (
              <Box marginBottom={[4, 4, 6]}>
                <EditorInput
                  label={t(msg.signatureText)}
                  draftId={draft.id}
                  value={draft.signatureText.value}
                  onChange={(text) => updateState('signatureText', text)}
                  readOnly
                />
              </Box>
            ) : (
              ministries.length > 0 &&
              !draft.signatureText.value && (
                <Select
                  size="sm"
                  label={t(m.regulationAdminMinistries)}
                  name="setMinistry"
                  isSearchable
                  value={
                    draft.ministry.value
                      ? {
                          value: draft.ministry.value,
                          label: draft.ministry.value,
                        }
                      : undefined
                  }
                  placeholder={t(msg.selectMinistry)}
                  options={[
                    {
                      label: t(msg.selectMinistry),
                      value: '',
                    },
                    ...ministries.map((ministry) => ({
                      value: ministry.name,
                      label: ministry.name,
                    })),
                  ].filter((item) => item.label)}
                  required={false}
                  onChange={(option) => actions.setMinistry(option?.value)}
                  backgroundColor="white"
                />
              )
            )}
          </AccordionItem>
        </Accordion>
        {shouldShowModal ? (
          <ConfirmModal
            isVisible={
              draft.type.value === RegulationDraftTypes.amending &&
              isModalVisible
            }
            title="Uppfæra texta"
            message={updateText}
            onConfirm={() => {
              updateEditorText()
              setIsModalVisible(false)
              setHasConfirmed(true)
            }}
            onVisibilityChange={(visibility: boolean) => {
              setIsModalVisible(visibility)
              if (visibility === false && !hasSeenModal) {
                setHasSeenModal(true)
              }
            }}
            confirmMessage="Uppfæra"
            confirmGhost
          />
        ) : undefined}
        <Appendixes
          draftId={draft.id}
          appendixes={appendixes}
          actions={actions}
        />
      </Box>
    </>
  )
}
