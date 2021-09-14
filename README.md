# Taihou - A weeb.sh wrapper

[![CircleCI](https://circleci.com/gh/ParadoxalCorp/Taihou.svg?style=svg)](https://circleci.com/gh/ParadoxalCorp/Taihou) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/dcde3c99ed014a1284391aee2abc04b6)](https://www.codacy.com/app/paradoxalcorp/Taihou?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=ParadoxalCorp/Taihou&amp;utm_campaign=Badge_Grade)

Taihou is a promise-returning Node.js wrapper for [weeb.sh](https://docs.weeb.sh/#introduction). Taihou is easy to use but also has 
a lot of advanced features for a more advanced usage. To get started, you should head over to the [requirements](#requirements) and [usage](#usage) sections

Special thanks to [MrLar](https://github.com/MrLar) (MrLar 🌺#0611) who helped me getting the Korra wrapper to work

## Tables of content

* [Features](#features)
* [Requirements](#requirements)
* [Changelog](#changelog)
* [Usage](#usage)
- * [Passing options to specific services/methods](#passing-options-to-specifc-services-or-methods)
- * [Sending generated images to Discord](#sending-generated-images-to-discord)
- - * [With Eris](#with-eris)
- - * [With Discord.js](#with-discord.js)
* [Documentation](#documentation)
- * [Taihou](#taihou)
- * [Toph](#toph)
- * [Korra](#korra)
- * [Shimakaze](#shimakaze)
- * [Tama](#tama)
- * [Request handling](#request-handling)
- - * [Sequential mode](#sequential-mode)
- - * [Burst mode](#burst-mode)
- - * [Sequential VS Burst example case](#sequential-vs-burst-example-case)
- * [Error handling](#error-handling)
- * [Tama's caching behavior](#tama-caching-behavior)


## Features

* Full cover for weeb.sh services
* Consistent interface
* Entirely configurable, with global, per-services and per-requests configuration
* Configurable built-in rate-limiter (see [request handling](#request-handling))
* Built-in cache for Tama
* Named after the Imperial Japanese Navy's [first armored aircraft carrier](https://en.wikipedia.org/wiki/Japanese_aircraft_carrier_Taih%C5%8D), which not only had a funny fate, but has also a cute as hell [kancolle equivalent](http://kancolle.wikia.com/wiki/Taihou)

## Requirements

The lowest known Node.js version supported is Node.js `8.3.0`

## Changelog

## Patch 2.0.6

Another security bump for axios, bumping from `0.21.1` to `0.21.2`.

### Patch 2.0.5

This patch fixes the methods broken by patch 2.0.4

### Security Patch 2.0.4

This patch fixes a security issue within axios by bumping the required axios version from `0.18.1` to `0.21.1`.

### Important Security Patch 2.0.3  

> 2.0.2 => 2.0.3

This patch fixes a security issue within axios by bumping the required axios version from `0.18.0` to `0.18.1`, see the relevant changelog [here](https://github.com/axios/axios/blob/v0.18.1/CHANGELOG.md)

### Update 2.0.2

> 1.0.2 => 2.0.2

This update optimize a bit the internal code documentation and document the responses of all methods, which should make any code editor that supports JSDoc able to provide decent Intellisense.

The reason why this is a major update is because of the potentially breaking rework of error handling, rejected/thrown errors are no longer instances of the `TaihouError` class, but instances of Node.js's Error class. Errors that are directly originating from the request sent to the weeb.sh servers are following [Axios's error scheme](https://www.npmjs.com/package/axios#handling-errors)

## Usage 

While the size of this readme may make it look complicated, Taihou is fairly easy to use:

> npm install taihou

Once installed, to start using Taihou:

```js
const Taihou = require('taihou');
const weebSH = new Taihou('token', true, {
    userAgent: 'YourBotName/YourBotVersion'
});

weebSH.toph.getRandomImage('pat')
    .then(image => console.log(image.url))
    .catch(err => console.error(`Oopsie, an error occurred: ${err}`));

//You can also access the classes with their english name description, like

weebSH.images.getRandomImage('pat')
    .then(image => console.log(image.url))
    .catch(err => console.error(`Oopsie, an error occurred: ${err}`));

//Which is exactly the same
```

To see all the methods available and the different possibilities, check out the [documentation](#documentation)

### Passing options to specific services or methods

Some options can be set globally, per-service and per-request, per-service override global, and per-request override per-service options.

```js
const Taihou = require('taihou');
const weebSH = new Taihou('token', true, {
    userAgent: 'YourBotName/YourBotVersion',
    timeout: 15000, //Globally set the maximum time in ms to wait before aborting a request to 15000,
    baseURL: 'https://api.weeb.sh'
    toph: {
        timeout: 5000 //Set 5000ms instead of 15000 for all toph methods,
        baseURL: 'https://staging.weeb.sh' //You can use a different environment for a specific service, and even for a specific request 
    },
    images: {
        timeout: 5000 //If you don't want to use the name "toph", it can be done with "images" too
    }
});

weebSH.toph.getRandomImage('pat', {timeout: 3000}) //Set 3000ms instead of 5000 for this specific request
    .then(image => console.log(image.url))
    .catch(err => console.error(`Oopsie, an error occurred: ${err}`));
```

### Sending generated images to Discord

Especially if it's your first time dealing with buffers, sending the images generated by Korra might be a little confusing. The two examples below 
show how to do it in the most probable context (when a command is called)

#### With Eris

```js
weebSH.korra.generateWaifuInsult('https://cdn.discordapp.com/attachments/397069608043020298/452094168890867722/memesie.png') 
    .then(buffer => {
        message.channel.createMessage('', {file: buffer, name: `${Date.now()}-${message.author.id}.png`})
    })
    .catch(err => console.error(`Oopsie, an error occurred: ${err}`));
```

#### With Discord.js

```js
weebSH.korra.generateWaifuInsult('https://cdn.discordapp.com/attachments/397069608043020298/452094168890867722/memesie.png') 
    .then(buffer => {
        message.channel.send('', {files: [{attachment: buffer, name: `${Date.now()}-${message.author.id}.png`]})
    })
    .catch(err => console.error(`Oopsie, an error occurred: ${err}`));
```

## Documentation

<dl>
<dt><a href="#Taihou">Taihou</a></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#TaihouOptions">TaihouOptions</a></dt>
<dd></dd>
</dl>

<a name="Taihou"></a>

## Taihou
**Kind**: global class
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| token | <code>any</code> | The token given in the constructor, formatted according to whether it is a wolke token or not |
| toph | <code>Toph</code> | The [Toph](#toph) class - gives access to toph methods |
| korra | <code>Korra</code> | The [Korra](#korra) class - gives access to korra methods |
| shimakaze | <code>Shimakaze</code> | The [Shimakaze](#shimakaze) class - gives access to shimakaze methods |
| tama | <code>Tama</code> | The [Tama](#tama) class - gives access to tama methods |
| images | <code>Toph</code> | Equivalent for toph |
| imageGeneration | <code>Korra</code> | Equivalent for korra |
| reputation | <code>Shimakaze</code> | Equivalent for reputation |
| settings | <code>Tama</code> | Equivalent for tama |


* [Taihou](#Taihou)
    * [.Taihou](#Taihou.Taihou)
        * [new Taihou(token, wolken, options)](#new_Taihou.Taihou_new)

<a name="Taihou.Taihou"></a>

### Taihou.Taihou
**Kind**: static class of [<code>Taihou</code>](#Taihou)
<a name="new_Taihou.Taihou_new"></a>

#### new Taihou(token, wolken, options)
Creates an instance of Taihou.


| Param | Type | Description |
| --- | --- | --- |
| token | <code>string</code> | The token, required to use weeb.sh |
| wolken | <code>boolean</code> | A boolean representing whether the token is a wolke token or not, needed for taihou to work properly |
| options | [<code>TaihouOptions</code>](#TaihouOptions) | An object of options |

<a name="TaihouOptions"></a>

## TaihouOptions
**Kind**: global typedef
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| baseURL | <code>string</code> | The base URL to use for each request, you may change this if you want to use staging or if you run a local instance (like: 'https://api.weeb.sh') |
| userAgent | <code>string</code> | Strongly recommended, this should follow a BotName/Version/Environment pattern, or at least the bot name |
| timeout | <code>number</code> | Time in milliseconds before a request should be aborted |
| headers | <code>any</code> | An object of additional headers following a {'header': 'value'} format, note that those must not be content-type, user-agent or authorization header |

<dl>
<dt><a href="#Toph">Toph</a></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#TophOptions">TophOptions</a></dt>
<dd></dd>
<dt><a href="#UploadOptions">UploadOptions</a></dt>
<dd></dd>
</dl>

<a name="Toph"></a>

## Toph
**Kind**: global class
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| token | <code>any</code> | The token given in the constructor of Taihou, formatted according to whether it is a wolke token or not |
| options | <code>any</code> | The **effective** options; e.g, if you specified options specific to Toph, those override the base ones |


* [Toph](#Toph)
    * [.getStatus([options])](#Toph+getStatus) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.uploadImage(uploadOptions, [options])](#Toph+uploadImage) ⇒ <code>Promise.&lt;any&gt;</code>
    * [.getRandomImage(type, [options])](#Toph+getRandomImage) ⇒ <code>Promise.&lt;any&gt;</code>
    * [.getImageTypes([options])](#Toph+getImageTypes) ⇒ <code>Promise.&lt;any&gt;</code>
    * [.getImageTags([options])](#Toph+getImageTags) ⇒ <code>Promise.&lt;any&gt;</code>
    * [.getImageInfo(id, [options])](#Toph+getImageInfo) ⇒ <code>Promise.&lt;any&gt;</code>
    * [.addTagsToImage(id, tags, [options])](#Toph+addTagsToImage) ⇒ <code>Promise.&lt;any&gt;</code>
    * [.removeTagsFromImage(id, tags, [options])](#Toph+removeTagsFromImage) ⇒ <code>Promise.&lt;any&gt;</code>
    * [.deleteImage(id, [options])](#Toph+deleteImage) ⇒ <code>Promise.&lt;any&gt;</code>

<a name="Toph+getStatus"></a>

### toph.getStatus([options]) ⇒ <code>Promise.&lt;boolean&gt;</code>
Make a simple request to check whether Toph is available or not, due to its nature, this method never rejects

**Kind**: instance method of [<code>Toph</code>](#Toph)
**Returns**: <code>Promise.&lt;boolean&gt;</code> - Whether or not Toph is online

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | [<code>TophOptions</code>](#TophOptions) | <code>{}</code> | An optional object of options |

**Example**
```js
weebSH.toph.getStatus()
    .then(console.log) //true
```
<a name="Toph+uploadImage"></a>

### toph.uploadImage(uploadOptions, [options]) ⇒ <code>Promise.&lt;any&gt;</code>
Upload an image to Toph

**Kind**: instance method of [<code>Toph</code>](#Toph)
**Returns**: <code>Promise.&lt;any&gt;</code> - An image object with a file key

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| uploadOptions | [<code>UploadOptions</code>](#UploadOptions) |  | An object of options |
| [options] | [<code>TophOptions</code>](#TophOptions) | <code>{}</code> |  |

**Example**
```js
weebSH.toph.uploadImage({url: 'https://wew.png', type: 'wew', hidden: true, nsfw: false})
    .then(console.log)
    .catch(console.error)
```
<a name="Toph+getRandomImage"></a>

### toph.getRandomImage(type, [options]) ⇒ <code>Promise.&lt;any&gt;</code>
Get a random image from weeb.sh, you can specify both type and options.tags. You can also set the type to null and only specify options.tags

**Kind**: instance method of [<code>Toph</code>](#Toph)
**Returns**: <code>Promise.&lt;any&gt;</code> - The parsed image object, refer to https://docs.weeb.sh/#random-image for its structure

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| type | <code>string</code> |  | The type, either this or options.tags is mandatory. To get a list of types, use getImageTypes, as well as getImageTags for a list of tags |
| [options] | [<code>TophOptions</code>](#TophOptions) | <code>{}</code> |  |

**Example**
```js
weebSH.toph.getRandomImage('pat')
    .then(console.log)
    .catch(console.error)
```
<a name="Toph+getImageTypes"></a>

### toph.getImageTypes([options]) ⇒ <code>Promise.&lt;any&gt;</code>
Get a list of image types and a preview image for each if you want

**Kind**: instance method of [<code>Toph</code>](#Toph)
**Returns**: <code>Promise.&lt;any&gt;</code> - The parsed response object that you can see here https://docs.weeb.sh/#image-types

| Param | Type | Default |
| --- | --- | --- |
| [options] | [<code>TophOptions</code>](#TophOptions) | <code>{}</code> |

**Example**
```js
weebSH.toph.getImageTypes()
    .then(console.log)
    .catch(console.error)
```
<a name="Toph+getImageTags"></a>

### toph.getImageTags([options]) ⇒ <code>Promise.&lt;any&gt;</code>
Get a list of image tags

**Kind**: instance method of [<code>Toph</code>](#Toph)
**Returns**: <code>Promise.&lt;any&gt;</code> - The parsed response object that you can see here https://docs.weeb.sh/#image-tags

| Param | Type | Default |
| --- | --- | --- |
| [options] | [<code>TophOptions</code>](#TophOptions) | <code>{}</code> |

**Example**
```js
weebSH.toph.getImageTags()
    .then(console.log)
    .catch(console.error)
```
<a name="Toph+getImageInfo"></a>

### toph.getImageInfo(id, [options]) ⇒ <code>Promise.&lt;any&gt;</code>
Get info about an image using its ID

**Kind**: instance method of [<code>Toph</code>](#Toph)
**Returns**: <code>Promise.&lt;any&gt;</code> - The parsed response object that you can see here https://docs.weeb.sh/#image-info

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| id | <code>string</code> |  | The ID of the image to get info from |
| [options] | [<code>TophOptions</code>](#TophOptions) | <code>{}</code> |  |

**Example**
```js
weebSH.toph.getImageInfo('6d875e')
    .then(console.log)
    .catch(console.error)
```
<a name="Toph+addTagsToImage"></a>

### toph.addTagsToImage(id, tags, [options]) ⇒ <code>Promise.&lt;any&gt;</code>
Add tags to an image

**Kind**: instance method of [<code>Toph</code>](#Toph)
**Returns**: <code>Promise.&lt;any&gt;</code> - An object detailing added and skipped tags

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| id | <code>string</code> |  | The ID of the image to add tags to |
| tags | <code>array</code> |  | An array of tags, either strings or {name: 'tag_name'} objects |
| [options] | [<code>TophOptions</code>](#TophOptions) | <code>{}</code> |  |

**Example**
```js
weebSH.toph.addTagsToImage('6d875e', ['baguette'])
    .then(console.log)
    .catch(console.error)
```
<a name="Toph+removeTagsFromImage"></a>

### toph.removeTagsFromImage(id, tags, [options]) ⇒ <code>Promise.&lt;any&gt;</code>
Remove tags from an image

**Kind**: instance method of [<code>Toph</code>](#Toph)

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| id | <code>string</code> |  | The ID of the image to remove tags from |
| tags | <code>array</code> |  | An array of tags, either strings or {name: 'tag_name'} objects |
| [options] | [<code>TophOptions</code>](#TophOptions) | <code>{}</code> |  |

**Example**
```js
weebSH.toph.removeTagsFromImage('6d875e',  ['baguette'])
    .then(console.log)
    .catch(console.error)
```
<a name="Toph+deleteImage"></a>

### toph.deleteImage(id, [options]) ⇒ <code>Promise.&lt;any&gt;</code>
Delete an image

**Kind**: instance method of [<code>Toph</code>](#Toph)
**Returns**: <code>Promise.&lt;any&gt;</code> - An object containing a success confirmation

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| id | <code>string</code> |  | The ID of the image to remove tags from |
| [options] | [<code>TophOptions</code>](#TophOptions) | <code>{}</code> |  |

**Example**
```js
weebSH.toph.deleteImage('6d875e')
    .then(console.log)
    .catch(console.error)
```
<a name="TophOptions"></a>

## TophOptions
**Kind**: global typedef
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| baseURL | <code>string</code> | The base URL |
| timeout | <code>number</code> | Time in milliseconds before the request should be aborted. Default is 15000 |
| headers | <code>any</code> | An object of additional headers following a {'header': 'value'} format, note that those must not be content-type, user-agent or authorization header |
| nsfw | <code>boolean</code> | Either a boolean or "only", false entirely filters nsfw, true gets both nsfw and non-nsfw, and "only" gets only nsfw. False by default |
| hidden | <code>boolean</code> | If true, you only get back hidden images you uploaded. Defaults to false |
| preview | <code>boolean</code> | Only apply to getImageTypes(), if true, a preview image image is sent along. Defaults to false |
| fileType | <code>string</code> | Only apply to getRandomImage(), can be "jpeg", "gif" or "png" |
| tags | <code>string</code> | Only apply to getRandomImage(), a comma-separated list of tags the image should have |
| burst | <code>boolean</code> | Whether to enable the request handler's burst mode, false by default |
| beforeNextRequest | <code>number</code> | Only apply per-request, time in milliseconds before the next request in the queue should be executed. Is ignored if burst mode is enabled |
| requestsPerMinute | <code>number</code> | Only apply when instantiating the module, regardless of the mode, define how many requests can be done in a minute. 0 makes it limitless |

<a name="UploadOptions"></a>

## UploadOptions
**Kind**: global typedef
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| file | <code>string</code> | Absolute path to a file, takes priority over url argument |
| url | <code>string</code> | Url pointing directly at the image you want to upload, you may only use file or url |
| baseType | <code>string</code> | The type of the image; e.g, the category (pat, cuddle and such) |
| hidden | <code>boolean</code> | Whether the uploaded image should be private or not |
| nsfw | <code>boolean</code> | Whether this image has content that could be considered NSFW (not safe for work) |
| tags | <code>string</code> | Comma-separated list of tags to add to the image, they will inherit the hidden property of the image |
| source | <code>string</code> | Url pointing to the original source of the image |

<dl>
<dt><a href="#Korra">Korra</a></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#KorraOptions">KorraOptions</a></dt>
<dd></dd>
<dt><a href="#LicenseOptions">LicenseOptions</a></dt>
<dd></dd>
<dt><a href="#SimpleOptions">SimpleOptions</a></dt>
<dd></dd>
</dl>

<a name="Korra"></a>

## Korra
**Kind**: global class
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| token | <code>any</code> | The token given in the constructor of Taihou, formatted according to whether it is a wolke token or not |
| options | <code>any</code> | The **effective** options; e.g, if you specified options specific to Korra, those override the base ones |


* [Korra](#Korra)
    * [.getStatus([options])](#Korra+getStatus) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.generateSimple(type, [simpleOptions], [options])](#Korra+generateSimple) ⇒ <code>Promise.&lt;any&gt;</code>
    * [.generateDiscordStatus(status, avatar, [options])](#Korra+generateDiscordStatus) ⇒ <code>Promise.&lt;any&gt;</code>
    * [.generateWaifuInsult(avatar, [options])](#Korra+generateWaifuInsult) ⇒ <code>Promise.&lt;any&gt;</code>
    * [.generateLoveShip(firstTarget, secondTarget, [options])](#Korra+generateLoveShip) ⇒ <code>Promise.&lt;any&gt;</code>
    * [.generateLicense(licenseOptions, [options])](#Korra+generateLicense) ⇒ <code>Promise.&lt;any&gt;</code>

<a name="Korra+getStatus"></a>

### korra.getStatus([options]) ⇒ <code>Promise.&lt;boolean&gt;</code>
Make a simple request to check whether Korra is available or not, due to its nature, this method never rejects

**Kind**: instance method of [<code>Korra</code>](#Korra)
**Returns**: <code>Promise.&lt;boolean&gt;</code> - Whether or not Korra is online

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | [<code>KorraOptions</code>](#KorraOptions) | <code>{}</code> | An optional object of options |

**Example**
```js
weebSH.korra.getStatus()
    .then(console.log)
    .catch(console.error)
```
<a name="Korra+generateSimple"></a>

### korra.generateSimple(type, [simpleOptions], [options]) ⇒ <code>Promise.&lt;any&gt;</code>
**Kind**: instance method of [<code>Korra</code>](#Korra)
**Returns**: <code>Promise.&lt;Buffer&gt;</code> - The image buffer, that you can directly pass to d.js/eris

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| type | <code>string</code> |  | One of the available types, you can see them here: https://docs.weeb.sh/#generate-simple |
| [simpleOptions] | [<code>SimpleOptions</code>](#SimpleOptions) |  | An object of options for this generation, for a complete list of options you can use, check: https://docs.weeb.sh/#generate-simple |
| [options] | [<code>KorraOptions</code>](#KorraOptions) | <code>{}</code> |  |

**Example**
```js
weebSH.korra.generateSimple('awooo')
    .then(console.log)
    .catch(console.error)
```
<a name="Korra+generateDiscordStatus"></a>

### korra.generateDiscordStatus(status, avatar, [options]) ⇒ <code>Promise.&lt;any&gt;</code>
**Kind**: instance method of [<code>Korra</code>](#Korra)
**Returns**: <code>Promise.&lt;Buffer&gt;</code> - The image buffer, that you can directly pass to d.js/eris

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| status | <code>string</code> |  | The status, can be either "online", "idle", "streaming", "dnd" or "offline" |
| avatar | <code>string</code> |  | The direct URL to the image |
| [options] | [<code>KorraOptions</code>](#KorraOptions) | <code>{}</code> |  |

**Example**
```js
weebSH.korra.generateDiscordStatus('online', 'https://cdn.discordapp.com/avatars/140149699486154753/a_211d333073a63b3adfd13943268fc7a1.webp?size=1024')
    .then(console.log)
    .catch(console.error)
```
<a name="Korra+generateWaifuInsult"></a>

### korra.generateWaifuInsult(avatar, [options]) ⇒ <code>Promise.&lt;any&gt;</code>
**Kind**: instance method of [<code>Korra</code>](#Korra)
**Returns**: <code>Promise.&lt;Buffer&gt;</code> - The image buffer, that you can directly pass to d.js/eris

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| avatar | <code>string</code> |  | The direct URL to the image |
| [options] | [<code>KorraOptions</code>](#KorraOptions) | <code>{}</code> |  |

**Example**
```js
weebSH.korra.generateWaifuInsult('https://cdn.discordapp.com/avatars/140149699486154753/a_211d333073a63b3adfd13943268fc7a1.webp?size=1024')
    .then(console.log)
    .catch(console.error)
```
<a name="Korra+generateLoveShip"></a>

### korra.generateLoveShip(firstTarget, secondTarget, [options]) ⇒ <code>Promise.&lt;any&gt;</code>
**Kind**: instance method of [<code>Korra</code>](#Korra)
**Returns**: <code>Promise.&lt;Buffer&gt;</code> - The image buffer, that you can directly pass to d.js/eris

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| firstTarget | <code>string</code> |  | The direct URL to the image of the first target |
| secondTarget | <code>string</code> |  | The direct URL to the image of the second target |
| [options] | [<code>KorraOptions</code>](#KorraOptions) | <code>{}</code> |  |

**Example**
```js
weebSH.korra.generateLoveShip('https://cdn.discordapp.com/avatars/128392910574977024/174c3436af3e4857accb4a32e2f9f220.webp?size=1024', 'https://cdn.discordapp.com/avatars/108638204629925888/e05fb8c7720c3618569828246e176fb4.webp?size=1024')
    .then(console.log)
    .catch(console.error)
```
<a name="Korra+generateLicense"></a>

### korra.generateLicense(licenseOptions, [options]) ⇒ <code>Promise.&lt;any&gt;</code>
**Kind**: instance method of [<code>Korra</code>](#Korra)
**Returns**: <code>Promise.&lt;Buffer&gt;</code> - The image buffer, that you can directly pass to d.js/eris

| Param | Type | Default |
| --- | --- | --- |
| licenseOptions | [<code>LicenseOptions</code>](#LicenseOptions) |  |
| [options] | [<code>KorraOptions</code>](#KorraOptions) | <code>{}</code> |

**Example**
```js
weebSH.korra.generateLicense({title: 'Baguette License', avatar: 'https://cdn.discordapp.com/avatars/128392910574977024/174c3436af3e4857accb4a32e2f9f220.webp?size=1024'})
    .then(console.log)
    .catch(console.error)     
```
<a name="KorraOptions"></a>

## KorraOptions
**Kind**: global typedef
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| baseURL | <code>string</code> | The base URL |
| timeout | <code>number</code> | Time in milliseconds before the request should be aborted. Default is 15000 |
| headers | <code>any</code> | An object of additional headers following a {'header': 'value'} format, note that those must not be content-type, user-agent or authorization header |
| burst | <code>boolean</code> | Whether to enable the request handler's burst mode, false by default |
| beforeNextRequest | <code>number</code> | Only apply per-request, time in milliseconds before the next request in the queue should be executed. Is ignored if burst mode is enabled |
| requestsPerMinute | <code>number</code> | Only apply when instantiating the module, regardless of the mode, define how many requests can be done in a minute. 0 makes it limitless |

<a name="LicenseOptions"></a>

## LicenseOptions
**Kind**: global typedef
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| title | <code>string</code> | The base URL |
| avatar | <code>string</code> | Direct URL to an image |
| [badges] | <code>array</code> | Array of http/s links directly pointing to images; to see how it renders, check https://docs.weeb.sh/#license-generation |
| [widgets] | <code>array</code> | An array of strings to fill the boxes |

<a name="SimpleOptions"></a>

## SimpleOptions
**Kind**: global typedef
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [face] | <code>string</code> | Only for awooo type; HEX color code of the face |
| [hair] | <code>string</code> | Only for awooo type; HEX color code of the hairs |

<dl>
<dt><a href="#Shimakaze">Shimakaze</a></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#ShimakazeOptions">ShimakazeOptions</a></dt>
<dd></dd>
<dt><a href="#GiveReputationOptions">GiveReputationOptions</a></dt>
<dd></dd>
<dt><a href="#ResetUserReputationOptions">ResetUserReputationOptions</a></dt>
<dd></dd>
<dt><a href="#IncreaseUserReputationOptions">IncreaseUserReputationOptions</a></dt>
<dd></dd>
<dt><a href="#DecreaseUserReputationOptions">DecreaseUserReputationOptions</a></dt>
<dd></dd>
<dt><a href="#ReputationSettings">ReputationSettings</a></dt>
<dd></dd>
</dl>

<a name="Shimakaze"></a>

## Shimakaze
**Kind**: global class
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| token | <code>any</code> | The token given in the constructor of Taihou, formatted according to whether it is a wolke token or not |
| options | <code>any</code> | The **effective** options; e.g, if you specified options specific to Shimakaze, those override the base ones |


* [Shimakaze](#Shimakaze)
    * [.getStatus([options])](#Shimakaze+getStatus) ⇒ <code>boolean</code>
    * [.getUserReputation(botID, targetID, [options])](#Shimakaze+getUserReputation) ⇒ <code>Promise.&lt;any&gt;</code>
    * [.giveReputation(reputationOptions, [options])](#Shimakaze+giveReputation) ⇒ <code>Promise.&lt;any&gt;</code>
    * [.resetUserReputation(resetOptions, [options])](#Shimakaze+resetUserReputation) ⇒ <code>Promise.&lt;any&gt;</code>
    * [.increaseUserReputation(increaseOptions, [options])](#Shimakaze+increaseUserReputation) ⇒ <code>Promise.&lt;any&gt;</code>
    * [.decreaseUserReputation(decreaseOptions, [options])](#Shimakaze+decreaseUserReputation) ⇒ <code>Promise.&lt;any&gt;</code>
    * [.getSettings([options])](#Shimakaze+getSettings) ⇒ <code>Promise.&lt;any&gt;</code>
    * [.setSettings(settings, [options])](#Shimakaze+setSettings) ⇒ <code>Promise.&lt;any&gt;</code>

<a name="Shimakaze+getStatus"></a>

### shimakaze.getStatus([options]) ⇒ <code>boolean</code>
Make a simple request to check whether Shimakaze is available or not, due to its nature, this method never rejects

**Kind**: instance method of [<code>Shimakaze</code>](#Shimakaze)
**Returns**: <code>boolean</code> - Whether or not Shimakaze is online

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | [<code>ShimakazeOptions</code>](#ShimakazeOptions) | <code>{}</code> | An optional object of options |

**Example**
```js
weebSH.shimakaze.getStatus()
    .then(console.log)
    .catch(console.error)
```

<a name="Shimakaze+getUserReputation"></a>

### shimakaze.getUserReputation(botID, targetID, [options]) ⇒ <code>Promise.&lt;any&gt;</code>
Get the reputation of a user

**Kind**: instance method of [<code>Shimakaze</code>](#Shimakaze)
**Returns**: <code>Promise.&lt;any&gt;</code> - The parsed response object, refer to https://docs.weeb.sh/#get-reputation-of-user for its structure

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| botID | <code>string</code> |  | The ID of the bot reputation database to access |
| targetID | <code>string</code> |  | The ID of the user to get reputation of |
| [options] | [<code>ShimakazeOptions</code>](#ShimakazeOptions) | <code>{}</code> |  |

**Example**
```js
weebSH.shimakaze.getUserReputation('327144735359762432', '184051394179891201')
    .then(console.log)
    .catch(console.error)
```
<a name="Shimakaze+giveReputation"></a>

### shimakaze.giveReputation(reputationOptions, [options]) ⇒ <code>Promise.&lt;any&gt;</code>
Give reputation to a user

**Kind**: instance method of [<code>Shimakaze</code>](#Shimakaze)
**Returns**: <code>Promise.&lt;any&gt;</code> - The parsed response object, refer to https://docs.weeb.sh/#get-reputation-of-user for its structure

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| reputationOptions | [<code>GiveReputationOptions</code>](#GiveReputationOptions) |  | An object of options |
| [options] | [<code>ShimakazeOptions</code>](#ShimakazeOptions) | <code>{}</code> |  |

**Example**
```js
weebSH.shimakaze.postUserReputation({botID: '184051394179891201', targetID: '128392910574977024', sourceID: '140149699486154753'})
    .then(console.log)
    .catch(console.error)
```
<a name="Shimakaze+resetUserReputation"></a>

### shimakaze.resetUserReputation(resetOptions, [options]) ⇒ <code>Promise.&lt;any&gt;</code>
Reset the reputation of a user

**Kind**: instance method of [<code>Shimakaze</code>](#Shimakaze)
**Returns**: <code>Promise.&lt;any&gt;</code> - The parsed response object, refer to https://docs.weeb.sh/#reset-user-reputation for its structure

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| resetOptions | [<code>ResetUserReputationOptions</code>](#ResetUserReputationOptions) |  | An object of options |
| [options] | [<code>ShimakazeOptions</code>](#ShimakazeOptions) | <code>{}</code> |  |

**Example**
```js
weebSH.shimakaze.resetUserReputation({botID: '327144735359762432', targetID: '184051394179891201'})
    .then(console.log)
    .catch(console.error)
```
<a name="Shimakaze+increaseUserReputation"></a>

### shimakaze.increaseUserReputation(increaseOptions, [options]) ⇒ <code>Promise.&lt;any&gt;</code>
Increase the reputation of a user

**Kind**: instance method of [<code>Shimakaze</code>](#Shimakaze)
**Returns**: <code>Promise.&lt;any&gt;</code> - The parsed response object, refer to https://docs.weeb.sh/#increase-user-reputation for its structure

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| increaseOptions | [<code>IncreaseUserReputationOptions</code>](#IncreaseUserReputationOptions) |  | An object of options |
| [options] | [<code>ShimakazeOptions</code>](#ShimakazeOptions) | <code>{}</code> |  |

**Example**
```js
weebSH.shimakaze.increaseUserReputation({botID: '327144735359762432', targetID: '184051394179891201', increase: 1})
    .then(console.log)
    .catch(console.error)
```
<a name="Shimakaze+decreaseUserReputation"></a>

### shimakaze.decreaseUserReputation(decreaseOptions, [options]) ⇒ <code>Promise.&lt;any&gt;</code>
Decrease the reputation of a user

**Kind**: instance method of [<code>Shimakaze</code>](#Shimakaze)
**Returns**: <code>Promise.&lt;any&gt;</code> - The parsed response object, refer to https://docs.weeb.sh/#decrease-user-reputation for its structure

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| decreaseOptions | [<code>DecreaseUserReputationOptions</code>](#DecreaseUserReputationOptions) |  | An object of options |
| [options] | [<code>ShimakazeOptions</code>](#ShimakazeOptions) | <code>{}</code> |  |

**Example**
```js
weebSH.shimakaze.decreaseUserReputation({botID: '327144735359762432', targetID: '184051394179891201', decrease: 1})
    .then(console.log)
    .catch(console.error)
```
<a name="Shimakaze+getSettings"></a>

### shimakaze.getSettings([options]) ⇒ <code>Promise.&lt;any&gt;</code>
Get the current settings

**Kind**: instance method of [<code>Shimakaze</code>](#Shimakaze)
**Returns**: <code>Promise.&lt;any&gt;</code> - The parsed response object, refer to https://docs.weeb.sh/#get-settings for its structure

| Param | Type | Default |
| --- | --- | --- |
| [options] | [<code>ShimakazeOptions</code>](#ShimakazeOptions) | <code>{}</code> |

**Example**
```js
weebSH.shimakaze.getSettings()
    .then(console.log)
    .catch(console.error)
```
<a name="Shimakaze+setSettings"></a>

### shimakaze.setSettings(settings, [options]) ⇒ <code>Promise.&lt;any&gt;</code>
Update the current settings

**Kind**: instance method of [<code>Shimakaze</code>](#Shimakaze)
**Returns**: <code>Promise.&lt;any&gt;</code> - The parsed response object, refer to https://docs.weeb.sh/#set-settings for its structure

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| settings | [<code>ReputationSettings</code>](#ReputationSettings) |  | The settings to update |
| [options] | [<code>ShimakazeOptions</code>](#ShimakazeOptions) | <code>{}</code> |  |

**Example**
```js
weebSH.shimakaze.setSettings({reputationPerDay: 3})
    .then(console.log)
    .catch(console.error)
```
<a name="ShimakazeOptions"></a>

## ShimakazeOptions
**Kind**: global typedef
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| baseURL | <code>string</code> | The base URL |
| timeout | <code>number</code> | Time in milliseconds before the request should be aborted |
| headers | <code>any</code> | An object of additional headers following a {'header': 'value'} format, note that those must not be content-type, user-agent or authorization header |
| burst | <code>boolean</code> | Whether to enable the request handler's burst mode, false by default |
| beforeNextRequest | <code>number</code> | Only apply per-request, time in milliseconds before the next request in the queue should be executed. Is ignored if burst mode is enabled |
| requestsPerMinute | <code>number</code> | Only apply when instantiating the module, regardless of the mode, define how many requests can be done in a minute. 0 makes it limitless |
| botID | <code>string</code> | - The ID of the bot reputation database to access, if you specify it here, you won't need to specify it in every methods. You can always override it by specifying it in the method, note that methods which don't take objects as argument (methods with 2 or fewer parameters) will take the passed arguments count; As in, if the method expect at least 2 arguments (the bot id and something else) and you pass only one argument, it will be assumed that you want to use the botID set in the constructor |

<a name="GiveReputationOptions"></a>

## GiveReputationOptions
**Kind**: global typedef
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| botID | <code>string</code> | The ID of the bot reputation database to use |
| targetID | <code>string</code> | The ID of the user to give reputation to |
| sourceID | <code>string</code> | The ID of the user who is giving reputation |

<a name="ResetUserReputationOptions"></a>

## ResetUserReputationOptions
**Kind**: global typedef
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| botID | <code>string</code> |  | The ID of the bot reputation database to use |
| targetID | <code>string</code> |  | The ID of the user to reset |
| [resetCooldown] | <code>boolean</code> | <code>false</code> | Whether to reset the user cooldown field too, false by default |

<a name="IncreaseUserReputationOptions"></a>

## IncreaseUserReputationOptions
**Kind**: global typedef
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| botID | <code>string</code> | The ID of the bot reputation database to use |
| targetID | <code>string</code> | The ID of the user to reset |
| increase | <code>number</code> | By how much should the user reputation be increased |

<a name="DecreaseUserReputationOptions"></a>

## DecreaseUserReputationOptions
**Kind**: global typedef
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| botID | <code>string</code> | The ID of the bot reputation database to use |
| targetID | <code>string</code> | The ID of the user to reset |
| decrease | <code>number</code> | By how much should the user reputation be decreased |

<a name="ReputationSettings"></a>

## ReputationSettings
**Kind**: global typedef
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [reputationPerDay] | <code>number</code> | The maximum reputation a user can give per **reputationCooldown** (so per day by default) |
| [maximumReputation] | <code>number</code> | The maximum reputation a user can ever have (there is no maximum by default) |
| [maximumReputationReceivedDay] | <code>number</code> | How much reputation a user can receive per day (there is no maximum by default) |
| [reputationCooldown] | <code>number</code> | Cooldown per reputation, this is set to time in seconds (must be >= 300) |

<dl>
<dt><a href="#Tama">Tama</a></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#TamaOptions">TamaOptions</a></dt>
<dd></dd>
<dt><a href="#CreateOrUpdateOptions">CreateOrUpdateOptions</a></dt>
<dd></dd>
<dt><a href="#listSubSettingsOptions">listSubSettingsOptions</a></dt>
<dd></dd>
<dt><a href="#getSubSettingOptions">getSubSettingOptions</a></dt>
<dd></dd>
<dt><a href="#CreateOrUpdateSubSettingOptions">CreateOrUpdateSubSettingOptions</a></dt>
<dd></dd>
</dl>

<a name="Tama"></a>

## Tama
**Kind**: global class
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| token | <code>any</code> | The token given in the constructor of Taihou, formatted according to whether it is a wolke token or not |
| options | <code>any</code> | The **effective** options; e.g, if you specified options specific to Tama, those override the base ones |
| settingsCache | <code>Collection</code> | The settings cache |
| subSettingsCache | <code>Collection</code> | The sub-settings cache |


* [Tama](#Tama)
    * [.getStatus([options])](#Tama+getStatus) ⇒ <code>boolean</code>
    * [.getSetting(type, id, [options])](#Tama+getSetting) ⇒ <code>Promise.&lt;any&gt;</code>
    * [.createSetting(createOptions, [options])](#Tama+createSetting) ⇒ <code>Promise.&lt;any&gt;</code>
    * [.updateSetting(updateOptions, [options])](#Tama+updateSetting) ⇒ <code>Promise.&lt;any&gt;</code>
    * [.deleteSetting(type, id, [options])](#Tama+deleteSetting) ⇒ <code>Promise.&lt;any&gt;</code>
    * [.listSubSettings(listOptions, [options])](#Tama+listSubSettings) ⇒ <code>Promise.&lt;any&gt;</code>
    * [.getSubSetting(getSubSettingOptions, [options])](#Tama+getSubSetting) ⇒ <code>Promise.&lt;any&gt;</code>
    * [.createSubSetting(createOptions, [options])](#Tama+createSubSetting) ⇒ <code>Promise.&lt;any&gt;</code>
    * [.updateSubSetting(updateOptions, [options])](#Tama+updateSubSetting) ⇒ <code>Promise.&lt;any&gt;</code>
    * [.deleteSubSetting(deleteOptions, [options])](#Tama+deleteSubSetting) ⇒ <code>Promise.&lt;any&gt;</code>

<a name="Tama+getStatus"></a>

### tama.getStatus([options]) ⇒ <code>boolean</code>
Make a simple request to check whether Tama is available or not, due to its nature, this method never rejects

**Kind**: instance method of [<code>Tama</code>](#Tama)
**Returns**: <code>boolean</code> - Whether or not Tama is online

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | [<code>TamaOptions</code>](#TamaOptions) | <code>{}</code> | An optional object of options |

**Example**
```js
weebSH.tama.getStatus()
    .then(console.log)
    .catch(console.error)
```

<a name="Tama+getSetting"></a>

### tama.getSetting(type, id, [options]) ⇒ <code>Promise.&lt;any&gt;</code>
Get a setting by type and ID

**Kind**: instance method of [<code>Tama</code>](#Tama)
**Returns**: <code>Promise.&lt;any&gt;</code> - The parsed response object, with a `cached` property representing whether the returned setting is from the cache, refer to https://docs.weeb.sh/#get-setting for its structure

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| type | <code>string</code> |  | The type of the setting |
| id | <code>string</code> \| <code>number</code> |  | The ID of the setting |
| [options] | [<code>TamaOptions</code>](#TamaOptions) | <code>{}</code> |  |

**Example**
```js
weebSH.tama.getSetting('guilds', '300407204987666432')
    .then(console.log)
    .catch(console.error)
```
<a name="Tama+createSetting"></a>

### tama.createSetting(createOptions, [options]) ⇒ <code>Promise.&lt;any&gt;</code>
Technically you can update an existing setting with this method too, the only reason there is two different methods is to be clearer

**Kind**: instance method of [<code>Tama</code>](#Tama)
**Returns**: <code>Promise.&lt;any&gt;</code> - The parsed response object, refer to https://docs.weeb.sh/#create-update-setting for its structure

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| createOptions | [<code>CreateOrUpdateOptions</code>](#CreateOrUpdateOptions) |  | An object of parameters |
| [options] | [<code>TamaOptions</code>](#TamaOptions) | <code>{}</code> |  |

**Example**
```js
weebSH.tama.createSetting({type: 'guilds', id: '300407204987666432', data: {prefix: 'poi', baguette: true}})
    .then(console.log)
    .catch(console.error)
```
<a name="Tama+updateSetting"></a>

### tama.updateSetting(updateOptions, [options]) ⇒ <code>Promise.&lt;any&gt;</code>
Technically you can create a setting with this method too, the only reason there is two different methods is to be clearer

**Kind**: instance method of [<code>Tama</code>](#Tama)
**Returns**: <code>Promise.&lt;any&gt;</code> - The parsed response object, refer to https://docs.weeb.sh/#create-update-setting for its structure

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| updateOptions | [<code>CreateOrUpdateOptions</code>](#CreateOrUpdateOptions) |  | An object of parameters |
| [options] | [<code>TamaOptions</code>](#TamaOptions) | <code>{}</code> |  |

**Example**
```js
weebSH.tama.updateSetting({type: 'guilds', id: '300407204987666432', data: {prefix: 'poi', baguette: false}})
    .then(console.log)
    .catch(console.error)
```
<a name="Tama+deleteSetting"></a>

### tama.deleteSetting(type, id, [options]) ⇒ <code>Promise.&lt;any&gt;</code>
If options.useCache is true, the setting will also be deleted from the cache. Note that this however won't delete the subsettings

**Kind**: instance method of [<code>Tama</code>](#Tama)
**Returns**: <code>Promise.&lt;any&gt;</code> - The parsed response object, refer to https://docs.weeb.sh/#delete-setting for its structure

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| type | <code>string</code> |  | The type of the setting |
| id | <code>string</code> \| <code>number</code> |  | The ID of the setting |
| [options] | [<code>TamaOptions</code>](#TamaOptions) | <code>{}</code> |  |

**Example**
```js
weebSH.tama.deleteSetting('guilds', '300407204987666432')
    .then(console.log)
    .catch(console.error)
```
<a name="Tama+listSubSettings"></a>

### tama.listSubSettings(listOptions, [options]) ⇒ <code>Promise.&lt;any&gt;</code>
Get a list of sub-settings for a sub-setting type.

**Kind**: instance method of [<code>Tama</code>](#Tama)
**Returns**: <code>Promise.&lt;any&gt;</code> - The parsed response object, refer to https://docs.weeb.sh/#list-sub-settings for its structure

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| listOptions | [<code>listSubSettingsOptions</code>](#listSubSettingsOptions) |  | An object of parameters |
| [options] | [<code>TamaOptions</code>](#TamaOptions) | <code>{}</code> |  |

**Example**
```js
weebSH.tama.listSubSettings({type: 'guilds', id: '300407204987666432', subType: 'channels'})
    .then(console.log)
    .catch(console.error)
```
<a name="Tama+getSubSetting"></a>

### tama.getSubSetting(getSubSettingOptions, [options]) ⇒ <code>Promise.&lt;any&gt;</code>
Get a sub-setting by type and id

**Kind**: instance method of [<code>Tama</code>](#Tama)
**Returns**: <code>Promise.&lt;any&gt;</code> - The parsed response object, along with a `cached` property representing whether the returned sub-setting is from the cache, refer to https://docs.weeb.sh/#get-sub-settings for its structure

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| getSubSettingOptions | <code>GetSubSettingOptions</code> |  | An object of parameters |
| [options] | [<code>TamaOptions</code>](#TamaOptions) | <code>{}</code> |  |

**Example**
```js
weebSH.tama.getSubSetting({type: 'guilds', id: '300407204987666432', subType: 'channels', subId: '439457506960605185'})
    .then(console.log)
    .catch(console.error)
```
<a name="Tama+createSubSetting"></a>

### tama.createSubSetting(createOptions, [options]) ⇒ <code>Promise.&lt;any&gt;</code>
Technically this method can be used to update a sub-setting too, the only reason there is two different methods is to be clearer

**Kind**: instance method of [<code>Tama</code>](#Tama)
**Returns**: <code>Promise.&lt;any&gt;</code> - The parsed response object, refer to https://docs.weeb.sh/#create-update-sub-setting for its structure

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| createOptions | [<code>CreateOrUpdateSubSettingOptions</code>](#CreateOrUpdateSubSettingOptions) |  | An object of parameters |
| [options] | [<code>TamaOptions</code>](#TamaOptions) | <code>{}</code> |  |

**Example**
```js
weebSH.tama.createSubSetting({type: 'guilds', id: '300407204987666432', subType: 'channels', subId: '439457506960605185', data: {weeb: false}})
    .then(console.log)
    .catch(console.error)
```
<a name="Tama+updateSubSetting"></a>

### tama.updateSubSetting(updateOptions, [options]) ⇒ <code>Promise.&lt;any&gt;</code>
Technically this method can be used to create a sub-setting too, the only reason there is two different methods is to be clearer

**Kind**: instance method of [<code>Tama</code>](#Tama)
**Returns**: <code>Promise.&lt;any&gt;</code> - The parsed response object, refer to https://docs.weeb.sh/#create-update-sub-setting for its structure

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| updateOptions | [<code>CreateOrUpdateSubSettingOptions</code>](#CreateOrUpdateSubSettingOptions) |  | An object of parameters |
| [options] | [<code>TamaOptions</code>](#TamaOptions) | <code>{}</code> |  |

**Example**
```js
weebSH.tama.createSubSetting({type: 'guilds', id: '300407204987666432', subType: 'channels', subId: '439457506960605185', data: {weeb: true}})
    .then(console.log)
    .catch(console.error)
```
<a name="Tama+deleteSubSetting"></a>

### tama.deleteSubSetting(deleteOptions, [options]) ⇒ <code>Promise.&lt;any&gt;</code>
Delete a sub-setting

**Kind**: instance method of [<code>Tama</code>](#Tama)
**Returns**: <code>Promise.&lt;any&gt;</code> - The parsed response object, refer to https://docs.weeb.sh/#delete-sub-setting for its structure

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| deleteOptions | <code>DeleteSubSettingOptions</code> |  | An object of parameters |
| [options] | [<code>TamaOptions</code>](#TamaOptions) | <code>{}</code> |  |

**Example**
```js
 weebSH.tama.deleteSubSetting({type: 'guilds', id: '300407204987666432', subType: 'channels', subId: '439457506960605185'})
    .then(console.log)
    .catch(console.error)
```
<a name="TamaOptions"></a>

## TamaOptions
**Kind**: global typedef
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| baseURL | <code>string</code> | The base URL |
| timeout | <code>number</code> | Time in milliseconds before the request should be aborted |
| headers | <code>any</code> | An object of additional headers following a {'header': 'value'} format, note that those must not be content-type, user-agent or authorization header |
| burst | <code>boolean</code> | Whether to enable the request handler's burst mode, false by default |
| beforeNextRequest | <code>number</code> | Only apply per-request, time in milliseconds before the next request in the queue should be executed. Is ignored if burst mode is enabled |
| requestsPerMinute | <code>number</code> | Only apply when instantiating the module, regardless of the mode, define how many requests can be done in a minute. 0 makes it limitless |
| useCache | <code>boolean</code> | Defaults to true, this define whether to use the cache rather than always requesting to weeb.sh. The cache is updated whenever the setting is updated through Taihou |

<a name="CreateOrUpdateOptions"></a>

## CreateOrUpdateOptions
**Kind**: global typedef
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| type | <code>string</code> | The type of the setting |
| id | <code>string</code> \| <code>number</code> | The id of the setting |
| data | <code>any</code> | The data you want this setting to hold. Please note that existing data will be overriden by this, so in the case of an update, specify unchanged fields too |

<a name="listSubSettingsOptions"></a>

## listSubSettingsOptions
**Kind**: global typedef
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| type | <code>string</code> | The type of the setting |
| id | <code>string</code> \| <code>number</code> | The id of the setting |
| subType | <code>string</code> | The type of the sub-setting |

<a name="getSubSettingOptions"></a>

## getSubSettingOptions
**Kind**: global typedef
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| type | <code>string</code> | The type of the setting |
| id | <code>string</code> \| <code>number</code> | The id of the setting |
| subType | <code>string</code> | The type of the sub-setting |
| subId | <code>string</code> \| <code>number</code> | The id of the sub-setting |

<a name="CreateOrUpdateSubSettingOptions"></a>

## CreateOrUpdateSubSettingOptions
**Kind**: global typedef
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| type | <code>string</code> | The type of the setting |
| id | <code>string</code> \| <code>number</code> | The id of the setting |
| subType | <code>string</code> | The type of the sub-setting |
| subId | <code>string</code> \| <code>number</code> | The id of the sub-setting |
| data | <code>any</code> | The data you want this sub-setting to hold. Please note that existing data will be overriden by this, so in the case of an update, specify unchanged fields too |

### Request handling

Taihou comes with her own built-in rate-limiter, **note that there is no official rate-limits on weeb.sh, the rate-limiter defaults rate-limits are set to what i think is respectful to the API, you are free to adjust the rate-limits to what you think is best or even disable them entirely by setting `requestsPerMinutes` to 0**

Note that, as weeb.sh offer different services (toph, tama...), each service has its own request handler in Taihou, meaning that rate-limits are per-service and not 
global (so if you hit the limit in toph for example, you can still use tama)

There is a `burst` option, by default set to `false`, if true, the request handler will switch from `sequential` to `burst` mode, more information about those below.

#### Sequential mode

The sequential mode, which is the default mode, distribute the load of requests evenly: After each request, it waits `60000 / <requestsPerMinutes>` before executing 
the next request. There is an example case below which shows clearly how it works

If you want to wait longer or shorter after a specific request, you can pass the `beforeNextRequest` option when calling a method, that will make the request handler wait the specified milliseconds before executing the next request in the queue

#### Burst mode

The burst mode works pretty much exactly like if there was no rate-limiter, except that there is still a limit. Queued requests will be directly executed, unless
it executed as much requests as the limit in the past minute already, in this case, it will wait for the said minute to pass before executing the rest

#### Sequential VS Burst example case

To see clearly how these two modes acts, we'll take a simple use case:

Let's say there is 61 requests to Korra (image-generation) in the queue. The default rate-limit on Korra is 60 requests/minute 

The sequential mode will execute a request/second (`60000 / 60 => 1000 milliseconds => 1 second`) and therefore will finish executing all the requests 
after 1 minute and 1 second

The burst mode will execute all requests as fast as it can, (so most likely the first 60 during the first second) but will then hit the limit, and wait 
for the minute to pass before executing the last one.

Meaning that both modes will execute the 61 requests in the queue in ~1 minute and 1 second

In most cases the sequential mode is more suited, which is why it's the default, but feel free to chose what you think is best

### Error handling

Malformed requests errors are instances of Node.js's Error class while errors that are directly originating from the request sent to the weeb.sh servers are following [Axios's error scheme](https://www.npmjs.com/package/axios#handling-errors)

### Tama caching behavior

As you can store things such as prefixes with Tama, and that you most likely want to access the said prefixes whenever your bot receive a message, Taihou 
comes with a enabled by default built-in cache to not spam the API and to serve settings faster.

Whenever you request a setting/subsetting (like with the `Tama.getSetting()` method for example), the object returned by weeb.sh will be put into the cache, then,
when you request the same setting again, the cached one will be returned. You can explicitly tell Taihou to not use the cache by passing the `useCache: false` option

Not only when you fetch a setting, but also when you create/update a setting/subsetting, the cache will be updated, to ensure that the cached version is always
up-to-date. As well as when you delete a setting/sub-setting, it is deleted from the cache as well (unless you specify otherwise, more information below)

A `cached` property is added to the objects that can potentially be returned from the cache, if `true`, it means the returned object is from the cache

Though there's still a lot of use cases where the cache might not be welcome, if for example another process (another bot for example) change the settings, the cached version won't be updated, as Taihou is not able to know that. This is why the `useCache` option is available, you can either set it to `false` for the entire 
service, or set it to `false` for specific requests. 

The `useCache` option gives you great control over the cache, as when you set it to `false` you, you tell to Taihou "Do not interact with the cache at all" rather 
than something like "Do not fetch from the cache". Meaning that if you for example request a setting deletion, and that `useCache` is set to `false`, the cached 
version (if any) won't be deleted. Same if you create/update a setting, if `useCache` is set to `false`, the setting won't be added/updated in the cache.

![Taihou](https://cdn.discordapp.com/attachments/356224772184735756/451848094963990528/unknown.png)
