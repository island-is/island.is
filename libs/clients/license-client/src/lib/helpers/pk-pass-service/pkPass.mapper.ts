import { Pass as PassV1 } from '@island.is/clients/smartsolutions'
import { Pass as PassV2 } from '@island.is/clients/smart-solutions-v2'
import { PassData } from '../../licenseClient.type'

export const mapPassData = (pass: PassV1 | PassV2): PassData => ({
  ...pass,
  inputFieldValues: (pass?.inputFieldValues ?? []).map((i) => ({
    id: i.id,
    identifier: i.passInputField.identifier,
    value: i.value ?? undefined,
  })),
  expirationDate: pass?.expirationDate
    ? new Date(pass?.expirationDate).toISOString()
    : undefined,
  whenCreated: new Date(pass.whenCreated).toISOString(),
  whenModified: new Date(pass.whenModified).toISOString(),
})
