import test from "node:test";
import assert from "node:assert/strict";

import poutineIpsum, { PoutineIpsum } from "../src/index.js";
import { DICTIONARIES } from "../src/dictionaries.js";

/**
 * Check that every portion of text (after the starter phrase) comes from the
 * given word list. Handles multi-word dictionary entries by trying longest
 * matches first.
 */
function assertWordsFrom(text, wordList) {
  const starter = "Poutine ipsum dolor sit amet";
  assert.ok(text.startsWith(starter), `expected text to start with "${starter}"`);

  let remaining = text.slice(starter.length).trim();
  // Sort entries longest-first so multi-word entries match before their parts
  const sorted = [...wordList].sort((a, b) => b.length - a.length);

  while (remaining.length > 0) {
    const lower = remaining.toLowerCase();
    const match = sorted.find(
      (entry) =>
        lower.startsWith(entry) &&
        (lower.length === entry.length || lower[entry.length] === " "),
    );
    assert.ok(match, `"${remaining.split(" ").slice(0, 3).join(" ")}…" is not in the word list`);
    remaining = remaining.slice(match.length).trim();
  }
}

// --- Function API ---

test("function API defaults to french and starts with required phrase", () => {
  const output = poutineIpsum({
    count: 2,
    units: "sentences",
    random: () => 0.2,
  });

  assert.ok(output.length > 0);
  assert.ok(output.startsWith("Poutine ipsum dolor sit amet"));
});

test("function API generates only french words", () => {
  const output = poutineIpsum({
    count: 10,
    units: "words",
    language: "fr",
    random: () => 0.1,
  });

  const allFrWords = [...DICTIONARIES.fr.classic, ...DICTIONARIES.fr.extended];
  assertWordsFrom(output, allFrWords);
});

test("function API generates only english words", () => {
  const output = poutineIpsum({
    count: 10,
    units: "words",
    language: "en",
    random: () => 0.3,
  });

  const allEnWords = [...DICTIONARIES.en.classic, ...DICTIONARIES.en.extended];
  assertWordsFrom(output, allEnWords);
});

test("function API supports html paragraph format", () => {
  const output = poutineIpsum({
    count: 2,
    units: "paragraphs",
    format: "html",
    random: () => 0.15,
  });

  assert.ok(output.startsWith("<p>Poutine ipsum dolor sit amet"));
  assert.match(output, /^<p>.*<\/p>\n<p>.*<\/p>$/s);
});

// --- Class API ---

test("class API supports paragraph generation", () => {
  const generator = new PoutineIpsum({
    language: "en",
    random: () => 0.05,
    sentencesPerParagraph: { min: 1, max: 1 },
    wordsPerSentence: { min: 3, max: 3 },
  });

  const output = generator.generateParagraphs(2);

  assert.equal(output.split("\n").length, 2);
  assert.ok(output.startsWith("Poutine ipsum dolor sit amet"));
});

// --- Vocabulary option ---

test("vocabulary 'classic' only uses classic words", () => {
  const output = poutineIpsum({
    count: 12,
    units: "words",
    language: "fr",
    vocabulary: "classic",
    random: () => 0.5,
  });

  assertWordsFrom(output, DICTIONARIES.fr.classic);
});

test("vocabulary 'extended' only uses extended words", () => {
  const output = poutineIpsum({
    count: 12,
    units: "words",
    language: "fr",
    vocabulary: "extended",
    random: () => 0.5,
  });

  assertWordsFrom(output, DICTIONARIES.fr.extended);
});

test("vocabulary 'all' uses both classic and extended words", () => {
  const output = poutineIpsum({
    count: 12,
    units: "words",
    language: "en",
    vocabulary: "all",
    random: () => 0.9,
  });

  const allEnWords = [...DICTIONARIES.en.classic, ...DICTIONARIES.en.extended];
  assertWordsFrom(output, allEnWords);
});

test("class API respects vocabulary option", () => {
  const generator = new PoutineIpsum({
    language: "en",
    vocabulary: "classic",
    random: () => 0.4,
  });

  const output = generator.generateWords(10);
  assertWordsFrom(output, DICTIONARIES.en.classic);
});
