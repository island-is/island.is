import React, {
  FC,
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import {useAuthStore} from '../stores/auth-store';
import * as configcat from 'configcat-js';
import AsyncStorage from '@react-native-community/async-storage';
import {getConfig} from '../config';

interface FeatureFlagUser {
  identifier: string;
  attributes?: {[key: string]: string};
}

export interface FeatureFlagClient {
  getValue(
    key: string,
    defaultValue: boolean | string,
    user?: FeatureFlagUser,
  ): Promise<boolean | string>;

  dispose(): void;
}

const FeatureFlagContext = createContext<FeatureFlagClient>({
  getValue: (_, defaultValue) => Promise.resolve(defaultValue),
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  dispose() {},
});

export interface FeatureFlagContextProviderProps {
  children: ReactNode;
  defaultUser?: FeatureFlagUser;
}

class ConfigCatAsyncStorageCache {
  set(key: string, config: configcat.ProjectConfig) {
    return AsyncStorage.setItem(key, JSON.stringify(config));
  }
  async get(key: string) {
    const item = await AsyncStorage.getItem(key);
    if (item) {
      try {
        return JSON.parse(item) as configcat.ProjectConfig;
      } catch (err) {
        // noop
      }
    }
    return null;
  }
}

// const logger = configcat.createConsoleLogger(configcat.LogLevel.Info);
const featureFlagClient = configcat.getClient(
  getConfig().configCat ?? '',
  configcat.PollingMode.AutoPoll,
  {
    dataGovernance: configcat.DataGovernance.EuOnly,
    // logger: logger,
    cache: new ConfigCatAsyncStorageCache(),
  },
);

export const FeatureFlagProvider: FC<
  React.PropsWithChildren<FeatureFlagContextProviderProps>
> = ({children}) => {
  const {userInfo} = useAuthStore();
  const [time, setTime] = useState(Date.now());

  useEffect(() => {
    const listener = () => setTime(Date.now());
    featureFlagClient.addListener('configChanged', listener);

    return () => {
      featureFlagClient.removeListener('configChanged', listener);
    };
  }, []);

  const context = useMemo<FeatureFlagClient>(() => {
    const userAuth =
      userInfo && userInfo.nationalId
        ? {
            identifier: userInfo.nationalId,
            attributes: {
              nationalId: userInfo.nationalId,
              name: userInfo.name,
            },
          }
        : undefined;
    return {
      getValue(
        key: string,
        defaultValue: boolean | string,
        user: FeatureFlagUser | undefined = userAuth,
      ) {
        return featureFlagClient.getValueAsync(key, defaultValue, user);
      },
      dispose: () => featureFlagClient.dispose(),
    };
  }, [featureFlagClient, userInfo, time]);

  return (
    <FeatureFlagContext.Provider value={context}>
      {children}
    </FeatureFlagContext.Provider>
  );
};

export const useFeatureFlagClient = () => {
  return useContext(FeatureFlagContext);
};

export function useFeatureFlag(key: string, defaultValue: string): string;
export function useFeatureFlag(key: string, defaultValue: boolean): boolean;

export function useFeatureFlag<T extends string | boolean>(
  key: string,
  defaultValue: T,
) {
  const featureFlagClient = useFeatureFlagClient();
  const [flag, setFlag] = useState<T>(defaultValue);

  useEffect(() => {
    featureFlagClient.getValue(key, defaultValue).then(result => {
      setFlag(result as T);
    });
  }, [defaultValue, featureFlagClient, key]);

  return flag;
}
