import { figmaPrimitives } from './figmaPrimitives'
export const figmaTypographyTokens = {
  modes: {
    desktop: {
      device: {
        size: 1440,
      },
      heading: {
        h1: {
          fontName: figmaPrimitives.modes.mode1.font.family.primary,
          fontweight: figmaPrimitives.modes.mode1.font.weight.semibold,
          fontsize: 42,
          lineheight: 52,
        },
        h2: {
          fontName: figmaPrimitives.modes.mode1.font.family.primary,
          fontweight: figmaPrimitives.modes.mode1.font.weight.semibold,
          fontsize: 34,
          lineheight: 44,
        },
        h3: {
          fontName: figmaPrimitives.modes.mode1.font.family.primary,
          fontweight: figmaPrimitives.modes.mode1.font.weight.semibold,
          fontsize: 24,
          lineheight: 34,
        },
        h4: {
          fontName: figmaPrimitives.modes.mode1.font.family.primary,
          fontweight: figmaPrimitives.modes.mode1.font.weight.semibold,
          fontsize: 20,
          lineheight: 30,
        },
        h5: {
          fontName: figmaPrimitives.modes.mode1.font.family.primary,
          fontweight: figmaPrimitives.modes.mode1.font.weight.semibold,
          fontsize: 18,
          lineheight: 28,
        },
      },
      paragraph: {
        default: {
          fontName: figmaPrimitives.modes.mode1.font.family.primary,
          fontweight: figmaPrimitives.modes.mode1.font.weight.light,
          fontsize: 18,
          lineheight: 28,
        },
        large: {
          fontName: figmaPrimitives.modes.mode1.font.family.primary,
          fontweight: figmaPrimitives.modes.mode1.font.weight.light,
          fontsize: 24,
          lineheight: 34,
        },
        mediumRegular: {
          fontName: figmaPrimitives.modes.mode1.font.family.primary,
          fontweight: figmaPrimitives.modes.mode1.font.weight.regular,
          fontsize: 16,
          lineheight: 26,
        },
        mediumLight: {
          fontName: figmaPrimitives.modes.mode1.font.family.primary,
          fontweight: figmaPrimitives.modes.mode1.font.weight.light,
          fontsize: 16,
          lineheight: 26,
        },
        small: {
          fontName: figmaPrimitives.modes.mode1.font.family.primary,
          fontweight: figmaPrimitives.modes.mode1.font.weight.regular,
          fontsize: 14,
          lineheight: 24,
        },
      },
      other: {
        eyebrows: {
          fontName: figmaPrimitives.modes.mode1.font.family.primary,
          fontweight: figmaPrimitives.modes.mode1.font.weight.semibold,
          fontsize: 14,
          lineheight: 16,
        },
      },
      table: {
        head: {
          fontName: figmaPrimitives.modes.mode1.font.family.primary,
          fontweight: figmaPrimitives.modes.mode1.font.weight.semibold,
          fontsize: 16,
          lineheight: 20,
        },
        headSmall: {
          fontName: figmaPrimitives.modes.mode1.font.family.primary,
          fontweight: figmaPrimitives.modes.mode1.font.weight.semibold,
          fontsize: 14,
          lineheight: 18,
        },
        body: {
          fontName: figmaPrimitives.modes.mode1.font.family.primary,
          fontweight: figmaPrimitives.modes.mode1.font.weight.regular,
          fontsize: 16,
          lineheight: 20,
        },
        bodyLarge: {
          fontName: figmaPrimitives.modes.mode1.font.family.primary,
          fontweight: figmaPrimitives.modes.mode1.font.weight.regular,
          fontsize: 18,
          lineheight: 24,
        },
        bodySmall: {
          fontName: figmaPrimitives.modes.mode1.font.family.primary,
          fontweight: figmaPrimitives.modes.mode1.font.weight.regular,
          fontsize: 14,
          lineheight: 18,
        },
        foot: {
          fontName: figmaPrimitives.modes.mode1.font.family.primary,
          fontweight: figmaPrimitives.modes.mode1.font.weight.semibold,
          fontsize: 16,
          lineheight: 20,
        },
        footSmall: {
          fontName: figmaPrimitives.modes.mode1.font.family.primary,
          fontweight: figmaPrimitives.modes.mode1.font.weight.semibold,
          fontsize: 14,
          lineheight: 18,
        },
      },
    },
    mobile: {
      device: {
        size: 375,
      },
      heading: {
        h1: {
          fontName: figmaPrimitives.modes.mode1.font.family.primary,
          fontweight: figmaPrimitives.modes.mode1.font.weight.semibold,
          fontsize: 32,
          lineheight: 38,
        },
        h2: {
          fontName: figmaPrimitives.modes.mode1.font.family.primary,
          fontweight: figmaPrimitives.modes.mode1.font.weight.semibold,
          fontsize: 26,
          lineheight: 32,
        },
        h3: {
          fontName: figmaPrimitives.modes.mode1.font.family.primary,
          fontweight: figmaPrimitives.modes.mode1.font.weight.semibold,
          fontsize: 20,
          lineheight: 26,
        },
        h4: {
          fontName: figmaPrimitives.modes.mode1.font.family.primary,
          fontweight: figmaPrimitives.modes.mode1.font.weight.semibold,
          fontsize: 18,
          lineheight: 24,
        },
        h5: {
          fontName: figmaPrimitives.modes.mode1.font.family.primary,
          fontweight: figmaPrimitives.modes.mode1.font.weight.semibold,
          fontsize: 16,
          lineheight: 20,
        },
      },
      paragraph: {
        default: {
          fontName: figmaPrimitives.modes.mode1.font.family.primary,
          fontweight: figmaPrimitives.modes.mode1.font.weight.light,
          fontsize: 16,
          lineheight: 24,
        },
        large: {
          fontName: figmaPrimitives.modes.mode1.font.family.primary,
          fontweight: figmaPrimitives.modes.mode1.font.weight.light,
          fontsize: 20,
          lineheight: 28,
        },
        mediumRegular: {
          fontName: figmaPrimitives.modes.mode1.font.family.primary,
          fontweight: figmaPrimitives.modes.mode1.font.weight.regular,
          fontsize: 14,
          lineheight: 20,
        },
        mediumLight: {
          fontName: figmaPrimitives.modes.mode1.font.family.primary,
          fontweight: figmaPrimitives.modes.mode1.font.weight.light,
          fontsize: 14,
          lineheight: 20,
        },
        small: {
          fontName: figmaPrimitives.modes.mode1.font.family.primary,
          fontweight: figmaPrimitives.modes.mode1.font.weight.regular,
          fontsize: 12,
          lineheight: 16,
        },
      },
      other: {
        eyebrows: {
          fontName: figmaPrimitives.modes.mode1.font.family.primary,
          fontweight: figmaPrimitives.modes.mode1.font.weight.semibold,
          fontsize: 12,
          lineheight: 16,
        },
      },
      table: {
        head: {
          fontName: figmaPrimitives.modes.mode1.font.family.primary,
          fontweight: figmaPrimitives.modes.mode1.font.weight.semibold,
          fontsize: 14,
          lineheight: 18,
        },
        headSmall: {
          fontName: figmaPrimitives.modes.mode1.font.family.primary,
          fontweight: figmaPrimitives.modes.mode1.font.weight.semibold,
          fontsize: 14,
          lineheight: 18,
        },
        body: {
          fontName: figmaPrimitives.modes.mode1.font.family.primary,
          fontweight: figmaPrimitives.modes.mode1.font.weight.regular,
          fontsize: 14,
          lineheight: 18,
        },
        bodyLarge: {
          fontName: figmaPrimitives.modes.mode1.font.family.primary,
          fontweight: figmaPrimitives.modes.mode1.font.weight.regular,
          fontsize: 16,
          lineheight: 20,
        },
        bodySmall: {
          fontName: figmaPrimitives.modes.mode1.font.family.primary,
          fontweight: figmaPrimitives.modes.mode1.font.weight.regular,
          fontsize: 14,
          lineheight: 18,
        },
        foot: {
          fontName: figmaPrimitives.modes.mode1.font.family.primary,
          fontweight: figmaPrimitives.modes.mode1.font.weight.semibold,
          fontsize: 14,
          lineheight: 18,
        },
        footSmall: {
          fontName: figmaPrimitives.modes.mode1.font.family.primary,
          fontweight: figmaPrimitives.modes.mode1.font.weight.semibold,
          fontsize: 14,
          lineheight: 18,
        },
      },
    },
  },
}
