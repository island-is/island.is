import { Field, ObjectType } from '@nestjs/graphql'

interface IOrganizationTheme {
  gradientStartColor?: string
  gradientEndColor?: string
  backgroundColor?: string
  darkText?: boolean
}

@ObjectType()
export class OrganizationTheme {
  @Field()
  gradientStartColor!: string

  @Field()
  gradientEndColor!: string

  @Field(() => String, { nullable: true })
  backgroundColor?: string

  @Field(() => Boolean, { nullable: true })
  darkText?: boolean
}

export const mapOrganizationTheme = (
  theme: IOrganizationTheme,
): OrganizationTheme => ({
  gradientStartColor: theme.gradientStartColor ?? '',
  gradientEndColor: theme.gradientEndColor ?? '',
  backgroundColor: theme.backgroundColor ?? '',
  darkText: !theme.darkText ? false : true,
})
