export type Msg = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

export type Phase = "idle" | "building" | "done";
export type Tab = "preview" | "code";
export type Device = "desktop" | "tablet" | "mobile";
