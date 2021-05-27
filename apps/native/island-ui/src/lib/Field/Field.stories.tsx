import { withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react-native'
import React from 'react'
import { SafeAreaView, View } from 'react-native'
import { Field } from './Field'
import { FieldCard } from './FieldCard'
import { FieldGroup } from './FieldGroup'
import { FieldLabel } from './FieldLabel'
import { FieldRow } from './FieldRow'

const CenterView = ({ children }: any) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    {children}
  </View>
)

storiesOf('Field', module)
  .addDecorator((getStory) => <CenterView>{getStory()}</CenterView>)
  .addDecorator(withKnobs)
  .add('Compact', () => {
    return (
      <Field
        compact
        size="large"
        label="1. Eiginnafn"
        value="Svanur"
        style={{ marginRight: 8 }}
      />
    )
  })
  .add('2 Compact In Row', () => {
    return (
      <FieldRow>
        <Field
          compact
          size="large"
          label="2. Eiginnafn"
          value="Svanur"
          style={{ marginRight: 8 }}
        />
        <Field compact size="large" label="1. Kenninafn" value="Örn Svanberg" />
      </FieldRow>
    )
  })
  .add('3 In Group', () => {
    return (
      <View style={{ width: '100%', paddingHorizontal: 16 }}>
        <FieldGroup>
          <FieldRow>
            <Field label="4a. Útgáfudagur" value="12.03.1990" />
            <Field label="4b. Gildir til" value="01.01.2041" />
            <Field label="5. Númer" value="36001475" />
          </FieldRow>
        </FieldGroup>
      </View>
    )
  })
  .add('Card', () => {
    return (
      <View style={{ paddingHorizontal: 16, width: '100%' }}>
        <FieldCard code="B" title="Fólksbíll">
          <FieldRow>
            <Field label="Útgáfudagur" value="12.03.1990" />
            <Field label="Gildir til" value="01.01.2041" />
          </FieldRow>
        </FieldCard>
      </View>
    )
  })
  .add('Full Example', () => {
    return (
      <View style={{ width: '100%' }}>
        <SafeAreaView style={{ marginHorizontal: 16 }}>
          <FieldGroup>
            <FieldRow>
              <Field
                compact
                size="large"
                label="2. Eiginnafn"
                value="Svanur"
                style={{ marginRight: 8 }}
              />
              <Field
                compact
                size="large"
                label="1. Kenninafn"
                value="Örn Svanberg"
              />
            </FieldRow>
            <Field label="4d. Kennitala" value="010171-3389" />
          </FieldGroup>
          <FieldGroup>
            <FieldRow>
              <Field label="4a. Útgáfudagur" value="12.03.1990" />
              <Field label="4b. Gildir til" value="01.01.2041" />
              <Field label="5. Númer" value="36001475" />
            </FieldRow>
          </FieldGroup>
          <View style={{ marginTop: 24, paddingBottom: 4 }}>
            <FieldLabel>9. Réttindaflokkar</FieldLabel>
            <FieldCard code="B" title="Fólksbíll">
              <FieldRow>
                <Field label="Útgáfudagur" value="12.03.1990" />
                <Field label="Gildir til" value="01.01.2041" />
              </FieldRow>
            </FieldCard>
            <FieldCard code="BE" title="Kerra">
              <FieldRow>
                <Field label="Útgáfudagur" value="12.03.1990" />
                <Field label="Gildir til" value="01.01.2041" />
              </FieldRow>
            </FieldCard>
          </View>
        </SafeAreaView>
      </View>
    )
  })
