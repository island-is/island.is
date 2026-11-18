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
      // Decorative accent. Figma warns it does not have enough contrast on
      // the light success surface, so icons and text use foregroundContrast.
      foreground: mint400,
      foregroundContrast: mint800,
    },
    // Progress meters and bars
    progress: {
      background: mint200,
      foreground: mint800,
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
      brand: 'rgba(0, 97, 255, 0.12)',
      card: 'rgb(0, 32, 128)',
    },
  },
}

export type Tokens = typeof light
export type TokenSelector = (tokens: Tokens) => string

// Dark mode. Values marked confirmed were read from the dark frames in Figma.
// Everything else is derived: `name` means a Figma dark surface matches the
// token's role, `family` means a hue rule taken from a confirmed sibling,
// `inferred` means reasoned from the light value's role. `figma` means the
// value comes from the Test - Colors Tokens export.
const dark: Tokens = {
  background: {
    invert: darkSurface, // figma
    brand: darkHeader, // figma
    brandLighter: darkActive, // figma
    brandMinimal: darkCanvas, // figma
    brandSecondary: darkPurpleBg, // figma
    brandSecondaryLighter: darkSelection, // figma
    brandSecondaryMinimal: darkTinted, // figma
  },
  foreground: {
    primary: dark100, // figma
    primaryMinimal: dark200, // figma
    brand: blue300, // figma
    brandContrast: blue200, // figma
    brandSecondary: purple300, // figma
    invert: dark400, // figma
  },
  border: {
    primary: darkBorder, // figma
    primaryContrast: dark300, // figma
    invert: dark100, // figma
  },
  feedback: {
    information: {
      backgroundMinimal: darkTinted, // figma
      border: blue300, // figma
      foreground: blue300, // figma
    },
    success: {
      background: darkMintBg, // figma
      border: mint400, // figma
      foreground: mint400, // figma
      foregroundContrast: mint300, // figma
    },
    progress: {
      background: darkMintBg, // figma
      foreground: mint400, // figma
    },
    warning: {
      background: darkYellowBg, // figma
      border: yellow600, // figma
      foreground: yellow400, // figma
    },
    error: {
      background: darkRedBg, // figma
      border: red300, // figma
      borderContrast: red200, // figma
      foreground: red300, // figma
      foregroundContrast: red200, // figma
    },
    tags: {
      blue: {
        background: darkSurface, // figma
        accent: blue300, // figma
        border: blue300, // figma
      },
      darkerBlue: {
        background: darkSelection, // figma
        accent: dark100, // figma
        border: dark100, // figma
      },
      red: {
        background: darkRedBg, // figma
        accent: red300, // figma
        border: red300, // figma
      },
      purple: {
        background: darkPurpleBg, // figma
        accent: purple300, // figma
        border: purple300, // figma
      },
      rose: {
        background: darkRoseBg, // figma
        accent: roseTinted200, // figma
        border: darkBorder, // no figma equivalent
      },
      blueberry: {
        background: darkBerryBg, // figma
        accent: blueberry200, // figma
        border: blueberry200, // figma
      },
      mint: {
        background: darkMintBg, // figma
        accent: mint400, // figma
        border: mint400, // figma
      },
      yellow: {
        background: darkYellowBg, // figma
        accent: yellow400, // figma
        border: yellow400, // figma
      },
    },
  },
  interactive: {
    background: {
      primary: blue300, // figma
      primaryActive: blueberry300, // figma
      primaryDisabled: darkSurface, // figma
      primaryMinimal: darkTinted, // figma
      primaryMinimalActive: darkSelection, // figma
      focus: mint400, // figma
      invert: darkSurface, // figma
      destructive: red300, // figma
      destructiveActive: red200, // figma
      destructiveDisabled: darkRedBg, // figma
    },
    foreground: {
      primary: blue300, // figma
      primaryActive: blueberry200, // figma
      primaryContrast: blue200, // figma
      primaryDisabled: darkDisabled, // figma
      default: dark200, // figma
      disabled: darkDisabled, // figma
      invert: dark400, // figma
      invertActive: dark400, // figma
      destructive: red300, // figma
      destructiveActive: red200, // figma
      destructiveDisabled: darkDisabled, // figma
    },
    border: {
      borderPrimary: blue300, // figma
      borderPrimaryMinimal: dark300, // figma
      borderActive: blue200, // figma
      borderDisabled: darkBorder, // figma
      active: blue300, // figma
      focus: mint400, // figma
      invert: dark100, // figma
      invertActive: blue200, // figma
      destructiveDefault: red300, // figma
      destructiveActive: red200, // figma
      destructiveDisabled: darkBorder, // figma
    },
  },
  app: {
    background: {
      pressed: darkActive, // no figma equivalent
      header: darkHeader, // no figma equivalent
      neutral: darkTinted, // no figma equivalent
      neutralActive: darkActive, // no figma equivalent
    },
    fill: {
      errorLighter: darkRedBg, // no figma equivalent
      roseLighter: darkRoseLighter, // no figma equivalent
    },
    foreground: {
      successContrast: mint300, // no figma equivalent
    },
    border: {
      neutral: darkBorder, // no figma equivalent
      subtle: darkBorder, // no figma equivalent
      muted: darkBorder, // no figma equivalent
    },
    tags: {
      white: {
        background: darkSurface, // no figma equivalent
        accent: blue300, // no figma equivalent
        border: darkBorder, // no figma equivalent
      },
      dark: {
        background: darkSelection, // no figma equivalent
        accent: dark100, // no figma equivalent
        border: darkBorder, // no figma equivalent
      },
      disabled: {
        background: darkTinted, // no figma equivalent
        accent: darkDisabled, // no figma equivalent
        border: darkBorder, // no figma equivalent
      },
      warn: {
        background: darkYellowBg, // no figma equivalent
        accent: dark100, // no figma equivalent
        border: yellow600, // no figma equivalent
      },
    },
    overlay: {
      scrim: darkScrim, // no figma equivalent
    },
    shadow: {
      brand: 'rgba(153, 192, 255, 0.2)', // figma
      card: darkShadowCard, // no figma equivalent
    },
  },
}

export const tokenModes: { light: Tokens; dark: Tokens } = {
  light,
  dark,
}

export const tokens = tokenModes.light
