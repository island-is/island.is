import { theme } from '@island.is/island-ui/theme'
import { ComplexStyleRule, style } from '@vanilla-extract/css'

export const container = style({
  overflow: 'scroll',
  minHeight: '150px',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      minHeight: '460px',
    },
  },
})

const basePhotoClassName: ComplexStyleRule = {
  display: 'inline-flex',
  overflow: 'hidden',
  backgroundColor: 'white',
  borderRadius: theme.border.radius.large,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  maxHeight: '230px',
  minHeight: '100px',
  minWidth: '85px',
  aspectRatio: '413/513',
}

export const photoClass = style(basePhotoClassName)

export const placeholderClass = style({
  ...basePhotoClassName,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})

export const signatureClass = style({
  backgroundColor: 'white',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  maxWidth: '230px',
  height: '100%',
  objectFit: 'contain',
  aspectRatio: '945/178',
  overflow: 'hidden',
  borderRadius: theme.border.radius.large,
})
