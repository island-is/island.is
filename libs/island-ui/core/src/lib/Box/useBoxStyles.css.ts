import { style, styleVariants } from '@vanilla-extract/css'
import { Properties } from 'csstype'
import { theme, themeUtils } from '@island.is/island-ui/theme'

import { mapToStyleProperty } from '../../utils/mapToStyleProperty'

type Breakpoints = keyof typeof theme.breakpoints

const spaceMapToCss = (
  t: typeof theme,
  cssPropertyName: keyof Properties,
  breakpoint: Breakpoints,
) => {
  const spaceWithKeywords = {
    ...t.spacing,
    none: 0,
    auto: 'auto',
  }

  return mapToStyleProperty(
    spaceWithKeywords,
    cssPropertyName,
    (value, propertyName) => {
      const styles = {
        [propertyName]: value,
      }

      const minWidth = t.breakpoints[breakpoint]

      return minWidth === 0
        ? styles
        : {
            '@media': {
              [`screen and (min-width: ${minWidth}px)`]: styles,
            },
          }
    },
  )
}

const figmaSpaceMapToCss = (
  t: typeof theme,
  cssPropertyName: keyof Properties,
  breakpoint: Breakpoints,
) => {
  const spaceWithKeywords = {
    ...t.figmaSpacing,
    none: 0,
    auto: 'auto',
  }

  return mapToStyleProperty(
    spaceWithKeywords,
    cssPropertyName,
    (value, propertyName) => {
      const styles = {
        [propertyName]: value,
      }

      const minWidth = t.breakpoints[breakpoint]

      return minWidth === 0
        ? styles
        : {
            '@media': {
              [`screen and (min-width: ${minWidth}px)`]: styles,
            },
          }
    },
  )
}

export const relativePosition = {
  top: styleVariants(spaceMapToCss(theme, 'top', 'xs')),
  bottom: styleVariants(spaceMapToCss(theme, 'bottom', 'xs')),
  left: styleVariants(spaceMapToCss(theme, 'left', 'xs')),
  right: styleVariants(spaceMapToCss(theme, 'right', 'xs')),
}

export const relativePositionSm = {
  top: styleVariants(spaceMapToCss(theme, 'top', 'sm')),
  bottom: styleVariants(spaceMapToCss(theme, 'bottom', 'sm')),
  left: styleVariants(spaceMapToCss(theme, 'left', 'sm')),
  right: styleVariants(spaceMapToCss(theme, 'right', 'sm')),
}

export const relativePositionMd = {
  top: styleVariants(spaceMapToCss(theme, 'top', 'md')),
  bottom: styleVariants(spaceMapToCss(theme, 'bottom', 'md')),
  left: styleVariants(spaceMapToCss(theme, 'left', 'md')),
  right: styleVariants(spaceMapToCss(theme, 'right', 'md')),
}

export const relativePositionLg = {
  top: styleVariants(spaceMapToCss(theme, 'top', 'lg')),
  bottom: styleVariants(spaceMapToCss(theme, 'bottom', 'lg')),
  left: styleVariants(spaceMapToCss(theme, 'left', 'lg')),
  right: styleVariants(spaceMapToCss(theme, 'right', 'lg')),
}

export const relativePositionXl = {
  top: styleVariants(spaceMapToCss(theme, 'top', 'xl')),
  bottom: styleVariants(spaceMapToCss(theme, 'bottom', 'xl')),
  left: styleVariants(spaceMapToCss(theme, 'left', 'xl')),
  right: styleVariants(spaceMapToCss(theme, 'right', 'xl')),
}

export const figmaRelativePosition = {
  top: styleVariants(figmaSpaceMapToCss(theme, 'top', 'xs')),
  bottom: styleVariants(figmaSpaceMapToCss(theme, 'bottom', 'xs')),
  left: styleVariants(figmaSpaceMapToCss(theme, 'left', 'xs')),
  right: styleVariants(figmaSpaceMapToCss(theme, 'right', 'xs')),
}

export const figmaRelativePositionSm = {
  top: styleVariants(figmaSpaceMapToCss(theme, 'top', 'sm')),
  bottom: styleVariants(figmaSpaceMapToCss(theme, 'bottom', 'sm')),
  left: styleVariants(figmaSpaceMapToCss(theme, 'left', 'sm')),
  right: styleVariants(figmaSpaceMapToCss(theme, 'right', 'sm')),
}

export const figmaRelativePositionMd = {
  top: styleVariants(figmaSpaceMapToCss(theme, 'top', 'md')),
  bottom: styleVariants(figmaSpaceMapToCss(theme, 'bottom', 'md')),
  left: styleVariants(figmaSpaceMapToCss(theme, 'left', 'md')),
  right: styleVariants(figmaSpaceMapToCss(theme, 'right', 'md')),
}

export const figmaRelativePositionLg = {
  top: styleVariants(figmaSpaceMapToCss(theme, 'top', 'lg')),
  bottom: styleVariants(figmaSpaceMapToCss(theme, 'bottom', 'lg')),
  left: styleVariants(figmaSpaceMapToCss(theme, 'left', 'lg')),
  right: styleVariants(figmaSpaceMapToCss(theme, 'right', 'lg')),
}

export const figmaRelativePositionXl = {
  top: styleVariants(figmaSpaceMapToCss(theme, 'top', 'xl')),
  bottom: styleVariants(figmaSpaceMapToCss(theme, 'bottom', 'xl')),
  left: styleVariants(figmaSpaceMapToCss(theme, 'left', 'xl')),
  right: styleVariants(figmaSpaceMapToCss(theme, 'right', 'xl')),
}

export const margin = {
  top: styleVariants(spaceMapToCss(theme, 'marginTop', 'xs')),
  bottom: styleVariants(spaceMapToCss(theme, 'marginBottom', 'xs')),
  left: styleVariants(spaceMapToCss(theme, 'marginLeft', 'xs')),
  right: styleVariants(spaceMapToCss(theme, 'marginRight', 'xs')),
}
export const marginSm = {
  top: styleVariants(spaceMapToCss(theme, 'marginTop', 'sm')),
  bottom: styleVariants(spaceMapToCss(theme, 'marginBottom', 'sm')),
  left: styleVariants(spaceMapToCss(theme, 'marginLeft', 'sm')),
  right: styleVariants(spaceMapToCss(theme, 'marginRight', 'sm')),
}
export const marginMd = {
  top: styleVariants(spaceMapToCss(theme, 'marginTop', 'md')),
  bottom: styleVariants(spaceMapToCss(theme, 'marginBottom', 'md')),
  left: styleVariants(spaceMapToCss(theme, 'marginLeft', 'md')),
  right: styleVariants(spaceMapToCss(theme, 'marginRight', 'md')),
}
export const marginLg = {
  top: styleVariants(spaceMapToCss(theme, 'marginTop', 'lg')),
  bottom: styleVariants(spaceMapToCss(theme, 'marginBottom', 'lg')),
  left: styleVariants(spaceMapToCss(theme, 'marginLeft', 'lg')),
  right: styleVariants(spaceMapToCss(theme, 'marginRight', 'lg')),
}
export const marginXl = {
  top: styleVariants(spaceMapToCss(theme, 'marginTop', 'xl')),
  bottom: styleVariants(spaceMapToCss(theme, 'marginBottom', 'xl')),
  left: styleVariants(spaceMapToCss(theme, 'marginLeft', 'xl')),
  right: styleVariants(spaceMapToCss(theme, 'marginRight', 'xl')),
}

export const figmaMargin = {
  top: styleVariants(figmaSpaceMapToCss(theme, 'marginTop', 'xs')),
  bottom: styleVariants(figmaSpaceMapToCss(theme, 'marginBottom', 'xs')),
  left: styleVariants(figmaSpaceMapToCss(theme, 'marginLeft', 'xs')),
  right: styleVariants(figmaSpaceMapToCss(theme, 'marginRight', 'xs')),
}
export const figmaMarginSm = {
  top: styleVariants(figmaSpaceMapToCss(theme, 'marginTop', 'sm')),
  bottom: styleVariants(figmaSpaceMapToCss(theme, 'marginBottom', 'sm')),
  left: styleVariants(figmaSpaceMapToCss(theme, 'marginLeft', 'sm')),
  right: styleVariants(figmaSpaceMapToCss(theme, 'marginRight', 'sm')),
}
export const figmaMarginMd = {
  top: styleVariants(figmaSpaceMapToCss(theme, 'marginTop', 'md')),
  bottom: styleVariants(figmaSpaceMapToCss(theme, 'marginBottom', 'md')),
  left: styleVariants(figmaSpaceMapToCss(theme, 'marginLeft', 'md')),
  right: styleVariants(figmaSpaceMapToCss(theme, 'marginRight', 'md')),
}
export const figmaMarginLg = {
  top: styleVariants(figmaSpaceMapToCss(theme, 'marginTop', 'lg')),
  bottom: styleVariants(figmaSpaceMapToCss(theme, 'marginBottom', 'lg')),
  left: styleVariants(figmaSpaceMapToCss(theme, 'marginLeft', 'lg')),
  right: styleVariants(figmaSpaceMapToCss(theme, 'marginRight', 'lg')),
}
export const figmaMarginXl = {
  top: styleVariants(figmaSpaceMapToCss(theme, 'marginTop', 'xl')),
  bottom: styleVariants(figmaSpaceMapToCss(theme, 'marginBottom', 'xl')),
  left: styleVariants(figmaSpaceMapToCss(theme, 'marginLeft', 'xl')),
  right: styleVariants(figmaSpaceMapToCss(theme, 'marginRight', 'xl')),
}

export const padding = {
  top: styleVariants(spaceMapToCss(theme, 'paddingTop', 'xs')),
  bottom: styleVariants(spaceMapToCss(theme, 'paddingBottom', 'xs')),
  left: styleVariants(spaceMapToCss(theme, 'paddingLeft', 'xs')),
  right: styleVariants(spaceMapToCss(theme, 'paddingRight', 'xs')),
}
export const paddingSm = {
  top: styleVariants(spaceMapToCss(theme, 'paddingTop', 'sm')),
  bottom: styleVariants(spaceMapToCss(theme, 'paddingBottom', 'sm')),
  left: styleVariants(spaceMapToCss(theme, 'paddingLeft', 'sm')),
  right: styleVariants(spaceMapToCss(theme, 'paddingRight', 'sm')),
}
export const paddingMd = {
  top: styleVariants(spaceMapToCss(theme, 'paddingTop', 'md')),
  bottom: styleVariants(spaceMapToCss(theme, 'paddingBottom', 'md')),
  left: styleVariants(spaceMapToCss(theme, 'paddingLeft', 'md')),
  right: styleVariants(spaceMapToCss(theme, 'paddingRight', 'md')),
}
export const paddingLg = {
  top: styleVariants(spaceMapToCss(theme, 'paddingTop', 'lg')),
  bottom: styleVariants(spaceMapToCss(theme, 'paddingBottom', 'lg')),
  left: styleVariants(spaceMapToCss(theme, 'paddingLeft', 'lg')),
  right: styleVariants(spaceMapToCss(theme, 'paddingRight', 'lg')),
}
export const paddingXl = {
  top: styleVariants(spaceMapToCss(theme, 'paddingTop', 'xl')),
  bottom: styleVariants(spaceMapToCss(theme, 'paddingBottom', 'xl')),
  left: styleVariants(spaceMapToCss(theme, 'paddingLeft', 'xl')),
  right: styleVariants(spaceMapToCss(theme, 'paddingRight', 'xl')),
}

export const figmaPadding = {
  top: styleVariants(figmaSpaceMapToCss(theme, 'paddingTop', 'xs')),
  bottom: styleVariants(figmaSpaceMapToCss(theme, 'paddingBottom', 'xs')),
  left: styleVariants(figmaSpaceMapToCss(theme, 'paddingLeft', 'xs')),
  right: styleVariants(figmaSpaceMapToCss(theme, 'paddingRight', 'xs')),
}
export const figmaPaddingSm = {
  top: styleVariants(figmaSpaceMapToCss(theme, 'paddingTop', 'sm')),
  bottom: styleVariants(figmaSpaceMapToCss(theme, 'paddingBottom', 'sm')),
  left: styleVariants(figmaSpaceMapToCss(theme, 'paddingLeft', 'sm')),
  right: styleVariants(figmaSpaceMapToCss(theme, 'paddingRight', 'sm')),
}
export const figmaPaddingMd = {
  top: styleVariants(figmaSpaceMapToCss(theme, 'paddingTop', 'md')),
  bottom: styleVariants(figmaSpaceMapToCss(theme, 'paddingBottom', 'md')),
  left: styleVariants(figmaSpaceMapToCss(theme, 'paddingLeft', 'md')),
  right: styleVariants(figmaSpaceMapToCss(theme, 'paddingRight', 'md')),
}
export const figmaPaddingLg = {
  top: styleVariants(figmaSpaceMapToCss(theme, 'paddingTop', 'lg')),
  bottom: styleVariants(figmaSpaceMapToCss(theme, 'paddingBottom', 'lg')),
  left: styleVariants(figmaSpaceMapToCss(theme, 'paddingLeft', 'lg')),
  right: styleVariants(figmaSpaceMapToCss(theme, 'paddingRight', 'lg')),
}
export const figmaPaddingXl = {
  top: styleVariants(figmaSpaceMapToCss(theme, 'paddingTop', 'xl')),
  bottom: styleVariants(figmaSpaceMapToCss(theme, 'paddingBottom', 'xl')),
  left: styleVariants(figmaSpaceMapToCss(theme, 'paddingLeft', 'xl')),
  right: styleVariants(figmaSpaceMapToCss(theme, 'paddingRight', 'xl')),
}

export const transform = {
  touchable: style({
    ':active': { transform: theme.transforms.touchable },
  }),
}

export const transition = styleVariants(
  mapToStyleProperty(theme.transitions, 'transition'),
)

export const border = styleVariants({
  disabled: {
    border: `${theme.border.style.solid} ${theme.border.width.standard}px ${theme.border.color.dark100}`,
  },
  standard: {
    border: `${theme.border.style.solid} ${theme.border.width.standard}px ${theme.border.color.standard}`,
  },
  focus: {
    border: `${theme.border.style.solid} ${theme.border.width.standard}px ${theme.border.color.focus}`,
  },
})

export const borderRadius = {
  ...styleVariants(
    mapToStyleProperty(theme.border.radius, 'borderRadius'),
    'borderRadius',
  ),
}

export const borderColor = styleVariants(
  mapToStyleProperty(theme.border.color, 'borderColor'),
  'borderColor',
)

export const borderWidth = styleVariants(
  mapToStyleProperty(theme.border.width, 'borderWidth'),
  'borderWidth',
)

export const borderRightWidth = styleVariants(
  mapToStyleProperty(theme.border.width, 'borderRightWidth'),
  'borderRightWidth',
)

export const borderTopWidth = styleVariants(
  mapToStyleProperty(theme.border.width, 'borderTopWidth'),
  'borderTopWidth',
)

export const borderLeftWidth = styleVariants(
  mapToStyleProperty(theme.border.width, 'borderLeftWidth'),
  'borderLeftWidth',
)

export const borderBottomWidth = styleVariants(
  mapToStyleProperty(theme.border.width, 'borderBottomWidth'),
  'borderBottomWidth',
)

export const borderXWidth = styleVariants(
  {
    ...mapToStyleProperty(theme.border.width, 'borderLeftWidth'),
    ...mapToStyleProperty(theme.border.width, 'borderRightWidth'),
  },
  'borderXWidth',
)

export const borderYWidth = styleVariants(
  {
    ...mapToStyleProperty(theme.border.width, 'borderTopWidth'),
    ...mapToStyleProperty(theme.border.width, 'borderBottomWidth'),
  },
  'borderYWidth',
)

export const borderStyle = styleVariants(
  mapToStyleProperty(theme.border.style, 'borderStyle'),
  'borderStyle',
)

export const width = {
  ...styleVariants(
    {
      full: { width: '100%' },
      touchable: { width: theme.spacing[1] * theme.touchableSize },
      half: { width: '50%' },
    },
    'width',
  ),
}

export const height = {
  ...styleVariants(
    {
      full: { height: '100%' },
      touchable: { height: theme.spacing[1] * theme.touchableSize },
    },
    'height',
  ),
}

const positionRules = {
  absolute: 'absolute',
  relative: 'relative',
  fixed: 'fixed',
  static: 'static',
  sticky: 'sticky',
}
export const position = styleVariants(
  mapToStyleProperty(positionRules, 'position'),
)

const displayRules = {
  block: 'block',
  inline: 'inline',
  none: 'none',
  inlineBlock: 'inline-block',
  flex: 'flex',
  inlineFlex: 'inline-flex',
}
export const display = styleVariants(
  mapToStyleProperty(displayRules, 'display'),
)
export const displaySm = styleVariants(
  mapToStyleProperty(displayRules, 'display', (value, propertyName) =>
    themeUtils.responsiveStyle({
      sm: { [propertyName]: value },
    }),
  ),
)
export const displayMd = styleVariants(
  mapToStyleProperty(displayRules, 'display', (value, propertyName) =>
    themeUtils.responsiveStyle({
      md: { [propertyName]: value },
    }),
  ),
)
export const displayLg = styleVariants(
  mapToStyleProperty(displayRules, 'display', (value, propertyName) =>
    themeUtils.responsiveStyle({
      lg: { [propertyName]: value },
    }),
  ),
)
export const displayXl = styleVariants(
  mapToStyleProperty(displayRules, 'display', (value, propertyName) =>
    themeUtils.responsiveStyle({
      xl: { [propertyName]: value },
    }),
  ),
)

const alignItemsRules = {
  flexStart: 'flex-start',
  center: 'center',
  flexEnd: 'flex-end',
  baseline: 'baseline',
  stretch: 'stretch',
}
export const alignItems = styleVariants(
  mapToStyleProperty(alignItemsRules, 'alignItems'),
)
export const alignItemsSm = styleVariants(
  mapToStyleProperty(alignItemsRules, 'alignItems', (value, propertyName) =>
    themeUtils.responsiveStyle({
      sm: { [propertyName]: value },
    }),
  ),
)
export const alignItemsMd = styleVariants(
  mapToStyleProperty(alignItemsRules, 'alignItems', (value, propertyName) =>
    themeUtils.responsiveStyle({
      md: { [propertyName]: value },
    }),
  ),
)
export const alignItemsLg = styleVariants(
  mapToStyleProperty(alignItemsRules, 'alignItems', (value, propertyName) =>
    themeUtils.responsiveStyle({
      lg: { [propertyName]: value },
    }),
  ),
)
export const alignItemsXl = styleVariants(
  mapToStyleProperty(alignItemsRules, 'alignItems', (value, propertyName) =>
    themeUtils.responsiveStyle({
      xl: { [propertyName]: value },
    }),
  ),
)

const alignSelfRules = {
  flexStart: 'flex-start',
  center: 'center',
  flexEnd: 'flex-end',
  baseline: 'baseline',
  stretch: 'stretch',
}
export const alignSelf = styleVariants(
  mapToStyleProperty(alignSelfRules, 'alignSelf'),
)

export const alignSelfSm = styleVariants(
  mapToStyleProperty(alignSelfRules, 'alignSelf', (value, propertyName) =>
    themeUtils.responsiveStyle({
      sm: { [propertyName]: value },
    }),
  ),
)
export const alignSelfMd = styleVariants(
  mapToStyleProperty(alignSelfRules, 'alignSelf', (value, propertyName) =>
    themeUtils.responsiveStyle({
      md: { [propertyName]: value },
    }),
  ),
)
export const alignSelfLg = styleVariants(
  mapToStyleProperty(alignSelfRules, 'alignSelf', (value, propertyName) =>
    themeUtils.responsiveStyle({
      lg: { [propertyName]: value },
    }),
  ),
)
export const alignSelfXl = styleVariants(
  mapToStyleProperty(alignSelfRules, 'alignSelf', (value, propertyName) =>
    themeUtils.responsiveStyle({
      xl: { [propertyName]: value },
    }),
  ),
)

const justifyContentRules = {
  flexStart: 'flex-start',
  center: 'center',
  flexEnd: 'flex-end',
  spaceBetween: 'space-between',
  spaceAround: 'space-around',
}
export const justifyContent = styleVariants(
  mapToStyleProperty(justifyContentRules, 'justifyContent'),
)
export const justifyContentSm = styleVariants(
  mapToStyleProperty(
    justifyContentRules,
    'justifyContent',
    (value, propertyName) =>
      themeUtils.responsiveStyle({
        sm: { [propertyName]: value },
      }),
  ),
)
export const justifyContentMd = styleVariants(
  mapToStyleProperty(
    justifyContentRules,
    'justifyContent',
    (value, propertyName) =>
      themeUtils.responsiveStyle({
        md: { [propertyName]: value },
      }),
  ),
)
export const justifyContentLg = styleVariants(
  mapToStyleProperty(
    justifyContentRules,
    'justifyContent',
    (value, propertyName) =>
      themeUtils.responsiveStyle({
        lg: { [propertyName]: value },
      }),
  ),
)
export const justifyContentXl = styleVariants(
  mapToStyleProperty(
    justifyContentRules,
    'justifyContent',
    (value, propertyName) =>
      themeUtils.responsiveStyle({
        xl: { [propertyName]: value },
      }),
  ),
)

const flexDirectionRules = {
  row: 'row',
  rowReverse: 'row-reverse',
  column: 'column',
  columnReverse: 'column-reverse',
}
export const flexDirection = styleVariants(
  mapToStyleProperty(flexDirectionRules, 'flexDirection'),
)
export const flexDirectionSm = styleVariants(
  mapToStyleProperty(
    flexDirectionRules,
    'flexDirection',
    (value, propertyName) =>
      themeUtils.responsiveStyle({
        sm: { [propertyName]: value },
      }),
  ),
)
export const flexDirectionMd = styleVariants(
  mapToStyleProperty(
    flexDirectionRules,
    'flexDirection',
    (value, propertyName) =>
      themeUtils.responsiveStyle({
        md: { [propertyName]: value },
      }),
  ),
)
export const flexDirectionLg = styleVariants(
  mapToStyleProperty(
    flexDirectionRules,
    'flexDirection',
    (value, propertyName) =>
      themeUtils.responsiveStyle({
        lg: { [propertyName]: value },
      }),
  ),
)
export const flexDirectionXl = styleVariants(
  mapToStyleProperty(
    flexDirectionRules,
    'flexDirection',
    (value, propertyName) =>
      themeUtils.responsiveStyle({
        xl: { [propertyName]: value },
      }),
  ),
)

export const columnGap = styleVariants(spaceMapToCss(theme, 'columnGap', 'xs'))
export const columnGapSm = styleVariants(
  spaceMapToCss(theme, 'columnGap', 'sm'),
)
export const columnGapMd = styleVariants(
  spaceMapToCss(theme, 'columnGap', 'md'),
)
export const columnGapLg = styleVariants(
  spaceMapToCss(theme, 'columnGap', 'lg'),
)
export const columnGapXl = styleVariants(
  spaceMapToCss(theme, 'columnGap', 'xl'),
)

export const rowGap = styleVariants(spaceMapToCss(theme, 'rowGap', 'xs'))
export const rowGapSm = styleVariants(spaceMapToCss(theme, 'rowGap', 'sm'))
export const rowGapMd = styleVariants(spaceMapToCss(theme, 'rowGap', 'md'))
export const rowGapLg = styleVariants(spaceMapToCss(theme, 'rowGap', 'lg'))
export const rowGapXl = styleVariants(spaceMapToCss(theme, 'rowGap', 'xl'))

const flexWrapRules = {
  wrap: 'wrap',
  nowrap: 'nowrap',
}
export const flexWrap = styleVariants(
  mapToStyleProperty(flexWrapRules, 'flexWrap'),
)
export const flexWrapSm = styleVariants(
  mapToStyleProperty(flexWrapRules, 'flexWrap', (value, propertyName) =>
    themeUtils.responsiveStyle({
      sm: { [propertyName]: value },
    }),
  ),
)
export const flexWrapMd = styleVariants(
  mapToStyleProperty(flexWrapRules, 'flexWrap', (value, propertyName) =>
    themeUtils.responsiveStyle({
      md: { [propertyName]: value },
    }),
  ),
)
export const flexWrapLg = styleVariants(
  mapToStyleProperty(flexWrapRules, 'flexWrap', (value, propertyName) =>
    themeUtils.responsiveStyle({
      lg: { [propertyName]: value },
    }),
  ),
)
export const flexWrapXl = styleVariants(
  mapToStyleProperty(flexWrapRules, 'flexWrap', (value, propertyName) =>
    themeUtils.responsiveStyle({
      xl: { [propertyName]: value },
    }),
  ),
)

const flexShrinkRules = {
  0: 0,
  1: 1,
}
export const flexShrink = styleVariants(
  mapToStyleProperty(flexShrinkRules, 'flexShrink'),
) as Record<keyof typeof flexShrinkRules, string> // Remove this when 'styleVariants' supports numbers as keys and it's been released to sku consumers

const flexGrowRules = {
  0: 0,
  1: 1,
}
export const flexGrow = styleVariants(
  mapToStyleProperty(flexGrowRules, 'flexGrow'),
) as Record<keyof typeof flexGrowRules, string> // Remove this when 'styleVariants' supports numbers as keys and it's been released to sku consumers

const dotDesktop = `url('data:image/svg+xml,%0A%3Csvg width="33" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M1.96472 3.92944C3.0498 3.92944 3.92943 3.0498 3.92943 1.96472C3.92943 0.879639 3.0498 0 1.96472 0C0.879633 0 0 0.879639 0 1.96472C0 3.0498 0.879633 3.92944 1.96472 3.92944Z" fill="%23CCDFFF"/%3E%3C/svg%3E%0A')`
const dotMobile = `url('data:image/svg+xml,%0A%3Csvg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="24" height="24" fill="white"/%3E%3Cpath d="M1.41521 2.83041C2.19681 2.83041 2.83041 2.19681 2.83041 1.41521C2.83041 0.63361 2.19681 0 1.41521 0C0.63361 0 0 0.63361 0 1.41521C0 2.19681 0.63361 2.83041 1.41521 2.83041Z" fill="%23CCDFFF"/%3E%3C/svg%3E%0A')`

export const backgroundPattern = styleVariants({
  dotted: themeUtils.responsiveStyle({
    md: { background: dotDesktop },
    xs: { background: dotMobile },
  }),
})

export const background = styleVariants(
  mapToStyleProperty(theme.color, 'background'),
)
export const backgroundSm = styleVariants(
  mapToStyleProperty(theme.color, 'background', (value, propertyName) =>
    themeUtils.responsiveStyle({
      sm: { [propertyName]: value },
    }),
  ),
)
export const backgroundMd = styleVariants(
  mapToStyleProperty(theme.color, 'background', (value, propertyName) =>
    themeUtils.responsiveStyle({
      md: { [propertyName]: value },
    }),
  ),
)
export const backgroundLg = styleVariants(
  mapToStyleProperty(theme.color, 'background', (value, propertyName) =>
    themeUtils.responsiveStyle({
      lg: { [propertyName]: value },
    }),
  ),
)
export const backgroundXl = styleVariants(
  mapToStyleProperty(theme.color, 'background', (value, propertyName) =>
    themeUtils.responsiveStyle({
      xl: { [propertyName]: value },
    }),
  ),
)

const boxShadowProps = {
  borderWidth: theme.border.width,
  color: theme.border.color,
  shadows: theme.shadows,
}

export const boxShadow = styleVariants({
  ...mapToStyleProperty(boxShadowProps.shadows, 'boxShadow'),
  outlineFocus: {
    boxShadow: `0 0 0 ${boxShadowProps.borderWidth.large}px ${boxShadowProps.color.focus}`,
  },
  borderStandard: {
    boxShadow: `inset 0 0 0 ${boxShadowProps.borderWidth.standard}px ${boxShadowProps.color.standard}`,
  },
})

export const cursor = styleVariants({
  pointer: { cursor: 'pointer' },
})

export const pointerEvents = styleVariants({
  none: { pointerEvents: 'none' },
})

const textAlignRules = {
  left: 'left',
  center: 'center',
  right: 'right',
}

export const textAlign = styleVariants(
  mapToStyleProperty(textAlignRules, 'textAlign'),
)
export const textAlignSm = styleVariants(
  mapToStyleProperty(textAlignRules, 'textAlign', (value, propertyName) =>
    themeUtils.responsiveStyle({
      sm: { [propertyName]: value },
    }),
  ),
)
export const textAlignMd = styleVariants(
  mapToStyleProperty(textAlignRules, 'textAlign', (value, propertyName) =>
    themeUtils.responsiveStyle({
      md: { [propertyName]: value },
    }),
  ),
)
export const textAlignLg = styleVariants(
  mapToStyleProperty(textAlignRules, 'textAlign', (value, propertyName) =>
    themeUtils.responsiveStyle({
      lg: { [propertyName]: value },
    }),
  ),
)
export const textAlignXl = styleVariants(
  mapToStyleProperty(textAlignRules, 'textAlign', (value, propertyName) =>
    themeUtils.responsiveStyle({
      xl: { [propertyName]: value },
    }),
  ),
)

const overflowRules = {
  hidden: 'hidden',
  scroll: 'scroll',
  visible: 'visible',
  auto: 'auto',
  initial: 'initial',
}
export const overflow = styleVariants(
  mapToStyleProperty(overflowRules, 'overflow'),
)

const minWidthRules = {
  0: '0%', // We use a percentage here so it supports IE11: https://css-tricks.com/flexbox-truncated-text/#comment-1611744
}
export const minWidth = styleVariants(
  mapToStyleProperty(minWidthRules, 'minWidth'),
) as Record<keyof typeof minWidthRules, string> // Remove this when 'styleVariants' supports numbers as keys and it's been released to sku consumers

export const userSelect = styleVariants({
  none: { userSelect: 'none' },
})

export const outline = styleVariants({
  none: { outline: 'none' },
})

export const opacity = styleVariants({
  0: { opacity: 0 },
  0.5: { opacity: 0.5 },
  1: { opacity: 1 },
})

export const zIndex = styleVariants({
  10: { zIndex: 10 },
  20: { zIndex: 20 },
  30: { zIndex: 30 },
  40: { zIndex: 40 },
  50: { zIndex: 50 },
  60: { zIndex: 60 },
  70: { zIndex: 70 },
  80: { zIndex: 80 },
  90: { zIndex: 90 },
})

export const printHidden = style({
  '@media': {
    print: {
      display: 'none !important',
    },
  },
})
