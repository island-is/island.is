import { findLastGoodBuild, WorkflowQueries } from './detection'
import { ActionsListWorkflowRunsForRepoResponseData } from '@octokit/types'
import { Substitute, Arg } from '@fluffy-spoon/substitute'

describe('Discovering last successful build', () => {
  it('should find it on the same branch', async () => {
    const workflowQueried = Substitute.for<WorkflowQueries>()
    workflowQueried
      .getData('new-br')
      .resolves(
        (workflowsBranch as unknown) as ActionsListWorkflowRunsForRepoResponseData,
      )
    const lastGoodBuild = await findLastGoodBuild(
      shasBranch,
      'new-br',
      'baseBranch',
      workflowQueried,
    )
    expect(lastGoodBuild).toStrictEqual({
      sha: '9998ae544a070a2f88b14d1d4fb3fa35e982a01e',
      branch: 'new-br',
      run_number: 43,
    })
  })

  it('should find it on baseBranch if branch has no successful runs', async () => {
    const workflowQueried = Substitute.for<WorkflowQueries>()
    workflowQueried
      .getData('baseBranch')
      .resolves(
        (workflowsBase as unknown) as ActionsListWorkflowRunsForRepoResponseData,
      )
    workflowQueried
      .getData('new-br')
      .resolves({ total_count: 0, workflow_runs: [] })
    const lastGoodBuild = await findLastGoodBuild(
      shasBranch,
      'new-br',
      'baseBranch',
      workflowQueried,
    )
    expect(lastGoodBuild).toStrictEqual({
      sha: '4be24b2648c1bde30bc7f0358d251652a9aee08a',
      branch: 'baseBranch',
      run_number: 23,
    })
  })

  it('should find it on master if not found on the branch nor the base', async () => {
    const workflowQueried = Substitute.for<WorkflowQueries>()
    workflowQueried
      .getData('new-br')
      .resolves({ total_count: 0, workflow_runs: [] })
    workflowQueried
      .getData('baseBranch')
      .resolves({ total_count: 0, workflow_runs: [] })
    workflowQueried
      .getData('master')
      .resolves(
        (workflowsMaster as unknown) as ActionsListWorkflowRunsForRepoResponseData,
      )
    const lastGoodBuild = await findLastGoodBuild(
      shasBranch,
      'new-br',
      'baseBranch',
      workflowQueried,
    )
    expect(lastGoodBuild).toStrictEqual({
      sha: 'b39fb602059ec0f873623249e9a72e2740686a28',
      branch: 'master',
      run_number: 157,
    })
  })

  it('should return empty object if not found on baseBranch, master nor on the branch', async () => {
    const workflowQueried = Substitute.for<WorkflowQueries>()
    workflowQueried
      .getData(Arg.any())
      .resolves({ total_count: 0, workflow_runs: [] })
    const lastGoodBuild = await findLastGoodBuild(
      shasBranch,
      'new-br',
      'baseBranch',
      workflowQueried,
    )
    expect(lastGoodBuild).toStrictEqual({})
  })
})

const shasBranch = [
  '9998ae544a070a2f88b14d1d4fb3fa35e982a01e',
  '75542c375886137d16c30b50f829bf6f72b65ad6',
  'de4b274ac3e28d998d9d659606814b9eb5b43c33',
  '4eefe1973b75256ce8a1bdd2242ac2928bc9eb5d',
  '553747233c14dfe5b872836e162c78d3ad5ecc84',
  '64bb19bd6084bf8a4d224bb2538f955bde8ea12a',
  'c748a35903521008360c69b932c731e356125246',
  '3640432e767097524475a926b01988872b07e66b',
  '9fdd8eff6e988818a86d994ee53a06fa896fef06',
  '61578a3f6c8d727f515654e64ce8f482ffd7a203',
  'b468e21beb1987966fd32f23ce7855e964adb4d9',
  '841e85a6d198f39ca1c00d1059c4a27a0b186013',
  '70d0324b115fe02ef4801ec988c00bd5d51e2a04',
  'd784e77608ae75c712a2d677a79167396b7643bb',
  '3611b3e06f568b4441264f94eb6d6fed4a609dff',
  '4be24b2648c1bde30bc7f0358d251652a9aee08a',
  '3f92c034c80a7ae0734e0685bf0cd8591c1e1568',
  'd89035753004221699c4896d76a4a94e3dfb1323',
  '188ddd4db84a84753d16ab9441706fa5724b33de',
  'b39fb602059ec0f873623249e9a72e2740686a28',
]

import * as workflowsBase from './baseWorkflows.json'
import * as workflowsBranch from './branchWorkflows.json'
import * as workflowsMaster from './masterWorkflows.json'
