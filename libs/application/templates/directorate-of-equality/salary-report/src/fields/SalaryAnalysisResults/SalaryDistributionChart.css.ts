import { globalStyle, style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

/**
 * Marker class on the chart's `ResponsiveContainer`, so the rules below can
 * reach the svg recharts renders inside it without leaking to every chart in
 * the application system.
 */
export const chartFocus = style({})

/**
 * Kills the focus ring a click draws inside the plot.
 *
 * Recharts 3 turns its accessibility layer on by default and scatters
 * focusable elements through the chart: `RootSurface` puts `tabIndex={0}` and
 * `role="application"` on the `<svg>` so the points can be walked with the
 * arrow keys, and `ZIndexSvgPortal` puts `tabIndex={-1}` on the `<g>` wrappers
 * it portals layers into. Chrome focuses either on a plain click and outlines
 * it — the svg gives a border around the whole chart, a portal `<g>` gives one
 * around the bounding box of the points. Both read as a rendering bug.
 *
 * So the reset is aimed at every focused descendant rather than at one element:
 * chasing them individually just moves the border somewhere else.
 *
 * This has to be CSS at all because the `style` prop cannot reach the svg:
 * `RootSurface` spreads the chart's attributes onto `<Surface>` and *then*
 * overrides `style` with its own full-width-and-height object, so a
 * `style={{ outline: 'none' }}` on `<ScatterChart>` is silently discarded. One
 * was there before this and never had any effect.
 *
 * `globalStyle` rather than a `selectors` block on `chartFocus`: the targets
 * are descendants recharts owns, and vanilla-extract only allows `selectors`
 * whose subject is `&` itself.
 */
globalStyle(`${chartFocus} :focus`, {
  outline: 'none',
})

/**
 * Keyboard focus stays visible.
 *
 * Scoped as widely as the reset above on purpose. Only the `<svg>` is a tab
 * stop today — recharts gives everything else `tabIndex={-1}` — so matching
 * `.recharts-surface` alone would behave identically right now. But
 * `chartFocus` sits on the ResponsiveContainer, which also wraps the legend and
 * the tooltip, so the first focusable control added in either would inherit the
 * reset and ship with no focus indicator at all. Pairing the two rules at the
 * same breadth means that cannot happen quietly.
 *
 * Widening it also levelled the specificity — both selectors are now (0,2,0),
 * where the narrower `.recharts-surface` form outranked the reset. So this rule
 * wins on source order alone and MUST stay below the reset. vanilla-extract
 * emits `globalStyle` calls in file order, which is what keeps that true.
 */
globalStyle(`${chartFocus} :focus-visible`, {
  outline: `3px solid ${theme.color.blue400}`,
  outlineOffset: 2,
})
