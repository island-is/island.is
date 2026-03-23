import handlebars from 'handlebars'
import { SendMailOptions } from 'nodemailer'

type Alignment = 'left' | 'center' | 'right' | undefined
type Style = 'bold' | 'italic' | 'normal' | undefined

export interface ImageComponent {
  component: 'Image'
  context: {
    src: string
    alt: string
    removeFixedHeight?: boolean
  }
}

export interface HeadingComponent {
  component: 'Heading'
  context: {
    copy: string
    align?: Alignment
    small?: boolean
    eyebrow?: string
  }
}

export interface CopyComponent {
  component: 'Copy'
  context: {
    copy: string
    align?: Alignment
    small?: boolean
    style?: Style
  }
}

export interface ListComponent {
  component: 'List'
  context: {
    items: string[]
  }
}

export interface ButtonComponent {
  component: 'Button'
  context: {
    copy: string
    href: string
  }
}

interface SubtitleComponent {
  component: 'Subtitle'
  context: {
    copy: string
    application: string
  }
}

interface SpacerComponent {
  component: 'Spacer'
  context?: object
}

interface TextWithLinkComponent {
  component: 'TextWithLink'
  context: {
    align?: Alignment
    small?: boolean
    style?: Style
    preText?: string
    postText?: string
    linkHref: string
    linkLabel: string
  }
}

interface TagComponent {
  component: 'Tag'
  context: {
    label: string
  }
}

interface ImageWithLinkComponent {
  component: 'ImageWithLink'
  context: {
    src: string
    alt: string
    href: string
    height?: string
  }
}

export type Body =
  | ImageComponent
  | HeadingComponent
  | CopyComponent
  | ButtonComponent
  | ListComponent
  | SubtitleComponent
  | SpacerComponent
  | TextWithLinkComponent
  | TagComponent
  | ImageWithLinkComponent

export interface Template {
  title: string
  body: Body[]
}

/**
 * Define the design template.
 * Figma design: https://www.figma.com/file/ine6cGn7cnrJJK43fzUZTF/Templates-%2F-h%C3%B6nnunarkerfi-fyrir-ums%C3%B3knir?node-id=1258%3A24214
 *
 * ```
 * template: {
 *   title: 'Subject of the email',
 *   body: [
 *     { component: 'Image', src: path.join(__dirname, 'logo.jpg') },
 *     { component: 'Heading', copy: 'Hello world,' },
 *     { component: 'Copy', copy: `Hi ${applicant}, we are happy to have you here. Enjoy and stay safe.` },
 *   ]
 * }
 * ```
 */
export interface DesignTemplate {
  template?: Template
}

export type Message = SendMailOptions & DesignTemplate

export type Handlebars = typeof handlebars
