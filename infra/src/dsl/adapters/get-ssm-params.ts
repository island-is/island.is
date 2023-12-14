import { SSM } from '@aws-sdk/client-ssm'
import { logger } from '../../common'

const API_INITIALIZATION_OPTIONS = {
  region: 'eu-west-1',
  maxAttempts: 10,
}
const client = new SSM(API_INITIALIZATION_OPTIONS)
export async function getSsmParams(
  ssmNames: string[],
): Promise<{ [name: string]: string }> {
  logger.debug('getSsmParams', { numSsmNames: ssmNames.length })
  throw new Error('DEBUG')
  const chunks = ssmNames.reduce((all: string[][], one: string, i: number) => {
    const ch = Math.floor(i / 10)
    all[ch] = ([] as string[]).concat(all[ch] || [], one)
    return all
  }, [])

  const allParams = await Promise.all(
    chunks.map((Names) =>
      client.getParameters({ Names, WithDecryption: true }),
    ),
  )
  return allParams
    .map(({ Parameters }) =>
      Object.fromEntries(Parameters!.map((p) => [p.Name, p.Value])),
    )
    .reduce((p, c) => ({ ...p, ...c }), {})
}
