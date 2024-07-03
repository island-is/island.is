import { stopSQS } from '@island.is/testing/containers'

export default async () => {
  await stopSQS()
}
