import { style, styleMap } from 'treat'
import { Properties } from 'csstype'
import omit from 'lodash/omit'
import { mapToStyleProperty } from '../../utils'
import { theme, themeUtils } from '../../theme'

const spaceMapToCss = (
  t: typeof theme,
  cssPropertyName: keyof Properties,
  breakpoint: keyof typeof theme['breakpoints'],
) => {
  const spaceWithNone = {
    ...t.spacing,
    none: 0,
  }

  return mapToStyleProperty(
    spaceWithNone,
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

export const margin = {
  top: styleMap(spaceMapToCss(theme, 'marginTop', 'xs')),
  bottom: styleMap(spaceMapToCss(theme, 'marginBottom', 'xs')),
  left: styleMap(spaceMapToCss(theme, 'marginLeft', 'xs')),
  right: styleMap(spaceMapToCss(theme, 'marginRight', 'xs')),
}
export const marginSm = {
  top: styleMap(spaceMapToCss(theme, 'marginTop', 'sm')),
  bottom: styleMap(spaceMapToCss(theme, 'marginBottom', 'sm')),
  left: styleMap(spaceMapToCss(theme, 'marginLeft', 'sm')),
  right: styleMap(spaceMapToCss(theme, 'marginRight', 'sm')),
}
export const marginMd = {
  top: styleMap(spaceMapToCss(theme, 'marginTop', 'md')),
  bottom: styleMap(spaceMapToCss(theme, 'marginBottom', 'md')),
  left: styleMap(spaceMapToCss(theme, 'marginLeft', 'md')),
  right: styleMap(spaceMapToCss(theme, 'marginRight', 'md')),
}
export const marginLg = {
  top: styleMap(spaceMapToCss(theme, 'marginTop', 'lg')),
  bottom: styleMap(spaceMapToCss(theme, 'marginBottom', 'lg')),
  left: styleMap(spaceMapToCss(theme, 'marginLeft', 'lg')),
  right: styleMap(spaceMapToCss(theme, 'marginRight', 'lg')),
}
export const marginXl = {
  top: styleMap(spaceMapToCss(theme, 'marginTop', 'xl')),
  bottom: styleMap(spaceMapToCss(theme, 'marginBottom', 'xl')),
  left: styleMap(spaceMapToCss(theme, 'marginLeft', 'xl')),
  right: styleMap(spaceMapToCss(theme, 'marginRight', 'xl')),
}

export const padding = {
  top: styleMap(spaceMapToCss(theme, 'paddingTop', 'xs')),
  bottom: styleMap(spaceMapToCss(theme, 'paddingBottom', 'xs')),
  left: styleMap(spaceMapToCss(theme, 'paddingLeft', 'xs')),
  right: styleMap(spaceMapToCss(theme, 'paddingRight', 'xs')),
}
export const paddingSm = {
  top: styleMap(spaceMapToCss(theme, 'paddingTop', 'sm')),
  bottom: styleMap(spaceMapToCss(theme, 'paddingBottom', 'sm')),
  left: styleMap(spaceMapToCss(theme, 'paddingLeft', 'sm')),
  right: styleMap(spaceMapToCss(theme, 'paddingRight', 'sm')),
}
export const paddingMd = {
  top: styleMap(spaceMapToCss(theme, 'paddingTop', 'md')),
  bottom: styleMap(spaceMapToCss(theme, 'paddingBottom', 'md')),
  left: styleMap(spaceMapToCss(theme, 'paddingLeft', 'md')),
  right: styleMap(spaceMapToCss(theme, 'paddingRight', 'md')),
}
export const paddingLg = {
  top: styleMap(spaceMapToCss(theme, 'paddingTop', 'lg')),
  bottom: styleMap(spaceMapToCss(theme, 'paddingBottom', 'lg')),
  left: styleMap(spaceMapToCss(theme, 'paddingLeft', 'lg')),
  right: styleMap(spaceMapToCss(theme, 'paddingRight', 'lg')),
}
export const paddingXl = {
  top: styleMap(spaceMapToCss(theme, 'paddingTop', 'xl')),
  bottom: styleMap(spaceMapToCss(theme, 'paddingBottom', 'xl')),
  left: styleMap(spaceMapToCss(theme, 'paddingLeft', 'xl')),
  right: styleMap(spaceMapToCss(theme, 'paddingRight', 'xl')),
}

export const transform = {
  touchable: style({
    ':active': { transform: theme.transforms.touchable },
  }),
}

export const transition = styleMap(
  mapToStyleProperty(theme.transitions, 'transition'),
)

export const border = styleMap({
  standard: {
    border: `${theme.border.style.solid} ${theme.border.width.standard}px ${theme.border.color.standard}`,
  },
  focus: {
    border: `${theme.border.style.solid} ${theme.border.width.standard}px ${theme.border.color.focus}`,
  },
})

export const borderRadius = {
  ...styleMap(
    mapToStyleProperty(theme.border.radius, 'borderRadius'),
    'borderRadius',
  ),
}

export const width = {
  ...styleMap(
    {
      full: { width: '100%' },
      touchable: { width: theme.spacing[1] * theme.touchableSize },
    },
    'width',
  ),
}

export const height = {
  ...styleMap(
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
}
export const position = styleMap(mapToStyleProperty(positionRules, 'position'))

const displayRules = {
  block: 'block',
  inline: 'inline',
  none: 'none',
  inlineBlock: 'inline-block',
  flex: 'flex',
}
export const display = styleMap(mapToStyleProperty(displayRules, 'display'))
export const displaySm = styleMap(
  mapToStyleProperty(displayRules, 'display', (value, propertyName) =>
    themeUtils.responsiveStyle({
      sm: { [propertyName]: value },
    }),
  ),
)
export const displayMd = styleMap(
  mapToStyleProperty(displayRules, 'display', (value, propertyName) =>
    themeUtils.responsiveStyle({
      md: { [propertyName]: value },
    }),
  ),
)
export const displayLg = styleMap(
  mapToStyleProperty(displayRules, 'display', (value, propertyName) =>
    themeUtils.responsiveStyle({
      lg: { [propertyName]: value },
    }),
  ),
)
export const displayXl = styleMap(
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
}
export const alignItems = styleMap(
  mapToStyleProperty(alignItemsRules, 'alignItems'),
)
export const alignItemsSm = styleMap(
  mapToStyleProperty(alignItemsRules, 'alignItems', (value, propertyName) =>
    themeUtils.responsiveStyle({
      sm: { [propertyName]: value },
    }),
  ),
)
export const alignItemsMd = styleMap(
  mapToStyleProperty(alignItemsRules, 'alignItems', (value, propertyName) =>
    themeUtils.responsiveStyle({
      md: { [propertyName]: value },
    }),
  ),
)
export const alignItemsLg = styleMap(
  mapToStyleProperty(alignItemsRules, 'alignItems', (value, propertyName) =>
    themeUtils.responsiveStyle({
      lg: { [propertyName]: value },
    }),
  ),
)
export const alignItemsXl = styleMap(
  mapToStyleProperty(alignItemsRules, 'alignItems', (value, propertyName) =>
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
export const justifyContent = styleMap(
  mapToStyleProperty(justifyContentRules, 'justifyContent'),
)
export const justifyContentSm = styleMap(
  mapToStyleProperty(
    justifyContentRules,
    'justifyContent',
    (value, propertyName) =>
      themeUtils.responsiveStyle({
        sm: { [propertyName]: value },
      }),
  ),
)
export const justifyContentMd = styleMap(
  mapToStyleProperty(
    justifyContentRules,
    'justifyContent',
    (value, propertyName) =>
      themeUtils.responsiveStyle({
        md: { [propertyName]: value },
      }),
  ),
)
export const justifyContentLg = styleMap(
  mapToStyleProperty(
    justifyContentRules,
    'justifyContent',
    (value, propertyName) =>
      themeUtils.responsiveStyle({
        lg: { [propertyName]: value },
      }),
  ),
)
export const justifyContentXl = styleMap(
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
export const flexDirection = styleMap(
  mapToStyleProperty(flexDirectionRules, 'flexDirection'),
)
export const flexDirectionSm = styleMap(
  mapToStyleProperty(
    flexDirectionRules,
    'flexDirection',
    (value, propertyName) =>
      themeUtils.responsiveStyle({
        sm: { [propertyName]: value },
      }),
  ),
)
export const flexDirectionMd = styleMap(
  mapToStyleProperty(
    flexDirectionRules,
    'flexDirection',
    (value, propertyName) =>
      themeUtils.responsiveStyle({
        md: { [propertyName]: value },
      }),
  ),
)
export const flexDirectionLg = styleMap(
  mapToStyleProperty(
    flexDirectionRules,
    'flexDirection',
    (value, propertyName) =>
      themeUtils.responsiveStyle({
        lg: { [propertyName]: value },
      }),
  ),
)
export const flexDirectionXl = styleMap(
  mapToStyleProperty(
    flexDirectionRules,
    'flexDirection',
    (value, propertyName) =>
      themeUtils.responsiveStyle({
        xl: { [propertyName]: value },
      }),
  ),
)

const flexWrapRules = {
  wrap: 'wrap',
  nowrap: 'nowrap',
}
export const flexWrap = styleMap(mapToStyleProperty(flexWrapRules, 'flexWrap'))

const flexShrinkRules = {
  0: 0,
}
export const flexShrink = styleMap(
  mapToStyleProperty(flexShrinkRules, 'flexShrink'),
) as Record<keyof typeof flexShrinkRules, string> // Remove this when 'styleMap' supports numbers as keys and it's been released to sku consumers

const flexGrowRules = {
  0: 0,
  1: 1,
}
export const flexGrow = styleMap(
  mapToStyleProperty(flexGrowRules, 'flexGrow'),
) as Record<keyof typeof flexGrowRules, string> // Remove this when 'styleMap' supports numbers as keys and it's been released to sku consumers

const dotDesktop = `url('data:image/svg+xml,%0A%3Csvg width="33" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M1.96472 3.92944C3.0498 3.92944 3.92943 3.0498 3.92943 1.96472C3.92943 0.879639 3.0498 0 1.96472 0C0.879633 0 0 0.879639 0 1.96472C0 3.0498 0.879633 3.92944 1.96472 3.92944Z" fill="%23CCDFFF"/%3E%3C/svg%3E%0A')`
const dotMobile = `url('data:image/svg+xml,%0A%3Csvg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="24" height="24" fill="white"/%3E%3Cpath d="M1.41521 2.83041C2.19681 2.83041 2.83041 2.19681 2.83041 1.41521C2.83041 0.63361 2.19681 0 1.41521 0C0.63361 0 0 0.63361 0 1.41521C0 2.19681 0.63361 2.83041 1.41521 2.83041Z" fill="%23CCDFFF"/%3E%3C/svg%3E%0A')`

export const background = styleMap({
  ...mapToStyleProperty(omit(theme.color, 'body'), 'background'),
  dotted: {
    ...themeUtils.responsiveStyle({
      md: { background: dotDesktop },
      xs: { background: dotMobile },
    }),
  },
})

const boxShadowProps = {
  borderWidth: theme.border.width,
  color: theme.border.color,
  shadows: theme.shadows,
}

export const boxShadow = styleMap({
  ...mapToStyleProperty(boxShadowProps.shadows, 'boxShadow'),
  outlineFocus: {
    boxShadow: `0 0 0 ${boxShadowProps.borderWidth.large}px ${boxShadowProps.color.focus}`,
  },
  borderStandard: {
    boxShadow: `inset 0 0 0 ${boxShadowProps.borderWidth.standard}px ${boxShadowProps.color.standard}`,
  },
})

export const cursor = styleMap({
  pointer: { cursor: 'pointer' },
})

export const pointerEvents = styleMap({
  none: { pointerEvents: 'none' },
})

const textAlignRules = {
  left: 'left',
  center: 'center',
  right: 'right',
}

export const textAlign = styleMap(
  mapToStyleProperty(textAlignRules, 'textAlign'),
)
export const textAlignSm = styleMap(
  mapToStyleProperty(textAlignRules, 'textAlign', (value, propertyName) =>
    themeUtils.responsiveStyle({
      sm: { [propertyName]: value },
    }),
  ),
)
export const textAlignMd = styleMap(
  mapToStyleProperty(textAlignRules, 'textAlign', (value, propertyName) =>
    themeUtils.responsiveStyle({
      md: { [propertyName]: value },
    }),
  ),
)
export const textAlignLg = styleMap(
  mapToStyleProperty(textAlignRules, 'textAlign', (value, propertyName) =>
    themeUtils.responsiveStyle({
      lg: { [propertyName]: value },
    }),
  ),
)
export const textAlignXl = styleMap(
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
}
export const overflow = styleMap(mapToStyleProperty(overflowRules, 'overflow'))

const minWidthRules = {
  0: '0%', // We use a percentage here so it supports IE11: https://css-tricks.com/flexbox-truncated-text/#comment-1611744
}
export const minWidth = styleMap(
  mapToStyleProperty(minWidthRules, 'minWidth'),
) as Record<keyof typeof minWidthRules, string> // Remove this when 'styleMap' supports numbers as keys and it's been released to sku consumers

const relativePositionRules = {
  0: 0,
  20: '20px',
}
// Remove this when 'styleMap' supports numbers as keys and it's been released to sku consumers,
type PositionRulesType = Record<keyof typeof relativePositionRules, string>
export const relativePosition = {
  top: styleMap(
    mapToStyleProperty(relativePositionRules, 'top'),
  ) as PositionRulesType,
  bottom: styleMap(
    mapToStyleProperty(relativePositionRules, 'bottom'),
  ) as PositionRulesType,
  left: styleMap(
    mapToStyleProperty(relativePositionRules, 'left'),
  ) as PositionRulesType,
  right: styleMap(
    mapToStyleProperty(relativePositionRules, 'right'),
  ) as PositionRulesType,
}

export const userSelect = styleMap({
  none: { userSelect: 'none' },
})

export const outline = styleMap({
  none: { outline: 'none' },
})

export const opacity = styleMap({
  0: { opacity: 0 },
})
