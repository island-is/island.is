// import s from './Appendixes.module.scss'

import { EditorInput } from './EditorInput'
import React, { MutableRefObject, useState } from 'react'
import { useIsBrowserSide } from '../utils/hooks'
import { MiniDiff } from './MiniDiff'
import { useIntl } from 'react-intl'
import { editorMsgs as msg } from '../messages'
import { domid, HTMLText, PlainText } from '@island.is/regulations'
import { RegulationDraft } from '@island.is/regulations/admin'

const NEW_PREFIX = 'new---'

// ---------------------------------------------------------------------------

type AppendixProps = {
  appendix: AppendixStateItem
  idx: number
  defaultOpen: boolean
  buttons: boolean
  isImpact?: boolean
} & Pick<AppendixesProps, 'onTextChange' | 'onChange' | 'draftId'>

const Appendix = (props: AppendixProps) => {
  const { appendix, defaultOpen, idx, buttons, onChange, onTextChange } = props
  const t = useIntl().formatMessage
  const [isOpen, setIsOpen] = useState(defaultOpen)

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

  const labelShiftUp = t(msg.appendix_shiftup, { idx: idx + 1 })
  const labelRemove = t(msg.appendix_remove, { idx: idx + 1 })

  return (
    <section>
      <h2>
        {t(msg.appendix_legend, { idx: idx + 1 })}
        <button onClick={() => setIsOpen(!isOpen)}>
          {t(isOpen ? msg.appendix_close : msg.appendix_open)}
        </button>
      </h2>
      {isOpen && (
        <>
          <div>
            <textarea
              onChange={(e) => {
                changeAppendixTitle(idx, e.currentTarget.value)
                onTextChange && onTextChange(idx)
              }}
              value={appendix.title}
              aria-label={t(msg.appendix_title)}
              placeholder={t(msg.appendix_title)}
            />
            {props.isImpact && appendix.title !== appendix.baseTitle && (
              <MiniDiff older={appendix.baseTitle} newer={appendix.title} />
            )}
          </div>
          <EditorInput
            label={t(msg.appendix_text)}
            initialText={appendix.initialText}
            baseText={appendix.baseText}
            valueRef={appendix.valueRef}
            elmRef={appendix.elmRef}
            onChange={onTextChange ? () => onTextChange(idx) : undefined}
            draftId={props.draftId}
            isImpact={props.isImpact}
          />
          {(buttons || isRemovable) && (
            <div>
              {idx > 0 && (
                <button
                  onClick={() => moveAppendixUp(idx)}
                  title={labelShiftUp}
                >
                  {labelShiftUp}
                </button>
              )}{' '}
              {isRemovable && (
                <button onClick={() => removeAppendix(idx)} title={labelRemove}>
                  {labelRemove}
                </button>
              )}
            </div>
          )}{' '}
        </>
      )}
    </section>
  )
}

// ---------------------------------------------------------------------------

export type AppendixStateItem = {
  key: string
  title: PlainText
  initialTitle?: PlainText
  baseTitle: PlainText
  initialText?: HTMLText
  baseText: HTMLText
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
        baseTitle: '',
        baseText: '' as HTMLText,
        valueRef: { current: () => '' as HTMLText },
        elmRef: { current: null },
      }),
    )
  }

  const isBrowser = useIsBrowserSide()

  return (
    <section>
      {props.appendixes.map((appendix, i) => (
        <Appendix
          key={appendix.key}
          appendix={appendix}
          idx={i}
          defaultOpen={!props.defaultClosed || !!isBrowser}
          buttons={!props.appendOnly}
          onChange={props.onChange}
          onTextChange={props.onTextChange}
          draftId={props.draftId}
          isImpact={props.isImpact}
        />
      ))}
      <button onClick={addAppendix}>{t(msg.appendix_add)}</button>
    </section>
  )
}
