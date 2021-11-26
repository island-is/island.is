import { execSync } from 'child_process'

const setup = async () => {
  execSync('yarn nx run services-auth-api:migrate')
  execSync('yarn nx run services-auth-api:seed')
}

export default setup
