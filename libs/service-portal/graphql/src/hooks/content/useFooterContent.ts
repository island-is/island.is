import { useQuery } from '@apollo/client'
import { Menu, Query, QueryGetMenuArgs } from '@island.is/api/schema'
import { GET_MENU } from '../../lib/queries/getMenu'

const getVariables = (name: string, lang: string) => ({
  variables: {
    input: {
      name,
      lang,
    },
  },
})

export type ServicePortalFooterContent = {
  upper: Menu | null
  lower: Menu | null
  middle: Menu | null
  tags: Menu | null
  upperContact: Menu | null
}

export const useFooterContent = (
  locale: string,
): ServicePortalFooterContent => {
  const { data: upper } = useQuery<Query, QueryGetMenuArgs>(
    GET_MENU,
    getVariables('Footer upper', locale),
  )
  const { data: lower } = useQuery<Query, QueryGetMenuArgs>(
    GET_MENU,
    getVariables('Footer lower', locale),
  )
  const { data: middle } = useQuery<Query, QueryGetMenuArgs>(
    GET_MENU,
    getVariables('Footer middle', locale),
  )
  const { data: tags } = useQuery<Query, QueryGetMenuArgs>(
    GET_MENU,
    getVariables('Footer tags', locale),
  )
  const { data: upperContact } = useQuery<Query, QueryGetMenuArgs>(
    GET_MENU,
    getVariables('Footer upper contact', locale),
  )

  return {
    upper: upper?.getMenu || null,
    lower: lower?.getMenu || null,
    middle: middle?.getMenu || null,
    tags: tags?.getMenu || null,
    upperContact: upperContact?.getMenu || null,
  }
}
