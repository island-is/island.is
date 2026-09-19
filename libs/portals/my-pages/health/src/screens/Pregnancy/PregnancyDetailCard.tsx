import { Box, Text } from '@island.is/island-ui/core'
import * as styles from './PregnancyDetailCard.css'

interface PregnancyDetail {
  label: string
  value: string
}

interface Props {
  details: PregnancyDetail[]
  img?: string
}

export const PregnancyDetailCard = ({ details, img }: Props) => {
  if (details.length === 0) {
    return null
  }

  return (
    <Box
      border="standard"
      borderColor="blue200"
      borderRadius="large"
      background="white"
      padding={[3, 3, 4]}
      display="flex"
      columnGap={4}
    >
      <Box className={styles.grid}>
        {details.map((detail, index) => (
          <Box
            key={`${detail.label}-${index}`}
            className={index % 2 === 1 ? styles.dividerCell : undefined}
          >
            <Text variant="small" marginBottom={1}>
              {detail.label}
            </Text>
            <Text variant="h3" as="p">
              {detail.value}
            </Text>
          </Box>
        ))}
      </Box>
      {img && (
        <Box component="img" alt="" src={img} className={styles.image} />
      )}
    </Box>
  )
}

export default PregnancyDetailCard
