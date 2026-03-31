/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ElementType } from 'react'
import classnames from 'classnames'
import { theme } from '@island.is/island-ui/theme'

import {
  resolveResponsiveProp,
  ResponsiveProp,
} from '../../utils/responsiveProp'
import * as resetStyleRefs from '../../styles/reset.css'
import * as styleRefs from './useBoxStyles.css'

export type Space = keyof typeof theme.spacing
export type FigmaSpace = keyof typeof theme.figmaSpacing

export type ResponsiveSpace = ResponsiveProp<Space>
export type ResponsiveFigmaSpacing = ResponsiveProp<FigmaSpace>

export interface UseBoxStylesProps {
  component: ElementType | null
  padding?: ResponsiveSpace
  paddingX?: ResponsiveSpace
  paddingY?: ResponsiveSpace
  paddingTop?: ResponsiveSpace
  paddingBottom?: ResponsiveSpace
  paddingLeft?: ResponsiveSpace
  paddingRight?: ResponsiveSpace
  unstablePadding?: ResponsiveFigmaSpacing
  unstablePaddingX?: ResponsiveFigmaSpacing
  unstablePaddingY?: ResponsiveFigmaSpacing
  unstablePaddingTop?: ResponsiveFigmaSpacing
  unstablePaddingBottom?: ResponsiveFigmaSpacing
  unstablePaddingLeft?: ResponsiveFigmaSpacing
  unstablePaddingRight?: ResponsiveFigmaSpacing
  margin?: ResponsiveProp<Space | 'auto'>
  marginX?: ResponsiveProp<Space | 'auto'>
  marginY?: ResponsiveProp<Space | 'auto'>
  marginTop?: ResponsiveProp<Space | 'auto'>
  marginBottom?: ResponsiveProp<Space | 'auto'>
  marginLeft?: ResponsiveProp<Space | 'auto'>
  marginRight?: ResponsiveProp<Space | 'auto'>
  unstableMargin?: ResponsiveProp<FigmaSpace | 'auto'>
  unstableMarginX?: ResponsiveProp<FigmaSpace | 'auto'>
  unstableMarginY?: ResponsiveProp<FigmaSpace | 'auto'>
  unstableMarginTop?: ResponsiveProp<FigmaSpace | 'auto'>
  unstableMarginBottom?: ResponsiveProp<FigmaSpace | 'auto'>
  unstableMarginLeft?: ResponsiveProp<FigmaSpace | 'auto'>
  unstableMarginRight?: ResponsiveProp<FigmaSpace | 'auto'>
  display?: ResponsiveProp<keyof typeof styleRefs.display>
  flexDirection?: ResponsiveProp<keyof typeof styleRefs.flexDirection>
  flexWrap?: ResponsiveProp<keyof typeof styleRefs.flexWrap>
  flexShrink?: keyof typeof styleRefs.flexShrink
  flexGrow?: keyof typeof styleRefs.flexGrow
  alignItems?: ResponsiveProp<keyof typeof styleRefs.alignItems>
  alignSelf?: ResponsiveProp<keyof typeof styleRefs.alignSelf>
  justifyContent?: ResponsiveProp<keyof typeof styleRefs.justifyContent>
  textAlign?: ResponsiveProp<keyof typeof styleRefs.textAlign>
  columnGap?: ResponsiveSpace
  rowGap?: ResponsiveSpace
  border?: keyof typeof styleRefs.border
  borderRadius?: keyof typeof styleRefs.borderRadius
  background?: ResponsiveProp<keyof typeof styleRefs.background>
  backgroundPattern?: keyof typeof styleRefs.backgroundPattern
  borderColor?: keyof typeof styleRefs.borderColor
  borderWidth?: keyof typeof styleRefs.borderWidth
  borderRightWidth?: keyof typeof styleRefs.borderRightWidth
  borderTopWidth?: keyof typeof styleRefs.borderTopWidth
  borderLeftWidth?: keyof typeof styleRefs.borderLeftWidth
  borderBottomWidth?: keyof typeof styleRefs.borderBottomWidth
  borderXWidth?: keyof typeof styleRefs.borderXWidth
  borderYWidth?: keyof typeof styleRefs.borderYWidth
  borderStyle?: keyof typeof styleRefs.borderStyle
  boxShadow?: keyof typeof styleRefs.boxShadow
  transform?: keyof typeof styleRefs.transform
  transition?: keyof typeof styleRefs.transition
  height?: keyof typeof styleRefs.height
  width?: keyof typeof styleRefs.width
  position?: keyof typeof styleRefs.position
  cursor?: keyof typeof styleRefs.cursor
  pointerEvents?: keyof typeof styleRefs.pointerEvents
  overflow?: keyof typeof styleRefs.overflow
  minWidth?: keyof typeof styleRefs.minWidth
  top?: ResponsiveProp<Space>
  unstableTop?: ResponsiveFigmaSpacing
  bottom?: ResponsiveProp<Space>
  unstableBottom?: ResponsiveFigmaSpacing
  left?: ResponsiveProp<Space>
  unstableLeft?: ResponsiveFigmaSpacing
  right?: ResponsiveProp<Space>
  unstableRight?: ResponsiveFigmaSpacing
  userSelect?: keyof typeof styleRefs.userSelect
  outline?: keyof typeof styleRefs.outline
  opacity?: keyof typeof styleRefs.opacity
  printHidden?: boolean
  className?: Parameters<typeof classnames>[0]
  zIndex?: keyof typeof styleRefs.zIndex
}

export const useBoxStyles = ({
  component,
  padding,
  paddingX,
  paddingY,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
  unstablePadding,
  unstablePaddingX,
  unstablePaddingY,
  unstablePaddingTop,
  unstablePaddingBottom,
  unstablePaddingLeft,
  unstablePaddingRight,
  margin,
  marginX,
  marginY,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  unstableMargin,
  unstableMarginX,
  unstableMarginY,
  unstableMarginTop,
  unstableMarginBottom,
  unstableMarginLeft,
  unstableMarginRight,
  display,
  flexDirection,
  flexWrap,
  flexShrink,
  flexGrow,
  rowGap,
  columnGap,
  alignItems,
  alignSelf,
  justifyContent,
  textAlign,
  border,
  borderColor,
  borderWidth,
  borderRightWidth,
  borderTopWidth,
  borderLeftWidth,
  borderBottomWidth,
  borderXWidth,
  borderYWidth,
  borderStyle = 'solid',
  borderRadius,
  background,
  backgroundPattern,
  boxShadow,
  transition,
  transform,
  height,
  width,
  position,
  cursor,
  pointerEvents,
  overflow,
  minWidth,
  top,
  unstableTop,
  bottom,
  unstableBottom,
  right,
  unstableRight,
  left,
  unstableLeft,
  userSelect,
  outline,
  opacity,
  printHidden,
  className,
  zIndex,
}: UseBoxStylesProps) => {
  const resetStyles = { ...resetStyleRefs }
  const styles = { ...styleRefs }

  const resolvedPaddingTop = paddingTop ?? paddingY ?? padding
  const resolvedPaddingBottom = paddingBottom ?? paddingY ?? padding
  const resolvedPaddingLeft = paddingLeft ?? paddingX ?? padding
  const resolvedPaddingRight = paddingRight ?? paddingX ?? padding

  const unstableResolvedPaddingTop =
    unstablePaddingTop ?? unstablePaddingY ?? unstablePadding
  const unstableResolvedPaddingBottom =
    unstablePaddingBottom ?? unstablePaddingY ?? unstablePadding
  const unstableResolvedPaddingLeft =
    unstablePaddingLeft ?? unstablePaddingX ?? unstablePadding
  const unstableResolvedPaddingRight =
    unstablePaddingRight ?? unstablePaddingX ?? unstablePadding

  const resolvedMarginTop = marginTop ?? marginY ?? margin
  const resolvedMarginBottom = marginBottom ?? marginY ?? margin
  const resolvedMarginLeft = marginLeft ?? marginX ?? margin
  const resolvedMarginRight = marginRight ?? marginX ?? margin

  const unstableResolvedMarginTop =
    unstableMarginTop ?? unstableMarginY ?? unstableMargin
  const unstableResolvedMarginBottom =
    unstableMarginBottom ?? unstableMarginY ?? unstableMargin
  const unstableResolvedMarginLeft =
    unstableMarginLeft ?? unstableMarginX ?? unstableMargin
  const unstableResolvedMarginRight =
    unstableMarginRight ?? unstableMarginX ?? unstableMargin

  return classnames(
    component !== null && resetStyles.base,
    component !== null &&
      resetStyles.element[component as keyof typeof resetStyleRefs.element],
    background !== undefined &&
      resolveResponsiveProp(
        background,
        styles.background,
        styles.backgroundSm,
        styles.backgroundMd,
        styles.backgroundLg,
        styles.backgroundXl,
      ),
    styles.backgroundPattern[backgroundPattern!],
    styles.border[border!],
    styles.borderColor[borderColor!],
    styles.borderWidth[borderWidth!],
    styles.borderRightWidth[borderRightWidth!],
    styles.borderTopWidth[borderTopWidth!],
    styles.borderLeftWidth[borderLeftWidth!],
    styles.borderBottomWidth[borderBottomWidth!],
    styles.borderXWidth[borderXWidth!],
    styles.borderYWidth[borderYWidth!],
    styles.borderStyle[borderStyle!],
    styles.borderRadius[borderRadius!],
    styles.boxShadow[boxShadow!],
    styles.transition[transition!],
    styles.transform[transform!],
    styles.height[height!],
    styles.width[width!],
    styles.position[position!],
    styles.cursor[cursor!],
    styles.pointerEvents[pointerEvents!],
    styles.overflow[overflow!],
    styles.minWidth[minWidth!],
    top !== undefined &&
      resolveResponsiveProp(
        top,
        styles.relativePosition.top,
        styles.relativePositionSm.top,
        styles.relativePositionMd.top,
        styles.relativePositionLg.top,
        styles.relativePositionXl.top,
      ),
    unstableTop !== undefined &&
      resolveResponsiveProp(
        unstableTop,
        styles.figmaRelativePosition.top,
        styles.figmaRelativePositionSm.top,
        styles.figmaRelativePositionMd.top,
        styles.figmaRelativePositionLg.top,
        styles.figmaRelativePositionXl.top,
      ),
    bottom !== undefined &&
      resolveResponsiveProp(
        bottom,
        styles.relativePosition.bottom,
        styles.relativePositionSm.bottom,
        styles.relativePositionMd.bottom,
        styles.relativePositionLg.bottom,
        styles.relativePositionXl.bottom,
      ),
    unstableBottom !== undefined &&
      resolveResponsiveProp(
        unstableBottom,
        styles.figmaRelativePosition.top,
        styles.figmaRelativePositionSm.top,
        styles.figmaRelativePositionMd.top,
        styles.figmaRelativePositionLg.top,
        styles.figmaRelativePositionXl.top,
      ),
    left !== undefined &&
      resolveResponsiveProp(
        left,
        styles.relativePosition.left,
        styles.relativePositionSm.left,
        styles.relativePositionMd.left,
        styles.relativePositionLg.left,
        styles.relativePositionXl.left,
      ),
    unstableLeft !== undefined &&
      resolveResponsiveProp(
        unstableLeft,
        styles.figmaRelativePosition.top,
        styles.figmaRelativePositionSm.top,
        styles.figmaRelativePositionMd.top,
        styles.figmaRelativePositionLg.top,
        styles.figmaRelativePositionXl.top,
      ),
    right !== undefined &&
      resolveResponsiveProp(
        right,
        styles.relativePosition.right,
        styles.relativePositionSm.right,
        styles.relativePositionMd.right,
        styles.relativePositionLg.right,
        styles.relativePositionXl.right,
      ),
    unstableRight !== undefined &&
      resolveResponsiveProp(
        unstableRight,
        styles.figmaRelativePosition.top,
        styles.figmaRelativePositionSm.top,
        styles.figmaRelativePositionMd.top,
        styles.figmaRelativePositionLg.top,
        styles.figmaRelativePositionXl.top,
      ),
    resolvedMarginTop !== undefined &&
      resolveResponsiveProp(
        resolvedMarginTop,
        styles.margin.top,
        styles.marginSm.top,
        styles.marginMd.top,
        styles.marginLg.top,
        styles.marginXl.top,
      ),
    resolvedMarginBottom !== undefined &&
      resolveResponsiveProp(
        resolvedMarginBottom,
        styles.margin.bottom,
        styles.marginSm.bottom,
        styles.marginMd.bottom,
        styles.marginLg.bottom,
        styles.marginXl.bottom,
      ),
    resolvedMarginLeft !== undefined &&
      resolveResponsiveProp(
        resolvedMarginLeft,
        styles.margin.left,
        styles.marginSm.left,
        styles.marginMd.left,
        styles.marginLg.left,
        styles.marginXl.left,
      ),
    resolvedMarginRight !== undefined &&
      resolveResponsiveProp(
        resolvedMarginRight,
        styles.margin.right,
        styles.marginSm.right,
        styles.marginMd.right,
        styles.marginLg.right,
        styles.marginXl.right,
      ),
    unstableResolvedMarginTop !== undefined &&
      resolveResponsiveProp(
        unstableResolvedMarginTop,
        styles.figmaMargin.top,
        styles.figmaMarginSm.top,
        styles.figmaMarginMd.top,
        styles.figmaMarginLg.top,
        styles.figmaMarginXl.top,
      ),
    unstableResolvedMarginBottom !== undefined &&
      resolveResponsiveProp(
        unstableResolvedMarginBottom,
        styles.figmaMargin.top,
        styles.figmaMarginSm.top,
        styles.figmaMarginMd.top,
        styles.figmaMarginLg.top,
        styles.figmaMarginXl.top,
      ),
    unstableResolvedMarginLeft !== undefined &&
      resolveResponsiveProp(
        unstableResolvedMarginLeft,
        styles.figmaMargin.top,
        styles.figmaMarginSm.top,
        styles.figmaMarginMd.top,
        styles.figmaMarginLg.top,
        styles.figmaMarginXl.top,
      ),
    unstableResolvedMarginRight !== undefined &&
      resolveResponsiveProp(
        unstableResolvedMarginRight,
        styles.figmaMargin.top,
        styles.figmaMarginSm.top,
        styles.figmaMarginMd.top,
        styles.figmaMarginLg.top,
        styles.figmaMarginXl.top,
      ),
    resolvedPaddingTop !== undefined &&
      resolveResponsiveProp(
        resolvedPaddingTop,
        styles.padding.top,
        styles.paddingSm.top,
        styles.paddingMd.top,
        styles.paddingLg.top,
        styles.paddingXl.top,
      ),
    resolvedPaddingBottom !== undefined &&
      resolveResponsiveProp(
        resolvedPaddingBottom,
        styles.padding.bottom,
        styles.paddingSm.bottom,
        styles.paddingMd.bottom,
        styles.paddingLg.bottom,
        styles.paddingXl.bottom,
      ),
    resolvedPaddingLeft !== undefined &&
      resolveResponsiveProp(
        resolvedPaddingLeft,
        styles.padding.left,
        styles.paddingSm.left,
        styles.paddingMd.left,
        styles.paddingLg.left,
        styles.paddingXl.left,
      ),
    resolvedPaddingRight !== undefined &&
      resolveResponsiveProp(
        resolvedPaddingRight,
        styles.padding.right,
        styles.paddingSm.right,
        styles.paddingMd.right,
        styles.paddingLg.right,
        styles.paddingXl.right,
      ),
    unstableResolvedPaddingTop !== undefined &&
      resolveResponsiveProp(
        unstableResolvedPaddingTop,
        styles.figmaPadding.top,
        styles.figmaPaddingSm.top,
        styles.figmaPaddingMd.top,
        styles.figmaPaddingLg.top,
        styles.figmaPaddingXl.top,
      ),
    unstableResolvedPaddingBottom !== undefined &&
      resolveResponsiveProp(
        unstableResolvedPaddingBottom,
        styles.figmaPadding.top,
        styles.figmaPaddingSm.top,
        styles.figmaPaddingMd.top,
        styles.figmaPaddingLg.top,
        styles.figmaPaddingXl.top,
      ),
    unstableResolvedPaddingLeft !== undefined &&
      resolveResponsiveProp(
        unstableResolvedPaddingLeft,
        styles.figmaPadding.top,
        styles.figmaPaddingSm.top,
        styles.figmaPaddingMd.top,
        styles.figmaPaddingLg.top,
        styles.figmaPaddingXl.top,
      ),
    unstableResolvedPaddingRight !== undefined &&
      resolveResponsiveProp(
        unstableResolvedPaddingRight,
        styles.figmaPadding.top,
        styles.figmaPaddingSm.top,
        styles.figmaPaddingMd.top,
        styles.figmaPaddingLg.top,
        styles.figmaPaddingXl.top,
      ),
    display !== undefined &&
      resolveResponsiveProp(
        display,
        styles.display,
        styles.displaySm,
        styles.displayMd,
        styles.displayLg,
        styles.displayXl,
      ),
    flexDirection !== undefined &&
      resolveResponsiveProp(
        flexDirection,
        styles.flexDirection,
        styles.flexDirectionSm,
        styles.flexDirectionMd,
        styles.flexDirectionLg,
        styles.flexDirectionXl,
      ),
    flexWrap !== undefined &&
      resolveResponsiveProp(
        flexWrap,
        styles.flexWrap,
        styles.flexWrapSm,
        styles.flexWrapMd,
        styles.flexWrapLg,
        styles.flexWrapXl,
      ),
    columnGap !== undefined &&
      resolveResponsiveProp(
        columnGap,
        styles.columnGap,
        styles.columnGapSm,
        styles.columnGapMd,
        styles.columnGapLg,
        styles.columnGapXl,
      ),
    rowGap !== undefined &&
      resolveResponsiveProp(
        rowGap,
        styles.rowGap,
        styles.rowGapSm,
        styles.rowGapMd,
        styles.rowGapLg,
        styles.rowGapXl,
      ),
    styles.flexShrink[flexShrink!],
    styles.flexGrow[flexGrow!],
    alignItems !== undefined &&
      resolveResponsiveProp(
        alignItems,
        styles.alignItems,
        styles.alignItemsSm,
        styles.alignItemsMd,
        styles.alignItemsLg,
        styles.alignItemsXl,
      ),
    alignSelf !== undefined &&
      resolveResponsiveProp(
        alignSelf,
        styles.alignSelf,
        styles.alignSelfSm,
        styles.alignSelfMd,
        styles.alignSelfLg,
        styles.alignSelfXl,
      ),
    justifyContent !== undefined &&
      resolveResponsiveProp(
        justifyContent,
        styles.justifyContent,
        styles.justifyContentSm,
        styles.justifyContentMd,
        styles.justifyContentLg,
        styles.justifyContentXl,
      ),
    textAlign !== undefined &&
      resolveResponsiveProp(
        textAlign,
        styles.textAlign,
        styles.textAlignSm,
        styles.textAlignMd,
        styles.textAlignLg,
        styles.textAlignXl,
      ),
    styles.userSelect[userSelect!],
    styles.outline[outline!],
    styles.opacity[opacity!],
    printHidden && styles.printHidden,
    className,
    styles.zIndex[zIndex!],
  )
}
