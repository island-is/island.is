import { SendMailOptions } from 'nodemailer'

export interface ImageComponent {
  component: 'Image'
  context: {
    src: string
    alt: string
  }
}

interface HeadingComponent {
  component: 'Heading'
  context: {
    copy: string
  }
}

interface CopyComponent {
  component: 'Copy'
  context: {
    copy: string
  }
}

interface ButtonComponent {
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

export interface Template {
  title: string
  body: (
    | ImageComponent
    | HeadingComponent
    | CopyComponent
    | ButtonComponent
    | SubtitleComponent
  )[]
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
