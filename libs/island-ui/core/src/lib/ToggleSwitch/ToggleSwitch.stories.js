import {
  ToggleSwitchCheckbox,
  ToggleSwitchButton,
  ToggleSwitchLink,
} from './index'
import { useState } from 'react'

export default {
  title: 'Form/ToggleSwitch',
}

const DefaultComponent = () => {
  const [checked, setChecked] = useState(false)

  return (
    <>
      <ToggleSwitchCheckbox
        label="Basic Toggle Switch"
        checked={checked}
        onChange={setChecked}
      />
      <ToggleSwitchCheckbox
        label="Large version"
        large
        checked={checked}
        onChange={setChecked}
      />
      <ToggleSwitchCheckbox
        label="Full-width version"
        wide
        checked={checked}
        onChange={setChecked}
      />
      <ToggleSwitchCheckbox
        label="Disabled version"
        disabled
        checked={checked}
        onChange={setChecked}
      />
      <p>In rare instances you may need to hide the label:</p>
      <ToggleSwitchCheckbox
        label="The label is still required!"
        hiddenLabel={true}
        checked={checked}
        onChange={setChecked}
      />
    </>
  )
}

export const Default = {
  render: () => <DefaultComponent />,
  name: 'Default',
}

export const ToggleSwitchCheckboxStory = {
  render: () => (
    <ToggleSwitchCheckbox
      label="Named Toggle Switch Checkbox"
      checked={false}
      onChange={(newChecked) => alert('Checked is now: ' + newChecked)}
      name="fieldName"
      value="fieldValue"
    />
  ),

  name: 'ToggleSwitchCheckbox',
}

export const ToggleSwitchButtonStory = {
  render: () => (
    <ToggleSwitchButton
      label="Basic aria-pressed Toggle Switch"
      checked={false}
      onChange={(newChecked) => alert('Checked is now: ' + newChecked)}
      aria-controls="remote-content-area"
    />
  ),

  name: 'ToggleSwitchButton',
}

export const ToggleSwitchLinkStory = {
  render: () => (
    <ToggleSwitchLink
      label="Simple Toggle Switch link"
      linkText={'Switch the ToggleSwitch off'}
      href="/some/resource/?off"
      checked={true}
      onChange={(newChecked, preventDefault) => {
        alert('Sorry, not today!')
        preventDefault()
      }}
    />
  ),

  name: 'ToggleSwitchLink',
}
