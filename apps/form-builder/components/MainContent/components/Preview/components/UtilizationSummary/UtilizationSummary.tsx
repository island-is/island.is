import {
  Select,
  GridColumn,
  GridRow,
  Button,
  Stack,
} from "@island.is/island-ui/core"
import { useState } from "react"


export default function UtilizationSummary() {

  const years = [
    {
      label: '2021',
      value: '2021'
    },
    {
      label: '2022',
      value: '2022'
    },
    {
      label: '2023',
      value: '2023'
    },
    {
      label: '2024',
      value: '2024'
    },
  ]

  const [dates, setDates] = useState<Date[]>([])


  return (
    <Stack space={2}>
      <GridRow>
        <GridColumn span='5/12'>
          <Select
            options={years}
            name='year'
            label='Ár'
            placeholder="Veldu ár"
            onChange={(date) => console.log(date)}
          />
        </GridColumn>
      </GridRow>
      <GridRow>
        <Button onClick={() => console.log(getAllDateStringsInMonth(1, 2023))}>Btn</Button>
      </GridRow>
    </Stack>
  )
}

function getDaysInMonth(month: number, year: number) {
  return new Date(year, month, 0).getDate()
}

function getAllDateStringsInMonth(month: number, year: number): Date[] {
  const days = getDaysInMonth(month, year)
  const dateStrings = []
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  for (let i = 1; i <= days; i++) {
    const date = new Date(Date.UTC(year, month - 1, i))
    dateStrings.push(new Intl.DateTimeFormat('is-IS', options).format(date));
  }
  return dateStrings
}
