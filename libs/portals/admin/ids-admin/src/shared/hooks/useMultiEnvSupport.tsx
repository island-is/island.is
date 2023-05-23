import { useContext, useEffect, useState } from 'react'
import { ClientContext } from '../context/ClientContext'

export const useMultiEnvSupport = () => {
  const { client } = useContext(ClientContext)
  const [shouldSupportMultiEnv, setShouldSupportMultiEnv] = useState<boolean>(
    true,
  )

  useEffect(() => {
    setShouldSupportMultiEnv(client?.availableEnvironments?.length > 1)
  }, [client])

  return { shouldSupportMultiEnv }
}
