import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { Locale } from '@island.is/shared/types'
import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { SdfService } from './sdf.service'
import {
  SdfScreen,
  SdfGetScreenInput,
  SdfExecuteActionInput,
} from './sdf.model'
import type { ScreenDto } from '../../gen/fetch'

const mapRestScreenToGql = (dto: ScreenDto): SdfScreen => {
  return {
    applicationId: dto.applicationId,
    locale: dto.locale,
    header: {
      title: dto.header.title,
      description: dto.header.description,
    },
    stepper: {
      sections: dto.stepper.sections.map((s) => ({
        id: s.id,
        title: s.title,
        isComplete: s.isComplete,
        children: s.children.map((c) => ({
          id: c.id,
          title: c.title,
        })),
      })),
      activeSectionIndex: dto.stepper.activeSectionIndex,
      activeSubSectionIndex: dto.stepper.activeSubSectionIndex,
    },
    page: {
      id: dto.page.id,
      index: dto.page.index,
      sectionIndex: dto.page.sectionIndex,
      subSectionIndex: dto.page.subSectionIndex,
      components: dto.page.components as SdfScreen['page']['components'],
      errors: dto.page.errors.map((e) => ({
        componentId: e.componentId,
        message: e.message,
      })),
    },
    footer: {
      buttons: dto.footer.buttons.map((b) => ({
        id: b.id,
        text: b.text,
        variant: b.variant,
        actionType: b.actionType,
      })),
      canGoBack: dto.footer.canGoBack,
    },
  }
}

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class SdfResolver {
  constructor(private readonly sdfService: SdfService) {}

  @Query(() => SdfScreen, { name: 'applicationSdfScreen' })
  async getScreen(
    @Args('input') input: SdfGetScreenInput,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @CurrentUser() user: User,
  ): Promise<SdfScreen> {
    const dto = await this.sdfService.getScreen(
      input.applicationId,
      input.step,
      locale,
      user,
    )
    return mapRestScreenToGql(dto)
  }

  @Mutation(() => SdfScreen, { name: 'applicationSdfAction' })
  async executeAction(
    @Args('input') input: SdfExecuteActionInput,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @CurrentUser() user: User,
  ): Promise<SdfScreen> {
    const answers: Record<string, unknown> | undefined = input.answers
      ? JSON.parse(input.answers)
      : undefined

    const dto = await this.sdfService.executeAction(
      input.applicationId,
      input.actionType,
      answers,
      input.lastKnownPageIndex,
      locale,
      user,
      input.fieldIds,
      input.event,
    )
    return mapRestScreenToGql(dto)
  }
}
