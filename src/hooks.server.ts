import { dev } from "$app/environment";
import GH from "@auth/sveltekit/providers/github";
import { SvelteKitAuth, type Session } from "@auth/sveltekit";
import { GH_CLIENT_ID, GH_CLIENT_SECRET } from "$env/static/private";
import type { AdapterSession, AdapterUser } from "@auth/core/adapters";

export const { handle } = SvelteKitAuth({
    debug: dev,
    trustHost: true,
    providers: [
        GH({
            clientId: GH_CLIENT_ID,
            clientSecret: GH_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        async jwt({ token, account }) {
            if (account) token.accessToken = account.access_token;
            return token;
        },
        async session({ session, token }) {
            let ret: {
                user: AdapterUser;
                access_token?: string;
            } & AdapterSession & Session = session;
            ret.access_token = token.accessToken as string;
            return ret;
        },
    },
});