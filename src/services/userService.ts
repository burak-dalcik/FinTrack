import { authClient } from "./apiClient";
import { Role, User } from "../types/auth";

export interface InviteUserDto {
  name: string;
  email: string;
  role: Role;
}

export const userService = {
  async list(): Promise<User[]> {
    const res = await authClient.get("/v1/users");
    const body: any = res.data;
    return (body.users as User[]) ?? body;
  },
  async invite(payload: InviteUserDto): Promise<User> {
    const res = await authClient.post("/v1/users", payload);
    const body: any = res.data;
    return (body.user as User) ?? (body.users?.[0] as User) ?? body;
  },
  async deactivate(userId: string): Promise<void> {
    await authClient.delete(`/v1/users/${userId}`);
  }
};

