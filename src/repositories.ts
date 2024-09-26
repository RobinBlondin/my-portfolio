import { AppDatasource } from "./datasource";
import { Presentation } from "./entities/Presentation";
import { Skill } from "./entities/Skill";
import { Project } from "./entities/Project";
import { User } from "./entities/User";

export const presentationRepo = AppDatasource.getRepository(Presentation);
export const skillRepo = AppDatasource.getRepository(Skill);
export const projectRepo = AppDatasource.getRepository(Project);
export const userRepo = AppDatasource.getRepository(User);