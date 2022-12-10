type AsArray<T> = T extends any[] ? T : [T];

type TapOptions = {
  before?: number;
  stage?: number;
};

type Tap = TapOptions & {
  name: string;
};

type FullTap = Tap & {
  type: "sync" | "async" | "promise";
  fn: Function;
};
