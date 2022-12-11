type TapType = "sync" | "async" | "promise";
type HookCompileOptions = {
  type: TapType;
  taps: Tap<TapType>[];
  args: string[];
};
type TFunction = (...args: any[]) => any;

type Tap<T extends TapType = TapType> = {
  name: string;
  type: T;
  fn: TapFunction<T>;
  stage?: number;
  context?: boolean;
  before?: string | string[];
};

type TapFunction<T extends TapType = TapType> = T extends "sync"
  ? (...args: any[]) => any
  : T extends "async"
  ? (...args: any[]) => void
  : T extends "promise"
  ? (...args: any[]) => Promise<any>
  : never;

type THookCodeContent = {
  onError: TFunction;
  onDone: TFunction;
  doneReturns?: boolean;
  onResult?: TFunction;
  resultReturns?: boolean;
  rethrowIfPossible?: boolean;
};
