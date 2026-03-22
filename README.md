# poutine-ipsum

`poutine-ipsum` is an npm library that generates Lorem Ipsum-like placeholder text about poutine.

It mimics the API style of the most-starred comparable JavaScript lorem library (`knicklabs/lorem-ipsum.js`) by exposing:

- A class API for repeated generation with shared options.
- A function API for one-off text generation.

Supported languages:

- `en` (English)
- `fr` (French)

All generated outputs always begin with:

`Poutine ipsum dolor sit amet`

## Installation

```bash
npm install poutine-ipsum
```

## Using the Class

```js
import { PoutineIpsum } from "poutine-ipsum";

const poutine = new PoutineIpsum({
  language: "fr",
  sentencesPerParagraph: {
    min: 2,
    max: 4,
  },
  wordsPerSentence: {
    min: 4,
    max: 10,
  },
});

console.log(poutine.generateWords(5));
console.log(poutine.generateSentences(2));
console.log(poutine.generateParagraphs(3));
```

### Class Options

- `language`: `"en" | "fr"` (default: `"fr"`)
- `sentencesPerParagraph.min`: number (default: `3`)
- `sentencesPerParagraph.max`: number (default: `7`)
- `wordsPerSentence.min`: number (default: `5`)
- `wordsPerSentence.max`: number (default: `15`)
- `random`: PRNG function (default: `Math.random`)
- `suffix`: paragraph separator string (default: OS-specific line ending)
- `words`: optional custom word list array (overrides language dictionary)

## Using the Function

```js
import { poutineIpsum } from "poutine-ipsum";

const text = poutineIpsum({
  count: 2,
  units: "paragraphs",
  language: "en",
});

console.log(text);
```

### Function Options

- `count`: number of units to generate (default: `1`)
- `units`: `"word(s)" | "sentence(s)" | "paragraph(s)"` (default: `"sentences"`)
- `format`: `"plain" | "html"` (HTML wraps paragraphs in `<p>` tags)
- `language`: `"en" | "fr"` (default: `"fr"`)
- `paragraphLowerBound`: min sentences per paragraph (default: `3`)
- `paragraphUpperBound`: max sentences per paragraph (default: `7`)
- `sentenceLowerBound`: min words per sentence (default: `5`)
- `sentenceUpperBound`: max words per sentence (default: `15`)
- `suffix`: separator between generated units (default: OS-specific line ending)
- `random`: PRNG function (default: `Math.random`)
- `words`: optional custom words array

## Examples

English words:

```js
poutineIpsum({ count: 8, units: "words", language: "en" });
// "Poutine ipsum dolor sit amet curds saucebrune ..."
```

French sentence (default language):

```js
poutineIpsum({ count: 1, units: "sentences" });
// "Poutine ipsum dolor sit amet ..."
```

HTML paragraphs:

```js
poutineIpsum({ count: 2, units: "paragraphs", format: "html" });
// "<p>...</p>\n<p>...</p>"
```

## Author

Created by [felixlechat](https://github.com/felixlechat).
