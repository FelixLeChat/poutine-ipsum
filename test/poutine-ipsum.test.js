import test from "node:test";
import assert from "node:assert/strict";

import poutineIpsum, { PoutineIpsum } from "../src/index.js";
import { DICTIONARIES } from "../src/dictionaries.js";

test("function API defaults to french and starts with required phrase", () => {
  const output = poutineIpsum({
    count: 2,
    units: "sentences",
    random: () => 0.2,
  });

  assert.ok(output.length > 0);
  assert.ok(output.startsWith("Poutine ipsum dolor sit amet"));
  assert.match(output, /bouillon|frites|fromage|saucebrune|québec|cassecroûte/);
});

test("function API can generate french words", () => {
  const output = poutineIpsum({
    count: 10,
    units: "words",
    language: "fr",
    random: () => 0.1,
  });

  const words = output.split(" ");
  assert.equal(words.length, 10);
  assert.equal(words.slice(0, 5).join(" "), "Poutine ipsum dolor sit amet");

  const allFrWords = [...DICTIONARIES.fr.classic, ...DICTIONARIES.fr.extended];
  for (const word of words.slice(5)) {
    assert.ok(allFrWords.includes(word));
  }
});

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
