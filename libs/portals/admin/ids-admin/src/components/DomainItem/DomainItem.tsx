import { Typography } from '@island.is/island-ui/core'

interface DomainItemProps {
  domain: string
  title: string
  numberOfApplications: number
  numberOfApis: number
}

const DomainItem = ({
  domain,
  title,
  numberOfApplications,
  numberOfApis,
}: DomainItemProps) => {
  return <Typography variant={'h3'}>{title}</Typography>
}

export default DomainItem
