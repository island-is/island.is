import React from 'react'
import { render } from '@testing-library/react'

import { Home } from './Home'
import ContentfulApi from '../../services/contentful'

describe(' Home ', () => {
  it('should render successfully', async () => {
    const client = new ContentfulApi()

    const pageContent = await client.fetchPageBySlug('home', 'is-IS')
    const { baseElement } = render(<Home pageContent={pageContent} />)
    expect(baseElement).toBeTruthy()
  })
})
