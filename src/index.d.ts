export interface Range {
  min?: number;
  max?: number;
}

export type Vocabulary = "classic" | "extended" | "all";

export interface PoutineIpsumOptions {
  language?: "en" | "fr";
  vocabulary?: Vocabulary;
  sentencesPerParagraph?: Range;
  wordsPerSentence?: Range;
  random?: () => number;
  suffix?: string;
  words?: string[];
}

export class PoutineIpsum {
  constructor(options?: PoutineIpsumOptions);
  generateWords(count?: number): string;
  generateSentences(count?: number): string;
  generateParagraphs(count?: number): string;
}

export type Units =
  | "word"
  | "words"
  | "sentence"
  | "sentences"
  | "paragraph"
  | "paragraphs";

export interface PoutineIpsumFunctionOptions {
  count?: number;
  units?: Units;
  format?: "plain" | "html";
  language?: "en" | "fr";
  vocabulary?: Vocabulary;
  paragraphLowerBound?: number;
  paragraphUpperBound?: number;
  sentenceLowerBound?: number;
  sentenceUpperBound?: number;
  suffix?: string;
  random?: () => number;
  words?: string[];
}

export function poutineIpsum(options?: PoutineIpsumFunctionOptions): string;

export default poutineIpsum;
