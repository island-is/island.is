import { Constituencies } from './types'

export const constituencyMapper: Record<
  Constituencies,
  {
    low: number
    high: number
  }
> = {
  Norðausturkjördæmi: { low: 3, high: 5 }, //todo: change to 300 and 400
  Norðvesturkjördæmi: { low: 240, high: 320 },
  'Reykjavíkurkjördæmi norður': { low: 330, high: 440 },
  'Reykjavíkurkjördæmi suður': { low: 330, high: 440 },
  Suðurkjördæmi: { low: 300, high: 400 },
  Suðvesturkjördæmi: { low: 390, high: 520 },
}
