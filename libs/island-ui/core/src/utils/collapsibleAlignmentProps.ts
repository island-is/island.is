import { Children, ReactNode } from 'react'
import {
  ResponsiveRangeProps,
  resolveResponsiveRangeProps,
} from './responsiveRangeProps'
import { ResponsiveProp, normaliseResponsiveProp } from './responsiveProp'
import { Align, alignToFlexAlign, alignYToFlexAlign, AlignY } from './align'

function invertAlignment<Alignment extends string>(alignment: Alignment) {
  if (alignment === 'flexStart') {
    return 'flexEnd'
  }

  if (alignment === 'flexEnd') {
    return 'flexStart'
  }

  return alignment
}

export interface CollapsibleAlignmentProps {
  collapseBelow?: ResponsiveRangeProps['below']
  align?: ResponsiveProp<Align>
  alignY?: ResponsiveProp<AlignY>
  reverse?: boolean
}

export function resolveCollapsibleAlignmentProps({
  align,
  alignY,
  collapseBelow,
  reverse,
}: CollapsibleAlignmentProps) {
  const [
    collapseXs,
    collapseSm,
    collapseMd,
    collapseLg,
  ] = resolveResponsiveRangeProps({
    below: collapseBelow,
  })

  const rowReverseSm = collapseXs && reverse
  const rowReverseMd = (collapseXs || collapseSm) && reverse
  const rowReverseLg = (collapseXs || collapseSm || collapseMd) && reverse
  const rowReverseXl =
    (collapseXs || collapseSm || collapseMd || collapseLg) && reverse

  const [
    justifyContentXs,
    justifyContentSm,
    justifyContentMd,
    justifyContentLg,
    justifyContentXl,
  ] = normaliseResponsiveProp(alignToFlexAlign(align) || 'flexStart')

  return {
    collapseXs,
    collapseSm,
    collapseMd,
    collapseLg,
    orderChildren: (children: ReactNode) => {
      const childrenArray = Children.toArray(children)
      return !collapseXs && !collapseSm && !collapseMd && !collapseLg && reverse
        ? childrenArray.reverse()
        : childrenArray
    },
    collapsibleAlignmentProps: {
      display: [
        collapseXs ? 'block' : 'flex',
        collapseSm ? 'block' : 'flex',
        collapseMd ? 'block' : 'flex',
        collapseLg ? 'block' : 'flex',
        'flex',
      ],
      flexDirection: [
        collapseXs ? 'column' : 'row',
        // eslint-disable-next-line no-nested-ternary
        collapseSm ? 'column' : rowReverseSm ? 'rowReverse' : 'row',
        collapseMd ? 'column' : rowReverseMd ? 'rowReverse' : 'row',
        collapseLg ? 'column' : rowReverseLg ? 'rowReverse' : 'row',
        rowReverseXl ? 'rowReverse' : 'row',
      ],
      justifyContent: align
        ? ([
            justifyContentXs,
            rowReverseSm ? invertAlignment(justifyContentSm) : justifyContentSm,
            rowReverseMd ? invertAlignment(justifyContentMd) : justifyContentMd,
            rowReverseLg ? invertAlignment(justifyContentLg) : justifyContentLg,
            rowReverseXl ? invertAlignment(justifyContentXl) : justifyContentXl,
          ] as const)
        : undefined,
      alignItems: alignY ? alignYToFlexAlign(alignY) : undefined,
    },
    collapsibleAlignmentChildProps: {
      display: [
        collapseXs && justifyContentXs !== 'flexStart' ? 'flex' : 'block',
        collapseSm && justifyContentSm !== 'flexStart' ? 'flex' : 'block',
        collapseMd && justifyContentMd !== 'flexStart' ? 'flex' : 'block',
        collapseLg && justifyContentLg !== 'flexStart' ? 'flex' : 'block',
        'block',
      ],
      justifyContent: [
        justifyContentXs,
        justifyContentSm,
        justifyContentMd,
        justifyContentLg,
      ],
    },
  } as const
}
