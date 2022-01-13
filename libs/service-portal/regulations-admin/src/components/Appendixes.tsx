import * as s from './Appendixes.css'

import { EditorInput } from './EditorInput'
import React, { MutableRefObject, useState } from 'react'
import { MiniDiff } from './MiniDiff'
import { editorMsgs as msg, errorMsgs } from '../messages'
import { HTMLText, PlainText, Appendix } from '@island.is/regulations'
import { RegulationDraft } from '@island.is/regulations/admin'
import {
  Accordion,
  AccordionItem,
  Box,
  Button,
} from '@island.is/island-ui/core'
import { MagicTextarea } from './MagicTextarea'
import { useLocale } from '../utils'
import { AppendixDraftForm, RegDraftForm } from '../state/types'
import { RegDraftActions } from '../state/useDraftingState'

// ---------------------------------------------------------------------------

type AppendixEditingProps = {
  appendix: AppendixDraftForm
  baseAppendix?: Appendix
  idx: number
  removable: boolean
  moveUpable: boolean
} & Pick<AppendixesProps, 'actions' | 'draftId'>

const AppendixEditing = (props: AppendixEditingProps) => {
  const {
    appendix,
    baseAppendix,
    moveUpable,
    removable,
    idx,
    actions,
    draftId,
  } = props
  const { title, text } = appendix

  const t = useLocale().formatMessage

  const isImpact = !!baseAppendix
  const baseTitle = baseAppendix?.title
  const baseText = baseAppendix?.text

  const [expanded, setExpanded] = useState(
    () => !appendix.title.value && !appendix.text.value,
  )

  const removeAppendix = () => {
    if (!removable) return

    const appendixEmpty = !title.value && !text.value
    if (
      appendixEmpty ||
      // eslint-disable-next-line no-restricted-globals
      confirm(t(msg.appendix_remove_confirm, { idx: idx + 1 }))
    ) {
      actions.removeAppendix(idx)
    }
  }

  // Let's not allow editing titles of preexisting appendixes —
  // as it would allow editors to sneak through disallowed "move-up" effects.
  const titleEditable = !baseAppendix

  return (
    <AccordionItem
      id={props.draftId + '-appendix-' + idx}
      label={
        baseTitle ||
        appendix.title.value ||
        t(msg.appendix_legend, { idx: idx + 1 })
      }
      expanded={expanded}
      onToggle={setExpanded}
    >
      <div className={s.appendix}>
        {titleEditable && (
          <Box marginBottom={3}>
            <MagicTextarea
              label={t(msg.appendix_title)}
              name="title"
              value={title.value}
              onChange={(value) => {
                actions.setAppendixProp(idx, 'title', value)
              }}
              required
              error={title.error && t(title.error)}
            />
            {/* Pointless since editing is dis-allowed, but let's leave it in. */}
            {baseTitle != null && title.value !== baseTitle && (
              <MiniDiff older={baseTitle || ''} newer={title.value} />
            )}
          </Box>
        )}

        <Box marginBottom={4}>
          <EditorInput
            label={t(msg.appendix_text)}
            baseText={baseText}
            value={text.value}
            onChange={(newValue) =>
              actions.setAppendixProp(idx, 'text', newValue)
            }
            draftId={draftId}
            isImpact={isImpact}
          />
        </Box>

        {(moveUpable || removable) && (
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
            {removable && (
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
            )}
          </div>
        )}
      </div>
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
  appendixes: RegDraftForm['appendixes']
  baseAppendixes?: ReadonlyArray<Appendix>
  actions: Pick<
    RegDraftActions,
    'setAppendixProp' | 'addAppendix' | 'removeAppendix' | 'moveAppendixUp'
  >
}

export const Appendixes = (props: AppendixesProps) => {
  const { draftId, appendixes, baseAppendixes = [], actions } = props

  const t = useLocale().formatMessage

  return (
    <>
      {props.appendixes.length > 0 && (
        <Accordion singleExpand={false} dividerOnTop={false}>
          {appendixes.map((appendix, i) => (
            <AppendixEditing
              key={appendix.key}
              idx={i}
              appendix={appendix}
              baseAppendix={baseAppendixes[i]}
              actions={actions}
              draftId={draftId}
              removable={!baseAppendixes[i]}
              moveUpable={i > 0 && !baseAppendixes[i - 1]}
            />
          ))}
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
