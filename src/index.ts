type ColorFunction = (text: string) => string;
type Balk = ColorFunction & BalkInstance;

interface BalkInstance {
  reset: ColorFunction;
  bold: ColorFunction;
  dim: ColorFunction;
  italic: ColorFunction;
  underline: ColorFunction;
  inverse: ColorFunction;
  hidden: ColorFunction;
  strikethrough: ColorFunction;
  
  black: ColorFunction;
  red: ColorFunction;
  green: ColorFunction;
  yellow: ColorFunction;
  blue: ColorFunction;
  magenta: ColorFunction;
  cyan: ColorFunction;
  white: ColorFunction;
  gray: ColorFunction;
  grey: ColorFunction;
  
  blackBright: ColorFunction;
  redBright: ColorFunction;
  greenBright: ColorFunction;
  yellowBright: ColorFunction;
  blueBright: ColorFunction;
  magentaBright: ColorFunction;
  cyanBright: ColorFunction;
  whiteBright: ColorFunction;
  
  bgBlack: ColorFunction;
  bgRed: ColorFunction;
  bgGreen: ColorFunction;
  bgYellow: ColorFunction;
  bgBlue: ColorFunction;
  bgMagenta: ColorFunction;
  bgCyan: ColorFunction;
  bgWhite: ColorFunction;
  bgGray: ColorFunction;
  bgGrey: ColorFunction;
  
  bgBlackBright: ColorFunction;
  bgRedBright: ColorFunction;
  bgGreenBright: ColorFunction;
  bgYellowBright: ColorFunction;
  bgBlueBright: ColorFunction;
  bgMagentaBright: ColorFunction;
  bgCyanBright: ColorFunction;
  bgWhiteBright: ColorFunction;
  
  rgb: (r: number, g: number, b: number) => ColorFunction;
  hex: (hex: string) => ColorFunction;
  bgRgb: (r: number, g: number, b: number) => ColorFunction;
  bgHex: (hex: string) => ColorFunction;
  ansi256: (code: number) => ColorFunction;
  bgAnsi256: (code: number) => ColorFunction;
  
  visible: ColorFunction;
  stripColor: (text: string) => string;
  supportsColor: boolean;
  level: 0 | 1 | 2 | 3;
}

interface StyleDef {
  open: string;
  close: string;
  color?: string | [number, number, number];
}

const styles: Record<string, StyleDef> = {
  reset: { open: "\x1b[0m", close: "\x1b[0m" },
  bold: { open: "\x1b[1m", close: "\x1b[22m" },
  dim: { open: "\x1b[2m", close: "\x1b[22m" },
  italic: { open: "\x1b[3m", close: "\x1b[23m" },
  underline: { open: "\x1b[4m", close: "\x1b[24m" },
  inverse: { open: "\x1b[7m", close: "\x1b[27m" },
  hidden: { open: "\x1b[8m", close: "\x1b[28m" },
  strikethrough: { open: "\x1b[9m", close: "\x1b[29m" },
  
  black: { open: "", close: "\x1b[39m", color: "black" },
  red: { open: "", close: "\x1b[39m", color: "red" },
  green: { open: "", close: "\x1b[39m", color: "green" },
  yellow: { open: "", close: "\x1b[39m", color: "yellow" },
  blue: { open: "", close: "\x1b[39m", color: "blue" },
  magenta: { open: "", close: "\x1b[39m", color: "magenta" },
  cyan: { open: "", close: "\x1b[39m", color: "cyan" },
  white: { open: "", close: "\x1b[39m", color: "white" },
  gray: { open: "", close: "\x1b[39m", color: "gray" },
  grey: { open: "", close: "\x1b[39m", color: "gray" },
  
  blackBright: { open: "", close: "\x1b[39m", color: [128, 128, 128] },
  redBright: { open: "", close: "\x1b[39m", color: [255, 85, 85] },
  greenBright: { open: "", close: "\x1b[39m", color: [85, 255, 85] },
  yellowBright: { open: "", close: "\x1b[39m", color: [255, 255, 85] },
  blueBright: { open: "", close: "\x1b[39m", color: [85, 85, 255] },
  magentaBright: { open: "", close: "\x1b[39m", color: [255, 85, 255] },
  cyanBright: { open: "", close: "\x1b[39m", color: [85, 255, 255] },
  whiteBright: { open: "", close: "\x1b[39m", color: [255, 255, 255] },
  
  bgBlack: { open: "\x1b[40m", close: "\x1b[49m" },
  bgRed: { open: "\x1b[41m", close: "\x1b[49m" },
  bgGreen: { open: "\x1b[42m", close: "\x1b[49m" },
  bgYellow: { open: "\x1b[43m", close: "\x1b[49m" },
  bgBlue: { open: "\x1b[44m", close: "\x1b[49m" },
  bgMagenta: { open: "\x1b[45m", close: "\x1b[49m" },
  bgCyan: { open: "\x1b[46m", close: "\x1b[49m" },
  bgWhite: { open: "\x1b[47m", close: "\x1b[49m" },
  bgGray: { open: "", close: "\x1b[49m", color: [128, 128, 128] },
  bgGrey: { open: "", close: "\x1b[49m", color: [128, 128, 128] },
  
  bgBlackBright: { open: "\x1b[100m", close: "\x1b[49m" },
  bgRedBright: { open: "\x1b[101m", close: "\x1b[49m" },
  bgGreenBright: { open: "\x1b[102m", close: "\x1b[49m" },
  bgYellowBright: { open: "\x1b[103m", close: "\x1b[49m" },
  bgBlueBright: { open: "\x1b[104m", close: "\x1b[49m" },
  bgMagentaBright: { open: "\x1b[105m", close: "\x1b[49m" },
  bgCyanBright: { open: "\x1b[106m", close: "\x1b[49m" },
  bgWhiteBright: { open: "\x1b[107m", close: "\x1b[49m" },
};

function getSupportsColor(): boolean {
  if (process.env.FORCE_COLOR === "0") return false;
  if (process.env.FORCE_COLOR) return true;
  return process.stdout?.isTTY ?? false;
}

function getColorLevel(): 0 | 1 | 2 | 3 {
  if (!getSupportsColor()) return 0;
  if (process.env.FORCE_COLOR === "0") return 0;
  return 3;
}

function stripAnsi(text: string): string {
  return text.replace(/\x1b\[[0-9;]*m/g, "");
}

function hexToRgb(hex: string): [number, number, number] {
  const cleaned = hex.replace("#", "");
  const bigint = parseInt(cleaned, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

function getColorCode(color: string | [number, number, number], format: "ansi"): string {
  // Use Bun.color if available, otherwise fallback to manual conversion
  if (typeof Bun !== 'undefined' && Bun.color) {
    return Bun.color(color, format);
  }
  
  // Fallback for non-Bun environments
  if (typeof color === 'string') {
    // Named colors
    const namedColors: Record<string, [number, number, number]> = {
      black: [0, 0, 0],
      red: [255, 0, 0],
      green: [0, 128, 0],
      yellow: [255, 255, 0],
      blue: [0, 0, 255],
      magenta: [255, 0, 255],
      cyan: [0, 255, 255],
      white: [255, 255, 255],
      gray: [128, 128, 128],
      grey: [128, 128, 128],
    };
    const rgb = namedColors[color] || [128, 128, 128];
    return `\x1b[38;2;${rgb[0]};${rgb[1]};${rgb[2]}m`;
  } else {
    // RGB array
    return `\x1b[38;2;${color[0]};${color[1]};${color[2]}m`;
  }
}

function applyStyle(text: string, style: StyleDef, isBg: boolean = false): string {
  if (style.color) {
    const ansiCode = getColorCode(style.color, "ansi");
    const colorCode = isBg ? ansiCode.replace("[38;", "[48;") : ansiCode;
    return `${colorCode}${text}${style.close}`;
  }
  return `${style.open}${text}${style.close}`;
}

function createChainableInstance(parentStyles: string[] = []): Balk {
  const applyStyles = (text: string) => {
    if (!getSupportsColor() || getColorLevel() === 0) return text;
    
    let result = text;
    for (const styleName of parentStyles) {
      if (styleName.startsWith("_rgb_")) {
        const parts = styleName.split("_");
        const [, , r, g, b] = parts;
        result = `\x1b[38;2;${r};${g};${b}m${result}\x1b[39m`;
      } else if (styleName.startsWith("_bgRgb_")) {
        const parts = styleName.split("_");
        const [, , r, g, b] = parts;
        result = `\x1b[48;2;${r};${g};${b}m${result}\x1b[49m`;
      } else if (styleName.startsWith("_ansi256_")) {
        const code = styleName.split("_")[2];
        result = `\x1b[38;5;${code}m${result}\x1b[39m`;
      } else if (styleName.startsWith("_bgAnsi256_")) {
        const code = styleName.split("_")[2];
        result = `\x1b[48;5;${code}m${result}\x1b[49m`;
      } else {
        const style = styles[styleName];
        if (style) {
          const isBg = styleName.startsWith("bg");
          result = applyStyle(result, style, isBg);
        }
      }
    }
    return result;
  };
  
  const instance: any = applyStyles;
  
  for (const styleName of Object.keys(styles)) {
    Object.defineProperty(instance, styleName, {
      get() {
        return createChainableInstance([...parentStyles, styleName]);
      }
    });
  }
  
  instance.rgb = (r: number, g: number, b: number) => {
    const newStyles = [...parentStyles, `_rgb_${r}_${g}_${b}`];
    return createChainableInstance(newStyles);
  };
  
  instance.hex = (hex: string) => {
    const [r, g, b] = hexToRgb(hex);
    return instance.rgb(r, g, b);
  };
  
  instance.bgRgb = (r: number, g: number, b: number) => {
    const newStyles = [...parentStyles, `_bgRgb_${r}_${g}_${b}`];
    return createChainableInstance(newStyles);
  };
  
  instance.bgHex = (hex: string) => {
    const [r, g, b] = hexToRgb(hex);
    return instance.bgRgb(r, g, b);
  };
  
  instance.ansi256 = (code: number) => {
    const newStyles = [...parentStyles, `_ansi256_${code}`];
    return createChainableInstance(newStyles);
  };
  
  instance.bgAnsi256 = (code: number) => {
    const newStyles = [...parentStyles, `_bgAnsi256_${code}`];
    return createChainableInstance(newStyles);
  };
  
  instance.visible = (text: string) => text;
  instance.stripColor = stripAnsi;
  instance.supportsColor = getSupportsColor();
  instance.level = getColorLevel();
  
  return instance as Balk;
}

const balk = createChainableInstance();

export default balk;
export { balk };

export const {
  reset,
  bold,
  dim,
  italic,
  underline,
  inverse,
  hidden,
  strikethrough,
  black,
  red,
  green,
  yellow,
  blue,
  magenta,
  cyan,
  white,
  gray,
  grey,
  blackBright,
  redBright,
  greenBright,
  yellowBright,
  blueBright,
  magentaBright,
  cyanBright,
  whiteBright,
  bgBlack,
  bgRed,
  bgGreen,
  bgYellow,
  bgBlue,
  bgMagenta,
  bgCyan,
  bgWhite,
  bgGray,
  bgGrey,
  bgBlackBright,
  bgRedBright,
  bgGreenBright,
  bgYellowBright,
  bgBlueBright,
  bgMagentaBright,
  bgCyanBright,
  bgWhiteBright,
  rgb,
  hex,
  bgRgb,
  bgHex,
  ansi256,
  bgAnsi256,
  visible,
  stripColor,
  level
} = balk;

export const supportsColor = balk.supportsColor;