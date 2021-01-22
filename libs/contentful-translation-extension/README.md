# contentful-translation-extension

This is the Contentful extension responsible of translations for namespaces for your application. It works in pair with the [localization](../localization/README.md) library.

![](https://user-images.githubusercontent.com/937328/105497145-626c4c80-5cb6-11eb-8df8-1b8f19076768.png)

## Usage

Contentful's extensions are using their own bundler and configurations. That's the reason why it's not part of the normal NX workflow.

The following commands are handle inside the `contentful-translation-extension.sh` using contentful's [`contentful-extension-scripts`](https://github.com/jeremybarbet/create-contentful-extension).

{% hint style="warning" %}
To be able to run the `start` and `deploy` commands you will need to pass an `extensionId`, a `managementToken` and the `path` to the extension's folder.
{% endhint %}

### Start

Will start the local development server. You are then able to go to Contentful to do your changes.

```bash
yarn cte start <extensionId> <managementToken> <path>
```

{% hint style="warning" %}
Be careful, once you are running this command with your extensionId, it will replaces the production's extension and only the local extension will be accessible. In short, others users trying to display the extension in their contentful dashboard will get an error message.
{% endhint %}

### Build

Will only bundles the extension's files.

```bash
yarn cte build
```

### Deploy

Will build and deploy the changes to Contentful. If you want your extension to be hosted by contentful it has to be under 512KB.

```bash
yarn cte deploy <extensionId> <managementToken> <path>
```
