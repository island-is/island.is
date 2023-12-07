import { useContext } from 'react'
import words from '@island.is/financial-aid-web/veita/src/utils/words'
import { AdminContext } from '@island.is/financial-aid-web/veita/src/components/AdminProvider/AdminProvider'

const wordsLength = words.length - 1

const randomNumberFromSeed = (seed: number): number => {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

const GenerateName = (
  nationalId: string,
  name: string,
  usePseudoName: boolean,
): string => {
  return usePseudoName
    ? `${words[Number(nationalId) % wordsLength]} ${
        words[
          Math.round(randomNumberFromSeed(Number(nationalId)) * wordsLength)
        ]
      }`
    : `${name}`
}

export default GenerateName
