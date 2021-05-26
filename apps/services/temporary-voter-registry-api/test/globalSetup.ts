import { execSync } from 'child_process'

const setup = async () => {
  execSync(
    'yarn nx run services-temporary-voter-registry-api:migrate --env test',
  )
  execSync(
    'yarn nx run services-temporary-voter-registry-api:seed --env test --seed 20210514091457-e2e-tests.js',
  )
}

export default setup
