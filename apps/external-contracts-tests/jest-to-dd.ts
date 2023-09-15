import { StatsD } from 'hot-shots'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// this is not in use yet, but will be part of the next phase in this development

const client = new StatsD({ mock: true })
const jestReport = JSON.parse(
  readFileSync(resolve(process.argv[2]), { encoding: 'utf-8' }),
) as {
  testResults: {
    assertionResults: { fullName: string; status: 'passed' | 'failed' }[]
  }[]
}

const testCasesInfo = jestReport.testResults.flatMap(
  (testResult) =>
    testResult.assertionResults.map((test) => ({
      name: test.fullName as string,
      status: test.status === 'passed' ? 'success' : 'failure',
    })) as { name: string; status: 'success' | 'failure' }[],
)
const successfulTests = testCasesInfo
  .filter((tc) => tc.status === 'success')
  .map((tc) => tc.name)
const failedTests = testCasesInfo
  .filter((tc) => tc.status === 'failure')
  .map((tc) => tc.name)

console.log(`Failed test: ${failedTests}`)
console.log(`Successful tests: ${successfulTests}`)

successfulTests.forEach((tc) => client.check(tc, client.CHECKS.OK))
failedTests.forEach((tc) => client.check(tc, client.CHECKS.CRITICAL))
