import AsyncStorage from '@react-native-async-storage/async-storage'
import createUse from 'zustand'
import { persist } from 'zustand/middleware'
import create, { State } from 'zustand/vanilla'
import { config, environments } from '../config'

export interface EnvironmentConfig {
  id: string
  label: string
  idsIssuer: string
  apiUrl: string
  baseUrl: string
  configCat: string | null
  datadog: string | null
}

interface CognitoResponse {
  accessToken: string
  idToken: string
  tokenType: string
  expiresIn: number
  expiresAt: number
}

export interface EnvironmentResponse {
  results: {
    ids: EnvironmentConfig[]
    branches: Array<{
      namespace: string
      host: string
      path: string
    }>
  }
}

export interface EnvironmentStore extends State {
  environment: EnvironmentConfig
  cognito: CognitoResponse | null
  loading: boolean
  fetchedAt: number
  result: EnvironmentConfig[]
  actions: {
    setEnvironment(environment: EnvironmentConfig): void
    loadEnvironments(): Promise<EnvironmentConfig[]>
    setCognito(cognito: CognitoResponse): void
  }
}

export const environmentStore = create<EnvironmentStore>(
  persist(
    (set, get) => ({
      environment: config.isTestingApp ? environments.dev : environments.prod,
      result: [],
      fetchedAt: 0,
      cognito: null,
      loading: false,
      actions: {
        setEnvironment(environment: EnvironmentConfig) {
          set({
            environment,
          })
        },
        async loadEnvironments() {
          if (get().fetchedAt > Date.now() - 1000 * 60 * 2) {
            // Cache for two minutes
            return get().result
          }

          set({ loading: true })

          try {
            const res = await fetch(config.environmentsUrl, {
              headers: {
                'X-Cognito-Token': `Bearer ${get().cognito?.accessToken}`,
              },
            }).then((r) => r.json() as Promise<EnvironmentResponse>)
            const ids = res.results.ids.map((n) => {
              const local =
                environments[n.id as keyof typeof environments] ?? {}
              const remote = n as any
              return {
                ...local,
                ...n,
                // Preserve baseUrl from local if remote does not provide it
                baseUrl: remote.baseUrl ?? remote.apiUrl.replace('/api', ''),
              }
            })
            const dev = ids.find((n) => n.id === 'dev')
            const result = [
              ...ids,
              ...res.results.branches.map((branch) => ({
                ...dev,
                id: branch.namespace,
                label: branch.namespace,
                apiUrl: `https://${branch.host}${branch.path}`,
              })),
              environments.local,
              environments.mock,
            ] as EnvironmentConfig[]
            set({ loading: false, fetchedAt: Date.now(), result })

            return result as EnvironmentConfig[]
          } catch (err) {
            // noop
          }
          set({ loading: false })
          return Object.values(environments) as EnvironmentConfig[]
        },
        setCognito(cognito: CognitoResponse) {
          set({
            cognito: {
              ...cognito,
              expiresAt: Date.now() + cognito.expiresIn * 1000,
            },
          })
        },
      },
    }),
    {
      name: '@island/environment13',
      getStorage: () => AsyncStorage,
      deserialize(str: string) {
        const { state, version } = JSON.parse(str)
        delete state.actions
        delete state.loading

        if (!config.isTestingApp) {
          state.environment = environments.prod
        }

        return { state, version }
      },
    },
  ),
)

export const useEnvironmentStore = createUse(environmentStore)
