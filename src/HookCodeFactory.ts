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
            rethrowIfPossible: true,
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

  callTapsSeries(config: THookCodeContent) {
    
  }
}
