import { Box } from '@island.is/island-ui/core'
import { NumberInput } from '@island.is/financial-aid-web/veita/src/components'
import { AidName, KeyMapping } from '@island.is/financial-aid/shared/lib'

interface Props {
  id: string
  aid: number
  prefix: string
  error: boolean
  update: (value: number) => void
}

const MunicipalityAdminInput = ({ id, aid, prefix, error, update }: Props) => {
  const label: KeyMapping<AidName, string> = {
    ownPlace: 'Eigið húsnæði',
    registeredRenting: 'Leiga með þinglýstan leigusamning',
    unregisteredRenting: 'Leiga með óþinglýstan leigusamning',
    withOthers: 'Býr eða leigir hjá öðrum án þinglýsts leigusamnings',
    livesWithParents: 'Býr hjá foreldrum',
    unknown: 'Annað',
  }

  return (
    <Box id={`${prefix}${id}`} marginBottom={[1, 1, 3]}>
      <NumberInput
        id={`input${prefix}${id}`}
        name={`${prefix}${id}`}
        label={label[id as AidName]}
        maximumInputLength={6}
        value={aid.toString()}
        hasError={error && aid === 0}
        errorMessage={'Grunnupphæð getur ekki verið 0'}
        onUpdate={(value) => update(value)}
      />
    </Box>
  )
}

export default MunicipalityAdminInput
