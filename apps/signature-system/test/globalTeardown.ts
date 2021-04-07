import { execSync } from 'child_process'

const setup = async () => {
  execSync('yarn nx run signature-system:seed/undo --env test')
}

export default setup
