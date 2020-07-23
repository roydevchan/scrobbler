<div align="center">

<p>
	<img width="128" src="./src/icons/icon_chrome_circle.svg"/>
</p>
<h1>Web Scrobbler</h1>

[![Chrome Web Store][WebStoreBadge]][WebStore]
[![AMO][AmoBadge]][Amo]
[![Discord][DiscordBadge]][Discord]
[![Test status][GitHubActionsBadge]][GitHubActions]
[![Codacy Badge][CodacyBadge]][Codacy]
[![Codacy Coverage Badge][CodacyCoverageBadge]][Codacy]

</div>

Web Scrobbler helps online music listeners to scrobble their playback history.

## Supported Services

-   [Last.fm][LastFm]
-   [Libre.fm][LibreFm]
-   [ListenBrainz][ListenBrainz]

## Installation

The extension can be either downloaded from the Chrome Web Store,
<abbr title="addons.mozilla.org">AMO</abbr>, or installed as
an [unpacked extension][DocsUnpacked].

### Chrome Web Store

It can be installed directly from [Chrome Web Store][WebStore] with Chrome used.

Opera users can install the extension from Chrome Web Store using the
[Download Chrome Extension][DownloadChromeExt] addon for Opera.

### Addons.mozilla.org

For those who prefer Firefox as a main browser, the extension is
available on [AMO][Amo].

### Install from source code

To install the extension from sources or zip file, read
[this page][WikiUnpacked] if you're on Chrome, or [this one][WikiTempAddon]
if you use Firefox.

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

The built extension is available in `build` directory. You can install it as an
unpacked extension from this directory.

The detailed build instruction is available [here][BuildInstructions].

### Develop connectors

Check the [wiki page][WikiDev] to understand development of connectors. Please
also read [contributions guidelines][Contributing].

### Translations

We use Transifex to maintain translations. If you want to translate
the extension, follow [this][Translations] wiki page for details.

## Media

Follow [@web_scrobbler][Twitter] on Twitter to receive the latest news and updates.

Join the experimental [Discord channel][Discord] to discuss the extension.

## Privacy Policy

See the [privacy policy][Privacy].

## License

See the [license file][License].

<!-- Badges -->
[AmoBadge]: https://img.shields.io/amo/v/web-scrobbler.svg?label=firefox&logo=firefox-browser&logoColor=white
[CodacyBadge]: https://img.shields.io/codacy/grade/32658c34c5c542d9a315ead8d5eadd0e?logo=codacy&logoColor=white
[CodacyCoverageBadge]: https://img.shields.io/codacy/coverage/32658c34c5c542d9a315ead8d5eadd0e?logo=codacy&logoColor=white
[DiscordBadge]: https://img.shields.io/discord/716363971070001202?logo=discord&logoColor=white&color=7289dA
[GitHubActionsBadge]: https://img.shields.io/github/workflow/status/web-scrobbler/web-scrobbler/Test?label=test&logo=github&logoColor=white
[WebStoreBadge]: https://img.shields.io/chrome-web-store/v/hhinaapppaileiechjoiifaancjggfjm.svg?label=chrome&logo=google-chrome&logoColor=white

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
[Discord]: https://discord.com/invite/u99wNWw
[GitHubActions]: https://github.com/web-scrobbler/web-scrobbler/actions
[Twitter]: https://twitter.com/web_scrobbler

<!-- Services -->
[LastFm]: http://www.last.fm/
[LibreFm]: https://libre.fm/
[ListenBrainz]: https://listenbrainz.org/

<!-- Wiki pages -->
[WikiDev]: https://github.com/web-scrobbler/web-scrobbler/wiki/Connectors-development
[WikiTempAddon]: https://github.com/web-scrobbler/web-scrobbler/wiki/Install-a-temporary-add-on
[WikiUnpacked]: https://github.com/web-scrobbler/web-scrobbler/wiki/Install-an-unpacked-extension
