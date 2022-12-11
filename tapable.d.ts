type TapType = "sync" | "async" | "promise";
type HookCompileOptions = {
  type: TapType;
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

type TapOptions<T extends TapType = TapType> = {
  name: string;
  stage?: number;
  context?: boolean;
  before?: string | string[];
} & (T extends "sync"
  ? {
      type?: "sync";
      fn?: TapFunction<"sync">;
    }
  : T extends "async"
  ? {
      type?: "async";
      fn?: TapFunction<"async">;
    }
  : T extends "promise"
  ? {
      type?: "promise";
      fn?: TapFunction<"promise">;
    }
  : {
      type?: T;
      fn?: TapFunction<T>;
    });
