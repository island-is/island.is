import { ApplicationMapper } from './application.mapper'

describe('ApplicationMapper application JSON', () => {
  it('includes the localized form name in the X-Road JSON', () => {
    const mapper = new ApplicationMapper()

    const applicationJson = mapper.mapApplicationDtoToApplicationJsonDto({
      id: 'application-id',
      slug: 'form-slug',
      formName: { is: 'Heiti eyðublaðs', en: 'Form name' },
      sections: [],
    })

    expect(JSON.parse(JSON.stringify(applicationJson))).toMatchObject({
      id: 'application-id',
      slug: 'form-slug',
      formName: { is: 'Heiti eyðublaðs', en: 'Form name' },
    })
  })
})
