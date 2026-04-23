import {
  typographyDesktopTokens,
  typographyMobileTokens,
} from '../tokens/tokens'

export const fontWeight = {
  light: 300,
  regular: 400,
  medium: 500,
  semiBold: 600,
}

const { heading, paragraph, other, table } = typographyDesktopTokens
const {
  heading: headingMobile,
  paragraph: paragraphMobile,
  other: otherMobile,
  table: tableMobile,
} = typographyMobileTokens

export const typographyValues = {
  desktop: {
    headings: {
      h1: {
        fontWeight: fontWeight.semiBold,
        fontSize: heading.h1.fontsize,
        lineHeight: heading.h1.lineheight.toString() + 'px',
      },
      h2: {
        fontWeight: fontWeight.semiBold,
        fontSize: heading.h2.fontsize,
        lineHeight: heading.h2.lineheight.toString() + 'px',
      },
      h3: {
        fontWeight: fontWeight.semiBold,
        fontSize: heading.h3.fontsize,
        lineHeight: heading.h3.lineheight.toString() + 'px',
      },
      h4: {
        fontWeight: fontWeight.semiBold,
        fontSize: heading.h4.fontsize,
        lineHeight: heading.h4.lineheight.toString() + 'px',
      },
      h5: {
        fontWeight: fontWeight.semiBold,
        fontSize: heading.h5.fontsize,
        lineHeight: heading.h5.lineheight.toString() + 'px',
      },
    },
    paragraph: {
      default: {
        fontWeight: fontWeight.light,
        fontSize: paragraph.default.fontsize,
        lineHeight: paragraph.default.lineheight.toString() + 'px',
      },
      small: {
        fontWeight: fontWeight.regular,
        fontSize: paragraph.small.fontsize,
        lineHeight: paragraph.small.lineheight.toString() + 'px',
      },
      mediumRegular: {
        fontWeight: fontWeight.regular,
        fontSize: paragraph.mediumRegular.fontsize,
        lineHeight: paragraph.mediumLight.lineheight.toString() + 'px',
      },
      mediumLight: {
        fontWeight: fontWeight.light,
        fontSize: paragraph.mediumLight.fontsize,
        lineHeight: paragraph.mediumLight.lineheight.toString() + 'px',
      },
      large: {
        fontWeight: fontWeight.light,
        fontSize: paragraph.large.fontsize,
        lineHeight: paragraph.large.lineheight.toString() + 'px',
      },
    },
    eyebrow: {
      fontWeight: fontWeight.semiBold,
      fontSize: other.eyebrows.fontsize,
      lineHeight: other.eyebrows.lineheight.toString() + 'px',
    },
    table: {
      header: {
        fontWeight: fontWeight.semiBold,
        fontSize: table.head.fontsize,
        lineHeight: table.head.lineheight.toString() + 'px',
      },
      headerSmall: {
        fontWeight: fontWeight.semiBold,
        fontSize: table.headSmall.fontsize,
        lineHeight: table.headSmall.lineheight.toString() + 'px',
      },
      body: {
        fontWeight: fontWeight.regular,
        fontSize: table.body.fontsize,
        lineHeight: table.body.lineheight.toString() + 'px',
      },
      bodyLarge: {
        fontWeight: fontWeight.regular,
        fontSize: table.bodyLarge.fontsize,
        lineHeight: table.bodyLarge.lineheight.toString() + 'px',
      },
      bodySmall: {
        fontWeight: fontWeight.regular,
        fontSize: table.bodySmall.fontsize,
        lineHeight: table.bodySmall.lineheight.toString() + 'px',
      },
      foot: {
        fontWeight: fontWeight.semiBold,
        fontSize: table.foot.fontsize,
        lineHeight: table.foot.lineheight.toString() + 'px',
      },
      footSmall: {
        fontWeight: fontWeight.semiBold,
        fontSize: table.footSmall.fontsize,
        lineHeight: table.footSmall.lineheight.toString() + 'px',
      },
    },
  },
  mobile: {
    headings: {
      h1: {
        fontWeight: fontWeight.semiBold,
        fontSize: headingMobile.h1.fontsize,
        lineHeight: headingMobile.h1.lineheight.toString() + 'px',
      },
      h2: {
        fontWeight: fontWeight.semiBold,
        fontSize: headingMobile.h2.fontsize,
        lineHeight: headingMobile.h2.lineheight.toString() + 'px',
      },
      h3: {
        fontWeight: fontWeight.semiBold,
        fontSize: headingMobile.h3.fontsize,
        lineHeight: headingMobile.h3.lineheight.toString() + 'px',
      },
      h4: {
        fontWeight: fontWeight.semiBold,
        fontSize: headingMobile.h4.fontsize,
        lineHeight: headingMobile.h4.lineheight.toString() + 'px',
      },
      h5: {
        fontWeight: fontWeight.semiBold,
        fontSize: headingMobile.h5.fontsize,
        lineHeight: headingMobile.h5.lineheight.toString() + 'px',
      },
    },
    paragraph: {
      default: {
        fontWeight: fontWeight.light,
        fontSize: paragraphMobile.default.fontsize,
        lineHeight: paragraphMobile.default.lineheight.toString() + 'px',
      },
      small: {
        fontWeight: fontWeight.regular,
        fontSize: paragraphMobile.small.fontsize,
        lineHeight: paragraphMobile.small.lineheight.toString() + 'px',
      },
      mediumRegular: {
        fontWeight: fontWeight.regular,
        fontSize: paragraphMobile.mediumRegular.fontsize,
        lineHeight: paragraphMobile.mediumLight.lineheight.toString() + 'px',
      },
      mediumLight: {
        fontWeight: fontWeight.light,
        fontSize: paragraphMobile.mediumLight.fontsize,
        lineHeight: paragraphMobile.mediumLight.lineheight.toString() + 'px',
      },
      large: {
        fontWeight: fontWeight.light,
        fontSize: paragraphMobile.large.fontsize,
        lineHeight: paragraphMobile.large.lineheight.toString() + 'px',
      },
    },
    eyebrow: {
      fontWeight: fontWeight.semiBold,
      fontSize: otherMobile.eyebrows.fontsize,
      lineHeight: otherMobile.eyebrows.lineheight.toString() + 'px',
    },
    table: {
      header: {
        fontWeight: fontWeight.semiBold,
        fontSize: tableMobile.head.fontsize,
        lineHeight: tableMobile.head.lineheight.toString() + 'px',
      },
      headerSmall: {
        fontWeight: fontWeight.semiBold,
        fontSize: tableMobile.headSmall.fontsize,
        lineHeight: tableMobile.headSmall.lineheight.toString() + 'px',
      },
      body: {
        fontWeight: fontWeight.regular,
        fontSize: tableMobile.body.fontsize,
        lineHeight: tableMobile.body.lineheight.toString() + 'px',
      },
      bodyLarge: {
        fontWeight: fontWeight.regular,
        fontSize: tableMobile.bodyLarge.fontsize,
        lineHeight: tableMobile.bodyLarge.lineheight.toString() + 'px',
      },
      bodySmall: {
        fontWeight: fontWeight.regular,
        fontSize: tableMobile.bodySmall.fontsize,
        lineHeight: tableMobile.bodySmall.lineheight.toString() + 'px',
      },
      foot: {
        fontWeight: fontWeight.semiBold,
        fontSize: tableMobile.foot.fontsize,
        lineHeight: tableMobile.foot.lineheight.toString() + 'px',
      },
      footSmall: {
        fontWeight: fontWeight.semiBold,
        fontSize: tableMobile.footSmall.fontsize,
        lineHeight: tableMobile.footSmall.lineheight.toString() + 'px',
      },
    },
  },
}
