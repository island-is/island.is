# GitBook Contributions

Adding new content to the handbook (hosted on GitBook at [docs.devland.is](https://docs.devland.is)) is very straight forward.

## Contributing

The documentation works in two different ways:

- `Handbook` which contains all the documentation regarding all the island.is projects. You will find technical overview, architectural decisions, api, devops, code reviews, code standards detailed information and much more. If you need to edit an existing documentation or create a new page inside the handbook directory, you simply have to create a `markdown` file and start writing your content.

- `README.md` which are all the readmes from the `apps` and `libs` directories contained in the sub folders. The same goes for the README.md. Simply add your content using markdown. We only recommend one thing, is to use [this template](../misc/gitbook-template.md) when you create a new app in the `apps` directory.

### Root `README.md` within `handbook` directory

`README.md` files from directories inside the [`handbook/` directory](../) are used to create the navigation structure when running the `yarn gitbook` command.

{% hint style="warning" %}
You MUST create a `README.md` with a `H1` heading ([example](https://raw.githubusercontent.com/island-is/island.is/main/handbook/technical-overview/auth/README.md)) — but apart from that, you may leave it empty and GitBook will automatically display the [sub file structure](../technical-overview/auth).
{% endhint %}

### Links

You need to use [relative paths](https://raw.githubusercontent.com/island-is/island.is/main/handbook/technical-overview/code-standards.md) based on the current file location, might need a couple of `../../../` before finding the file you want to link to.

### Assets

We recommend adding an `assets` folder inside the directory where you need it. You can then access your assets from your markdown file by doing `./assets/my-image.png`.

## Publishing

Once you are done with your changes, you will need to run the following command:

```bash
yarn gitbook
```

It will check for any new files created inside the `handbook` directory or new `README.md` located inside the `apps` or `libs` directories and add it to the `SUMMARY.md` file, which is the file used by GitBook to create the navigation structure.

The script will also format the README.md's title to follow the [APA style convention](https://en.wikipedia.org/wiki/APA_style). All files added the the `SUMMARY.md` will be alphabetically ordered and organised in folders/sub-folders for the `apps` and `libs`.

After your commit get merged into `main`, it will take a few minutes before your changes appears on [docs.devland.is](https://docs.devland.is).

{% hint style="info" %}
For some reason, if you don't want your markdown file to be part of the `SUMMARY.md` file and included inside the GitBook, you can add the following html comment `<!-- gitbook-ignore -->` as the first line of the file.
{% endhint %}
