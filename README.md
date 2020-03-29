[![Chrome Web Store][WebStoreBadge]][WebStore]
[![AMO][AmoBadge]][Amo]
[![Gitter][GitterBadge]][Gitter]

[![dependencies status][DavidDmBadge]][DavidDm]
[![devDependencies status][DavidDmBadgeDev]][DavidDmDev]

[![Test status][GitHubActionsBadge]][GitHubActions]
[![Codacy Badge][CodacyBadge]][Codacy]
[![Codacy Coverage Badge][CodacyCoverageBadge]][Codacy]

# Web Scrobbler

Web Scrobbler helps online music listeners to scrobble their playback history.

## Supported Services

-   [Last.fm][LastFm]
-   [Libre.fm][LibreFm]
-   [ListenBrainz][ListenBrainz]

## Installation

The extension can be either downloaded from the Chrome Web Store, <abbr title="addons.mozilla.org">AMO</abbr>, or installed as an [unpacked extension][DocsUnpacked].

### Chrome Web Store

It can be installed directly from [Chrome Web Store][WebStore] with Chrome used.

Opera users can install the extension from Chrome Web Store using the [Download Chrome Extension][DownloadChromeExt] addon for Opera.

### Addons.mozilla.org

For those who prefer Firefox as a main browser, the extension is available on [AMO][Amo].

### Install from source code

To install the extension from sources or zip file, read [this page][WikiUnpacked] if you're on Chrome, or [this one][WikiTempAddon] if you use Firefox.

## Development

### Build the extension

Before building the extension you should install dependencies:

```sh
# Install dependencies
> npm install

# Build the extension
> npx grunt build:firefox
# or
> npx grunt build:chrome
```

The built extension is available in `build` directory. You can install it as an unpacked extension from this directory.

The detailed build instruction is available [here][BuildInstructions].

### Develop connectors

Check the [wiki page][WikiDev] to understand development of connectors. Please also read [contributions guidelines][Contributing].

### Translations

We use Transifex to maintain translations. If you want to translate the extension, follow [this][Translations] wiki page for details.

### Gitter

We use Gitter and you can join us @ [web-scrobbler/web-scrobbler][Gitter].

## Media

Follow [@web_scrobbler][Twitter] on Twitter to receive the latest news and updates.

## Privacy Policy

See the [privacy policy][Privacy].

## License

See the [license file][License].

<!-- Badges -->
[AmoBadge]: https://img.shields.io/amo/v/web-scrobbler.svg
[CodacyBadge]: https://api.codacy.com/project/badge/Grade/32658c34c5c542d9a315ead8d5eadd0e
[CodacyCoverageBadge]: https://api.codacy.com/project/badge/Coverage/32658c34c5c542d9a315ead8d5eadd0e
[DavidDmBadge]: https://img.shields.io/david/web-scrobbler/web-scrobbler
[DavidDmBadgeDev]: https://img.shields.io/david/dev/web-scrobbler/web-scrobbler?label=devDependencies
[GitHubActionsBadge]: https://github.com/web-scrobbler/web-scrobbler/workflows/Test/badge.svg
[GitterBadge]: https://badges.gitter.im/Join%20Chat.svg
[WebStoreBadge]: https://img.shields.io/chrome-web-store/v/hhinaapppaileiechjoiifaancjggfjm.svg

<!-- Docs -->
[BuildInstructions]: https://github.com/web-scrobbler/web-scrobbler/wiki/Setup-development-environment
[Contributing]: https://github.com/web-scrobbler/web-scrobbler/blob/master/.github/CONTRIBUTING.md
[DocsUnpacked]: https://developer.chrome.com/extensions/getstarted#unpacked
[License]: https://github.com/web-scrobbler/web-scrobbler/blob/master/LICENSE.md
[Privacy]: https://github.com/web-scrobbler/web-scrobbler/blob/master/src/_locales/en/privacy.md
[Translations]: https://github.com/web-scrobbler/web-scrobbler/wiki/Translate-the-extension

<!-- Download -->
[WebStore]: https://chrome.google.com/webstore/detail/lastfm-scrobbler/hhinaapppaileiechjoiifaancjggfjm
[Amo]: https://addons.mozilla.org/en-US/firefox/addon/web-scrobbler/

<!-- Other -->
[DownloadChromeExt]: https://addons.opera.com/extensions/details/app_id/kipjbhgniklcnglfaldilecjomjaddfi

<!-- Related pages -->
[Codacy]: https://app.codacy.com/gh/web-scrobbler/web-scrobbler/dashboard
[DavidDm]: https://david-dm.org/web-scrobbler/web-scrobbler
[DavidDmDev]: https://david-dm.org/web-scrobbler/web-scrobbler?type=dev
[GitHubActions]: https://github.com/web-scrobbler/web-scrobbler/actions
[Gitter]: https://gitter.im/david-sabata/web-scrobbler
[Twitter]: https://twitter.com/web_scrobbler

<!-- Services -->
[LastFm]: http://www.last.fm/
[LibreFm]: https://libre.fm/
[ListenBrainz]: https://listenbrainz.org/

<!-- Wiki pages -->
[WikiDev]: https://github.com/web-scrobbler/web-scrobbler/wiki/Connectors-development
[WikiTempAddon]: https://github.com/web-scrobbler/web-scrobbler/wiki/Install-a-temporary-add-on
[WikiUnpacked]: https://github.com/web-scrobbler/web-scrobbler/wiki/Install-an-unpacked-extension
