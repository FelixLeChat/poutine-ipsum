import os from "node:os";
import { DICTIONARIES } from "./dictionaries.js";

const DEFAULT_LANGUAGE = "fr";
const STARTER_TEXT = "Poutine ipsum dolor sit amet";
const STARTER_WORDS = STARTER_TEXT.split(" ");

const DEFAULT_CLASS_OPTIONS = {
  language: DEFAULT_LANGUAGE,
  sentencesPerParagraph: {
    min: 3,
    max: 7,
  },
  wordsPerSentence: {
    min: 5,
    max: 15,
  },
  random: Math.random,
  suffix: os.EOL,
};

const DEFAULT_FUNCTION_OPTIONS = {
  count: 1,
  format: "plain",
  paragraphLowerBound: 3,
  paragraphUpperBound: 7,
  sentenceLowerBound: 5,
  sentenceUpperBound: 15,
  suffix: os.EOL,
  units: "sentences",
  random: Math.random,
  language: DEFAULT_LANGUAGE,
  words: undefined,
};

function normalizeLanguage(language) {
  return language === "fr" ? "fr" : "en";
}

function normalizeVocabulary(vocabulary) {
  if (vocabulary === "classic" || vocabulary === "extended") {
    return vocabulary;
  }
  return "all";
}

function getWords(language, customWords, vocabulary) {
  if (Array.isArray(customWords) && customWords.length > 0) {
    return customWords;
  }

  const dict = DICTIONARIES[normalizeLanguage(language)];
  const v = normalizeVocabulary(vocabulary);

  if (v === "classic") {
    return dict.classic;
  }
  if (v === "extended") {
    return dict.extended;
  }
  return [...dict.classic, ...dict.extended];
}

function randomInt(min, max, random) {
  return Math.floor(random() * (max - min + 1)) + min;
}

function randomWord(words, random, previousWord) {
  if (words.length === 1) {
    return words[0];
  }

  const firstIndex = randomInt(0, words.length - 1, random);
  let candidate = words[firstIndex];

  if (candidate === previousWord) {
    const nextIndex = (firstIndex + 1) % words.length;
    candidate = words[nextIndex];
  }

  return candidate;
}

function toSentence(words, random) {
  if (words.length === 0) {
    return "";
  }

  const punct = [".", ".", ".", "!", "?"];
  const ending = punct[randomInt(0, punct.length - 1, random)];

  const firstWord = words[0];
  words[0] = firstWord.charAt(0).toUpperCase() + firstWord.slice(1);

  return `${words.join(" ")}${ending}`;
}

function generateWordArray(count, words, random) {
  const result = [];

  while (result.length < count) {
    const previousWord = result[result.length - 1];
    result.push(randomWord(words, random, previousWord));
  }

  return result;
}

function normalizeUnits(units) {
  const value = String(units).toLowerCase();

  if (value === "word" || value === "words") {
    return "words";
  }

  if (value === "paragraph" || value === "paragraphs") {
    return "paragraphs";
  }

  return "sentences";
}

function buildLeadingWords(count, words, random) {
  const safeCount = Math.max(STARTER_WORDS.length, count);
  const tailCount = Math.max(0, safeCount - STARTER_WORDS.length);
  const tailWords = generateWordArray(tailCount, words, random);
  return [...STARTER_WORDS, ...tailWords];
}

function createGenerator(config) {
  return {
    generateWords(count = 1) {
      const leadingWords = buildLeadingWords(
        count,
        config.words,
        config.random,
      );
      return leadingWords.join(" ");
    },

    generateSentence(includeStarter = true) {
      const count = randomInt(
        config.wordsPerSentence.min,
        config.wordsPerSentence.max,
        config.random,
      );

      if (includeStarter) {
        return toSentence(
          buildLeadingWords(count, config.words, config.random),
          config.random,
        );
      }

      return toSentence(
        generateWordArray(count, config.words, config.random),
        config.random,
      );
    },

    generateSentences(count = 1, includeStarter = true) {
      const safeCount = Math.max(1, count);
      const output = [];

      for (let i = 0; i < safeCount; i += 1) {
        output.push(this.generateSentence(includeStarter && i === 0));
      }

      return output.join(" ");
    },

    generateParagraph(includeStarter = true) {
      const count = randomInt(
        config.sentencesPerParagraph.min,
        config.sentencesPerParagraph.max,
        config.random,
      );

      return this.generateSentences(count, includeStarter);
    },

    generateParagraphs(count = 1) {
      const safeCount = Math.max(1, count);
      const output = [];

      for (let i = 0; i < safeCount; i += 1) {
        output.push(this.generateParagraph(i === 0));
      }

      return output.join(config.suffix);
    },
  };
}

export class PoutineIpsum {
  constructor(options = {}) {
    const mergedOptions = {
      ...DEFAULT_CLASS_OPTIONS,
      ...options,
      sentencesPerParagraph: {
        ...DEFAULT_CLASS_OPTIONS.sentencesPerParagraph,
        ...(options.sentencesPerParagraph || {}),
      },
      wordsPerSentence: {
        ...DEFAULT_CLASS_OPTIONS.wordsPerSentence,
        ...(options.wordsPerSentence || {}),
      },
    };

    this.options = mergedOptions;
    this.options.language = normalizeLanguage(mergedOptions.language);
    this.words = getWords(this.options.language, mergedOptions.words, mergedOptions.vocabulary);
    this.generator = createGenerator({
      words: this.words,
      random: this.options.random,
      wordsPerSentence: this.options.wordsPerSentence,
      sentencesPerParagraph: this.options.sentencesPerParagraph,
      suffix: this.options.suffix,
    });
  }

  generateWords(count = 1) {
    return this.generator.generateWords(count);
  }

  generateSentences(count = 1) {
    return this.generator.generateSentences(count);
  }

  generateParagraphs(count = 1) {
    return this.generator.generateParagraphs(count);
  }
}

export function poutineIpsum(options = {}) {
  const config = {
    ...DEFAULT_FUNCTION_OPTIONS,
    ...options,
  };

  const words = getWords(config.language, config.words, config.vocabulary);
  const generator = createGenerator({
    words,
    random: config.random,
    wordsPerSentence: {
      min: config.sentenceLowerBound,
      max: config.sentenceUpperBound,
    },
    sentencesPerParagraph: {
      min: config.paragraphLowerBound,
      max: config.paragraphUpperBound,
    },
    suffix: config.suffix,
  });

  const units = normalizeUnits(config.units);

  if (units === "words") {
    return generator.generateWords(config.count);
  }

  if (units === "sentences") {
    return generator.generateSentences(config.count);
  }

  const paragraphs = generator.generateParagraphs(config.count);

  if (config.format === "html") {
    return paragraphs
      .split(config.suffix)
      .map((line) => `<p>${line}</p>`)
      .join(config.suffix);
  }

  return paragraphs;
}

export default poutineIpsum;
