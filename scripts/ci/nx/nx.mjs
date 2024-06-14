// @ts-check
import { IS_PULLREQUEST } from './_const.mjs'
import { NxAgents } from './_nx_agent.mjs'
import { formatWriteHasChanges } from './_pull_request_forrmat_write.mjs'

console.log(
  IS_PULLREQUEST ? 'Running in pull request mode' : 'Running in push mode',
)
console.log('Starting agents')
await NxAgents.start()

if (IS_PULLREQUEST) {
  if (await formatWriteHasChanges.run()) {
    console.log(`Formatting changes pushed to branch`)
    process.exit(1)
  }
}
