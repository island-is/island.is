// eslint-disable-next-line @nx/enforce-module-boundaries
import { stopSQS } from '../../testing/containers/src'

export default async () => {
  await stopSQS()
}
