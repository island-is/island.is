import { ActionCard, Box, Button, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  getNameAbbreviation,
  formatNationalId,
  ServicePortalPath,
  m,
} from '@island.is/service-portal/core'
import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import * as styles from './FamilyMemberCard.css'

interface Props {
  title: string
  nationalId?: string
  familyRelation?: string
  currentUser?: boolean
}

export const FamilyMemberCard: FC<Props> = ({
  title,
  nationalId,
  currentUser,
}) => {
  const { formatMessage } = useLocale()

  return (
    <Stack space={2}>
      <ActionCard
        cta={{
          label: 'Skoða upplýsingar',
          variant: 'primary',
        }}
        heading="YT-R26"
        headingVariant="h4"
        text="Ford Focus, 2010"
      />
      <ActionCard
        cta={{
          label: 'Skoða upplýsingar',
          variant: 'primary',
          disabled: true,
        }}
        heading="YT-R26"
        text="Ford Focus, 2010"
      />
      <ActionCard
        cta={{
          label: 'Recycle car',
          variant: 'text',
        }}
        tag={{ label: 'Co-owned' }}
        heading="YT-R26"
        text="Ford Focus, 2010"
      />
      <ActionCard
        cta={{
          label: 'Open process',
          variant: 'text',
          size: 'small',
        }}
        tag={{ label: 'Take to recycling company', variant: 'rose' }}
        heading="YT-R26"
        text="Ford Focus, 2010"
        progressMeter={{
          active: true,
          variant: 'rose',
          progress: 0.3,
        }}
      />
      <ActionCard
        cta={{
          label: 'Begin process',
          variant: 'primary',
        }}
        tag={{ label: 'Umsókn' }}
        heading="Umsókn um ökunám"
        eyebrow="Samgöngustofa"
        text="Dagur Örn Kristjánsson getur hafið ökunám. Hægt er að byrja ferlið hér"
      />
      <ActionCard
        cta={{
          label: 'Hefja umsóknarferli',
          variant: 'primary',
          icon: 'arrowForward',
        }}
        backgroundColor="blue"
        heading="Umsókn um fæðingarorlof"
      />
      <ActionCard
        tag={{ label: 'Co-owned' }}
        cta={{
          label: 'Recycle car',
          variant: 'text',
        }}
        heading="YT-R26"
        text="Ford Focus, 2012"
      />
      <ActionCard
        date={new Date().toDateString()}
        tag={{ label: 'In progress' }}
        cta={{
          label: 'Open application',
          variant: 'text',
          size: 'small',
        }}
        heading="Parental leave"
        text="Your application is in progress. Waiting for VMST approval"
        progressMeter={{
          active: true,
          progress: 0.8,
        }}
      />
    </Stack>
    // <Box
    //   display={['block', 'flex']}
    //   alignItems="center"
    //   paddingY={[2, 3, 4]}
    //   paddingX={[2, 3, 4]}
    //   border="standard"
    //   borderRadius="large"
    // >
    //   <Box display="flex" alignItems="center">
    //     <Box
    //       display="flex"
    //       justifyContent="center"
    //       alignItems="center"
    //       flexShrink={0}
    //       marginRight={[2, 4]}
    //       borderRadius="circle"
    //       background="blue100"
    //       className={styles.avatar}
    //     >
    //       <Text variant="h2" as="h2" color="blue400">
    //         {getNameAbbreviation(title)}
    //       </Text>
    //     </Box>
    //     <div>
    //       <Box marginBottom={nationalId ? 1 : 0}>
    //         <Text variant="h3" as="h3" color="dark400">
    //           {title}
    //         </Text>
    //       </Box>
    //       {nationalId && (
    //         <Text fontWeight="light">
    //           {formatMessage(m.natreg)}: {formatNationalId(nationalId)}
    //         </Text>
    //       )}
    //     </div>
    //   </Box>
    //   {nationalId && (
    //     <Box
    //       display="flex"
    //       alignItems="flexEnd"
    //       justifyContent="flexEnd"
    //       marginTop={[2, 'auto']}
    //       marginLeft="auto"
    //     >
    //       <Link
    //         to={
    //           currentUser
    //             ? ServicePortalPath.UserInfo
    //             : ServicePortalPath.FamilyMember.replace(
    //                 ':nationalId',
    //                 nationalId,
    //               )
    //         }
    //       >
    //         <Button variant="text" size="small">
    //           {formatMessage({
    //             id: 'sp.family:see-info',
    //             defaultMessage: 'Skoða upplýsingar',
    //           })}
    //         </Button>
    //       </Link>
    //     </Box>
    //   )}
    // </Box>
  )
}
