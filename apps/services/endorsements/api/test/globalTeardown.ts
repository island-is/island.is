import { execSync } from 'child_process'

const setup = async () => {
  execSync('yarn nx run endorsements-api:seed/undo --env test')
}

export default setup
