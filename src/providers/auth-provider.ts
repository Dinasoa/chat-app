import { User, CreateUser, RestUser } from "../model/";
import { publicRequest } from './request';
import { cache } from '@/common/utils';

export const authProvider = {
    signUp: async (user: CreateUser) => publicRequest().post('/users', user),
    signIn: async (user: User) => {
        try {
            const restUser: RestUser = (await publicRequest().post('/users/login', user)).data;
            cache.accessToken(restUser.token);
            return { redirection: '/board', data: restUser as User, authenticate: true };
        } catch (error) {
            const {
                response: { status, data },
            } = error as any;

            return { redirection: `/error?code=${status}`, data, authenticate: false };
        }
    },
};