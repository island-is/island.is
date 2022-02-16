import { Box } from '@island.is/island-ui/core'
import { NumberInput } from '@island.is/financial-aid-web/veita/src/components'
import { AidName, KeyMapping } from '@island.is/financial-aid/shared/lib'

interface Props {
  id: string
  aid: number
  prefix: string
  hasAidError: boolean
  updateHandler: (value: number) => void
}

const MunicipalityAdminInput = ({
  id,
  aid,
  prefix,
  hasAidError,
  updateHandler,
}: Props) => {
  const label: KeyMapping<string, string> = {
    [AidName.OWNPLACE]: 'Eigið húsnæði',
    [AidName.REGISTEREDRENTING]: 'Leiga með þinglýstan leigusamning',
    [AidName.UNREGISTEREDRENTING]: 'Leiga með óþinglýstan leigusamning',
    [AidName.WITHOTHERS]: 'Býr eða leigir hjá öðrum án þinglýsts leigusamnings',
    [AidName.LIVESWITHPARENTS]: 'Býr hjá foreldrum',
    [AidName.UNKNOWN]: 'Annað',
  }

  return (
    <Box id={`${prefix}${id}`} marginBottom={[1, 1, 3]}>
      <NumberInput
        id={`input${prefix}${id}`}
        name={`${prefix}${id}`}
        label={label[id]}
        maximumInputLength={6}
        value={aid.toString()}
        hasError={hasAidError && aid === 0}
        errorMessage={'Grunnupphæð getur ekki verið 0'}
        onUpdate={(value) => updateHandler(value)}
      />
    </Box>
  )
}

export default MunicipalityAdminInput
