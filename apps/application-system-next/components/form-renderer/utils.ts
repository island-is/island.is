export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

export const getObjectAnswer = (value: unknown): Record<string, unknown> =>
  isRecord(value) ? value : {}

export const getStringAnswerValue = (
  value: Record<string, unknown>,
  key: string,
): string => {
  const result = value[key]
  return typeof result === 'string' ? result : ''
}
