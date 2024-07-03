import { stopSQS } from '../../testing/containers/src'

export default async () => {
  await stopSQS()
}
