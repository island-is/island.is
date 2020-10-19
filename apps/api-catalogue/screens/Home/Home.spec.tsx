import React from 'react'
import { render } from '@testing-library/react'

import { Home } from './Home'
import ContentfulApi from '../../services/contentful'

describe(' Home ', () => {
  const OLD_ENV = process.env

  beforeAll(() => {
    process.env = OLD_ENV
    process.env.CONTENTFUL_SPACE_ID = 'jtzqkuaxipis'
    process.env.CONTENTFUL_ACCESS_TOKEN =
      'N6X1O7qgBQ_FqxQx0O-keh3tJDrEhV8myczR3w-ZbS0'
  })
  afterAll(() => {
    process.env = OLD_ENV // restore old env
  })

  it('should render successfully', async () => {
    const client = new ContentfulApi()

    const pageContent = await client.fetchPageBySlug('home', 'is-IS')
    const { baseElement } = render(<Home pageContent={pageContent} />)
    expect(baseElement).toBeTruthy()
  })
})
