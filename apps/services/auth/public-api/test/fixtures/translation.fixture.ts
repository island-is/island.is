import { Model } from 'sequelize'
import { Translation } from '@island.is/auth-api-lib'

export type CreateTranslation = Pick<
  Translation,
  'language' | 'className' | 'value' | 'property' | 'key'
>

export const createTranslations = (
  instance: Model,
  language: string,
  translations: Record<string, string>,
): CreateTranslation[] => {
  const className = instance.constructor.name.toLowerCase()
  const key = instance.get(
    (instance.constructor as typeof Model).primaryKeyAttributes[0],
  ) as string
  return Object.entries(translations).map(([property, value]) => ({
    language,
    className,
    key,
    property,
    value,
  }))
}
