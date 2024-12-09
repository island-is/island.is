import {
  typographyDesktopTokens,
  typographyMobileTokens,
} from '../tokens/tokens'

export const fontWeight = {
  light: 300,
  regular: 400,
  semiBold: 600,
}

export const typographyValues = {
  desktop: {
    headings: {
      h1: {
        fontWeight: fontWeight.semiBold,
        fontSize: typographyDesktopTokens.Heading.H1['font-size'].$value,
        lineHeight: typographyDesktopTokens.Heading.H1['line-height'].$value,
      },
      h2: {
        fontWeight: fontWeight.semiBold,
        fontSize: typographyDesktopTokens.Heading.H2['font-size'].$value,
        lineHeight: typographyDesktopTokens.Heading.H2['line-height'].$value,
      },
      h3: {
        fontWeight: fontWeight.semiBold,
        fontSize: typographyDesktopTokens.Heading.H3['font-size'].$value,
        lineHeight: typographyDesktopTokens.Heading.H3['line-height'].$value,
      },
      h4: {
        fontWeight: fontWeight.semiBold,
        fontSize: typographyDesktopTokens.Heading.H4['font-size'].$value,
        lineHeight: typographyDesktopTokens.Heading.H4['line-height'].$value,
      },
      h5: {
        fontWeight: fontWeight.semiBold,
        fontSize: typographyDesktopTokens.Heading.H5['font-size'].$value,
        lineHeight: typographyDesktopTokens.Heading.H5['line-height'].$value,
      },
    },
    paragraph: {
      default: {
        fontWeight: fontWeight.light,
        fontSize: typographyDesktopTokens.Paragraph.Default['font-size'].$value,
        lineHeight:
          typographyDesktopTokens.Paragraph.Default['line-height'].$value,
      },
      small: {
        fontWeight: fontWeight.regular,
        fontSize: typographyDesktopTokens.Paragraph.Small['font-size'].$value,
        lineHeight:
          typographyDesktopTokens.Paragraph.Small['line-height'].$value,
      },
      mediumRegular: {
        fontWeight: fontWeight.regular,
        fontSize:
          typographyDesktopTokens.Paragraph['Medium Regular']['font-size']
            .$value,
        lineHeight:
          typographyDesktopTokens.Paragraph['Medium Regular']['line-height']
            .$value,
      },
      mediumLight: {
        fontWeight: fontWeight.light,
        fontSize:
          typographyDesktopTokens.Paragraph['Medium Light']['font-size'].$value,
        lineHeight:
          typographyDesktopTokens.Paragraph['Medium Light']['line-height']
            .$value,
      },
      large: {
        fontWeight: fontWeight.light,
        fontSize: typographyDesktopTokens.Paragraph.Large['font-size'].$value,
        lineHeight:
          typographyDesktopTokens.Paragraph.Large['line-height'].$value,
      },
    },
    eyebrow: {
      fontWeight: fontWeight.semiBold,
      fontSize: typographyDesktopTokens.Other.Eyebrows['font-size'].$value,
      lineHeight: typographyDesktopTokens.Other.Eyebrows['line-height'].$value,
    },
    table: {
      header: {
        fontWeight: fontWeight.semiBold,
        fontSize: typographyDesktopTokens.Table.Head['font-size'].$value,
        lineHeight: typographyDesktopTokens.Table.Head['line-height'].$value,
      },
      headerSmall: {
        fontWeight: fontWeight.semiBold,
        fontSize:
          typographyDesktopTokens.Table['Head Small']['font-size'].$value,
        lineHeight:
          typographyDesktopTokens.Table['Head Small']['line-height'].$value,
      },
      body: {
        fontWeight: fontWeight.regular,
        fontSize: typographyDesktopTokens.Table.Body['font-size'].$value,
        lineHeight: typographyDesktopTokens.Table.Body['line-height'].$value,
      },
      bodyLarge: {
        fontWeight: fontWeight.regular,
        fontSize:
          typographyDesktopTokens.Table['Body Large']['font-size'].$value,
        lineHeight:
          typographyDesktopTokens.Table['Body Large']['line-height'].$value,
      },
      bodySmall: {
        fontWeight: fontWeight.regular,
        fontSize:
          typographyDesktopTokens.Table['Body Small']['font-size'].$value,
        lineHeight:
          typographyDesktopTokens.Table['Body Small']['line-height'].$value,
      },
      foot: {
        fontWeight: fontWeight.semiBold,
        fontSize: typographyDesktopTokens.Table['Foot']['font-size'].$value,
        lineHeight: typographyDesktopTokens.Table['Foot']['line-height'].$value,
      },
      footSmall: {
        fontWeight: fontWeight.semiBold,
        fontSize:
          typographyDesktopTokens.Table['Foot Small']['font-size'].$value,
        lineHeight:
          typographyDesktopTokens.Table['Foot Small']['line-height'].$value,
      },
    },
  },
  mobile: {
    headings: {
      h1: {
        fontWeight: fontWeight.semiBold,
        fontSize: typographyMobileTokens.Heading.H1['font-size'].$value,
        lineHeight: typographyMobileTokens.Heading.H1['line-height'].$value,
      },
      h2: {
        fontWeight: fontWeight.semiBold,
        fontSize: typographyMobileTokens.Heading.H2['font-size'].$value,
        lineHeight: typographyMobileTokens.Heading.H2['line-height'].$value,
      },
      h3: {
        fontWeight: fontWeight.semiBold,
        fontSize: typographyMobileTokens.Heading.H3['font-size'].$value,
        lineHeight: typographyMobileTokens.Heading.H3['line-height'].$value,
      },
      h4: {
        fontWeight: fontWeight.semiBold,
        fontSize: typographyMobileTokens.Heading.H4['font-size'].$value,
        lineHeight: typographyMobileTokens.Heading.H4['line-height'].$value,
      },
      h5: {
        fontWeight: fontWeight.semiBold,
        fontSize: typographyMobileTokens.Heading.H5['font-size'].$value,
        lineHeight: typographyMobileTokens.Heading.H5['line-height'].$value,
      },
    },
    paragraph: {
      default: {
        fontWeight: fontWeight.light,
        fontSize: typographyMobileTokens.Paragraph.Default['font-size'].$value,
        lineHeight:
          typographyMobileTokens.Paragraph.Default['line-height'].$value,
      },
      small: {
        fontWeight: fontWeight.regular,
        fontSize: typographyMobileTokens.Paragraph.Small['font-size'].$value,
        lineHeight:
          typographyMobileTokens.Paragraph.Small['line-height'].$value,
      },
      mediumRegular: {
        fontWeight: fontWeight.regular,
        fontSize:
          typographyMobileTokens.Paragraph['Medium Regular']['font-size']
            .$value,
        lineHeight:
          typographyMobileTokens.Paragraph['Medium Regular']['line-height']
            .$value,
      },
      mediumLight: {
        fontWeight: fontWeight.light,
        fontSize:
          typographyMobileTokens.Paragraph['Medium Light']['font-size'].$value,
        lineHeight:
          typographyMobileTokens.Paragraph['Medium Light']['line-height']
            .$value,
      },
      large: {
        fontWeight: fontWeight.light,
        fontSize: typographyMobileTokens.Paragraph.Large['font-size'].$value,
        lineHeight:
          typographyMobileTokens.Paragraph.Large['line-height'].$value,
      },
    },
    eyebrow: {
      fontWeight: fontWeight.semiBold,
      fontSize: typographyMobileTokens.Other.Eyebrows['font-size'].$value,
      lineHeight: typographyMobileTokens.Other.Eyebrows['line-height'].$value,
    },
    table: {
      header: {
        fontWeight: fontWeight.semiBold,
        fontSize: typographyMobileTokens.Table.Head['font-size'].$value,
        lineHeight: typographyMobileTokens.Table.Head['line-height'].$value,
      },
      headerSmall: {
        fontWeight: fontWeight.semiBold,
        fontSize:
          typographyMobileTokens.Table['Head Small']['font-size'].$value,
        lineHeight:
          typographyMobileTokens.Table['Head Small']['line-height'].$value,
      },
      body: {
        fontWeight: fontWeight.regular,
        fontSize: typographyMobileTokens.Table.Body['font-size'].$value,
        lineHeight: typographyMobileTokens.Table.Body['line-height'].$value,
      },
      bodyLarge: {
        fontWeight: fontWeight.regular,
        fontSize:
          typographyMobileTokens.Table['Body Large']['font-size'].$value,
        lineHeight:
          typographyMobileTokens.Table['Body Large']['line-height'].$value,
      },
      bodySmall: {
        fontWeight: fontWeight.regular,
        fontSize:
          typographyMobileTokens.Table['Body Small']['font-size'].$value,
        lineHeight:
          typographyMobileTokens.Table['Body Small']['line-height'].$value,
      },
      foot: {
        fontWeight: fontWeight.semiBold,
        fontSize: typographyMobileTokens.Table['Foot']['font-size'].$value,
        lineHeight: typographyMobileTokens.Table['Foot']['line-height'].$value,
      },
      footSmall: {
        fontWeight: fontWeight.semiBold,
        fontSize:
          typographyMobileTokens.Table['Foot Small']['font-size'].$value,
        lineHeight:
          typographyMobileTokens.Table['Foot Small']['line-height'].$value,
      },
    },
  },
}
