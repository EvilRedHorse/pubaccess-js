# skynet-js - Javascript ScPrime Public Portals Client

A Javascript module made to simplify communication with ScPrime Public Portals from the browser.

## Installing

Using npm

```sh
npm install pubaccess-js
```

Using yarn

```sh
yarn add pubaccess-js
```

## Development

- Clone the repository
- Run `yarn`
- Run `yarn test` to run the tests

## Docs: using standalone function

### async upload(portalUrl, file, [options])

```javascript
import { upload } from "pubaccess-js";
```

Use the `portalUrl` to upload `file` contents.

`portalUrl` (string) - The string portal url.

`file` (File) - The file to upload.

`options.onUploadProgress` (function) - Optional callback to track progress.

Returns a promise that resolves with a `{ publink }` or throws `error` on failure.

```javascript
const onUploadProgress = (progress, { loaded, total }) => {
  console.info(`Progress ${Math.round(progress * 100)}%`);
};

try {
  const { publink } = await upload(portalUrl, file, { onUploadProgress });
} catch (error) {
  // handle error
}
```

### async uploadDirectory(portalUrl, directory, filename, [options])

```javascript
import { uploadDirectory } from "pubaccess-js";
```

Use the `portalUrl` to upload `directory` contents as a `filename`.

`portalUrl` (string) - The string portal url.

`directory` (Object) - Directory map `{ "file1.jpeg": <File>, "subdirectory/file2.jpeg": <File> }`

`filename` (string) - Output file name (directory name).

`options.onUploadProgress` (function) - Optional callback to track progress.

Returns a promise that resolves with a `{ publink }` or throws `error` on failure.

#### Browser example

```javascript
import path from "path-browserify";

const getFilePath = (file) => file.webkitRelativePath || file.path || file.name;

const getRelativeFilePath = (file) => {
  const filePath = getFilePath(file);
  const { root, dir, base } = path.parse(filePath);
  const relative = path.normalize(dir).slice(root.length).split(path.sep).slice(1);

  return path.join(...relative, base);
};

const getRootDirectory = (file) => {
  const filePath = getFilePath(file);
  const { root, dir } = path.parse(filePath);

  return path.normalize(dir).slice(root.length).split(path.sep)[0];
};

const onUploadProgress = (progress, { loaded, total }) => {
  console.info(`Progress ${Math.round(progress * 100)}%`);
};

try {
  const filename = getRootDirectory(files[0]);
  const directory = files.reduce((acc, file) => {
    const path = getRelativeFilePath(file);

    return { ...acc, [path]: file };
  }, {});

  const { publink } = await uploadDirectory(portalUrl, directory, filename, { onUploadProgress });
} catch (error) {
  // handle error
}
```

### download(portalUrl, publink)

```javascript
import { download } from "pubaccess-js";
```

Use the `portalUrl` to download `publink` contents.

`portalUrl` (string) - The string portal url.

`publink` (string) - 46 character publink.

Returns nothing.

### open(portalUrl, publink)

```javascript
import { open } from "pubaccess-js";
```

Use the `portalUrl` to open `publink` in a new browser tab. Browsers support opening natively only limited file extensions like .html or .jpg and will fallback to downloading the file.

`portalUrl` (string) - The string portal url.

`publink` (string) - 46 character publink.

Returns nothing.

### getUrl(portalUrl, publink, [options])

```javascript
import { getUrl } from "pubaccess-js";
```

Use the `portalUrl` to generate direct `publink` url.

`portalUrl` (string) - The string portal url.

`publink` (string) - 46 character publink.

`options.download` (boolean) - Option to include download directive in the url that will force a download when used. Defaults to `false`.

## Docs: using PubaccessClient

```javascript
import PubaccessClient from "pubaccess-js";

const client = new PubaccessClient("https://scp.techandsupply.ca");
```

Client implements all the standalone functions as methods with bound `portalUrl` so you don't need to repeat it every time.
