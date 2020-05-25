import isEqual from 'lodash/isEqual'
import { Style } from 'treat'
import omit from 'lodash/omit'
import { theme } from './theme/index'

type Theme = typeof theme
type RequiredTokens = Pick<Theme, 'breakpoint'>
type StyleWithoutMediaQueries = Exclude<Style['@media'], undefined>[string]

export const makeThemeUtils = (tokens: RequiredTokens) => {
  const makeMediaQuery = (breakpoint: keyof RequiredTokens['breakpoint']) => (
    styles: StyleWithoutMediaQueries,
  ) =>
    !styles || Object.keys(styles).length === 0
      ? {}
      : {
          [`screen and (min-width: ${tokens.breakpoint[breakpoint]}px)`]: styles,
        }

  const mediaQuery = {
    sm: makeMediaQuery('sm'),
    md: makeMediaQuery('md'),
    lg: makeMediaQuery('lg'),
    xl: makeMediaQuery('xl'),
  }

  interface ResponsiveStyle {
    xs?: StyleWithoutMediaQueries
    sm?: StyleWithoutMediaQueries
    md?: StyleWithoutMediaQueries
    lg?: StyleWithoutMediaQueries
    xl?: StyleWithoutMediaQueries
  }

  const responsiveStyle = ({ xs, sm, md, lg, xl }: ResponsiveStyle): Style => {
    const xsStyles = omit(xs, '@media')

    const smStyles = !sm || isEqual(sm, xsStyles) ? null : sm
    const mdStyles = !md || isEqual(md, xsStyles || smStyles) ? null : md
    const lgStyles =
      !lg || isEqual(lg, xsStyles || smStyles || mdStyles) ? null : lg
    const xlStyles =
      !xl || isEqual(xl, xsStyles || smStyles || mdStyles || lgStyles)
        ? null
        : xl

    const hasMediaQueries = smStyles || mdStyles || lgStyles || xlStyles

    return {
      ...xsStyles,
      ...(hasMediaQueries
        ? {
            '@media': {
              ...(smStyles ? mediaQuery.sm(smStyles) : {}),
              ...(mdStyles ? mediaQuery.md(mdStyles) : {}),
              ...(lgStyles ? mediaQuery.lg(lgStyles) : {}),
              ...(xlStyles ? mediaQuery.xl(xlStyles) : {}),
            },
          }
        : {}),
    }
  }

  return { responsiveStyle }
}
