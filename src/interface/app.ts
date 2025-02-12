export type AppType = {
  type: string;
  prompt: string;
  sys_prompt?: string;
  follow?: string[];
  bearer_token?: string;
  api_key?: string;
  api_secret?: string;
  access_token?: string;
  token_secret?: string;
  tools?: ToolsType[];
  first_message?: string;
  chat_message?: string;
};

export type ToolsType = {
  item: string;
  params: string[];
};
