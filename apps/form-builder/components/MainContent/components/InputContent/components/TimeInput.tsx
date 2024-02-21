import {
  GridRow as Row,
  GridColumn as Column,
  Select,
} from '@island.is/island-ui/core'
import { useContext } from 'react'
import FormBuilderContext from '../../../../../context/FormBuilderContext'

export default function TimeInput() {
  const { listsDispatch } = useContext(FormBuilderContext)
  return (
    <Row>
      <Column span="5/10">
        <Select
          label="Tímabil"
          name="interval"
          size="sm"
          backgroundColor="blue"
          defaultValue={{ label: 'Mínútu fresti', value: '0' }}
          options={[
            { label: 'Mínútu fresti', value: '0' },
            { label: 'Klukkutíma fresti', value: '1' },
            { label: 'Hálftíma fresti', value: '2' },
            { label: 'Korter fresti', value: '3' },
          ]}
          onChange={(e) => {
            listsDispatch({
              type: 'timeInterval',
              payload: { data: e ? e.value : '0' }
            })
          }}
        />
      </Column>
    </Row>
  )
}
