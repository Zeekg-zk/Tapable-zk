class Hook {
  private _args: string[];
  name?: string;
  taps: Tap<TapType>[];
  private _call: TFunction;
  call: TFunction;

  constructor(args: string[] = [], name?: string) {
    this._args = args;
    this.name = name || undefined;
    this.taps = [];
    this._call = this.CALL_DELEGATE;
    this.call = this.CALL_DELEGATE;
    this.compile = this.compile;
  }

  /**
   * 同步调用的 call
   * @param args - 形参
   */
  private CALL_DELEGATE(...args: any[]) {
    this.call = this._createCall("sync");
    return this.call(...args);
  }

  /** 这个 compile 函数是必须要被**重写**的 */
  compile(_: HookCompileOptions): TFunction {
    throw new Error("Abstract: should be overridden");
  }

  private _createCall(type: TapType) {
    return this.compile({
      taps: this.taps,
      args: this._args,
      type: type,
    });
  }

  private _tap(type: TapType, options: string | Tap, fn: TFunction) {
    let newOpt: Tap =
      typeof options === "string"
        ? {
            type,
            name: options,
            fn,
          }
        : options;
    /* 这里源码还做了一些边界情况处理，因为源码用JS编写，我用的TS，所以省略了 */
    this._insert(newOpt);
  }

  tap(options: string | Tap, fn: TFunction) {
    return this._tap("sync", options, fn);
  }

  /**
   * 插入 taps 中
   */
  private _insert(opt: Tap) {
    this._resetCompilation();
    let before; // 当前 tap 的前面的 taps，它的意义应该是必须要在这些 tap 之前。
    if (typeof before === "string") {
      before = new Set([opt.before]);
    } else if (Array.isArray(opt.before)) {
      before = new Set(opt.before);
    }
    // stage 可以理解为权重的概念
    const stage = typeof opt.stage === "number" ? opt.stage : 0;
    let idx = this.taps.length;
    while (idx > 0) {
      idx--;
      const tmp = this.taps[idx];
      this.taps[idx + 1] = tmp;
      const tmpStage = tmp.stage || 0;
      if (before) {
        if (before.has(tmp.name)) {
          before.delete(tmp.name);
          continue;
        }
        if (before.size > 0) {
          continue;
        }
      }
      if (tmpStage > stage) {
        continue;
      }
      idx++;
      break;
    }
    this.taps[idx] = opt;
  }

  /** 重置 */
  private _resetCompilation() {
    this.call = this._call;
    // this.callAsync = this._callAsync;
    // this.promise = this._promise;
  }
}
