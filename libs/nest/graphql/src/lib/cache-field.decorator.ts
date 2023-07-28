import { applyDecorators } from '@nestjs/common'
import { Field } from '@nestjs/graphql'
import { FieldOptions } from '@nestjs/graphql/dist/decorators/field.decorator'
import { ReturnTypeFunc } from '@nestjs/graphql/dist/interfaces/return-type-func.interface'
import { CacheControl, CacheControlOptions } from './cache-control.decorator'

export interface CacheFieldOptions extends FieldOptions {
  cacheControl?: CacheControlOptions
}

export function CacheField(
  options: CacheFieldOptions,
): PropertyDecorator & MethodDecorator

export function CacheField(
  returnTypeFunction: ReturnTypeFunc,
  options?: CacheFieldOptions,
): PropertyDecorator & MethodDecorator

/**
 * @CacheField() decorator extends the NestJS Field decorator but includes a CacheControl directive which defaults to
 * `inheritFromParent: true`. This is recommended for object fields under a cached parent resolver.
 */
export function CacheField(
  typeOrOptions: ReturnTypeFunc | CacheFieldOptions,
  cacheFieldOptions?: CacheFieldOptions,
): PropertyDecorator & MethodDecorator {
  const [typeFunc, options] =
    typeof typeOrOptions === 'function'
      ? [typeOrOptions, cacheFieldOptions]
      : [undefined, typeOrOptions]
  return applyDecorators(
    Field(typeFunc, options),
    CacheControl(options?.cacheControl ?? { inheritMaxAge: true }),
  )
}
