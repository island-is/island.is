import React, { FC, createContext, useContext, useMemo } from 'react'
import { useAuthStore } from '../stores/auth-store'
import { config } from '../utils/config'
import * as configcat from "configcat-js";

interface FeatureFlagUser {
  identifier: string
  attributes?: { [key: string]: string }
}

export interface FeatureFlagClient {
  getValue(
    key: string,
    defaultValue: boolean | string,
    user?: FeatureFlagUser,
  ): Promise<boolean | string>

  dispose(): void
}

const FeatureFlagContext = createContext<FeatureFlagClient>({
  getValue: (_, defaultValue) => Promise.resolve(defaultValue),
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  dispose() {},
})

export interface FeatureFlagContextProviderProps {
  defaultUser?: FeatureFlagUser
}

export const FeatureFlagProvider: FC<FeatureFlagContextProviderProps> = ({
  children,
}) => {
  const { userInfo } = useAuthStore()

  // const logger = configcat.createConsoleLogger(configcat.LogLevel.Info);

  const featureFlagClient = configcat.getClient(
    config.configCat,
    configcat.PollingMode.AutoPoll,
    {
      dataGovernance: configcat.DataGovernance.EuOnly,
      // logger: logger,
    }
  );

  const context = useMemo<FeatureFlagClient>(() => {
    const userAuth =
      userInfo && userInfo.nationalId !== undefined
        ? {
            identifier: userInfo.nationalId,
            attributes: {
              nationalId: userInfo.nationalId,
              name: userInfo.name,
            },
          }
        : undefined
    return {
      getValue(
        key: string,
        defaultValue: boolean | string,
        user: FeatureFlagUser | undefined = userAuth,
      ) {
        return featureFlagClient.getValueAsync(key, defaultValue, user)
      },
      dispose: () => featureFlagClient.dispose(),
    }
  }, [featureFlagClient, userInfo])

  return (
    <FeatureFlagContext.Provider value={context}>
      {children}
    </FeatureFlagContext.Provider>
  )
}

export const useFeatureFlagClient = () => {
  return useContext(FeatureFlagContext)
}
