import { Field, ObjectType } from '@nestjs/graphql'

interface IOrganizationTheme {
  gradientStartColor?: string
  gradientEndColor?: string
}

@ObjectType()
export class OrganizationTheme {
  @Field()
  gradientStartColor!: string

  @Field()
  gradientEndColor!: string
}

export const mapOrganizationTheme = (
  theme: IOrganizationTheme,
): OrganizationTheme => ({
  gradientStartColor: theme.gradientStartColor ?? '',
  gradientEndColor: theme.gradientEndColor ?? '',
})
