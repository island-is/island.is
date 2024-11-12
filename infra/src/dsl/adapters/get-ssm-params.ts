import { GetParametersCommand, SSMClient } from '@aws-sdk/client-ssm'
import { fromNodeProviderChain } from '@aws-sdk/credential-providers'
import { logger } from '../../common'

const credentials = fromNodeProviderChain()

// const client = new SSMClient({ credentials: fromEnv() })
const client = new SSMClient({
  // region: 'eu-west-1',
  // credentials: fromEnv(),
  credentials,
})

export async function getSsmParams(
  ssmNames: string[],
): Promise<{ [name: string]: string }> {
  logger.debug('getSsmParams', { numSsmNames: ssmNames.length })
  logger.debug('AWS env vars', {
    AWS_ENV: Object.fromEntries(
      Object.entries(process.env).filter(([k]) => k.startsWith('AWS_')),
    ),
  })
  const chunks = ssmNames.reduce((all: string[][], one: string, i: number) => {
    const ch = Math.floor(i / 10)
    all[ch] = ([] as string[]).concat(all[ch] || [], one)
    return all
  }, [])

  const allParams = await Promise.all(
    chunks.map(
      async (Names) =>
        await client.send(
          new GetParametersCommand({ Names, WithDecryption: true }),
        ),
    ),
  ).catch(handleCredentialsProviderError)
  const params = allParams
    .map(({ Parameters }) =>
      Object.fromEntries(Parameters!.map((p) => [p.Name, p.Value])),
    )
    .reduce((p, c) => ({ ...p, ...c }), {})
  logger.debug('get-ssm-params return debug', {
    chunks,
    numChunks: chunks.length,
    allParams,
    sampleAllParams: allParams[0]?.Parameters ?? null,
    params,
  })
  return params
}

function handleCredentialsProviderError(err: Error): never {
  if (err.name === 'CredentialsProviderError') {
    logger.debug(`CredentialsProviderError: ${err.message}`, { err })
    console.error(
      'Could not load AWS credentials from any providers. Did you forget to configure environment variables, aws profile or run `aws sso login`?',
    )
    process.exit(1)
  }
  throw err
}
