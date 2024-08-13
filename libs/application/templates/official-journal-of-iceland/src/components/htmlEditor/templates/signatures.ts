import { HTMLText } from '@island.is/regulations-tools/types'

import is from 'date-fns/locale/is'
import en from 'date-fns/locale/en-US'
import format from 'date-fns/format'

const signatureTemplate = (
  name?: string,
  after?: string,
  above?: string,
  below?: string,
) => {
  if (!name) return ''
  return `
  <div class="signature">
    ${above ? `<p class="signature__above">${above}</p>` : ''}
    <div class="signature__nameWrapper">
      <p class="signature__name">${name}
        ${after ? `<span class="signature__after">${after}</span>` : ''}
      </p>
      ${below ? `<p class="signature__below">${below}</p>` : ''}
    </div>
  </div>
  `
}
