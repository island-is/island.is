import {
  Box,
  Button,
  Text,
  Inline
} from '@island.is/island-ui/core'
import { useNavigate } from 'react-router-dom'
import { FormSystemPaths } from '../../lib/paths'
import TableRow from '../../components/TableRow/TableRow'
const Forms = () => {
  const navigate = useNavigate()
  // const {data: formBuilder, loading} = useGetFormBuilderQuery({
  //   variables: {
  //     input: 1
  //   }
  // })
  const formBuilder: any = {
    forms: []
  }

  if (navigate) {
    return (
      <Box>
        {/* Title and buttons  */}
        <Box>
          <Text variant="h2">Forskriftir</Text>
        </Box>
        <Box marginTop={5}>
          <Inline space={2}>
            <Button
              variant="ghost"
              size="medium"
              onClick={() =>
                navigate(FormSystemPaths.Form)
              }
            >
              Ný forskrift
            </Button>
            <Button variant="ghost" size="medium">
              Hlaða inn forskrift
            </Button>
          </Inline>
        </Box>

        <Box marginTop={5}></Box>

        <Box marginTop={5}>
          <Box width={'half'}></Box>
          <Box></Box>
        </Box>
        <TableRow isHeader={true} />
        {formBuilder.forms &&
          formBuilder.forms?.map((f) => {
            return (
              <TableRow
                key={f.id}
                id={f.id}
                name={f.name.is}
                created={f.created}
                lastModified={f.lastChanged}
                org={f.organization.id}
                isHeader={false}
                translated={f.isTranslated}
              />
            )
          })}
      </Box>
    )
  }
  return <></>
}

export default Forms
