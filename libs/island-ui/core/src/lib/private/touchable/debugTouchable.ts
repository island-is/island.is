import { Style } from 'treat'

import { SelectorMap } from '../../../utils/theme'

// type SelectorMap = Style['selectors']

export const debugTouchable = ({ after = false } = {}): SelectorMap =>
  process.env.NODE_ENV === 'production'
    ? {}
    : {
        [`[data-braid-debug] &${after ? ':after' : ''}`]: {
          background: 'red',
          opacity: 0.2,
        },
      }
