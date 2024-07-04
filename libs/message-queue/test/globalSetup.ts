// eslint-disable-next-line @nx/enforce-module-boundaries
import { startLocalstack } from '../../testing/containers/src'

export default async () => {
  await startLocalstack()
}
