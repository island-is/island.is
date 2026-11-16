import { User } from '@island.is/auth-nest-tools'

import { Form } from '../forms/models/form.model'
import { ListItem } from '../listItems/models/listItem.model'
import { Section } from './models/section.model'
import { SectionsService } from './sections.service'

describe('SectionsService.delete', () => {
  it.each([false, true])(
    'removes section and descendant dependencies (has screens: %s)',
    async (hasScreens) => {
      const user = { nationalId: 'owner', scope: [] } as unknown as User
      const screen = {
        id: 'screen-id',
        $get: jest
          .fn()
          .mockResolvedValue([{ id: 'field-id', list: [{ id: 'option-id' }] }]),
      }
      const section = {
        id: 'section-id',
        formId: 'form-id',
        $get: jest.fn().mockResolvedValue(hasScreens ? [screen] : []),
        destroy: jest.fn().mockResolvedValue(undefined),
      }
      const removedIds = hasScreens
        ? [section.id, screen.id, 'field-id', 'option-id']
        : [section.id]
      const form = {
        organizationNationalId: user.nationalId,
        draftTotalSteps: 3,
        dependencies: [
          ...removedIds.map((parentProp) => ({
            parentProp,
            childProps: ['kept-id'],
          })),
          { parentProp: 'kept-parent', childProps: [...removedIds, 'kept-id'] },
        ],
        save: jest.fn().mockResolvedValue(undefined),
      }
      const service = new SectionsService(
        {
          findByPk: jest.fn().mockResolvedValue(section),
        } as unknown as typeof Section,
        {
          findByPk: jest.fn().mockResolvedValue(form),
        } as unknown as typeof Form,
      )

      await service.delete(user, section.id)

      expect(form.dependencies).toEqual([
        { parentProp: 'kept-parent', childProps: ['kept-id'] },
      ])
      if (hasScreens) {
        expect(screen.$get).toHaveBeenCalledWith('fields', {
          include: [ListItem],
        })
      }
      expect(form.draftTotalSteps).toBe(2)
      expect(form.save).toHaveBeenCalledTimes(1)
      expect(section.destroy).toHaveBeenCalledTimes(1)
    },
  )
})
