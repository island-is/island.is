import { theme } from './theme'

export const escapeGrid = (gutter?: number) => {
  if (gutter) {
    return {
      marginLeft: -gutter * 2,
      marginRight: -gutter * 2,
    }
  }

  // If gutter is not defined, we fallback to escape mobile gutter
  return {
    marginLeft: -theme.grid.gutter.mobile * 2,
    marginRight: -theme.grid.gutter.mobile * 2,
  }
}
