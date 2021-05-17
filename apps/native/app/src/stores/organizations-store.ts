import AsyncStorage from '@react-native-community/async-storage'
import createUse from 'zustand'
import { persist } from 'zustand/middleware'
import create, { State } from 'zustand/vanilla'
import organizations from '../graphql/cache/organizations.json'
import { client } from '../graphql/client'
import { GET_ORGANIZATIONS_QUERY } from '../graphql/queries/get-organizations.query'

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
  getOrganizationLogoUrl(forName: string, size?: number): string
  actions: any
}

function processItems(items: Omit<Organization, 'query'>[]) {
  return items.map((item) => ({
    ...(item || {}),
    query: item.title.toLocaleLowerCase(),
  }))
}

const logoCache = new Map()

export const organizationsStore = create<OrganizationsStore>(
  persist(
    (set, get) => ({
      organizations: processItems(organizations),
      getOrganizationLogoUrl(forName: string, size = 100) {
        let c = logoCache.get(forName)
        if (!c) {
          const qs = String(forName).trim().toLocaleLowerCase()
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
          '//images.ctfassets.net/8k0h54kbe6bj/6XhCz5Ss17OVLxpXNVDxAO/d3d6716bdb9ecdc5041e6baf68b92ba6/coat_of_arms.svg'
        const res = `https:${url}?w=${size}&h=${size}&fit=pad&bg=white&fm=png`
        return res
      },
      actions: {
        updateOriganizations() {
          client.query({ query: GET_ORGANIZATIONS_QUERY }).then((res) => {
            set({
              organizations: processItems(res.data.getOrganizations.items),
            })
          })
        },
      },
    }),
    {
      name: 'organizations',
      getStorage: () => AsyncStorage,
    },
  ),
)

export const useOrganizationsStore = createUse(organizationsStore)
