import { execSync } from 'child_process'

const setup = async () => {
  execSync('yarn nx run endorsements-api:migrate')
  execSync('yarn nx run endorsements-api:seed')
}

export default setup
