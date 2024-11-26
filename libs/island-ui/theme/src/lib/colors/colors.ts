import { color } from './primitivesMapper'

// Primary colors
export const blue600 = color.primary.blue[600] ?? '#0044b3'
export const blue400 = color.primary.blue[400] ?? '#0061ff'
export const blue300 = color.primary.blue[300] ?? '#99c0ff'
export const blue200 = color.primary.blue[200] ?? '#ccdfff'
export const blue100 = color.primary.blue[100] ?? '#ccdfff'

export const dark400 = color.primary.dark[400] ?? '#00003c'
export const dark350 = color.primary.dark[350] ?? '#33335a'
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
export const overlay = '#f2f7ff'

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

// Background Colors
export const backgroundBrand = blue400
export const backgroundBrandLighter = blue200
export const backgroundBrandMinimal = blue100
export const backgroundBrandSecondary = purple400
export const backgroundBrandSecondaryLighter = purple200
export const backgroundBrandSecondaryMinimal = purple100
export const backgroundInvert = white

// Border Colors
export const borderInvert = white
export const borderPrimary = blue200
export const borderPrimaryContrast = blue400
export const borderSecondaryActive = purple400
export const borderSecondaryInactive = purple200

// Feedback Colors - Error
export const feedbackErrorBackground = red100
export const feedbackErrorBorder = red200
export const feedbackErrorBorderContrast = red600
export const feedbackErrorForeground = red400
export const feedbackErrorForegroundContrast = red600

// Feedback Colors - Information
export const feedbackInfoBackgroundMinimal = blue100
export const feedbackInfoBorder = blue200
export const feedbackInfoForeground = blue400
export const feedbackInfoForegroundContrast = blue600

// Feedback Colors - Success
export const feedbackSuccessBackground = mint100
export const feedbackSuccessBorder = mint200
export const feedbackSuccessForeground = mint400

// Feedback Colors - Tags
export const feedbackTagsBlueAccent = blue400
export const feedbackTagsBlueBackground = blue100
export const feedbackTagsBlueBorder = blue200

export const feedbackTagsBlueberryAccent = blueberry400
export const feedbackTagsBlueberryBackground = blueberry100
export const feedbackTagsBlueberryBorder = blueberry200

export const feedbackTagsDarkBlueAccent = blue600
export const feedbackTagsDarkBlueBackground = blue200
export const feedbackTagsDarkBlueBorder = blue200

export const feedbackTagsMintAccent = mint800
export const feedbackTagsMintBackground = mint200
export const feedbackTagsMintBorder = mint200

export const feedbackTagsPurpleAccent = purple400
export const feedbackTagsPurpleBackground = purple100
export const feedbackTagsPurpleBorder = purple200

export const feedbackTagsRedAccent = red600
export const feedbackTagsRedBackground = red100
export const feedbackTagsRedBorder = red200

export const feedbackTagsRoseAccent = roseTinted400
export const feedbackTagsRoseBackground = roseTinted100
export const feedbackTagsRoseAccentBorder = roseTinted200

export const feedbackTagsYellowAccent = dark400
export const feedbackTagsYellowBackground = yellow300
export const feedbackTagsYellowBorder = yellow600
export const feedbackTagsYellowHover = yellow400

// Feedback Colors - Warning
export const feedbackWarningBackground = yellow200
export const feedbackWarningBorder = yellow400
export const feedbackWarningForeground = yellow600

// Foreground Colors
export const foregroundBrand = blue400
export const foregroundBrandContrast = blue600
export const foregroundBrandSecondary = purple400
export const foregroundBrandSecondaryContrast = purple600
export const foregroundInvert = white
export const foregroundModal = dark400
export const foregroundPrimary = dark400
export const foregroundPrimaryMinimal = dark300

// Interactive Colors - Background
export const interactiveBackgroundBrandSecondaryActive = purple200
export const interactiveBackgroundBrandSecondaryMinimal = purple100
export const interactiveBackgroundDestructive = red600
export const interactiveBackgroundDestructiveActive = roseTinted400
export const interactiveBackgroundDestructiveDisabled = red300
export const interactiveBackgroundFocus = mint400
export const interactiveBackgroundInvert = white
export const interactiveBackgroundNeutral = dark300
export const interactiveBackgroundNeutralActive = dark350
export const interactiveBackgroundPrimary = blue400
export const interactiveBackgroundPrimaryActive = blueberry400
export const interactiveBackgroundPrimaryDisabled = blue300
export const interactiveBackgroundPrimaryMinimal = blue100
export const interactiveBackgroundPrimaryMinimalActive = blue200
export const interactiveBackgroundTooltip = dark400

// Interactive Colors - Border
export const interactiveBorderActive = dark400
export const interactiveBorderDisabled = blue300
export const interactiveBorderPrimary = blue400
export const interactiveBorderPrimaryMinimal = blue200
export const interactiveBorderSecondary = purple400
export const interactiveBorderSecondaryMinimal = purple200
export const interactiveBorderDestructiveActive = roseTinted400
export const interactiveBorderDestructiveDefault = red600
export const interactiveBorderDestructiveDisabled = red300
export const interactiveBorderFocus = mint400
export const interactiveBorderInvert = white
export const interactiveBorderInvertActive = blueberry100

// Interactive Colors - Foreground
export const interactiveForegroundBrandSecondary = purple400
export const interactiveForegroundBrandSecondaryContrast = purple600
export const interactiveForegroundDefault = dark400
export const interactiveForegroundDestructive = red600
export const interactiveForegroundDestructiveActive = roseTinted400
export const interactiveForegroundDestructiveDisabled = red300
export const interactiveForegroundDisabled = dark300
export const interactiveForegroundInvert = white
export const interactiveForegroundInvertActive = blueberry100
export const interactiveForegroundPrimary = blue400
export const interactiveForegroundPrimaryActive = blueberry400
export const interactiveForegroundPrimaryContrast = blue600
export const interactiveForegroundPrimaryDisabled = blue300
export const interactiveForegroundRed = red400
export const interactiveForegroundRedMinimalActive = red200

// Overlay Colors
export const overlayDefault = overlay
