import { toast } from '@island.is/island-ui/core'
import { useState } from 'react'
import copyToClipboard from 'copy-to-clipboard'

const useApiKeysInfo = () => {
  const [isKeyVisable, setIsKeyVisable] = useState(false)

  const copyApiKeyToClipboard = (apiKey?: string) => {
    if (apiKey) {
      const copied = copyToClipboard(apiKey)

      if (copied) {
        toast.success('Lykill hefur verið afritaður')
      } else {
        toast.error('Ekki tókst að afrita lykil')
      }
    } else {
      toast.error('Vantar lykill')
    }
  }

  return {
    isKeyVisable,
    setIsKeyVisable,
    copyApiKeyToClipboard,
  }
}

export default useApiKeysInfo
