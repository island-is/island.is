import React from 'react'
import { render } from '@testing-library/react'

import DesignGuide from './DesignGuide'
import ContentfulApi from '../../services/contentful'

describe(' DesignGuide ', () => {
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

    const pageContent = await client.fetchPageBySlug('design-guide', 'is-IS')
    const { baseElement } = render(<DesignGuide pageContent={pageContent} />)
    expect(baseElement).toBeTruthy()
  })
})
