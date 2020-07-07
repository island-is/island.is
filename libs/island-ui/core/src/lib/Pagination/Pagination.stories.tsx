import React from 'react'
import Pagination from './Pagination'

export default {
  title: 'Components/Pagination',
  component: Pagination,
}

export const Default = () => (
  <Pagination page={10} totalPages={44} makeHref={(p) => `#page=${p}`} />
)

export const SinglePage = () => (
  <Pagination page={1} totalPages={1} makeHref={(p) => `#page=${p}`} />
)

export const Edge = () => (
  <Pagination page={1} totalPages={7} makeHref={(p) => `#page=${p}`} />
)

export const BigNumbers = () => (
  <Pagination page={1199} totalPages={1234} makeHref={(p) => `#page=${p}`} />
)
