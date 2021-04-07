import { getStaticEnv } from '@island.is/utils/environment'

export default {
  featureFlagSdkKey: getStaticEnv('SI_PUBLIC_CONFIGCAT_SDK_KEY'),
}
