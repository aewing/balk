import { test, expect, beforeAll } from "bun:test";

beforeAll(() => {
  process.env.FORCE_COLOR = "1";
});

import balk, {
  red,
  green,
  blue,
  bold,
  underline,
  stripColor,
  rgb,
  hex,
  bgRed,
  bgGreen,
  ansi256,
  bgAnsi256,
} from "./index";

test("basic colors", () => {
  const redText = red("hello");
  expect(redText).toContain("hello");
  expect(redText).toContain("\x1b");
  
  const greenText = green("world");
  expect(greenText).toContain("world");
  expect(greenText).toContain("\x1b");
  
  const blueText = blue("test");
  expect(blueText).toContain("test");
  expect(blueText).toContain("\x1b");
});

test("modifiers", () => {
  const boldText = bold("bold");
  expect(boldText).toContain("bold");
  expect(boldText).toContain("\x1b");
  
  const underlineText = underline("underline");
  expect(underlineText).toContain("underline");
  expect(underlineText).toContain("\x1b");
});

test("chaining", () => {
  const chainedText = balk.red.bold("chained");
  expect(chainedText).toContain("chained");
  expect(chainedText).toContain("\x1b");
  
  const multiChained = balk.bgBlue.white.bold.underline("complex");
  expect(multiChained).toContain("complex");
  expect(multiChained).toContain("\x1b");
});

test("stripColor", () => {
  const colored = red("hello world");
  const stripped = stripColor(colored);
  expect(stripped).toBe("hello world");
  
  const multiColored = balk.red.bold.bgBlue("test");
  const strippedMulti = stripColor(multiColored);
  expect(strippedMulti).toBe("test");
});

test("rgb colors", () => {
  const rgbText = rgb(255, 0, 0)("red");
  expect(rgbText).toContain("red");
  expect(rgbText).toContain("\x1b[38;2;255;0;0m");
  
  const bgRgbText = balk.bgRgb(0, 255, 0)("green bg");
  expect(bgRgbText).toContain("green bg");
  expect(bgRgbText).toContain("\x1b[48;2;0;255;0m");
});

test("hex colors", () => {
  const hexText = hex("#FF0000")("red");
  expect(hexText).toContain("red");
  expect(hexText).toContain("\x1b[38;2;255;0;0m");
  
  const bgHexText = balk.bgHex("#00FF00")("green bg");
  expect(bgHexText).toContain("green bg");
  expect(bgHexText).toContain("\x1b[48;2;0;255;0m");
});

test("ansi256 colors", () => {
  const ansi256Text = ansi256(196)("red");
  expect(ansi256Text).toContain("red");
  expect(ansi256Text).toContain("\x1b[38;5;196m");
  
  const bgAnsi256Text = bgAnsi256(46)("green bg");
  expect(bgAnsi256Text).toContain("green bg");
  expect(bgAnsi256Text).toContain("\x1b[48;5;46m");
});

test("background colors", () => {
  const bgRedText = bgRed("red bg");
  expect(bgRedText).toContain("red bg");
  expect(bgRedText).toContain("\x1b");
  
  const bgGreenText = bgGreen("green bg");
  expect(bgGreenText).toContain("green bg");
  expect(bgGreenText).toContain("\x1b");
});

test("default instance works as function", () => {
  const text = balk("plain");
  expect(text).toBe("plain");
});

test("gray and grey are aliases", () => {
  const grayText = balk.gray("gray");
  const greyText = balk.grey("grey");
  
  expect(grayText).toContain("gray");
  expect(greyText).toContain("grey");
  expect(grayText).toContain("\x1b");
  expect(greyText).toContain("\x1b");
});

test("visible returns text unchanged", () => {
  const text = balk.visible("test");
  expect(text).toBe("test");
});

test("supports chalk-style usage", () => {
  const chalkStyle1 = balk.red("red text");
  expect(chalkStyle1).toContain("red text");
  
  const chalkStyle2 = balk.blue.bgRed.bold("styled");
  expect(chalkStyle2).toContain("styled");
  
  const chalkStyle3 = balk.rgb(123, 45, 67)("custom");
  expect(chalkStyle3).toContain("custom");
});