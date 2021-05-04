import { execSync } from 'child_process'

const setup = async () => {
  execSync('yarn nx run services-endorsements-api:seed/undo --env test')
}

export default setup
