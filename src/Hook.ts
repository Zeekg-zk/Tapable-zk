class Hook {
  private _args: any[];
  name?: string;
  tags: never[];
  private _call: (...args: any[]) => any;
  call: (...args: any[]) => void;

  constructor(args: any[] = [], name?: string) {
    this._args = args;
    this.name = name || undefined;
    this.tags = [];
    this._call = this.CALL_DELEGATE;
    this.call = this.CALL_DELEGATE;
  }

  /**
   * 同步调用的 call
   * @param args - 形参
   */
  private CALL_DELEGATE(...args: any[]) {
    this.call = this._createCall("sync");
    return this.call(...args);
  }

  compile(options: TapOptions) {
    throw new Error("Abstract: should be overridden");
  }

  private _createCall(type: string) {}
}
