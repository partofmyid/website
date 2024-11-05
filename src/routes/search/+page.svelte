<script lang="ts">
    import { onMount } from "svelte";
    import { apiBaseURL } from "$lib";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import { Octokit } from "octokit";
    
    let available = false;
    let editable = false;
    let file = "{}";
    const search = new URLSearchParams($page.url.search);
    const q = search.get("q");
    const octokit = new Octokit({
        // @ts-ignore
        auth: $page.data.session?.access_token || '',
    });

    onMount(async () => {
        if (!q) return goto("/");
        const res = await fetch(`${apiBaseURL}/query/check/${q}`).then((res) => res.json());
        available = res.available;

        if (!available) {
            file = await fetch(`https://raw.githubusercontent.com/partofmyid/register/main/domains/${q}.json`).then(res => res.text());
            const user = await octokit.rest.users.getAuthenticated()
            if (JSON.parse(file).owner.username === user.data.login) editable = true;
        }
    });
</script>

<main class="flex justify-center items-center">
    <div class="flex flex-col md:flex-row gap-4 mx-2">
        <div class="bg-ctp-base p-4 flex flex-col h-min">
            <div>
                <h1><span class="underline">{q}</span><span class="text-ctp-subtext0">.part-of.my.id</span></h1>
                <h2 class="text-base italic text-ctp-red data-[available=true]:text-ctp-green" data-available={available || editable}>is {available ? 'available!' : (editable ? 'owned by you!' : 'taken... sorry')}</h2>
                {#if !available && JSON.parse(file).description}
                    <p>
                        {JSON.parse(file).description}
                    </p>
                {/if}
                {#if editable}
                    <input type="text" placeholder="Commit message..." class=" p-2 w-full my-2" disabled>
                {/if}
            </div>
            <div class="my-2">
                {#if !available}
                    <button class="rounded-l-full bg-ctp-sapphire"><a class="no-underline text-ctp-crust" href={
                        'https://github.com/partofmyid/register/blob/main/domains/' + q + '.json'
                    }>File</a></button>
                    <button class="rounded-r-full"><a  class="text-ctp-text no-underline" href={
                        'https://github.com/' + JSON.parse(file)?.owner?.username
                    }>Owner</a></button>
                {:else}
                    <button class="rounded-full bg-ctp-sapphire"><a class="no-underline text-ctp-crust" href={
                        'https://github.com/partofmyid/register/new/main/domains?filename=' + q + '.json'
                    }>Register</a></button>
                {/if}
            </div>
        </div>
        {#if !available}
            <div class="bg-ctp-base p-4">
                <div class="flex justify-between">
                    <code>domains/{q}.json</code>
                    {#if editable}
                        <button class="bg-ctp-green text-ctp-crust" disabled>
                            Commit
                        </button>
                    {/if}
                </div>
                <textarea class="block" cols="30" rows={file.split('\n').length + 1} readonly={!editable} value={file} spellcheck={false}></textarea>
            </div>
        {/if}
    </div>
</main>
