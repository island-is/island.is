import '../theme.d'

export const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl'] as const
type Breakpoint = typeof breakpoints[number]

export interface Theme {
  breakpoint: Record<Breakpoint, number>
  contentWidth: {
    medium: number
    large: number
  }
  grid: number
  touchableSize: number
  space: {
    gutter: number
    smallGutter: number
    containerGutter: number
    0: 0
    1: 1
    2: 2
    3: 3
    4: 4
    5: 5
    6: 6
    7: 7
    8: 8
    9: 9
    10: 10
    12: 12
    15: 15
    25: 25
  }
  transforms: {
    touchable: string
  }
  transitions: {
    fast: string
    touchable: string
  }
  border: {
    radius: {
      standard: string
      circle: string
    }
    width: {
      standard: number
      large: number
    }
    color: {
      standard: string
      focus: string
    }
  }
  shadows: {
    small: string
    medium: string
    large: string
  }
  color: {
    body: string
    background: string
    white: string
    blue600: string
    blue400: string
    blue300: string
    blue200: string
    blue100: string
    dark400: string
    dark300: string
    dark200: string
    dark100: string
    red600: string
    red400: string
    red300: string
    red200: string
    red100: string
    blueberry600: string
    blueberry400: string
    blueberry300: string
    blueberry200: string
    blueberry100: string
    purple600: string
    purple400: string
    purple300: string
    purple200: string
    purple100: string
    rosetinted600: string
    rosetinted400: string
    rosetinted300: string
    rosetinted200: string
    rosetinted100: string
    mint600: string
    mint400: string
    mint200: string
    mint300: string
    mint100: string
    yellow600: string
    yellow400: string
    yellow200: string
    yellow300: string
    yellow100: string
  }
}
