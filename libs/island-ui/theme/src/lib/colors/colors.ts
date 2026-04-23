import { figmaColorsTokens } from '../tokens/figmaColors'
import { figmaPrimitives } from '../tokens/figmaPrimitives'

const {
  primary: { blue, dark, red },
  secondary: { blueberry, purple, rose },
  accent: { mint, yellow },
} = figmaPrimitives.modes.mode1.color

// Primary colors
export const blue600 = blue[600] ?? '#0044b3'
export const blue400 = blue[400] ?? '#0061ff'
export const blue300 = blue[300] ?? '#99c0ff'
export const blue200 = blue[200] ?? '#ccdfff'
export const blue100 = blue[100] ?? '#ccdfff'

export const dark400 = dark[400] ?? '#00003c'
export const dark350 = dark[350] ?? '#33335a'
export const dark300 = dark[300] ?? '#9999b1'
export const dark200 = dark[200] ?? '#ccccd8'
export const dark100 = dark[100] ?? '#f2f2f5'

export const red600 = red[600] ?? '#b30038'
export const red400 = red[400] ?? '#ff0050'
export const red300 = red[300] ?? '#ff99b9'
export const red200 = red[200] ?? '#ffccdc'
export const red100 = red[100] ?? '#fff2f6'

export const white = '#ffffff'
export const black = '#000000'
export const overlay = '#f2f7ff'

// Secondary colors
export const blueberry600 = blueberry[600] ?? '#24268e'
export const blueberry400 = blueberry[400] ?? '#4649d0'
export const blueberry300 = blueberry[300] ?? '#b5b6ec'
export const blueberry200 = blueberry[200] ?? '#dadbf6'
export const blueberry100 = blueberry[100] ?? '#f6f6fd'

export const purple600 = purple[600] ?? '#421c63'
export const purple400 = purple[400] ?? '#6a2ea0'
export const purple300 = purple[300] ?? '#c3abd9'
export const purple200 = purple[200] ?? '#e1d5ec'
export const purple100 = purple[100] ?? '#f8f5fa'

export const roseTinted600 = rose[600] ?? '#4d003a'
export const roseTinted400 = rose[400] ?? '#9a0074'
export const roseTinted300 = rose[300] ?? '#d799c7'
export const roseTinted200 = rose[200] ?? '#ebcce3'
export const roseTinted100 = rose[100] ?? '#faf2f8'

// Accent colors
export const mint800 = mint[800] ?? '#005B52'
export const mint600 = mint[600] ?? '#00b39e'
export const mint400 = mint[400] ?? '#00e4ca'
export const mint300 = mint[300] ?? '#99f4ea'
export const mint200 = mint[200] ?? '#ccfaf4'
export const mint100 = mint[100] ?? '#f2fefc'

export const yellow600 = yellow[600] ?? '#e6cf00'
export const yellow400 = yellow[400] ?? '#fff066'
export const yellow300 = yellow[300] ?? '#fff9c2'
export const yellow200 = yellow[200] ?? '#fffce0'
export const yellow100 = yellow[100] ?? '#fffef7'

export const transparent = 'transparent'
export const currentColor = 'currentColor'

/* ----- Mapping colors to match the design tokens ----- */

// Background Colors
export const backgroundBrand =
  figmaColorsTokens.modes.lightMode.background.brand
export const backgroundBrandLighter =
  figmaColorsTokens.modes.lightMode.background.brandlighter
export const backgroundBrandMinimal =
  figmaColorsTokens.modes.lightMode.background.brandminimal
export const backgroundBrandSecondary =
  figmaColorsTokens.modes.lightMode.background.brandsecondary
export const backgroundBrandSecondaryLighter =
  figmaColorsTokens.modes.lightMode.background.brandsecondarylighter
export const backgroundBrandSecondaryMinimal =
  figmaColorsTokens.modes.lightMode.background.brandsecondaryminimal
export const backgroundInvert =
  figmaColorsTokens.modes.lightMode.background.invert

// Border Colors
export const borderInvert = figmaColorsTokens.modes.lightMode.border.invert
export const borderPrimary = figmaColorsTokens.modes.lightMode.border.primary
export const borderPrimaryContrast =
  figmaColorsTokens.modes.lightMode.border.primarycontrast
export const borderSecondaryActive =
  figmaColorsTokens.modes.lightMode.border.secondaryactive
export const borderSecondaryInactive =
  figmaColorsTokens.modes.lightMode.border.secondaryinactive
// Feedback Colors - Error
export const feedbackErrorBackground =
  figmaColorsTokens.modes.lightMode.feedback.error.background
export const feedbackErrorBorder =
  figmaColorsTokens.modes.lightMode.feedback.error.border
export const feedbackErrorBorderContrast =
  figmaColorsTokens.modes.lightMode.feedback.error.bordercontrast
export const feedbackErrorForeground =
  figmaColorsTokens.modes.lightMode.feedback.error.foreground
export const feedbackErrorForegroundContrast =
  figmaColorsTokens.modes.lightMode.feedback.error.foregroundcontrast

// Feedback Colors - Information
export const feedbackInfoBackgroundMinimal =
  figmaColorsTokens.modes.lightMode.feedback.information.backgroundminimal
export const feedbackInfoBorder =
  figmaColorsTokens.modes.lightMode.feedback.information.border
export const feedbackInfoForeground =
  figmaColorsTokens.modes.lightMode.feedback.information.foreground
export const feedbackInfoForegroundContrast =
  figmaColorsTokens.modes.lightMode.feedback.information.foregroundcontrast

// Feedback Colors - Success
export const feedbackSuccessBackground =
  figmaColorsTokens.modes.lightMode.feedback.success.background
export const feedbackSuccessBorder =
  figmaColorsTokens.modes.lightMode.feedback.success.border
export const feedbackSuccessForeground =
  figmaColorsTokens.modes.lightMode.feedback.success.foreground

// Feedback Colors - Tags
export const feedbackTagsBlueAccent =
  figmaColorsTokens.modes.lightMode.feedback.tags.blueaccent
export const feedbackTagsBlueBackground =
  figmaColorsTokens.modes.lightMode.feedback.tags.bluebackground
export const feedbackTagsBlueBorder =
  figmaColorsTokens.modes.lightMode.feedback.tags.blueborder

export const feedbackTagsBlueberryAccent =
  figmaColorsTokens.modes.lightMode.feedback.tags.blueberryaccent
export const feedbackTagsBlueberryBackground =
  figmaColorsTokens.modes.lightMode.feedback.tags.blueberrybackground
export const feedbackTagsBlueberryBorder =
  figmaColorsTokens.modes.lightMode.feedback.tags.blueberryborder

export const feedbackTagsDarkBlueAccent =
  figmaColorsTokens.modes.lightMode.feedback.tags.blueaccent
export const feedbackTagsDarkBlueBackground =
  figmaColorsTokens.modes.lightMode.feedback.tags.darkerBluebackground
export const feedbackTagsDarkBlueBorder =
  figmaColorsTokens.modes.lightMode.feedback.tags.darkerBlueborder

export const feedbackTagsMintAccent =
  figmaColorsTokens.modes.lightMode.feedback.tags.mintaccent
export const feedbackTagsMintBackground =
  figmaColorsTokens.modes.lightMode.feedback.tags.mintbackground
export const feedbackTagsMintBorder =
  figmaColorsTokens.modes.lightMode.feedback.tags.mintborder

export const feedbackTagsPurpleAccent =
  figmaColorsTokens.modes.lightMode.feedback.tags.purpleaccent
export const feedbackTagsPurpleBackground =
  figmaColorsTokens.modes.lightMode.feedback.tags.purplebackground
export const feedbackTagsPurpleBorder =
  figmaColorsTokens.modes.lightMode.feedback.tags.purpleborder

export const feedbackTagsRedAccent =
  figmaColorsTokens.modes.lightMode.feedback.tags.redaccent
export const feedbackTagsRedBackground =
  figmaColorsTokens.modes.lightMode.feedback.tags.redbackground
export const feedbackTagsRedBorder =
  figmaColorsTokens.modes.lightMode.feedback.tags.redborder

export const feedbackTagsRoseAccent =
  figmaColorsTokens.modes.lightMode.feedback.tags.roseaccent
export const feedbackTagsRoseBackground =
  figmaColorsTokens.modes.lightMode.feedback.tags.rosebackground
export const feedbackTagsRoseAccentBorder =
  figmaColorsTokens.modes.lightMode.feedback.tags.roseaccentborder

export const feedbackTagsYellowAccent =
  figmaColorsTokens.modes.lightMode.feedback.tags.yellowaccent
export const feedbackTagsYellowBackground =
  figmaColorsTokens.modes.lightMode.feedback.tags.yellowbackground
export const feedbackTagsYellowBorder =
  figmaColorsTokens.modes.lightMode.feedback.tags.yellowborder
export const feedbackTagsYellowHover =
  figmaColorsTokens.modes.lightMode.feedback.tags.yellowhover

// Feedback Colors - Warning
export const feedbackWarningBackground =
  figmaColorsTokens.modes.lightMode.feedback.warning.background
export const feedbackWarningBorder =
  figmaColorsTokens.modes.lightMode.feedback.warning.border
export const feedbackWarningForeground =
  figmaColorsTokens.modes.lightMode.feedback.warning.foreground

// Foreground Colors
export const foregroundBrand =
  figmaColorsTokens.modes.lightMode.foreground.brand
export const foregroundBrandContrast =
  figmaColorsTokens.modes.lightMode.foreground.brandcontrast
export const foregroundBrandSecondary =
  figmaColorsTokens.modes.lightMode.foreground.brandsecondary
export const foregroundBrandSecondaryContrast =
  figmaColorsTokens.modes.lightMode.foreground.brandsecondarycontrast
export const foregroundInvert =
  figmaColorsTokens.modes.lightMode.foreground.invert
export const foregroundModal =
  figmaColorsTokens.modes.lightMode.foreground.modal
export const foregroundPrimary =
  figmaColorsTokens.modes.lightMode.foreground.primary
export const foregroundPrimaryMinimal =
  figmaColorsTokens.modes.lightMode.foreground.primaryminimal

// Interactive Colors - Background
export const interactiveBackgroundBrandSecondaryActive =
  figmaColorsTokens.modes.lightMode.interactive.background.brandsecondaryactive
export const interactiveBackgroundBrandSecondaryMinimal =
  figmaColorsTokens.modes.lightMode.interactive.background.brandsecondaryminimal
export const interactiveBackgroundDestructive =
  figmaColorsTokens.modes.lightMode.interactive.background.destructive
export const interactiveBackgroundDestructiveActive =
  figmaColorsTokens.modes.lightMode.interactive.background.destructiveactive
export const interactiveBackgroundDestructiveDisabled =
  figmaColorsTokens.modes.lightMode.interactive.background.destructivedisabled
export const interactiveBackgroundFocus =
  figmaColorsTokens.modes.lightMode.interactive.background.focus
export const interactiveBackgroundInvert =
  figmaColorsTokens.modes.lightMode.interactive.background.invert
export const interactiveBackgroundNeutral =
  figmaColorsTokens.modes.lightMode.interactive.background.neutral
export const interactiveBackgroundNeutralActive =
  figmaColorsTokens.modes.lightMode.interactive.background.neutralactive
export const interactiveBackgroundPrimary =
  figmaColorsTokens.modes.lightMode.interactive.background.primary
export const interactiveBackgroundPrimaryActive =
  figmaColorsTokens.modes.lightMode.interactive.background.primaryactive
export const interactiveBackgroundPrimaryDisabled =
  figmaColorsTokens.modes.lightMode.interactive.background.primarydisabled
export const interactiveBackgroundPrimaryMinimal =
  figmaColorsTokens.modes.lightMode.interactive.background.primaryminimal
export const interactiveBackgroundPrimaryMinimalActive =
  figmaColorsTokens.modes.lightMode.interactive.background.primaryminimalactive
export const interactiveBackgroundTooltip =
  figmaColorsTokens.modes.lightMode.interactive.background.tooltip

// Interactive Colors - Border
export const interactiveBorderActive =
  figmaColorsTokens.modes.lightMode.interactive.border.active
export const interactiveBorderDisabled =
  figmaColorsTokens.modes.lightMode.interactive.border.borderdisabled
export const interactiveBorderPrimary =
  figmaColorsTokens.modes.lightMode.interactive.border.borderprimary
export const interactiveBorderPrimaryMinimal =
  figmaColorsTokens.modes.lightMode.interactive.border.borderprimaryminimal
export const interactiveBorderSecondary =
  figmaColorsTokens.modes.lightMode.interactive.border.bordersecondaryminimal
export const interactiveBorderSecondaryMinimal =
  figmaColorsTokens.modes.lightMode.interactive.border.bordersecondaryminimal
export const interactiveBorderDestructiveActive =
  figmaColorsTokens.modes.lightMode.interactive.border.destructiveactive
export const interactiveBorderDestructiveDefault =
  figmaColorsTokens.modes.lightMode.interactive.border.destructivedefault
export const interactiveBorderDestructiveDisabled =
  figmaColorsTokens.modes.lightMode.interactive.border.destructivedisabled
export const interactiveBorderFocus =
  figmaColorsTokens.modes.lightMode.interactive.border.focus
export const interactiveBorderInvert =
  figmaColorsTokens.modes.lightMode.interactive.border.invert
export const interactiveBorderInvertActive =
  figmaColorsTokens.modes.lightMode.interactive.border.invertactive

// Interactive Colors - Foreground
export const interactiveForegroundBrandSecondary =
  figmaColorsTokens.modes.lightMode.interactive.foreground.brandsecondary
export const interactiveForegroundBrandSecondaryContrast =
  figmaColorsTokens.modes.lightMode.interactive.foreground
    .brandsecondarycontrast
export const interactiveForegroundDefault =
  figmaColorsTokens.modes.lightMode.interactive.foreground.default
export const interactiveForegroundDestructive =
  figmaColorsTokens.modes.lightMode.interactive.foreground.destructive
export const interactiveForegroundDestructiveActive =
  figmaColorsTokens.modes.lightMode.interactive.foreground.destructiveactive
export const interactiveForegroundDestructiveDisabled =
  figmaColorsTokens.modes.lightMode.interactive.foreground.destructivedisabled
export const interactiveForegroundDisabled =
  figmaColorsTokens.modes.lightMode.interactive.foreground.disabled
export const interactiveForegroundInvert =
  figmaColorsTokens.modes.lightMode.interactive.foreground.invert
export const interactiveForegroundInvertActive =
  figmaColorsTokens.modes.lightMode.interactive.foreground.invertactive
export const interactiveForegroundPrimary =
  figmaColorsTokens.modes.lightMode.interactive.foreground.primary
export const interactiveForegroundPrimaryActive =
  figmaColorsTokens.modes.lightMode.interactive.foreground.primaryactive
export const interactiveForegroundPrimaryContrast =
  figmaColorsTokens.modes.lightMode.interactive.foreground.primarycontrast
export const interactiveForegroundPrimaryDisabled =
  figmaColorsTokens.modes.lightMode.interactive.foreground.primarydisabled
export const interactiveForegroundRed =
  figmaColorsTokens.modes.lightMode.interactive.foreground.red
export const interactiveForegroundRedMinimalActive =
  figmaColorsTokens.modes.lightMode.interactive.foreground.redminimalactive

// Overlay Colors
export const overlayDefault = figmaColorsTokens.modes.lightMode.overlay.default
