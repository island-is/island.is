import { PlainText, getTextContentDiff, HTMLDump } from '@island.is/regulations'
import * as s from './MiniDiff.css'

import cn from 'classnames'

export type MiniDiffProps = {
  older: PlainText
  newer: PlainText
  className?: string
}

export const MiniDiff = (props: MiniDiffProps) => (
  <HTMLDump
    className={cn(props.className, s.wrapper)}
    html={getTextContentDiff(props.older, props.newer)}
  />
)
