import { createHash } from 'crypto'

const portsIndex = 9000

export function hostPortNumber(name: string) {
  return (
    portsIndex +
    (Number.parseInt(
      createHash('sha1').update(name, 'utf-8').digest('hex').slice(-3),
      16,
    ) %
      1000)
  )
}

export function getMockName(to: string) {
  const parsed = new URL(to)
  parsed.pathname = ''
  return {
    name: `mock-${parsed.host.replace(/\./g, '-')}`,
    host: parsed.toString().slice(0, -1),
  }
}
