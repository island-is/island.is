import {
  blue100,
  blue200,
  blue300,
  blue400,
  blue600,
  blueberry100,
  blueberry200,
  blueberry400,
  dark100,
  dark200,
  dark300,
  dark400,
  mint100,
  mint200,
  mint400,
  mint600,
  mint800,
  purple100,
  purple200,
  purple400,
  red100,
  red200,
  red300,
  red400,
  red600,
  roseTinted100,
  roseTinted200,
  roseTinted400,
  white,
  yellow200,
  yellow300,
  yellow400,
  yellow600,
} from './colors'

// Semantic colour tokens, mirroring the Brand Guide „01 Colors Tokens“
// collection in Figma. A Figma path a/b/c-d is `tokens.a.b.cD` here, so
// `interactive/background/primary-active` is
// `tokens.interactive.background.primaryActive`. Tag tokens are split by
// colour: `feedback/tags/blue-background` is `feedback.tags.blue.background`.
//
// Values the Brand Guide lacks live under `app`, with the same paths as the
// local „App colors“ collection in the app's Figma file, plus a few code-only
// values marked below.
const light = {
  background: {
    invert: white,
    brand: blue400,
    brandLighter: blue200,
    brandMinimal: blue100,
    brandSecondary: purple400,
    brandSecondaryLighter: purple200,
    brandSecondaryMinimal: purple100,
  },
  foreground: {
    primary: dark400,
    primaryMinimal: dark300,
    brand: blue400,
    brandContrast: blue600,
    brandSecondary: purple400,
    invert: white,
  },
  border: {
    primary: blue200,
    primaryContrast: blue400,
    invert: white,
  },
  feedback: {
    information: {
      backgroundMinimal: blue100,
      border: blue200,
      foreground: blue400,
    },
    success: {
      background: mint100,
      border: mint200,
      foreground: mint400,
    },
    warning: {
      background: yellow200,
      border: yellow400,
      foreground: yellow600,
    },
    error: {
      background: red100,
      border: red200,
      borderContrast: red600,
      foreground: red400,
      foregroundContrast: red600,
    },
    tags: {
      blue: { background: blue100, accent: blue400, border: blue200 },
      darkerBlue: { background: blue200, accent: blue600, border: blue200 },
      red: { background: red100, accent: red600, border: red200 },
      purple: { background: purple100, accent: purple400, border: purple200 },
      // Figma names this one `rose-accent-border`
      rose: {
        background: roseTinted100,
        accent: roseTinted400,
        border: roseTinted200,
      },
      blueberry: {
        background: blueberry100,
        accent: blueberry400,
        border: blueberry200,
      },
      mint: { background: mint200, accent: mint800, border: mint200 },
      yellow: { background: yellow300, accent: dark400, border: yellow600 },
    },
  },
  interactive: {
    background: {
      primary: blue400,
      primaryActive: blueberry400,
      primaryDisabled: blue300,
      primaryMinimal: blue100,
      primaryMinimalActive: blue200,
      focus: mint400,
      invert: white,
      destructive: red600,
      destructiveActive: roseTinted400,
      destructiveDisabled: red300,
    },
    foreground: {
      primary: blue400,
      primaryActive: blueberry400,
      primaryContrast: blue600,
      primaryDisabled: blue300,
      default: dark400,
      disabled: dark300,
      invert: white,
      invertActive: blueberry100,
      destructive: red600,
      destructiveActive: roseTinted400,
      destructiveDisabled: red300,
    },
    border: {
      borderPrimary: blue400,
      borderPrimaryMinimal: blue200,
      borderActive: blueberry400,
      borderDisabled: blue300,
      active: dark400,
      focus: mint400,
      invert: white,
      invertActive: blueberry100,
      destructiveDefault: red600,
      destructiveActive: roseTinted400,
      destructiveDisabled: red300,
    },
  },
  app: {
    background: {
      pressed: '#e6ebf5',
      // code-only: grey surface behind grouped content
      neutral: dark100,
    },
    fill: {
      errorLighter: red200,
      roseLighter: roseTinted200,
    },
    foreground: {
      successContrast: mint600,
    },
    border: {
      neutral: dark200,
      // code-only: navigation theme hairline
      subtle: '#ebebeb',
      // code-only: default Label border
      muted: '#e4e3e2',
    },
    // code-only: Badge schemes outside the Brand Guide tag set, same shape as
    // `feedback.tags.*`
    tags: {
      white: { background: white, accent: blue400, border: blue100 },
      dark: { background: dark200, accent: dark400, border: dark300 },
      disabled: { background: dark100, accent: dark200, border: dark200 },
      warn: { background: yellow200, accent: dark400, border: yellow300 },
    },
    // code-only
    overlay: {
      scrim: 'rgba(0, 0, 0, 0.5)',
    },
    // code-only
    shadow: {
      brand: blue400,
      card: 'rgb(0, 32, 128)',
    },
  },
}

export type Tokens = typeof light
export type TokenSelector = (tokens: Tokens) => string

// Dark mode is off in the app, so the dark slot mirrors light for now.
export const tokenModes: { light: Tokens; dark: Tokens } = {
  light,
  dark: light,
}

export const tokens = tokenModes.light
