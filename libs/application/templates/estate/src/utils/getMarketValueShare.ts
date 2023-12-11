import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { formatCurrency } from '@island.is/application/ui-components'

export const getMarketValueShare = (answers: FormValue) => {
  const assets = getValueViaPath(answers, 'estate.assets')
  
  if (Array.isArray(assets) && assets.length > 0) {
    const sum = assets.reduce((acc, cur) => {
      const marketValue = parseInt(cur?.marketValue ?? 0, 10)
      const share = parseInt(cur?.share ?? 0, 10)

      if (share === 0) {
        return acc
      }

      acc += marketValue * (share / 100)

      return acc
    }, 0)
    
    return formatCurrency(String(sum))
  }

  return ''
}
