import Hook from "./Hook";

class HookCodeFactory {
  private options?: HookCompileOptions;
  private _args?: string[];

  constructor() {
    this.options = undefined;
    this._args = undefined;
  }

  private init(options: HookCompileOptions) {
    this.options = options;
    this._args = options.args.slice();
  }

  private deinit() {
    this.options = undefined;
    this._args = undefined;
  }

  /** 真正创建 */
  create(options: HookCompileOptions) {
    this.init(options);
    let fn;
    switch (options.type) {
      case "sync":
        fn = new Function(
          this.args(),
          `
          "use strict";
          ${this.header()}
          ${this.content({
            onError: (err) => `throw ${err};\n`,
            onResult: (result) => `return ${result};\n`,
            resultReturns: true,
            onDone: () => "",
          })}
          `
        );
        break;
      case "async":
        /* more code */
        break;
      case "promise":
        /* more code */
        break;
    }
    this.deinit();
    return fn;
  }

  setup(instance: Hook, options: HookCompileOptions) {
    instance._x = options.taps.map((t) => t.fn);
  }

  /** 形参 -> 用逗号分隔的字符串 */
  private args(obj: { before?: string; after?: string } = {}) {
    let allArgs = this._args || [];
    if (obj.before) {
      allArgs = [obj.before].concat(allArgs);
    }
    if (obj.after) {
      allArgs = allArgs.concat(obj.after);
    }
    return allArgs.length !== 0 ? allArgs.join(",") : "";
  }

  private header() {
    let code: string = `
      var _context;
      var _x = this._x;
    `;
    return code;
  }

  content(contentOpt: THookCodeContent) {
    throw new Error("Abstract: content function should be overridden.");
  }

  callTap(tapIndex: number, config: THookCodeContent) {
    const codeArr: string[] = [];
    let hasTapCached = false;
    codeArr.push(`var _fn${tapIndex} = ${this.getTapFn(tapIndex)};`);
    const tap = this.options!.taps[tapIndex];
    switch (tap.type) {
      case "sync":
        if (config.onResult) {
          codeArr.push(
            `var _result${tapIndex} = _fn${tapIndex}(${this.args({
              before: tap.context ? "_context" : undefined,
            })})`
          );
          codeArr.push(config.onResult(`_result${tapIndex}`));
        } else {
          codeArr.push(
            `_fn${tapIndex}(${this.args({
              before: tap.context ? "_context" : undefined,
            })})`
          );
        }
        codeArr.push(config.onDone());
        break;
      case "async":
        break;
      case "promise":
        break;
    }
  }

  callTapsSeries(config: THookCodeContent) {
    
  }

  getTapFn(idx: number) {
    return `_x[${idx}]`;
  }
}
