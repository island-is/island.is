import { execSync } from 'child_process'

const setup = async () => {
  execSync('yarn nx run services-endorsements-api:migrate')
  execSync('yarn nx run services-endorsements-api:seed')
}

export default setup
