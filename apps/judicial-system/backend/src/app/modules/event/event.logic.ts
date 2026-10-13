/** Error.name/message are non-enumerable; include them so Slack gets useful JSON. */
export const serializeErrorForSlack = (reason: Error): string => {
  const { stack: _omitted, ...fields } = {
    ...reason,
    name: reason.name,
    message: reason.message,
  } as Record<string, unknown>

  return JSON.stringify(fields)
}
