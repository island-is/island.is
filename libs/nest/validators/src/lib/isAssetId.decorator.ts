import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator'
import { logger } from '@island.is/logging'

function IsAssetId(validationOptions?: ValidationOptions) {
  return function (input: Object, propertyName: string) {
    registerDecorator({
      name: 'isAssetId',
      target: input.constructor,
      propertyName,
      options: {
        message: 'AssetId is not a of a valid form',
        ...validationOptions,
      },
      validator: {
        validate(_value: unknown, args: ValidationArguments) {
          logger.info('input', input)
          logger.info('args', args)
          logger.info('propertyName', propertyName)
          logger.info('_value', _value)
          return !!args.value.match(/f\d{6}/i)
        },
      },
    })
  }
}

export { IsAssetId }
