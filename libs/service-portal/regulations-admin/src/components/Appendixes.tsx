import * as s from './Appendixes.treat'

import { EditorInput } from './EditorInput'
import React, { MutableRefObject, useMemo } from 'react'
import { MiniDiff } from './MiniDiff'
import { useIntl } from 'react-intl'
import { editorMsgs as msg } from '../messages'
import { domid, HTMLText, PlainText } from '@island.is/regulations'
import { RegulationDraft } from '@island.is/regulations/admin'
import {
  Accordion,
  AccordionItem,
  Box,
  Button,
} from '@island.is/island-ui/core'
import { MagicTextarea } from './MagicTextarea'

const NEW_PREFIX = 'new---'

// ---------------------------------------------------------------------------

type AppendixProps = {
  appendix: AppendixStateItem
  idx: number
  buttons: boolean
  isImpact?: boolean
} & Pick<AppendixesProps, 'onTextChange' | 'onChange' | 'draftId'>

const Appendix = (props: AppendixProps) => {
  const { appendix, idx, buttons, onChange, onTextChange } = props
  const { title, baseTitle, valueRef, baseText, elmRef } = appendix

  const t = useIntl().formatMessage

  const isRemovable = appendix.key.startsWith(NEW_PREFIX)

  const removeAppendix = (idx: number) => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm(t(msg.appendix_remove_confirm, { idx: idx + 1 }))) {
      return
    }
    onChange((appendixes) => {
      if (idx < 0 || appendixes.length <= idx) {
        return appendixes
      }
      return appendixes.slice(0, idx).concat(appendixes.slice(idx + 1))
    })
  }
  const moveAppendixUp = (idx: number) => {
    onChange((appendixes) => {
      if (idx < 1 || appendixes.length <= idx) {
        return appendixes
      }
      const newList = [...appendixes]
      newList[idx] = appendixes[idx - 1]
      newList[idx - 1] = appendixes[idx]
      return newList
    })
  }
  const changeAppendixTitle = (idx: number, title: string) => {
    onChange((appendixes) => {
      const item = appendixes[idx]
      if (title === item.title) {
        return appendixes
      }
      const newList = [...appendixes]
      newList[idx] = {
        ...item,
        title,
      }
      return newList
    })
  }

  const isChanged = useMemo(
    () => !!baseText && baseText !== valueRef.current(),
    [],
  )

  const labelShiftUp = t(msg.appendix_shiftup, { idx: idx + 1 })
  const labelRemove = t(msg.appendix_remove, { idx: idx + 1 })

  // DECIDE: Should we disallow editing pre-existing titles? when
  // `isImpact === true`
  return (
    <div className={s.appendix}>
      <Box marginBottom={3}>
        <MagicTextarea
          label={t(msg.appendix_title)}
          name="title"
          value={title}
          onChange={(value) => {
            changeAppendixTitle(idx, value)
            onTextChange && onTextChange(idx)
          }}
          required
          errorMessage={'' && t(msg.requiredFieldError)}
          // hasError={!!draft.title?.error}
        />
        {props.isImpact && baseTitle != null && title !== baseTitle && (
          <MiniDiff older={baseTitle || ''} newer={title} />
        )}
      </Box>

      <Box marginBottom={4}>
        <EditorInput
          label={t(msg.appendix_text)}
          baseText={baseText}
          valueRef={valueRef}
          elmRef={elmRef}
          onChange={onTextChange ? () => onTextChange(idx) : undefined}
          draftId={props.draftId}
          isImpact={props.isImpact}
        />
      </Box>

      {(buttons || isRemovable) && (
        <div className={s.appendixTools}>
          {idx > 0 && (
            <Button
              size="small"
              variant="text"
              preTextIcon="arrowUp"
              // circle
              // variant="ghost"
              // icon="arrowUp"
              onClick={() => moveAppendixUp(idx)}
              title={labelShiftUp}
            >
              {t(msg.appendix_shiftup_short)}
            </Button>
          )}{' '}
          {isRemovable && (
            <Button
              size="small"
              variant="text"
              preTextIcon="trash"
              // circle
              // variant="ghost"
              // icon="trash"
              onClick={() => removeAppendix(idx)}
              title={labelRemove}
            >
              {t(msg.appendix_remove_short)}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

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
  appendixes: ReadonlyArray<AppendixStateItem>
  onChange: (
    reducer: (
      appendixes: ReadonlyArray<AppendixStateItem>,
    ) => ReadonlyArray<AppendixStateItem>,
  ) => void
  onTextChange?: (index: number) => void
  appendOnly?: boolean
  defaultClosed?: boolean
  isImpact?: boolean
}

export const Appendixes = (props: AppendixesProps) => {
  const t = useIntl().formatMessage

  const addAppendix = () => {
    props.onChange((appendixes) =>
      appendixes.concat({
        key: NEW_PREFIX + domid(),
        title: '',
        valueRef: { current: () => '' as HTMLText },
        elmRef: { current: null },
      }),
    )
  }

  return (
    <>
      {props.appendixes.length > 0 && (
        <Accordion singleExpand={false} dividerOnTop={false}>
          {props.appendixes.map((appendix, i) => {
            const startExpanded = !props.defaultClosed || !appendix.title

            return (
              <AccordionItem
                key={appendix.key}
                startExpanded={startExpanded}
                id={props.draftId + '-appendix-' + i}
                label={
                  appendix.baseTitle ||
                  appendix.title ||
                  t(msg.appendix_legend, { idx: i + 1 })
                }
              >
                <Appendix
                  appendix={appendix}
                  idx={i}
                  buttons={!props.appendOnly}
                  onChange={props.onChange}
                  onTextChange={props.onTextChange}
                  draftId={props.draftId}
                  isImpact={props.isImpact}
                />
              </AccordionItem>
            )
          })}
        </Accordion>
      )}{' '}
      <Box marginTop={2}>
        <Button
          variant="text"
          preTextIcon="add"
          // size="large"
          onClick={addAppendix}
        >
          {t(msg.appendix_add)}
        </Button>
      </Box>
    </>
  )
}
