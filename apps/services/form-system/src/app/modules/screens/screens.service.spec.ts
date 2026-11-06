import { User } from '@island.is/auth-nest-tools'

import { Form } from '../forms/models/form.model'
import { ListItem } from '../listItems/models/listItem.model'
import { Section } from '../sections/models/section.model'
import { UpdateScreenDto } from './models/dto/updateScreen.dto'
import { Screen } from './models/screen.model'
import { ScreensService } from './screens.service'

describe('ScreensService.update', () => {
  const user = { nationalId: 'owner', scope: [] } as unknown as User

  const setup = () => {
    const screen = {
      id: 'screen-id',
      identifier: 'existing-identifier',
      sectionId: 'section-id',
      name: { is: '', en: '' },
      save: jest.fn().mockResolvedValue(undefined),
    }
    const service = new ScreensService(
      {
        findByPk: jest.fn().mockResolvedValue(screen),
      } as unknown as typeof Screen,
      {
        findByPk: jest.fn().mockResolvedValue({ formId: 'form-id' }),
      } as unknown as typeof Section,
      {
        findByPk: jest.fn().mockResolvedValue({
          organizationNationalId: user.nationalId,
        }),
      } as unknown as typeof Form,
    )

    return { service, screen }
  }

  it.each([null, undefined])(
    'preserves the identifier when the update contains %s',
    async (identifier) => {
      const { service, screen } = setup()
      const name = { is: 'Updated screen', en: 'Updated screen' }

      await service.update(user, screen.id, {
        identifier,
        name,
      } as unknown as UpdateScreenDto)

      expect(screen.identifier).toBe('existing-identifier')
      expect(screen.name).toEqual(name)
      expect(screen.save).toHaveBeenCalledTimes(1)
    },
  )

  it('preserves the identifier when it is omitted', async () => {
    const { service, screen } = setup()

    await service.update(user, screen.id, { name: { is: 'Updated', en: '' } })

    expect(screen.identifier).toBe('existing-identifier')
    expect(screen.save).toHaveBeenCalledTimes(1)
  })

  it.each(['new-identifier', ''])(
    'updates the identifier to "%s"',
    async (identifier) => {
      const { service, screen } = setup()

      await service.update(user, screen.id, { identifier })

      expect(screen.identifier).toBe(identifier)
      expect(screen.save).toHaveBeenCalledTimes(1)
    },
  )
})

describe('ScreensService.create', () => {
  it('returns the generated identifier so subsequent updates retain it', async () => {
    const user = { nationalId: 'owner', scope: [] } as unknown as User
    const screen = {
      id: 'screen-id',
      identifier: 'generated-identifier',
      sectionId: 'section-id',
      save: jest.fn().mockResolvedValue(undefined),
    }
    const screenModel = Object.assign(
      jest.fn().mockImplementation(() => screen),
      { findByPk: jest.fn() },
    )
    const service = new ScreensService(
      screenModel as unknown as typeof Screen,
      {
        findByPk: jest.fn().mockResolvedValue({ formId: 'form-id' }),
      } as unknown as typeof Section,
      {
        findByPk: jest.fn().mockResolvedValue({
          organizationNationalId: user.nationalId,
        }),
      } as unknown as typeof Form,
    )

    const result = await service.create(user, {
      sectionId: screen.sectionId,
      displayOrder: 0,
    })

    expect(result).toEqual({
      id: screen.id,
      identifier: screen.identifier,
      sectionId: screen.sectionId,
    })
    expect(screen.save).toHaveBeenCalledTimes(1)
  })
})

describe('ScreensService.delete', () => {
  it.each([
    { fields: [] },
    { fields: [{ id: 'field-id', list: [{ id: 'option-id' }] }] },
  ])(
    'removes references to the screen and its descendants: %j',
    async ({ fields }) => {
      const user = { nationalId: 'owner', scope: [] } as unknown as User
      const screen = {
        id: 'screen-id',
        sectionId: 'section-id',
        fields,
        $get: jest.fn().mockResolvedValue(fields),
        destroy: jest.fn().mockResolvedValue(undefined),
      }
      const form = {
        organizationNationalId: user.nationalId,
        dependencies: [
          { parentProp: 'screen-id', childProps: ['kept-id'] },
          ...(fields.length
            ? [{ parentProp: 'option-id', childProps: ['kept-id'] }]
            : []),
          {
            parentProp: 'kept-parent',
            childProps: [
              'screen-id',
              ...(fields.length ? ['field-id', 'option-id'] : []),
              'kept-id',
            ],
          },
        ],
        save: jest.fn().mockResolvedValue(undefined),
      }
      const service = new ScreensService(
        {
          findByPk: jest.fn().mockResolvedValue(screen),
        } as unknown as typeof Screen,
        {
          findByPk: jest.fn().mockResolvedValue({ formId: 'form-id' }),
        } as unknown as typeof Section,
        {
          findByPk: jest.fn().mockResolvedValue(form),
        } as unknown as typeof Form,
      )

      await service.delete(user, screen.id)

      expect(screen.$get).toHaveBeenCalledWith('fields', {
        include: [ListItem],
      })
      expect(form.dependencies).toEqual([
        { parentProp: 'kept-parent', childProps: ['kept-id'] },
      ])
      expect(form.save).toHaveBeenCalledTimes(1)
      expect(screen.destroy).toHaveBeenCalledTimes(1)
    },
  )
})
