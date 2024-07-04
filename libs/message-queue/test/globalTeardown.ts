// eslint-disable-next-line @nx/enforce-module-boundaries
import { stopLocalstack } from '../../testing/containers/src'

export default async () => {
  await stopLocalstack()
}
