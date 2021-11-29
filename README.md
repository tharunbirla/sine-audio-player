# Sine Audio Player

![GitHub](https://img.shields.io/github/license/tharunbirla/sine-audio-player.svg)
![GitHub file size in bytes](https://img.shields.io/github/size/tharunbirla/sine-audio-player/dist/sine-audio-player.min.js.svg)
![GitHub last commit](https://img.shields.io/github/last-commit/tharunbirla/sine-audio-player.svg)

## [Online demo](https://tharunbirla.github.io/sine-audio-player/)

![Sine Audio Player](https://i.imgur.com/tnPLsRB.png)

## Installation

#### Github

Download repository [ZIP](https://github.com/tharunbirla/sine-audio-player/archive/master.zip).

#### CDN

Alternatively, you can load it from CDN:

```html
<script src="https://cdn.jsdelivr.net/gh/tharunbirla/sine-audio-player/dist/js/sine-audio-player.min.js"></script>
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

<iframe width="560" height="315" src="https://www.youtube.com/embed/rkqqBA6ohc0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>