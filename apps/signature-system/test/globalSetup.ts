import { execSync } from 'child_process'

const setup = async () => {
  execSync('yarn nx run signature-system:migrate')
  execSync('yarn nx run signature-system:seed')
}

export default setup
