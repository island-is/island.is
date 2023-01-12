import * as s from './Appendixes.css'

import { EditorInput } from './EditorInput'
import React, { MutableRefObject, useState } from 'react'
import { MiniDiff } from './MiniDiff'
import { editorMsgs as msg } from '../messages'
import { HTMLText, PlainText, Appendix } from '@island.is/regulations'
import { RegulationDraft } from '@island.is/regulations/admin'
import {
  Accordion,
  AccordionItem,
  Box,
  Button,
} from '@island.is/island-ui/core'
import { MagicTextarea } from './MagicTextarea'
import { useLocale } from '@island.is/localization'
import { AppendixDraftForm } from '../state/types'
import { RegDraftActions } from '../state/useDraftingState'

// ---------------------------------------------------------------------------

type AppendixEditingProps = {
  appendix: AppendixDraftForm
  baseAppendix?: Appendix
  idx: number
  moveUpable: boolean
  moveDownable: boolean
  isImpact: boolean
} & Pick<AppendixesProps, 'actions' | 'draftId'>

const AppendixEditing = (props: AppendixEditingProps) => {
  const {
    appendix,
    baseAppendix,
    moveUpable,
    moveDownable,
    idx,
    actions,
    draftId,
    isImpact,
  } = props
  const { title, text, revoked } = appendix

  const t = useLocale().formatMessage

  const baseTitle = baseAppendix?.title
  const baseText = baseAppendix?.text

  const [expanded, setExpanded] = useState(() => {
    const { title, text } = appendix
    // Start the appendix expanded if both fields are empty
    // (i.e. newly added appendixes) or if either field has
    // a serious error
    return Boolean((!title.value && !text.value) || title.error || text.error)
  })

  const defaultTitle = `Viðauki ${idx + 1}`

  const removeAppendix = () => {
    const isDeletable = !baseAppendix
    if (isDeletable) {
      const appendixEmpty =
        !text.value && (!title.value || title.value === defaultTitle)
      if (
        appendixEmpty ||
        // eslint-disable-next-line no-restricted-globals
        confirm(t(msg.appendix_remove_confirm, { idx: idx + 1 }))
      ) {
        actions.deleteAppendix(idx)
      }
    } else {
      actions.revokeAppendix(idx, true)
    }
  }
  const undoRevoke = () => {
    if (!revoked) return
    actions.revokeAppendix(idx, false)
  }

  const handleFocus = () => {
    if (!title.value && !title.dirty) {
      actions.setAppendixProp(idx, 'title', defaultTitle)
    }
  }
  handleFocus()

  return (
    <AccordionItem
      id={props.draftId + '-appendix-' + idx}
      label={
        revoked
          ? t(msg.appendix_legend_revoked)
          : baseTitle || title.value || t(msg.appendix_legend, { idx: idx + 1 })
      }
      expanded={expanded}
      onToggle={setExpanded}
    >
      {revoked ? (
        <Box marginBottom={3}>
          {t(msg.appendix_revoked_message)}{' '}
          <Button onClick={undoRevoke} variant="text" as="button" icon="reload">
            {t(msg.appendix_revoked_undo)}
          </Button>
        </Box>
      ) : (
        <div className={s.appendix}>
          <Box marginBottom={3}>
            <MagicTextarea
              label={t(msg.appendix_title)}
              name="title"
              value={title.value}
              onChange={(value) => {
                // console.log('setAppendixProp', idx, 'title', value)
                actions.setAppendixProp(idx, 'title', value)
              }}
              onFocus={handleFocus}
              required={!!title.required}
              error={title.error && t(title.error)}
            />
            {baseTitle != null && title.value !== baseTitle && (
              <MiniDiff older={baseTitle || ''} newer={title.value} />
            )}
          </Box>
          <Box marginBottom={4}>
            <EditorInput
              label={t(msg.appendix_text)}
              baseText={baseText}
              value={text.value}
              onChange={(newValue) =>
                // console.log('setAppendixProp', idx, 'text', newValue)
                actions.setAppendixProp(idx, 'text', newValue)
              }
              draftId={draftId}
              isImpact={isImpact}
              required={!!text.required}
              error={text.error && t(text.error)}
            />
          </Box>
          <div className={s.appendixTools}>
            {moveUpable && (
              <Button
                size="small"
                variant="text"
                preTextIcon="arrowUp"
                // circle
                // variant="ghost"
                // icon="arrowUp"
                onClick={() => actions.moveAppendixUp(idx)}
                title={t(msg.appendix_shiftup, { idx: idx + 1 })}
              >
                {t(msg.appendix_shiftup_short)}
              </Button>
            )}{' '}
            {moveDownable && (
              <Button
                size="small"
                variant="text"
                preTextIcon="arrowDown"
                // circle
                // variant="ghost"
                // icon="arrowUp"
                onClick={() => actions.moveAppendixDown(idx)}
                title={t(msg.appendix_shiftdown, { idx: idx + 1 })}
              >
                {t(msg.appendix_shiftdown_short)}
              </Button>
            )}{' '}
            <Button
              size="small"
              variant="text"
              preTextIcon="trash"
              // circle
              // variant="ghost"
              // icon="trash"
              onClick={removeAppendix}
              title={t(msg.appendix_remove, { idx: idx + 1 })}
            >
              {t(msg.appendix_remove_short)}
            </Button>
          </div>
        </div>
      )}
    </AccordionItem>
  )
}

// ===========================================================================

// ===========================================================================

export type AppendixStateItem = {
  key: string
  title: PlainText
  baseTitle?: PlainText
  baseText?: HTMLText
  valueRef: MutableRefObject<() => HTMLText>
  elmRef?: MutableRefObject<HTMLElement | null>
}

type AppendixesProps = {
  draftId: RegulationDraft['id']
  appendixes: Array<AppendixDraftForm>
  baseAppendixes?: ReadonlyArray<Appendix>
  actions: Pick<
    RegDraftActions,
    | 'setAppendixProp'
    | 'addAppendix'
    | 'deleteAppendix'
    | 'revokeAppendix'
    | 'moveAppendixUp'
    | 'moveAppendixDown'
  >
}

export const Appendixes = (props: AppendixesProps) => {
  const { draftId, appendixes, baseAppendixes = [], actions } = props
  const isImpact = !props.baseAppendixes

  const t = useLocale().formatMessage

  return (
    <>
      {appendixes.length > 0 && (
        <Accordion singleExpand={false} dividerOnTop={false}>
          {appendixes.map((appendix, i) => {
            const baseAppendix = baseAppendixes[i]
            if (baseAppendix && !baseAppendix.title) {
              // Skip displaying appendixes that have been "revoked" (emptied)
              // by an earlier impact.
              // Such revocations are final, and only revertable by
              // adding a new appendix at the end of the list.
              // (Else we end up with crazy complicated states.)
              return null
            }
            return (
              <AppendixEditing
                key={appendix.key}
                idx={i}
                appendix={appendix}
                baseAppendix={baseAppendix}
                actions={actions}
                draftId={draftId}
                moveUpable={i > 0 && !baseAppendixes[i - 1]}
                moveDownable={i !== appendixes.length - 1}
                isImpact={isImpact}
              />
            )
          })}
        </Accordion>
      )}{' '}
      <Box marginTop={2}>
        <Button
          variant="text"
          preTextIcon="add"
          // size="large"
          onClick={props.actions.addAppendix}
        >
          {t(msg.appendix_add)}
        </Button>
      </Box>
    </>
  )
}
