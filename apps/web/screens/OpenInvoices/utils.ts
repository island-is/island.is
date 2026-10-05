export const formatPaymentTypeGroupTooltip = (
  codes: Array<string>,
  name: string,
  and: string,
) => {
  const list =
    codes.length > 1
      ? `${codes.slice(0, -1).join(', ')} ${and} ${codes[codes.length - 1]}`
      : codes[0] ?? ''

  return `${list} (${name})`
}

export const MAX_LOOKUP_BATCH = 100
