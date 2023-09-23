// eslint-disable-next-line @nx/enforce-module-boundaries
import { startPostgres } from '../../../../libs/testing/containers/src'

export default async () => {
  await startPostgres()
}
