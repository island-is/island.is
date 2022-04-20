import { ApplicationService } from '@island.is/application/api/core'
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

  constructor(
    private readonly applicationService: ApplicationService,
    private readonly templateAPIService: TemplateAPIService,
  ) {}

  async run(
    application: ApplicationWithAttachments,
    actions: ApplicationTemplateAPIAction[],
    auth: User,
  ) {
    this.application = application
    this.auth = auth

    // group by order
    const groupedActions = actions.reduce((acc, action) => {
      const order = action.order ?? -1
      if (!acc[order]) {
        acc[order] = []
      }
      acc[order].push(action)
      return acc
    }, {} as { [key: number]: ApplicationTemplateAPIAction[] })

    //call by order
    Object.keys(groupedActions).map(async (value: string, index: number) => {
      const actions = groupedActions[index]
      console.log({ actions })
      console.log({ value })
      console.log('typeif ' + typeof value)
      console.log('typeif2 ' + typeof actions)
      if (actions) {
        const proms = actions.map((action) => this.makeCall(action))
        console.log('calling ', value)
        await Promise.all(proms)
      } else {
        console.log('no actions ', value)
      }
    })
  }

  async makeCall(action: ApplicationTemplateAPIAction) {
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

    if (persist) {
      const {
        updatedApplication: withExternalData,
      } = await this.applicationService.updateExternalData(
        this.application.id,
        this.application.externalData,
        newExternalDataEntry,
      )

      this.application = {
        ...this.application,
        externalData: {
          ...this.application.externalData,
          ...withExternalData.externalData,
        },
      }
    } else {
      this.application = {
        ...this.application,
        externalData: {
          ...this.application.externalData,
          ...newExternalDataEntry,
        },
      }
    }
  }
}
