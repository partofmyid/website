<script lang="ts">
    import { onMount } from "svelte";
    import { apiBaseURL } from "$lib";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import { Octokit } from "octokit";
    
    let available = false;
    let editable = false;
    let file = "";
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
        <div class="bg-ctp-base p-4 md:rounded-l-xl flex flex-col justify-between">
            <div>
                <h1><span class="underline">{q}</span><span class="text-ctp-subtext0">.part-of.my.id</span></h1>
                <h2 class="text-base italic text-ctp-red data-[editable=true]:text-ctp-green" data-available={editable}>is {available ? 'available!' : (editable ? 'owned by you!' : 'taken... sorry')}</h2>
            </div>

            <div class="my-2">
                {#if !available}
                    <button class="rounded-l-full text-ctp-crust bg-ctp-sapphire"><a href={
                        'https://github.com/partofmyid/register/edit/main/domains/' + q + '.json'
                    }>File</a></button>
                    <button class="rounded-r-full">Owner</button>
                {/if}
            </div>
        </div>
        <div class="bg-ctp-base p-4 md:rounded-r-xl">
            {#if !available}
                <code>domains/{q}.json:</code>
                <textarea class="block" cols="30" rows={file.split('\n').length + 1} readonly={!editable} value={file}></textarea>
            {/if}
        </div>
    </div>
</main>
