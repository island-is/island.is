import { GatewayTimeout } from '@island.is/nest/problem'
import { acceptableTimeSignal } from '../../utils/acceptableTime'

export const withTimeout = async <T>(
  timeoutMs: number,
  fetchFn: (signal: AbortSignal) => Promise<T>,
): Promise<T> => {
  const signal = acceptableTimeSignal(timeoutMs)

  try {
    return await fetchFn(signal)
  } catch (error) {
    if (signal.aborted) {
      throw new GatewayTimeout(timeoutMs)
    }
    throw error
  }
}
