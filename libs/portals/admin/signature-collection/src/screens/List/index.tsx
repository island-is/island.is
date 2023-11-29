import { IntroHeader } from '@island.is/portals/core'
import { useLoaderData, useRevalidator } from 'react-router-dom'
import { useEffect } from 'react'
import { SignatureList } from '@island.is/api/schema'

const List = () => {
  const list = useLoaderData() as SignatureList
  const { revalidate } = useRevalidator()

  useEffect(() => {
    revalidate()
  }, [])

  return (
    <>
      {list && <IntroHeader title={list.owner.name + ' - ' + list.area.name} />}
    </>
  )
}

export default List
