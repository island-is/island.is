import React, { FC } from 'react'
import {
  Typography,
  Stack,
  Accordion,
  AccordionItem,
} from '@island.is/island-ui/core'

const FAQ: FC = () => (
  <Stack space={2}>
    <Typography variant="h2" as="h2">
      Common questions and answers
    </Typography>
    <Accordion dividerOnTop={false}>
      <AccordionItem label="How does the service work?" id="1">
        <Stack space={2}>
          <Typography variant="p" links>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Amet
            molestie viverra molestie pharetra vestibulum. Non erat diam, lorem
            malesuada felis nec turpis enim. Maecenas netus sagittis
            pellentesque ultrices est dolor pretium. Aliquam quis rutrum quam
            sed.
          </Typography>
        </Stack>
      </AccordionItem>
      <AccordionItem label="When do I recive my payback?" id="2">
        <Stack space={2}>
          <Typography variant="p" links>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Amet
            molestie viverra molestie pharetra vestibulum. Non erat diam, lorem
            malesuada felis nec turpis enim. Maecenas netus sagittis
            pellentesque ultrices est dolor pretium. Aliquam quis rutrum quam
            sed.
          </Typography>
        </Stack>
      </AccordionItem>
      <AccordionItem label="Where can i take my car for recycling?" id="3">
        <Stack space={2}>
          <Typography variant="p" links>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Amet
            molestie viverra molestie pharetra vestibulum.
          </Typography>
          <Typography variant="p" links>
            Non erat diam, lorem malesuada felis nec turpis enim. Maecenas netus
            sagittis pellentesque ultrices est dolor pretium. Aliquam quis
            rutrum quam sed.
          </Typography>
        </Stack>
      </AccordionItem>
    </Accordion>
  </Stack>
)

export default FAQ
