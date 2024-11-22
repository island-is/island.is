import { colorPrimitives } from './figmaStyles'

const color = {
  primary: {
    blue: {
      100: colorPrimitives.primary.blue['100'].$value,
      200: colorPrimitives.primary.blue['200'].$value,
      300: colorPrimitives.primary.blue['300'].$value,
      400: colorPrimitives.primary.blue['400'].$value,
      600: colorPrimitives.primary.blue['600'].$value,
    },
    dark: {
      100: colorPrimitives.primary.dark['100'].$value,
      200: colorPrimitives.primary.dark['200'].$value,
      300: colorPrimitives.primary.dark['300'].$value,
      400: colorPrimitives.primary.dark['400'].$value,
    },
    red: {
      100: colorPrimitives.primary.red['100'].$value,
      200: colorPrimitives.primary.red['200'].$value,
      300: colorPrimitives.primary.red['300'].$value,
      400: colorPrimitives.primary.red['400'].$value,
      600: colorPrimitives.primary.red['600'].$value,
    },
    white: {
      400: colorPrimitives.primary.white['400'].$value,
    },
  },
  secondary: {
    blueberry: {
      100: colorPrimitives.secondary.blueberry['100'].$value,
      200: colorPrimitives.secondary.blueberry['200'].$value,
      300: colorPrimitives.secondary.blueberry['300'].$value,
      400: colorPrimitives.secondary.blueberry['400'].$value,
      600: colorPrimitives.secondary.blueberry['600'].$value,
    },
    purple: {
      100: colorPrimitives.secondary.purple['100'].$value,
      200: colorPrimitives.secondary.purple['200'].$value,
      300: colorPrimitives.secondary.purple['300'].$value,
      400: colorPrimitives.secondary.purple['400'].$value,
      600: colorPrimitives.secondary.purple['600'].$value,
    },
    rose: {
      100: colorPrimitives.secondary.rose['100'].$value,
      200: colorPrimitives.secondary.rose['200'].$value,
      300: colorPrimitives.secondary.rose['300'].$value,
      400: colorPrimitives.secondary.rose['400'].$value,
      600: colorPrimitives.secondary.rose['600'].$value,
    },
  },
  accent: {
    mint: {
      100: colorPrimitives.accent.mint['100'].$value,
      200: colorPrimitives.accent.mint['200'].$value,
      300: colorPrimitives.accent.mint['300'].$value,
      400: colorPrimitives.accent.mint['400'].$value,
      600: colorPrimitives.accent.mint['600'].$value,
      800: colorPrimitives.accent.mint['800'].$value,
    },
    yellow: {
      100: colorPrimitives.accent.yellow['100'].$value,
      200: colorPrimitives.accent.yellow['200'].$value,
      300: colorPrimitives.accent.yellow['300'].$value,
      400: colorPrimitives.accent.yellow['400'].$value,
      600: colorPrimitives.accent.yellow['600'].$value,
    },
  },
}

// Primary colors
export const blue600 = color.primary.blue[600] ?? '#0044b3'
export const blue400 = color.primary.blue[400] ?? '#0061ff'
export const blue300 = color.primary.blue[300] ?? '#99c0ff'
export const blue200 = color.primary.blue[200] ?? '#ccdfff'
export const blue100 = color.primary.blue[100] ?? '#ccdfff'

export const dark400 = color.primary.dark[400] ?? '#00003c'
export const dark300 = color.primary.dark[300] ?? '#9999b1'
export const dark200 = color.primary.dark[200] ?? '#ccccd8'
export const dark100 = color.primary.dark[100] ?? '#f2f2f5'

export const red600 = color.primary.red[600] ?? '#b30038'
export const red400 = color.primary.red[400] ?? '#ff0050'
export const red300 = color.primary.red[300] ?? '#ff99b9'
export const red200 = color.primary.red[200] ?? '#ffccdc'
export const red100 = color.primary.red[100] ?? '#fff2f6'

export const white = color.primary.white[400] ?? '#ffffff'
export const black = '#000000'

// Secondary colors
export const blueberry600 = color.secondary.blueberry[600] ?? '#24268e'
export const blueberry400 = color.secondary.blueberry[400] ?? '#4649d0'
export const blueberry300 = color.secondary.blueberry[300] ?? '#b5b6ec'
export const blueberry200 = color.secondary.blueberry[200] ?? '#dadbf6'
export const blueberry100 = color.secondary.blueberry[100] ?? '#f6f6fd'

export const purple600 = color.secondary.purple[600] ?? '#421c63'
export const purple400 = color.secondary.purple[400] ?? '#6a2ea0'
export const purple300 = color.secondary.purple[300] ?? '#c3abd9'
export const purple200 = color.secondary.purple[200] ?? '#e1d5ec'
export const purple100 = color.secondary.purple[100] ?? '#f8f5fa'

export const roseTinted600 = color.secondary.rose[600] ?? '#4d003a'
export const roseTinted400 = color.secondary.rose[400] ?? '#9a0074'
export const roseTinted300 = color.secondary.rose[300] ?? '#d799c7'
export const roseTinted200 = color.secondary.rose[200] ?? '#ebcce3'
export const roseTinted100 = color.secondary.rose[100] ?? '#faf2f8'

// Accent colors
export const mint800 = color.accent.mint[800] ?? '#005B52'
export const mint600 = color.accent.mint[600] ?? '#00b39e'
export const mint400 = color.accent.mint[400] ?? '#00e4ca'
export const mint300 = color.accent.mint[300] ?? '#99f4ea'
export const mint200 = color.accent.mint[200] ?? '#ccfaf4'
export const mint100 = color.accent.mint[100] ?? '#f2fefc'

export const yellow600 = color.accent.yellow[600] ?? '#e6cf00'
export const yellow400 = color.accent.yellow[400] ?? '#fff066'
export const yellow300 = color.accent.yellow[300] ?? '#fff9c2'
export const yellow200 = color.accent.yellow[200] ?? '#fffce0'
export const yellow100 = color.accent.yellow[100] ?? '#fffef7'

export const transparent = 'transparent'
export const currentColor = 'currentColor'
