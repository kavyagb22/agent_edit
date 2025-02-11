import { AppType } from "./app";
import { DnaType } from "./dna";
import { KnowledgeType } from "./knowledge";

export type AgentType = {
  id: string;
  apps: AppType[];
  dna: DnaType;
  knowledge: KnowledgeType;
  meta: any;
};
