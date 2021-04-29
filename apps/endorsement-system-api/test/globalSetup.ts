import { execSync } from 'child_process'

const setup = async () => {
  execSync('yarn nx run endorsement-system-api:migrate')
  execSync('yarn nx run endorsement-system-api:seed')
}

export default setup
