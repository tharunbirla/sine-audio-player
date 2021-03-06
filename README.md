# Sine Audio Player

![GitHub](https://img.shields.io/github/license/tharunbirla/sine-audio-player)
![GitHub file size in bytes](https://img.shields.io/github/size/tharunbirla/sine-audio-player/dist/sine-audio-player.min.js)
![GitHub last commit](https://img.shields.io/github/last-commit/tharunbirla/sine-audio-player)

## [Online demo](https://tharunbirla.github.io/sine-audio-player/)

![Sine Audio Player](https://i.imgur.com/tnPLsRB.png)

## Installation

#### Github

Download repository [ZIP](https://codeload.github.com/tharunbirla/sine-audio-player/zip/main).

#### CDN

Alternatively, you can load it from CDN:

```html
<script src="https://cdn.jsdelivr.net/gh/tharunbirla/sine-audio-player/dist/sine-audio-player.min.js"></script>
```

#### NPM

```
npm i sine-audio-player
```

## Usage

Include the `sine-audio-player.min.js` file:

```html
<script src="{path}/dist/sine-audio-player.min.js"></script>
```

Add `<sine-player>` tag between your HTML `<body></body>` tag. You add the attributes mentioned bellow in the table.

```html
<sine-player src="your-audio.mp3"></sine-player>
```

You can add multiple players on a single page.

## Options
| Option | Description | Values | Default |
|--------|-------------|--------|---------|
| src | Specifies the URL of the audio file. | `URL` | `-`
| muted | Specifies that the audio output should be muted. | `true`, `false` | `false`
| preload | Specifies if and how the author thinks the audio should be loaded when the page loads. | `none`,`auto`,`metadata` | `false`
| autoplay | Specifies that the audio will start playing as soon as it is ready. | `autoplay` | `false`
| buffer-percentage | Specifies how much audio data must be rendered as soon as the user load the page | `number` | `50`

_Other default options:_ 
| Options | Default |
|---------|---------|
| Volume | 100% |
| Preview Volume | 50% |


You can focus on player elements with Tab key and use the following keys to use the player controls.

| Key | Action |
|--------|-------------|
| Tab | Focus on the next element | 
| Shift + Tab | Focus on the previous element | 
| Enter or Spacebar | Pause/Play | 
| Right Arrow | Fast-forward | 
| Left Arrow | Rewind | 
| Enter or Spacebar | Show/hide volume slider |
| Up Arrow, Left Arrow | Increase volume |
| Down Arrow, Right Arrow | Decrease volume |

[Video](https://www.youtube.com/rkqqBA6ohc0)