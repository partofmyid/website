<script lang="ts">
    import { signIn, signOut } from "@auth/sveltekit/client";
    import { page } from "$app/stores";
    import "../app.css";
    import { onMount } from "svelte";
    import { dev } from "$app/environment";

    onMount(() => {
        if (!$page.data.session) return;
        if (dev) console.log($page.data.session);

        if (new Date($page.data.session.expires).getTime() < Date.now()) signOut({});
    });
</script>

<header>
    <h1 class="text-xl"><a class="text-ctp-gren no-underline" href="/">part-of.my.id</a></h1>
    {#if $page.data.session}
        <div class="flex gap-2 items-center">
            <img src={$page.data.session.user?.image} alt="user" class="size-8 rounded-full border-2 border-ctp-overlay2">
            <p class="text-ctp-subtext1 hidden sm:block">{$page.data.session.user?.name}</p>
        </div>
    {/if}
    <nav>
        {#if $page.data.session}
            <a href="/dash">dash</a>
            <a href="/json">json</a>
            <a href="/#" on:click={() => signOut({})}>logout</a>
        {:else}
            <a href="https://github.com/partofmyid/register">register</a>
            <a href="/#" on:click={() => signIn('github')}>login</a>
        {/if}
        <a href="/docs">docs</a>
    </nav>
</header>

<slot />

<footer class="border-t border-ctp-base mt-4">
    <p class="text-center">made in <span class="bg-gradient-to-t from-ctp-text via-ctp-red to-ctp-red bg-clip-text text-transparent font-semibold">indonesia</span> by <a href="//satr14.my.id">satr14</a></p>
    <nav>
        <a class="no-underline" href="//github.com/partofmyid">github</a>
        <a class="no-underline" href="//discord.gg/rFyRF3MMhc">discord</a>
    </nav>
</footer>
