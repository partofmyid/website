import { SvelteKitAuth } from "@auth/sveltekit";
import GH from "@auth/sveltekit/providers/github";
import { GH_CLIENT_ID, GH_CLIENT_SECRET } from "$env/static/private";

export const { handle } = SvelteKitAuth({
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
            // @ts-ignore
            session.access_token = token.accessToken;
            return session;
        },
    },
});