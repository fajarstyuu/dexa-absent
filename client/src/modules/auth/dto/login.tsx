import { object, string } from "zod";

export type CreateAuthDto = {
  email: string;
  password: string;
}

export const validation = (req: CreateAuthDto) => {
  return object({
    email: string().email(),
    password: string().min(4),
  }).required().safeParse(req);
}