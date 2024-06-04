import React, { useEffect, useState } from 'react'
import {
  Box,
  Accordion,
  AccordionItem,
  Divider,
  Text,
  Button,
  AlertMessage,
} from '@island.is/island-ui/core'
import { EditorInput } from './EditorInput'
import { editorMsgs as msg, errorMsgs } from '../lib/messages'
import { useLocale } from '@island.is/localization'
import { Appendixes } from './Appendixes'
import { MagicTextarea } from './MagicTextarea'
import { useDraftingState } from '../state/useDraftingState'
import { cleanTitle } from '@island.is/regulations-tools/cleanTitle'
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

export const EditBasics = () => {
  const t = useLocale().formatMessage
  const { draft, actions } = useDraftingState()
  const [editorKey, setEditorKey] = useState('initial')
  const [titleError, setTitleError] = useState<string | undefined>(undefined)
  const [hasUpdated, setHasUpdated] = useState<boolean>(false)
  const [references, setReferences] = useState<DraftImpactForm[]>()
  const [isModalVisible, setIsModalVisible] = useState<boolean>(true)
  const [hasConfirmed, setHasConfirmed] = useState<boolean>(false)
  const [hasSeenModal, setHasSeenModal] = useState<boolean>(false)

  const { text, appendixes } = draft
  const { updateState } = actions

  const startTextExpanded =
    !text.value || appendixes.length === 0 || !!text.error

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

  const updateEditorText = () => {
    const additions = formatAmendingBodyWithArticlePrefix(draft.impacts)

    setEditorKey(Date.now().toString())
    updateState('title', formatAmendingRegTitle(draft))
    const additionString = additions.join('') as HTMLText
    updateState('text', additionString)
    setHasUpdated(true)
  }

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
                  message="Uppfæra texta reglugerðar með breytingum frá fyrsta skrefi. Allur viðbættur texti í núverandi skrefi verður hreinsaður út."
                  action={
                    <Button
                      icon="reload"
                      onClick={() => setIsModalVisible(true)}
                      variant="text"
                      size="small"
                    >
                      Uppfæra
                    </Button>
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
                      text: apx.text.value,
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
            {draft.signedDocumentUrl.value && (
              <Box marginBottom={[4, 4, 6]}>
                <EditorInput
                  label={t(msg.signatureText)}
                  draftId={draft.id}
                  value={draft.signatureText.value}
                  onChange={(text) => updateState('signatureText', text)}
                  readOnly
                />
              </Box>
            )}
          </AccordionItem>
        </Accordion>
        {!hasUpdated ? (
          <ConfirmModal
            isVisible={
              draft.type.value === RegulationDraftTypes.amending &&
              isModalVisible
            }
            title="Uppfæra texta"
            message={
              'Uppfæra texta reglugerðar með breytingum frá fyrsta skrefi. Allur viðbættur texti í núverandi skrefi verður hreinsaður út.'
            }
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
