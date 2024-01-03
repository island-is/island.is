import { text, withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react-native'
import React from 'react'
import { Text, View } from 'react-native'
import { Accordion } from './accordion'
import { AccordionItem } from './accordion-item'

const CenterView = ({ children }: any) => (
  <View style={{ flex: 1, justifyContent: 'center' }}>{children}</View>
)

storiesOf('Accordion', module)
  .addDecorator((getStory) => <CenterView>{getStory()}</CenterView>)
  .addDecorator(withKnobs)
  .add('Accordion defaulte', () => {
    const title = text('Accordion Title', 'Barn Sveinsson')

    return (
      <Accordion>
        <AccordionItem key="alert1" title={title}>
          <Text>Testin</Text>
        </AccordionItem>
      </Accordion>
    )
  })
