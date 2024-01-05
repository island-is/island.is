# Contentful Translation Extension

This is the Contentful extension responsible of translations for namespaces for your application. It works in pair with the [localization](../../localization/README.md) library.

![](https://user-images.githubusercontent.com/937328/105497145-626c4c80-5cb6-11eb-8df8-1b8f19076768.png)

## Usage

The following commands are handled using contentful's [`contentful-extension-scripts`](https://github.com/jeremybarbet/create-contentful-extension). It uses a custom `tsconfig.json` and not the shared one from the root project.

{% hint style="warning" %}
To be able to run the `start` command you will need to pass a `managementToken`. It's required to be able to run the extension in development through Contentful.
{% endhint %}

{% hint style="info" %}
We host the extension by ourself using the `docker-static` image because it goes over the 512KB limit from Contentful.
{% endhint %}

### Start

Will start the local development server. You are then able to go to Contentful to see your changes.

```bash
yarn start contentful-translation-extension --token managementToken
```

{% hint style="warning" %}
Be careful, once you are running this command, it will replace the production's extension and only the local extension will be accessible. In short, others users trying to display the extension in their Contentful dashboard will get an error message.
{% endhint %}

### Build

Bundles the extension's files.

```bash
yarn build contentful-translation-extension
```

### Deploy

The extension's build script is bundling the files inside the NX dist folder under `dist/contentful-translation-extension`. The `docker-static` is deploying these files into a Docker image. We then add the production URL into Contentful to enable the UI extension.
