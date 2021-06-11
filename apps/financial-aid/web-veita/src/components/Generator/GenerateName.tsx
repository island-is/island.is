import words from '../../utils/words'

const wordsLength = words.length - 1

const randomNumberFromSeed = (seed: number): number => {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

const GenerateName = (kennitala: string): string =>
  `${words[Number(kennitala) % wordsLength]} ${
    words[Math.round(randomNumberFromSeed(Number(kennitala)) * wordsLength)]
  }`

export default GenerateName
