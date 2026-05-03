export type AuthUser = {
  id: number;
  roleId: number;
  name: string;
  email: string;
  [key: string]: unknown;
};

export type AuthResponse = {
  data: AuthUser;
  message: string;
  statusCode: number;

}