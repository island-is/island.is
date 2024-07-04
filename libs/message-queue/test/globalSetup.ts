// eslint-disable-next-line @nx/enforce-module-boundaries
import { startSQS } from '../../testing/containers/src'

export default async () => {
  await startSQS()
}
