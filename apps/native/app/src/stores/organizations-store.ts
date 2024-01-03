import AsyncStorage from '@react-native-community/async-storage'
import { ImageSourcePropType } from 'react-native'
import createUse from 'zustand'
import { persist } from 'zustand/middleware'
import create, { State } from 'zustand/vanilla'
import islandLogoSrc from '../assets/logo/logo-64w.png'
import organizations from '../graphql/cache/organizations.json'
import { client } from '../graphql/client'
import { ListOrganizationsDocument } from '../graphql/types/schema'
import { lowerCase } from '../lib/lowercase'

interface Organization {
  id: string
  title: string
  shortTitle: string
  description: string
  slug: string
  tag: Array<{ id: string; title: string }>
  link: string
  logo: null | {
    id: string
    url: string
    title: string
    width: number
    height: number
  }
  query: string
}

interface OrganizationsStore extends State {
  organizations: Organization[]
  getOrganizationLogoUrl(forName: string, size?: number): ImageSourcePropType
  actions: any
}

function processItems(items: Omit<Organization, 'query'>[]) {
  return items.map((item) => ({
    ...(item || {}),
    query: lowerCase(item.title),
  }))
}

const logoCache = new Map()

export const organizationsStore = create<OrganizationsStore>(
  persist(
    (set, get) => ({
      organizations: processItems(organizations),
      getOrganizationLogoUrl(forName: string, size = 100) {
        if (size === 64 && forName === 'Stafrænt Ísland') {
          return islandLogoSrc
        }
        let c = logoCache.get(forName)
        if (!c) {
          const qs = lowerCase(String(forName).trim())
          const orgs = get().organizations
          const match =
            orgs.find((o) => o.query === qs) ||
            orgs.find((o) => o.logo?.title === 'Skjaldarmerki')
          c = match?.logo?.url
          if (c) {
            logoCache.set(forName, c)
          }
        }
        const url =
          c ??
          'https://images.ctfassets.net/8k0h54kbe6bj/6XhCz5Ss17OVLxpXNVDxAO/d3d6716bdb9ecdc5041e6baf68b92ba6/coat_of_arms.svg'
        const uri = `${url}?w=${size}&h=${size}&fit=pad&bg=white&fm=png`
        return { uri }
      },
      actions: {
        updateOriganizations: async () => {
          const querySub = client
            .watchQuery({ query: ListOrganizationsDocument })
            .subscribe(({ data }) => {
              set({ organizations: processItems(data.getOrganizations.items) })
              querySub.unsubscribe()
            })
        },
      },
    }),
    {
      name: 'organizations_02',
      getStorage: () => AsyncStorage,
      serialize({ state, version }) {
        const res: any = { ...state }
        return JSON.stringify({ state: res, version })
      },
      deserialize(str: string) {
        const { state, version } = JSON.parse(str)
        // actions
        delete state.actions
        return { state, version }
      },
    },
  ),
)

export const useOrganizationsStore = createUse(organizationsStore)

organizationsStore.getState().actions.updateOriganizations()
