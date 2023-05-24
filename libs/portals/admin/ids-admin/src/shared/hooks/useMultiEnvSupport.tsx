import { useEffect, useState } from 'react'
import { useClient } from '../../components/Client/ClientContext'

export const useMultiEnvSupport = () => {
  const { client } = useClient()
  const [shouldSupportMultiEnv, setShouldSupportMultiEnv] = useState(true)

  useEffect(() => {
    setShouldSupportMultiEnv(client?.availableEnvironments?.length > 1)
  }, [client])

  return { shouldSupportMultiEnv }
}
