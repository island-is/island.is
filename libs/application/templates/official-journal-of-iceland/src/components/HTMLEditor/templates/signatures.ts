import { HTMLText } from '@island.is/regulations-tools/types'
import { RegularSignatureState } from '../../../lib/types'

export const regularSignatureTemplate = (
  signatureGroups: RegularSignatureState,
): HTMLText => {
  const results = signatureGroups
    .map((signatureGroup) => {
      const className =
        signatureGroup.members.length === 1
          ? 'signatures single'
          : signatureGroup.members.length === 2
          ? 'signatures double'
          : 'signatures'

      return `
      <div class="signature__group">
          <p class="signature__title">${signatureGroup.institution}${
        signatureGroup.institution && signatureGroup.date ? ', ' : ''
      }${signatureGroup.date}</p>
          <div class="${className}">
            ${signatureGroup.members
              .map((signature) => {
                return `
                        <div class="signature">
                          <p class="signature__textAbove">${signature.textAbove}</p>
                          <div class="signature__nameWrapper">
                            <p class="signature__name">${signature.name}
                              <span class="signature__textAfter">${signature.textAfter}</span>
                            </p>
                            <p class="signature__textBelow">${signature.textBelow}</p>
                          </div>
                        </div>
                      `
              })
              .join('')}
          </div>
        </div>`
    })

    .join('')

  return results as HTMLText
}

export const committeeSignatureTemplate = {}
