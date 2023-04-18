import AsyncStorage from '@react-native-community/async-storage';
import {config, environments} from '../config';
import createUse from 'zustand';
import {persist} from 'zustand/middleware';
import create, {State} from 'zustand/vanilla';

export interface EnvironmentConfig {
  id: string;
  label: string;
  idsIssuer: string;
  apiUrl: string;
  configcat: string | null;
  datadog: string | null;
}

interface CognitoResponse {
  accessToken: string;
  idToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface EnvironmentResponse {
  results: {
    ids: EnvironmentConfig[];
    branches: Array<{
      namespace: string;
      host: string;
      path: string;
    }>;
  };
}

export interface EnvironmentStore extends State {
  environment: EnvironmentConfig;
  cognito: CognitoResponse | null;
  loading: boolean;
  actions: {
    setEnvironment(id: string): void;
    loadEnvironments(): Promise<EnvironmentConfig[]>;
    setCognito(cognito: CognitoResponse): void;
  };
}

export const environmentStore = create<EnvironmentStore>(
  persist(
    (set, get) => ({
      environment: environments.prod,
      cognito: null,
      loading: false,
      actions: {
        setEnvironment(id: keyof typeof environments) {
          set({
            environment: environments[id],
          });
        },
        async loadEnvironments() {
          set({loading: true});
          try {
            const res = await fetch(config.environmentsUrl, {
              headers: {
                'X-Cognito-Token': `Bearer ${get().cognito?.accessToken}`,
              },
            }).then(r => r.json() as Promise<EnvironmentResponse>);
            const ids = res.results.ids.map(n => ({
              ...((environments as any)[n.id] ?? {}),
              ...n,
            }));
            const dev = ids.find(n => n.id === 'dev');
            return [
              ...ids,
              ...res.results.branches.map(branch => ({
                ...dev,
                id: branch.namespace,
                label: branch.namespace,
                apiUrl: `https://${branch.host}${branch.path}`,
              })),
            ];
          } catch (err) {
            console.error(err);
          }
          set({loading: false});
          return [];
        },
        setCognito(cognito: CognitoResponse) {
          set({
            cognito,
          });
        },
      },
    }),
    {
      name: '@island/environment10',
      getStorage: () => AsyncStorage,
      deserialize(str: string) {
        const {state, version} = JSON.parse(str);
        delete state.actions;
        return {state, version};
      },
    },
  ),
);

export const useEnvironmentStore = createUse(environmentStore);
