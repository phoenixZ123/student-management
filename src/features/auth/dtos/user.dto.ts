export type loginUser = {
    email: string;
    password: string;
}
export type SessionType = {
    id: number;
    userId?: number;
    token: string;
    user_agent?: string | null;
    created_at?: Date | null;
}