import {
  blue100,
  blue200,
  blue300,
  blue400,
  blue600,
  blueberry100,
  blueberry200,
  blueberry300,
  blueberry400,
  blueberry600,
  dark100,
  dark200,
  dark300,
  dark400,
  darkActive,
  darkBerryBg,
  darkBorder,
  darkCanvas,
  darkDisabled,
  darkHeader,
  darkMintBg,
  darkPurpleBg,
  darkRedBg,
  darkRoseBg,
  darkRoseLighter,
  darkScrim,
  darkSelection,
  darkShadowCard,
  darkSurface,
  darkTinted,
  darkYellowBg,
  mint100,
  mint200,
  mint300,
  mint400,
  mint600,
  mint800,
  purple100,
  purple200,
  purple300,
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
      // code-only: navigation header surface. White in light, matching the
      // old explicit headerStyle; Figma gives dark mode its own colour
      // (color/app/dark/header).
      header: white,
      // code-only: grey surface behind grouped content
      neutral: dark100,
      // code-only: pressed search field
      neutralActive: dark200,
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

// Dark mode. Values marked confirmed were read from the dark frames in Figma.
// Everything else is derived: `name` means a Figma dark surface matches the
// token's role, `family` means a hue rule taken from a confirmed sibling,
// `inferred` means reasoned from the light value's role, and `GUESS` means
// it needs design review.
const dark: Tokens = {
  background: {
    invert: darkSurface, // screens: base surface measured as #151F31
    brand: blue300, // family: blue 400->300
    brandLighter: darkTinted, // inferred
    brandMinimal: darkCanvas, // screens: recessed list rows measured as #0C1424
    brandSecondary: purple300,
    brandSecondaryLighter: darkPurpleBg, // inferred
    brandSecondaryMinimal: darkPurpleBg, // GUESS: only one purple dark surface exists, so Lighter and Minimal collapse
  },
  foreground: {
    primary: dark100,
    primaryMinimal: dark200, // screens: measured: muted text is lighter than dark300, which is too dark to match
    brand: blue300,
    brandContrast: blue200, // inferred: contrast variant goes one step lighter than brand
    brandSecondary: purple300,
    invert: dark400, // family: white->dark400 pole swap
  },
  border: {
    primary: darkBorder, // inferred
    primaryContrast: blue300, // family
    invert: dark400, // family
  },
  feedback: {
    information: {
      backgroundMinimal: darkTinted, // name
      border: blue300, // GUESS: warning and success borders use the hue's vivid tone, not darkBorder
      foreground: blue300, // family
    },
    success: {
      background: darkMintBg, // screens
      border: mint400, // screens: the success alert border is #00E4CA
      foreground: mint300, // screens: the success alert icon is #99F4EA
    },
    warning: {
      background: darkYellowBg, // screens: alert fill measured as #3B3519
      border: yellow600,
      foreground: yellow600, // screens: the alert icon is #E6CF00, same as the border
    },
    error: {
      background: darkRedBg, // name
      border: red300, // GUESS: warning and success borders use the hue's vivid tone, not darkBorder
      borderContrast: red300, // family: red->300, from interactive-foreground-red
      foreground: red300, // family
      foregroundContrast: red300, // family
    },
    tags: {
      blue: {
        background: darkTinted, // name
        accent: blue300, // family
        border: darkBorder, // inferred
      },
      darkerBlue: {
        background: darkSelection, // GUESS: needs to differ from the blue tag
        accent: blue200, // GUESS
        border: darkBorder, // inferred
      },
      red: {
        background: darkRedBg, // name
        accent: red300, // family
        border: darkBorder, // inferred
      },
      purple: {
        background: darkPurpleBg, // name
        accent: purple300, // family
        border: darkBorder, // inferred
      },
      rose: {
        background: darkRoseBg, // screens: tag fill measured as #35243B
        accent: roseTinted200,
        border: darkBorder, // inferred
      },
      blueberry: {
        background: darkBerryBg, // name
        accent: blueberry300, // GUESS: blueberry family rule unconfirmed
        border: darkBorder, // inferred
      },
      mint: {
        background: darkMintBg, // name
        accent: mint300, // GUESS: mint family rule unconfirmed
        border: darkBorder, // inferred
      },
      yellow: {
        background: darkYellowBg, // name
        accent: dark100, // family: dark400->dark100 pole swap
        border: yellow600, // inferred: matches the confirmed warning border
      },
    },
  },
  interactive: {
    background: {
      primary: blue300,
      primaryActive: blueberry300, // GUESS: blueberry family rule unconfirmed
      primaryDisabled: darkDisabled, // name
      primaryMinimal: darkTinted, // inferred
      primaryMinimalActive: darkActive, // name
      focus: mint400, // inferred: focus ring stays vivid on both themes
      invert: darkSurface, // inferred
      destructive: red300, // family
      destructiveActive: roseTinted200, // family: rose 400->200
      destructiveDisabled: darkDisabled, // name
    },
    foreground: {
      primary: blue300, // family
      primaryActive: blueberry300, // GUESS
      primaryContrast: blue200, // inferred
      primaryDisabled: darkDisabled, // name
      default: dark100, // family: matches foreground.primary
      disabled: darkDisabled, // name
      invert: dark400,
      invertActive: blueberry600, // GUESS: pressed state of an inverted control
      destructive: red300,
      destructiveActive: roseTinted200, // family
      destructiveDisabled: darkDisabled, // name
    },
    border: {
      borderPrimary: blue300, // family
      borderPrimaryMinimal: darkBorder, // inferred
      borderActive: blueberry300, // GUESS
      borderDisabled: darkDisabled, // name
      active: dark100, // family
      focus: mint400, // inferred
      invert: dark400, // family
      invertActive: blueberry600, // GUESS
      destructiveDefault: red300, // family
      destructiveActive: roseTinted200, // family
      destructiveDisabled: darkDisabled, // name
    },
  },
  app: {
    background: {
      pressed: darkActive, // name
      header: darkHeader, // name: Figma color/app/dark/header
      neutral: darkTinted, // screens: Posthol search field measured as #192A43
      neutralActive: darkActive, // name
    },
    fill: {
      errorLighter: darkRedBg, // name
      roseLighter: darkRoseLighter, // name: Figma calls it fill/rose-lighter
    },
    foreground: {
      successContrast: mint300, // GUESS
    },
    border: {
      neutral: darkBorder, // screens: dividers measured as #30415E
      subtle: darkBorder, // inferred: only one dark border exists
      muted: darkBorder, // inferred: only one dark border exists
    },
    tags: {
      white: {
        background: darkSurface, // inferred
        accent: blue300, // family
        border: darkBorder, // inferred
      },
      dark: {
        background: darkSelection, // inferred
        accent: dark100, // family
        border: darkBorder, // inferred
      },
      disabled: {
        background: darkTinted, // inferred
        accent: darkDisabled, // name
        border: darkBorder, // inferred
      },
      warn: {
        background: darkYellowBg, // name
        accent: dark100, // family
        border: yellow600, // inferred
      },
    },
    overlay: {
      scrim: darkScrim, // name: Figma calls it overlay/scrim
    },
    shadow: {
      brand: darkShadowCard, // GUESS: colored glow has no dark counterpart
      card: darkShadowCard, // name: Figma calls it shadow/card
    },
  },
}

export const tokenModes: { light: Tokens; dark: Tokens } = {
  light,
  dark,
}

export const tokens = tokenModes.light
