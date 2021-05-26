import { execSync } from 'child_process'

const setup = async () => {
  execSync(
    'yarn nx run services-endorsements-api:seed/undo --env test --seed 20210505212921-e2e-tests.js',
  )
}

export default setup
