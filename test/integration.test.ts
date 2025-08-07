import { test, expect, beforeAll } from "bun:test";
import { execSync } from "child_process";
import { writeFileSync, mkdirSync, rmSync } from "fs";
import { join } from "path";

beforeAll(() => {
  process.env.FORCE_COLOR = "1";
});

test("ESM import works", () => {
  const testDir = join(import.meta.dir, "temp-esm");
  mkdirSync(testDir, { recursive: true });
  
  const testFile = join(testDir, "test.mjs");
  writeFileSync(testFile, `
    import balk from '../../dist/index.mjs';
    console.log(balk.green('SUCCESS'));
  `);
  
  try {
    const output = execSync(`node ${testFile}`, { env: { ...process.env, FORCE_COLOR: "1" } }).toString();
    expect(output).toContain("SUCCESS");
    expect(output).toContain("\x1b");
  } finally {
    rmSync(testDir, { recursive: true, force: true });
  }
});

test("CommonJS require works", () => {
  const testDir = join(import.meta.dir, "temp-cjs");
  mkdirSync(testDir, { recursive: true });
  
  const testFile = join(testDir, "test.cjs");
  writeFileSync(testFile, `
    const balk = require('../../dist/index.cjs');
    console.log(balk.green('SUCCESS'));
  `);
  
  try {
    const output = execSync(`node ${testFile}`, { env: { ...process.env, FORCE_COLOR: "1" } }).toString();
    expect(output).toContain("SUCCESS");
    expect(output).toContain("\x1b");
  } finally {
    rmSync(testDir, { recursive: true, force: true });
  }
});

test("TypeScript/Bun import works", () => {
  const testDir = join(import.meta.dir, "temp-bun");
  mkdirSync(testDir, { recursive: true });
  
  const testFile = join(testDir, "test.ts");
  writeFileSync(testFile, `
    import balk from '../../src/index';
    const text: string = balk.green('SUCCESS');
    console.log(text);
  `);
  
  try {
    const output = execSync(`bun ${testFile}`, { env: { ...process.env, FORCE_COLOR: "1" } }).toString();
    expect(output).toContain("SUCCESS");
    expect(output).toContain("\x1b");
  } finally {
    rmSync(testDir, { recursive: true, force: true });
  }
});