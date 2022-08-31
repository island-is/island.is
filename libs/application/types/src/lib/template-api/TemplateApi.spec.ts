import { defineTemplateApi } from './TemplateApi'
export interface MyParams {
  id: number
  isDocument: boolean
  listOfStrings: string[]
}

describe('TemplateApi Action runner', () => {
  it(`Template is defined`, async () => {
    const api = defineTemplateApi({
      action: 'actionName',
      order: 1,
      throwOnError: false,
      params: {
        param: 1,
      },
    })

    expect(api.action).toBe('actionName')
    expect(api.actionId).toBe('actionName')
    expect(api.order).toBe(1)
    expect(api.params).toMatchObject({ param: 1 })
    expect(api.throwOnError).toBe(false)
  })

  it(`ActionId is correctly formed`, async () => {
    const api = defineTemplateApi({
      action: 'actionName',
      namespace: 'serviceName',
    })

    expect(api.actionId).toBe('serviceName.actionName')
  })

  it(`ThrowOnError and  ShouldPersistToExternalData default to true`, async () => {
    const api = defineTemplateApi({
      action: 'actionName',
    })

    expect(api.throwOnError).toBe(true)
    expect(api.shouldPersistToExternalData).toBe(true)
  })

  it('Updates paramaters partially', async () => {
    const api = defineTemplateApi<MyParams>({
      action: 'actionName',
      params: {
        id: 1,
        isDocument: true,
        listOfStrings: ['1'],
      },
    })

    expect(api.params).toMatchObject({
      id: 1,
      isDocument: true,
      listOfStrings: ['1'],
    })

    const configuredApi = api.configure({
      params: {
        listOfStrings: ['look', 'now', 'see'],
      },
    })

    expect(configuredApi.params).toMatchObject({
      id: 1,
      isDocument: true,
      listOfStrings: ['look', 'now', 'see'],
    })
  })

  it(`Defines and configures`, async () => {
    const paramObj = {
      id: 1,
      isDocument: true,
      listOfStrings: ['take', 'a', 'hike'],
    }

    const api = defineTemplateApi<MyParams>({
      action: 'actionName',
      order: 1,
      throwOnError: false,
      params: paramObj,
    })

    expect(api.action).toBe('actionName')
    expect(api.actionId).toBe('actionName')
    expect(api.order).toBe(1)
    expect(api.params).toMatchObject(paramObj)
    expect(api.throwOnError).toBe(false)

    const configuredApi = api.configure({
      externalDataId: 'newExternalDataId',
      order: 24,
      shouldPersistToExternalData: false,
      throwOnError: true,
      params: {
        id: 2,
        isDocument: false,
        listOfStrings: ['look', 'now', 'see'],
      },
    })

    expect(configuredApi.action).toBe('actionName')
    expect(configuredApi.actionId).toBe('actionName')
    expect(configuredApi.order).toBe(24)
    expect(configuredApi.throwOnError).toBe(true)
    expect(configuredApi.shouldPersistToExternalData).toBe(false)
    expect(configuredApi.params).toMatchObject({
      id: 2,
      isDocument: false,
      listOfStrings: ['look', 'now', 'see'],
    })
  })
})
