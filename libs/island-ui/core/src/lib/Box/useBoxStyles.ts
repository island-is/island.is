/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ElementType } from 'react'
import classnames from 'classnames'
import { theme } from '../../theme/'
import {
  resolveResponsiveProp,
  ResponsiveProp,
} from '../../utils/responsiveProp'
import * as resetStyleRefs from '../../reset/reset.treat'
import * as styleRefs from './useBoxStyles.treat'
export type Space = keyof typeof theme.spacing
export type ResponsiveSpace = ResponsiveProp<Space>

export interface UseBoxStylesProps {
  component: ElementType | null
  padding?: ResponsiveSpace
  paddingX?: ResponsiveSpace
  paddingY?: ResponsiveSpace
  paddingTop?: ResponsiveSpace
  paddingBottom?: ResponsiveSpace
  paddingLeft?: ResponsiveSpace
  paddingRight?: ResponsiveSpace
  margin?: ResponsiveSpace
  marginX?: ResponsiveSpace
  marginY?: ResponsiveSpace
  marginTop?: ResponsiveSpace
  marginBottom?: ResponsiveSpace
  marginLeft?: ResponsiveSpace
  marginRight?: ResponsiveSpace
  display?: ResponsiveProp<keyof typeof styleRefs.display>
  flexDirection?: ResponsiveProp<keyof typeof styleRefs.flexDirection>
  flexWrap?: keyof typeof styleRefs.flexWrap
  flexShrink?: keyof typeof styleRefs.flexShrink
  flexGrow?: keyof typeof styleRefs.flexGrow
  alignItems?: ResponsiveProp<keyof typeof styleRefs.alignItems>
  justifyContent?: ResponsiveProp<keyof typeof styleRefs.justifyContent>
  textAlign?: ResponsiveProp<keyof typeof styleRefs.textAlign>
  borderRadius?: keyof typeof styleRefs.borderRadius
  background?: keyof typeof styleRefs.background
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
  top?: keyof typeof styleRefs.relativePosition.top
  bottom?: keyof typeof styleRefs.relativePosition.bottom
  left?: keyof typeof styleRefs.relativePosition.left
  right?: keyof typeof styleRefs.relativePosition.right
  userSelect?: keyof typeof styleRefs.userSelect
  outline?: keyof typeof styleRefs.outline
  opacity?: keyof typeof styleRefs.opacity
  className?: Parameters<typeof classnames>[0]
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
  margin,
  marginX,
  marginY,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  display,
  flexDirection,
  flexWrap,
  flexShrink,
  flexGrow,
  alignItems,
  justifyContent,
  textAlign,
  borderRadius,
  background,
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
  bottom,
  right,
  left,
  userSelect,
  outline,
  opacity,
  className,
}: UseBoxStylesProps) => {
  const resetStyles = {
    ...resetStyleRefs,
  }
  const styles = {
    ...styleRefs,
  }

  const resolvedPaddingTop = paddingTop || paddingY || padding
  const resolvedPaddingBottom = paddingBottom || paddingY || padding
  const resolvedPaddingLeft = paddingLeft || paddingX || padding
  const resolvedPaddingRight = paddingRight || paddingX || padding

  const resolvedMarginTop = marginTop || marginY || margin
  const resolvedMarginBottom = marginBottom || marginY || margin
  const resolvedMarginLeft = marginLeft || marginX || margin
  const resolvedMarginRight = marginRight || marginX || margin

  return classnames(
    component !== null && resetStyles.base,
    component !== null &&
      resetStyles.element[component as keyof typeof resetStyleRefs.element],
    styles.background[background!],
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
    styles.relativePosition.top[top!],
    styles.relativePosition.bottom[bottom!],
    styles.relativePosition.right[right!],
    styles.relativePosition.left[left!],
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
    styles.flexWrap[flexWrap!],
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
    className,
  )
}
