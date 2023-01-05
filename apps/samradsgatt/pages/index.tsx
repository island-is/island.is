import React from 'react'

export async function getStaticProps(context) {
  console.log(context)
  console.log('test')
  return {
    props: {},
  }
}
export const Index = () => {
  return <div>Index page</div>
}

export default Index
