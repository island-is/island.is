import { execSync } from 'child_process'

const setup = async () => {
  execSync('yarn nx run services-party-letter-registry-api:migrate --env test')
  execSync(
    'yarn nx run services-party-letter-registry-api:seed --env test --seed 20210514153818-e2e-tests.js',
  )
}

export default setup
