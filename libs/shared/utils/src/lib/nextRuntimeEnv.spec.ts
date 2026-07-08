/**
 * @jest-environment jsdom
 */
import {
  NEXT_RUNTIME_ENV_SCRIPT_ID,
  getClientRuntimeEnv,
  serializeRuntimeEnv,
} from './nextRuntimeEnv'

describe('serializeRuntimeEnv', () => {
  it('serializes values to JSON', () => {
    expect(serializeRuntimeEnv({ graphqlEndpoint: '/api/graphql' })).toBe(
      '{"graphqlEndpoint":"/api/graphql"}',
    )
  })

  it('escapes < to keep the payload safe inside a script element', () => {
    expect(serializeRuntimeEnv({ evil: '</script><script>' })).not.toContain(
      '</script>',
    )
  })
})

describe('getClientRuntimeEnv', () => {
  it('reads the runtime env from the script tag', () => {
    const script = document.createElement('script')
    script.id = NEXT_RUNTIME_ENV_SCRIPT_ID
    script.type = 'application/json'
    script.textContent = serializeRuntimeEnv({ environment: 'dev' })
    document.body.appendChild(script)

    expect(getClientRuntimeEnv()['environment']).toBe('dev')

    document.body.removeChild(script)
  })
})
