import { NextPage } from 'next'
import React from 'react'

export async function getStaticProps(context) {
  console.log(context)
  console.log('test')
  return {
    props: {},
  }
}
export const Index: NextPage = () => {
  return <div>Index page</div>
}

export default Index
