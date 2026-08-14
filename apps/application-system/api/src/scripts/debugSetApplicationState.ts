// Local-only dev tool: forces an application straight into an arbitrary
// state, bypassing the normal event/role/onEntry-onExit transition flow.
// For unblocking local testing when an application is stuck in a state that
// can't be reached again through the real UI (e.g. mocked externals refuse
// to fire the event that would move it forward).
//
// Usage (TS_NODE_PROJECT is required — there's no plain tsconfig.json at the
// repo root for tsconfig-paths to fall back to; NODE_ENV=development is what
// isRunningOnEnvironment('local') actually checks server-side):
//   TS_NODE_PROJECT=tsconfig.base.json NODE_ENV=development yarn ts-node \
//     apps/application-system/api/src/scripts/debugSetApplicationState.ts <applicationId> <state>
import { NestFactory } from '@nestjs/core'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { ApplicationTemplateHelper } from '@island.is/application/core'
import { getApplicationTemplateByTypeId } from '@island.is/application/template-loader'
import { ApplicationService } from '@island.is/application/api/core'
import {
  ApplicationWithAttachments as BaseApplication,
  ApplicationTypes,
  FormValue,
} from '@island.is/application/types'
import { ApplicationLifecycleModule } from '../app/modules/application/lifecycle/application-lifecycle.module'
import { getApplicationLifecycle } from '../app/modules/application/utils/application'

const run = async () => {
  if (!isRunningOnEnvironment('local')) {
    throw new Error(
      'debugSetApplicationState only runs against a local environment.',
    )
  }

  const [applicationId, targetState] = process.argv.slice(2)
  if (!applicationId || !targetState) {
    throw new Error(
      'Usage: yarn ts-node apps/application-system/api/src/scripts/debugSetApplicationState.ts <applicationId> <state>',
    )
  }

  const app = await NestFactory.createApplicationContext(
    ApplicationLifecycleModule,
  )
  const applicationService = app.get(ApplicationService)

  const application = await applicationService.findOneById(applicationId)
  if (!application) {
    throw new Error(`No application found with id ${applicationId}`)
  }

  const template = await getApplicationTemplateByTypeId(
    application.typeId as ApplicationTypes,
  )

  if (!template.stateMachineConfig.states[targetState]) {
    throw new Error(
      `State "${targetState}" does not exist on template ${application.typeId}`,
    )
  }

  const answers = application.answers as FormValue
  const updatedApplication = {
    ...application,
    state: targetState,
    answers,
  } as unknown as BaseApplication

  const status = new ApplicationTemplateHelper(
    updatedApplication,
    template,
  ).getApplicationStatus()
  const lifecycle = getApplicationLifecycle(updatedApplication, template)

  await applicationService.updateApplicationState(
    applicationId,
    targetState,
    answers,
    application.assignees,
    status,
    lifecycle,
  )

  console.log(
    `Application ${applicationId} (${application.typeId}) forced to state "${targetState}".`,
  )

  await app.close()
  process.exit(0)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
