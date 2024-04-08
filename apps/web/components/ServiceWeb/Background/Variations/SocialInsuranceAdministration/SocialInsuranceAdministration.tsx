import { Box } from '@island.is/island-ui/core'
import { useNamespace } from '@island.is/web/hooks'

import * as styles from './SocialInsuranceAdministration.css'

interface SocialInsuranceAdministrationProps {
  namespace: Record<string, string>
}

const SocialInsuranceAdministration = ({
  namespace,
}: SocialInsuranceAdministrationProps) => {
  const n = useNamespace(namespace)
  return <Box className={styles.bg}></Box>
}

export default SocialInsuranceAdministration
