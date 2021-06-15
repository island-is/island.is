import { execSync } from 'child_process'

const setup = async () => {
  execSync('yarn nx run services-endorsements-api:migrate --env test')
  execSync(
    'yarn nx run services-endorsements-api:seed --env test --seed 20210505212921-e2e-tests.js',
  )
}

export default setup
