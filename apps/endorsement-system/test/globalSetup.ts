import { execSync } from 'child_process'

const setup = async () => {
  execSync('yarn nx run endorsement-system:migrate')
  execSync('yarn nx run endorsement-system:seed')
}

export default setup
