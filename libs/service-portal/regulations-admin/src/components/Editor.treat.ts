import { EditorClasses } from '@hugsmidjan/regulations-editor/Editor'
import { style, Style } from 'treat'
import { theme } from '@island.is/island-ui/theme'
import {
  diffStyling,
  regulationEditingStyling,
} from '@island.is/regulations/styling'
const { color, typography, border } = theme

// ---------------------------------------------------------------------------

const highlightAnimation = (): Style => ({
  '@keyframes': {
    from: { transform: 'scale(1)' },
    to: { transform: 'scale(1.1)' },
  },
  animationDelay: '100ms',
  animationDuration: '200ms',
  animationTimingFunction: 'ease-in-out',
  animationDirection: 'alternate',
  animationIterationCount: 4,
})

// ---------------------------------------------------------------------------

const addLegened = (
  $legend?: string | { value: string },
  $tiny?: boolean,
  $warning?: boolean,
): Style => {
  let beforeOrAfter = ':before'
  let color = '#555'
  let backgroundColor = '#dde9cc'

  if ($warning) {
    beforeOrAfter = ':after'
    color = '#700'
    backgroundColor = '#ddcccc'
  }

  const fontSize = $tiny ? '0.5rem' : '0.67rem'

  const content = !$legend
    ? undefined
    : typeof $legend === 'string'
    ? `"${$legend}"`
    : $legend.value

  return {
    position: 'relative',

    [beforeOrAfter]: {
      position: 'absolute',
      top: '-0.17rem',
      right: '-0.33em', // <-- intentional `em`

      padding: '0 0.33em', // <-- intentional `em`

      pointerEvents: 'none',

      fontSize,
      lineHeight: 1.1,
      fontWeight: 'normal',

      color,
      backgroundColor,
      content,
    },
  }
}

const addWarning = ($legend: Parameters<typeof addLegened>[0]) =>
  addLegened($legend, false, true)

// ===========================================================================

export const classes: EditorClasses = {
  wrapper: style({
    position: 'relative',
  }),

  editingpane: style({
    display: 'flex',
    flexFlow: 'column',
  }),

  editorBooting: style({
    height: '10em',
  }),

  toolbar: style({
    // …
  }),

  editor: style({
    // …
  }),

  comparisonpane: style({
    // …
  }),

  headline: style({
    // …
  }),

  diffmodes: style({
    // …
  }),

  modeButton: style({
    // …
  }),

  result: style({
    // …
  }),

  result_diff: style({
    // …
  }),

  result_base: style({
    // …
  }),

  result_dirty: style({
    // …
  }),

  // ---------------------------------------------------------------------------

  warnings: style({
    // …
  }),

  warnings__legend: style({
    // …
  }),

  warnings__list: style({
    // …
  }),

  warnings__item: style({
    // …
  }),

  warnings__item_high: style({
    // …
  }),
  warnings__item_medium: style({
    // …
  }),
  warnings__item_low: style({
    // …
  }),

  warnings__viewToggler: style({
    // …
  }),

  warnings__instancelist: style({
    // …
  }),

  warnings__instance: style({
    // …
  }),

  warnings__instance__button: style({
    // …
  }),

  warnings__instancelist__morecount: style({
    // …
  }),
}

regulationEditingStyling(classes.editor)
regulationEditingStyling(classes.result)
diffStyling(classes.result)
