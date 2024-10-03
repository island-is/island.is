# Email Service

## About

This library defines the `emailService`, allowing users to send email using Nodemailer.

The service currently supports the following transports:

- AWS SES
- Nodemailer's test account
- NodemailerApp

You can extend it to include other transports supported by Nodemailer.

## Setup with NestJS Standalone (not recommended)

Add `EmailModule` to your module imports:

```typescript
@Module({
  imports: [EmailModule],
})
```

Include `emailModuleConfig` in your App Module imports:

```typescript
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [emailModuleConfig],
    }),
  ],
})
```

## Using a Test Account

To preview emails using an Ethereal test account, enable the following environment variable:

```bash
EMAIL_USE_TEST_ACCOUNT=true
```

When calling the `sendEmail` method, it will return a preview link to view the email in a web browser.

## NodemailerApp Integration

You can use the [Nodemailer App](https://nodemailer.com/app/) to preview sent emails in your local environment. Emails sent using `sendEmail` will be visible in the app's UI.

![NodemailerApp example](https://user-images.githubusercontent.com/937328/123276714-f310b800-d4f4-11eb-88ad-1299ae7f75f5.png)

To use the app:

- Install the NodemailerApp from the link above.
- Set the following environment variable:

```bash
USE_NODEMAILER_APP=true
```

## Email Design Template

Instead of sending raw HTML, utilize components based on this [Figma design](https://www.figma.com/file/ine6cGn7cnrJJK43fzUZTF/Templates-%2F-h%C3%B6nnunarkerfi-fyrir-ums%C3%B3knir?node-id=1258%3A24214).

Available components and their props include:

- **Image**

  ```typescript
  {
    component: 'Image',
    context: {
      src: 'image-path',
      alt: 'Alt text',
    },
  }
  ```

- **Heading**

  ```typescript
  {
    component: 'Heading',
    context: {
      copy: 'A mind-blowing heading',
      align: 'left' | 'center' | 'right',
      small: false,
      eyebrow: 'A tiny bit of text displayed above the heading',
    },
  }
  ```

- **Copy**

  ```typescript
  {
    component: 'Copy',
    context: {
      copy: 'Some beautiful lorem ipsum',
      align: 'left' | 'center' | 'right',
      small: false,
      eyebrow: 'A tiny bit of text displayed above the heading',
    },
  }
  ```

- **Button**

  ```typescript
  {
    component: 'Button',
    context: {
      copy: 'Button copy',
      href: 'Button url',
    },
  }
  ```

- **Subtitle**

  ```typescript
  {
    component: 'Subtitle',
    context: {
      copy: 'Some text — especially suited for application-related emails',
      application: 'Name of an application',
    },
  }
  ```

- **Bulleted List**

  ```typescript
  {
    component: 'List',
    context: {
      items: ['Item 1', 'Item 2'],
    },
  }
  ```

To use these components, define a `template` object within your email message, instead of the `html` object:

```typescript
const message = {
  to: 'recipient@gmail.com',
  // ...other message properties
  template: {
    title: 'Email title',
    body: [
      {
        component: 'Image',
        context: {
          src: 'logo.jpg',
          alt: 'Logo name',
        },
      },
      {
        component: 'Heading',
        context: {
          copy: 'Email heading',
        },
      },
    ],
  },
};
```

> [Email example](https://github.com/island-is/island.is/blob/main/libs/application/template-api-modules/src/lib/modules/templates/parental-leave/emailGenerators/assignEmployerEmail.ts) for the parental leave application.

## Generate Example Email Template to HTML

To visualize or experiment with your template, modify `libs/email-service/src/tools/generate-html/example.ts`, then execute:

```bash
yarn nx run email-service:generate-html
```

The generated HTML will appear in `libs/email-service/src/tools/generate-html/output`.

### Behind the Scenes

This template system uses [Foundation emails template](https://github.com/foundation/foundation-emails) and Handlebars for component creation. The foundation styles, sourced from [here](https://github.com/jeremybarbet/foundation-emails/tree/master), are minified and embedded within `foundation.hbs` to minimize external dependencies. The [Juice](https://github.com/Automattic/juice) module is used for inlining styles within the HTML, as inline CSS is necessary for email compatibility.

## Code Owners and Maintainers

- [Kolibri](https://github.com/orgs/island-is/teams/kolibri/members)