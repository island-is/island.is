import { Field, ObjectType } from '@nestjs/graphql'

interface IOrganizationTheme {
  gradientStartColor?: string
  gradientEndColor?: string
  backgroundColor?: string
  darkText?: boolean
  fullWidth?: boolean
  textColor?: string
  imagePadding?: string
  imageIsFullHeight?: boolean
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
  fullWidth?: boolean

  @Field(() => String, { nullable: true })
  textColor?: string

  @Field(() => String, { nullable: true })
  imagePadding?: string

  @Field(() => Boolean, { nullable: true })
  imageIsFullHeight?: boolean
}

export const mapOrganizationTheme = (
  theme: IOrganizationTheme,
): OrganizationTheme => {
  let textColor = theme.darkText === false ? 'white' : 'dark400'

  if (theme.textColor) {
    textColor = theme.textColor
  }

  return {
    gradientStartColor: theme.gradientStartColor ?? '',
    gradientEndColor: theme.gradientEndColor ?? '',
    backgroundColor: theme.backgroundColor ?? '',
    fullWidth: !theme.fullWidth ? false : true,
    textColor,
    imagePadding: theme.imagePadding,
    imageIsFullHeight: theme.imageIsFullHeight ?? true,
  }
}
