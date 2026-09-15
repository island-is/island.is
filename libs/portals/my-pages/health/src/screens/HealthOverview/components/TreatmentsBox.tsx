import { Box, Hidden, Icon, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { LinkResolver, m } from '@island.is/portals/my-pages/core'
import { Features, useFeatureFlag } from '@island.is/react/feature-flags'
import { messages } from '../../../lib/messages'
import { HealthPaths } from '../../../lib/paths'
import { SECTION_GAP } from '../../../utils/constants'
import { useGetHealthTreatmentsOverviewQuery } from '../../Treatments/TreatmentOverview.generated'
import * as styles from './TreatmentsBox.css'

export const TreatmentsBox = () => {
  const { formatMessage } = useLocale()
  const { value: showTreatments } = useFeatureFlag(
    Features.isServicePortalHealthTreatmentsPageEnabled,
    false,
  )

  const { data, loading, error } = useGetHealthTreatmentsOverviewQuery({
    skip: !showTreatments,
  })

  const treatments = data?.healthDirectorateTreatments

  if (!showTreatments || loading || error || !treatments?.length) {
    return null
  }

  return (
    <Box marginBottom={SECTION_GAP}>
      <Box marginBottom={2}>
        <Text variant="eyebrow" color="foregroundBrandSecondary">
          {formatMessage(messages.treatment)}
        </Text>
      </Box>
      <Stack space={2}>
        {treatments.map((treatment) => (
          <LinkResolver
            key={treatment.id}
            href={HealthPaths.HealthTreatment.replace(':id', treatment.id)}
            className={styles.cardLink}
          >
            <Box
              background="white"
              border="standard"
              borderColor="blue200"
              borderRadius="large"
              padding={3}
              display="flex"
              justifyContent="spaceBetween"
              columnGap={3}
            >
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="flexStart"
              >
                <Text variant="h4" color="blue400" marginBottom={1}>
                  {treatment.name.trim() || formatMessage(m.healthTreatment)}
                </Text>
                <Text>
                  {formatMessage(messages.treatmentOverviewCardDescription)}
                </Text>
              </Box>
              <Box display="flex" columnGap={[2, 2, 2, 8]}>
                <Hidden below="md">
                  <Box display="flex" alignItems="center" height="full">
                    <img
                      src="./assets/images/treatment_flower.svg"
                      alt=""
                      className={styles.image}
                    />
                  </Box>
                </Hidden>
                <Box paddingTop="smallGutter">
                  <Icon icon="arrowForward" type="outline" color="blue400" />
                </Box>
              </Box>
            </Box>
          </LinkResolver>
        ))}
      </Stack>
    </Box>
  )
}

export default TreatmentsBox
