export const formatDayRateApiErrorMessages = (message: string) => {
  /*
    Example of errors this function was designed for:
    Input:
    Bad Request: Entries[0].Permno: EOH53 - An active dayrate entry already exists.
    Entries[1].Permno: HKS27 - An active dayrate entry already exists.
    Entries[2].Permno: KGL64 - An active dayrate entry already exists.
    PMJ13 - Entered mileage cannot be less than latest mileage entry.
    entityId: 5005101370 is not registered for all of the vehicles listed in the registration.
    Output:
    An active dayrate entry already exists. (EOH53, HKS27, KGL64)
    Entered mileage cannot be less than latest mileage entry. (PMJ13)
    5005101370 is not registered for all of the vehicles listed in the registration.
    */
  const normalizedMessage = message.replace(/\\r?\\n/g, '\n')

  const lines = normalizedMessage
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  const messageToIds = new Map<string, Set<string>>()

  const add = (msg: string, id?: string) => {
    let ids = messageToIds.get(msg)
    if (!ids) {
      ids = new Set<string>()
      messageToIds.set(msg, ids)
    }
    if (id) {
      ids.add(id)
    }
  }

  for (const rawLine of lines) {
    // Remove "entityId:" anywhere in the line
    const line = rawLine.replace(/\bentityId:\s*/gi, '')

    if (line.includes(' - ')) {
      const [left, right] = line.split(' - ', 2)
      const id = left.trim().split(/\s+/).pop() ?? ''
      const msg = right.trim()
      add(msg, id || undefined)
      continue
    }

    const lastColonIndex = line.lastIndexOf(':')
    if (lastColonIndex !== -1) {
      const msg = line.slice(lastColonIndex + 1).trim()
      add(msg)
      continue
    }

    add(line)
  }

  return Array.from(messageToIds.entries())
    .map(([msg, ids]) => {
      const idList = Array.from(ids)
      return idList.length ? `${msg} (${idList.join(', ')})` : msg
    })
    .join('\n')
}
