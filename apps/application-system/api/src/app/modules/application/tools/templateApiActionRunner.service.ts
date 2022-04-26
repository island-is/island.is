import {
  Application,
  ApplicationService,
} from '@island.is/application/api/core'
import {
  ApplicationTemplateAPIAction,
  ApplicationWithAttachments,
  ExternalData,
} from '@island.is/application/core'
import {
  PerformActionResult,
  TemplateAPIService,
} from '@island.is/application/template-api-modules'
import { User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'

@Injectable()
export class TemplateApiActionRunner {
  private application: ApplicationWithAttachments = {} as ApplicationWithAttachments
  private auth: User = {} as User
  private oldExternalData: ExternalData = {}
  private newExternalData: ExternalData = {}

  constructor(
    private readonly applicationService: ApplicationService,
    private readonly templateAPIService: TemplateAPIService,
  ) {}

  async run(
    application: ApplicationWithAttachments,
    actions: ApplicationTemplateAPIAction[],
    auth: User,
  ): Promise<ApplicationWithAttachments> {
    this.application = application
    this.auth = auth
    this.oldExternalData = application.externalData
    // group by order
    const groupedActions = actions.reduce((acc, action) => {
      const order = action.order ?? -1
      if (!acc[order]) {
        acc[order] = []
      }
      acc[order].push(action)
      return acc
    }, {} as { [key: number]: ApplicationTemplateAPIAction[] })

    const lss = Object.keys(groupedActions).map(
      (value: string): ApplicationTemplateAPIAction[] => {
        return groupedActions[(value as unknown) as number]
      },
    )

    const result = lss.reduce((accumulatorPromise, actions) => {
      return accumulatorPromise.then(() => {
        const ps = Promise.all(
          actions.map((action) => this.callProvider(action)),
        )
        return ps.then(() => {
          return
        })
      })
    }, Promise.resolve())

    await result

    this.persistExternalData()

    return this.application
  }

  async callProvider(action: ApplicationTemplateAPIAction) {
    console.log(
      `makeCall to ${action.apiModuleAction} for application ${this.application.id}`,
    )
    const {
      apiModuleAction,
      shouldPersistToExternalData,
      externalDataId,
    } = action
    const actionResult = await this.templateAPIService.performAction({
      templateId: this.application.typeId,
      type: apiModuleAction,
      props: {
        application: this.application,
        auth: this.auth,
      },
    })

    await this.updateExternalData(
      actionResult,
      apiModuleAction,
      externalDataId,
      shouldPersistToExternalData ?? false,
    )
    console.log(
      `done!!!!! makeCall to ${action.apiModuleAction} for application ${this.application.id}`,
    )
  }

  async persistExternalData(): Promise<void> {
    const {
      updatedApplication: withExternalData,
    } = await this.applicationService.updateExternalData(
      this.application.id,
      this.oldExternalData,
      this.newExternalData,
    )
    this.application = withExternalData as ApplicationWithAttachments
  }

  async updateExternalData(
    actionResult: PerformActionResult,
    apiModuleAction: string,
    externalDataId?: string,
    persist?: boolean,
  ): Promise<void> {
    const newExternalDataEntry: ExternalData = {
      [externalDataId || apiModuleAction]: {
        status: actionResult.success ? 'success' : 'failure',
        date: new Date(),
        data: actionResult.success
          ? (actionResult.response as ExternalData['data'])
          : actionResult.error,
      },
    }

    this.newExternalData = { ...this.newExternalData, ...newExternalDataEntry }

    this.application.externalData = {
      ...this.application.externalData,
      ...this.newExternalData,
    }
  }
}
