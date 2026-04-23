import { figmaPrimitives } from './figmaPrimitives'
export const figmaColorsTokens = {
  modes: {
    lightMode: {
      background: {
        invert: figmaPrimitives.modes.mode1.color.primary.white[400],
        brand: figmaPrimitives.modes.mode1.color.primary.blue[400],
        brandlighter: figmaPrimitives.modes.mode1.color.primary.blue[200],
        brandminimal: figmaPrimitives.modes.mode1.color.primary.blue[100],
        brandsecondary: figmaPrimitives.modes.mode1.color.secondary.purple[400],
        brandsecondarylighter:
          figmaPrimitives.modes.mode1.color.secondary.purple[200],
        brandsecondaryminimal:
          figmaPrimitives.modes.mode1.color.secondary.purple[100],
      },
      foreground: {
        primary: figmaPrimitives.modes.mode1.color.primary.dark[400],
        primaryminimal: figmaPrimitives.modes.mode1.color.primary.dark[300],
        brandsecondarycontrast:
          figmaPrimitives.modes.mode1.color.secondary.purple[600],
        brandsecondary: figmaPrimitives.modes.mode1.color.secondary.purple[400],
        brand: figmaPrimitives.modes.mode1.color.primary.blue[400],
        brandcontrast: figmaPrimitives.modes.mode1.color.primary.blue[600],
        invert: figmaPrimitives.modes.mode1.color.primary.white[400],
        modal: figmaPrimitives.modes.mode1.color.primary.dark[400],
      },
      border: {
        primary: figmaPrimitives.modes.mode1.color.primary.blue[200],
        primarycontrast: figmaPrimitives.modes.mode1.color.primary.blue[400],
        invert: figmaPrimitives.modes.mode1.color.primary.white[400],
        secondaryactive:
          figmaPrimitives.modes.mode1.color.secondary.purple[400],
        secondaryinactive:
          figmaPrimitives.modes.mode1.color.secondary.purple[200],
      },
      interactive: {
        background: {
          primary: figmaPrimitives.modes.mode1.color.primary.blue[400],
          primaryminimal: figmaPrimitives.modes.mode1.color.primary.blue[100],
          primaryminimalactive:
            figmaPrimitives.modes.mode1.color.primary.blue[200],
          primarydisabled: figmaPrimitives.modes.mode1.color.primary.blue[300],
          primaryactive:
            figmaPrimitives.modes.mode1.color.secondary.blueberry[400],
          neutral: figmaPrimitives.modes.mode1.color.primary.dark[300],
          neutralactive: figmaPrimitives.modes.mode1.color.primary.dark[350],
          focus: figmaPrimitives.modes.mode1.color.accent.mint[400],
          invert: figmaPrimitives.modes.mode1.color.primary.white[400],
          destructive: figmaPrimitives.modes.mode1.color.primary.red[600],
          destructiveactive:
            figmaPrimitives.modes.mode1.color.secondary.rose[400],
          destructivedisabled:
            figmaPrimitives.modes.mode1.color.primary.red[300],
          tooltip: figmaPrimitives.modes.mode1.color.primary.dark[400],
          brandsecondaryactive:
            figmaPrimitives.modes.mode1.color.secondary.purple[200],
          brandsecondaryminimal:
            figmaPrimitives.modes.mode1.color.secondary.purple[100],
        },
        foreground: {
          primary: figmaPrimitives.modes.mode1.color.primary.blue[400],
          primarycontrast: figmaPrimitives.modes.mode1.color.primary.blue[600],
          primaryactive:
            figmaPrimitives.modes.mode1.color.secondary.blueberry[400],
          primarydisabled: figmaPrimitives.modes.mode1.color.primary.blue[300],
          brandsecondary:
            figmaPrimitives.modes.mode1.color.secondary.purple[400],
          brandsecondarycontrast:
            figmaPrimitives.modes.mode1.color.secondary.purple[600],
          default: figmaPrimitives.modes.mode1.color.primary.dark[400],
          disabled: figmaPrimitives.modes.mode1.color.primary.dark[300],
          invert: figmaPrimitives.modes.mode1.color.primary.white[400],
          invertactive:
            figmaPrimitives.modes.mode1.color.secondary.blueberry[100],
          red: figmaPrimitives.modes.mode1.color.primary.red[400],
          redminimalactive: figmaPrimitives.modes.mode1.color.primary.red[200],
          destructive: figmaPrimitives.modes.mode1.color.primary.red[600],
          destructiveactive:
            figmaPrimitives.modes.mode1.color.secondary.rose[400],
          destructivedisabled:
            figmaPrimitives.modes.mode1.color.primary.red[300],
        },
        border: {
          borderprimary: figmaPrimitives.modes.mode1.color.primary.blue[400],
          borderactive:
            figmaPrimitives.modes.mode1.color.secondary.blueberry[400],
          borderdisabled: figmaPrimitives.modes.mode1.color.primary.blue[300],
          borderprimaryminimal:
            figmaPrimitives.modes.mode1.color.primary.blue[200],
          bordersecondaryminimal:
            figmaPrimitives.modes.mode1.color.secondary.purple[200],
          bordersecondary:
            figmaPrimitives.modes.mode1.color.secondary.purple[400],
          focus: figmaPrimitives.modes.mode1.color.accent.mint[400],
          active: figmaPrimitives.modes.mode1.color.primary.dark[400],
          invert: figmaPrimitives.modes.mode1.color.primary.white[400],
          invertactive:
            figmaPrimitives.modes.mode1.color.secondary.blueberry[100],
          destructivedefault:
            figmaPrimitives.modes.mode1.color.primary.red[600],
          destructiveactive:
            figmaPrimitives.modes.mode1.color.secondary.rose[400],
          destructivedisabled:
            figmaPrimitives.modes.mode1.color.primary.red[300],
        },
      },
      feedback: {
        information: {
          backgroundminimal:
            figmaPrimitives.modes.mode1.color.primary.blue[100],
          border: figmaPrimitives.modes.mode1.color.primary.blue[200],
          foreground: figmaPrimitives.modes.mode1.color.primary.blue[400],
          foregroundcontrast:
            figmaPrimitives.modes.mode1.color.primary.blue[600],
        },
        success: {
          background: figmaPrimitives.modes.mode1.color.accent.mint[100],
          foreground: figmaPrimitives.modes.mode1.color.accent.mint[400],
          border: figmaPrimitives.modes.mode1.color.accent.mint[200],
        },
        warning: {
          background: figmaPrimitives.modes.mode1.color.accent.yellow[200],
          foreground: figmaPrimitives.modes.mode1.color.accent.yellow[600],
          border: figmaPrimitives.modes.mode1.color.accent.yellow[400],
        },
        error: {
          background: figmaPrimitives.modes.mode1.color.primary.red[100],
          foreground: figmaPrimitives.modes.mode1.color.primary.red[400],
          foregroundcontrast:
            figmaPrimitives.modes.mode1.color.primary.red[600],
          border: figmaPrimitives.modes.mode1.color.primary.red[200],
          bordercontrast: figmaPrimitives.modes.mode1.color.primary.red[600],
        },
        tags: {
          bluebackground: figmaPrimitives.modes.mode1.color.primary.blue[100],
          blueaccent: figmaPrimitives.modes.mode1.color.primary.blue[400],
          blueborder: figmaPrimitives.modes.mode1.color.primary.blue[200],
          redbackground: figmaPrimitives.modes.mode1.color.primary.red[100],
          redaccent: figmaPrimitives.modes.mode1.color.primary.red[600],
          redborder: figmaPrimitives.modes.mode1.color.primary.red[200],
          purplebackground:
            figmaPrimitives.modes.mode1.color.secondary.purple[100],
          purpleaccent: figmaPrimitives.modes.mode1.color.secondary.purple[400],
          purpleborder: figmaPrimitives.modes.mode1.color.secondary.purple[200],
          rosebackground: figmaPrimitives.modes.mode1.color.secondary.rose[100],
          roseaccent: figmaPrimitives.modes.mode1.color.secondary.rose[400],
          roseaccentborder:
            figmaPrimitives.modes.mode1.color.secondary.rose[200],
          blueberrybackground:
            figmaPrimitives.modes.mode1.color.secondary.blueberry[100],
          blueberryaccent:
            figmaPrimitives.modes.mode1.color.secondary.blueberry[400],
          blueberryborder:
            figmaPrimitives.modes.mode1.color.secondary.blueberry[200],
          darkerBluebackground:
            figmaPrimitives.modes.mode1.color.primary.blue[200],
          darkerBlueaccent: figmaPrimitives.modes.mode1.color.primary.blue[600],
          darkerBlueborder: figmaPrimitives.modes.mode1.color.primary.blue[200],
          mintbackground: figmaPrimitives.modes.mode1.color.accent.mint[200],
          mintaccent: figmaPrimitives.modes.mode1.color.accent.mint[800],
          mintborder: figmaPrimitives.modes.mode1.color.accent.mint[200],
          yellowbackground:
            figmaPrimitives.modes.mode1.color.accent.yellow[300],
          yellowaccent: figmaPrimitives.modes.mode1.color.primary.dark[400],
          yellowhover: figmaPrimitives.modes.mode1.color.accent.yellow[400],
          yellowborder: figmaPrimitives.modes.mode1.color.accent.yellow[600],
        },
      },
      overlay: {
        default: figmaPrimitives.modes.mode1.color.primary.blue[100],
      },
    },
  },
}
