import { style, styleMap } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const variants = styleMap({
  purple: {},
  blue: {},
})

export const link = style({
  display: 'inline-block',
  textAlign: 'center',
  fontSize: 18,
  fontWeight: 300,
  minWidth: 40,
  height: 40,
  lineHeight: '40px',
  borderRadius: '20px',
  margin: '0 4px',
  padding: '0 8px',
  transition: 'all .1s',
  border: '1px solid transparent',
  ':hover': {
    textDecoration: 'none',
  },
  selectors: {
    [`${variants.purple} &:hover`]: {
      color: theme.color.purple400,
      backgroundColor: theme.color.purple100,
    },
    [`${variants.blue} &`]: {
      color: theme.color.blue600,
    },
    [`${variants.blue} &:hover`]: {
      color: theme.color.blue400,
      backgroundColor: theme.color.white,
    },
  },
})

export const linkCurrent = style({
  fontWeight: 600,
  selectors: {
    [`${variants.purple} &`]: {
      backgroundColor: theme.color.purple100,
      color: theme.color.purple400,
    },
    [`${variants.blue} &`]: {
      backgroundColor: theme.color.white,
      color: theme.color.blue400,
    },
  },
})

export const edge = style({
  margin: 0,
  backgroundColor: theme.color.purple100,
  ':hover': {
    transform: 'scale(1.1)',
  },
  selectors: {
    [`${variants.purple} &`]: {
      backgroundColor: theme.color.purple100,
    },
    [`${variants.blue} &`]: {
      backgroundColor: theme.color.white,
    },
  },
})

export const linkDisabled = style({
  margin: 0,
  backgroundColor: 'transparent',
  ':hover': {
    backgroundColor: 'transparent',
  },
  selectors: {
    [`${variants.purple} &`]: {
      border: `1px solid ${theme.color.purple200}`,
    },
    [`${variants.purple} &:hover`]: {
      backgroundColor: 'transparent',
    },
    [`${variants.blue} &`]: {
      border: `1px solid ${theme.color.blue200}`,
    },
    [`${variants.blue} &:hover`]: {
      backgroundColor: 'transparent',
    },
  },
})

export const gap = style({
  display: 'inline-block',
  textAlign: 'center',
  margin: '0 4px',
  minWidth: 40,
  selectors: {
    [`${variants.blue} &`]: {
      color: theme.color.blue600,
    },
  },
})
