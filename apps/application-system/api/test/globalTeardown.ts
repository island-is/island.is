// eslint-disable-next-line @nx/enforce-module-boundaries
import { stopPostgres } from '../../../../libs/testing/containers/src'

export default async () => {
  await stopPostgres()
}
