/** Error.name/message are non-enumerable; include them so Slack gets useful JSON. */
export const serializeErrorForSlack = (reason: Error): string =>
  JSON.stringify({
    ...reason,
    name: reason.name,
    message: reason.message,
  })
