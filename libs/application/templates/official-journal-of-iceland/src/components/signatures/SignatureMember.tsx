import { SignatureMemberKey } from '../../lib/dataSchema'
import { RegularMember } from './RegularMember'
import { CommitteeMember } from './ComitteeMember'

type Props = {
  regular?: boolean
  above?: string
  name?: string
  after?: string
  below?: string
  onChange: (key: SignatureMemberKey, value: string) => void
  onDelete?: () => void
}

export const SignatureMember = ({
  above,
  name,
  after,
  below,
  regular = true,
  onChange,
  onDelete,
}: Props) => {
  switch (regular) {
    case true: {
      return (
        <RegularMember
          above={above}
          name={name}
          after={after}
          below={below}
          onChange={onChange}
          onDelete={onDelete}
        />
      )
    }
    case false: {
      return (
        <CommitteeMember
          name={name}
          below={below}
          onChange={onChange}
          onDelete={onDelete}
        />
      )
    }
  }
}
