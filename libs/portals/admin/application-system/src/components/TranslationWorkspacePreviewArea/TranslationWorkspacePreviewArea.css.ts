import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

/** 150px clearance below preview chrome when scrolling. */
export const previewAreaBottomMargin = style({
  marginBottom: '150px',
})

export const previewWrapper = style({
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  paddingTop: theme.spacing[6],
  gap: theme.spacing[4],
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      flexWrap: 'nowrap',
    },
  },
})

export const previewFormColumn = style({
  flex: '1 1 0%',
  maxWidth: '920px',
  minWidth: 0,
})

export const previewStepperColumn = style({
  flex: '0 0 auto',
  width: '200px',
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.md - 1}px)`]: {
      display: 'none',
    },
  },
})

/** Matches `libs/application/ui-shell/src/lib/FormShell.css.ts` `.shellContainer` min-height. */
export const previewShell = style({
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      minHeight: '700px',
    },
  },
})

export const focusedFieldHighlight = style({
  outline: `2px solid ${theme.color.blue300}`,
  outlineOffset: '2px',
  borderRadius: theme.border.radius.standard,
  transition: 'outline-color 150ms ease',
})

/** Mirrors `libs/application/ui-shell/src/components/ScreenFooter.css.ts` `.buttonContainer`. */
export const previewFooter = style({
  borderTop: `2px solid ${theme.color.purple100}`,
  borderBottomLeftRadius: theme.border.radius.large,
  borderBottomRightRadius: theme.border.radius.large,
  paddingBottom: 'calc(env(safe-area-inset-bottom) + 10px)',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      paddingBottom: theme.spacing[2],
    },
  },
})
