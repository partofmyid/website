<script lang="ts">
    import { onMount } from "svelte";
    import { apiBaseURL } from "$lib";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import { Octokit } from "octokit";
    
    let available = false;
    let editable = false;
    let file = "{}";
    let user = '';
    let records: {
        "A"?: string[],
        "AAAA"?: string[],
        "CNAME"?: string,
        "MX"?: string[],
        // "NS"?: string[],
        "TXT"?: string[],
        // "CAA"?: {
        //     "flags": number,
        //     "tag": string,
        //     "value": string,
        // }[],
        "SRV"?: {
            "priority": number,
            "weight": number,
            "port": number,
            "target": string,
        }[],
        // "PTR"?: string[],
        "ALIAS"?: string,
    } = {};
    const search = new URLSearchParams($page.url.search);
    const q = search.get("q");
    const octokit = new Octokit({
        // @ts-ignore
        auth: $page.data.session?.access_token || '',
    });

    function register(record: Record<string, any>) {
        window.open('https://github.com/partofmyid/register/new/main/domains?filename=' + q + '.json'
            + '&value=' + encodeURIComponent(JSON.stringify({
                owner: {
                    username: user,
                }, record,
            }, null, 4)));
    }

    onMount(async () => {
        if (!q) return goto("/");
        const res = await fetch(`${apiBaseURL}/query/check/${q}`).then((res) => res.json());
        available = res.available;

        if (!available) file = await fetch(`https://raw.githubusercontent.com/partofmyid/register/main/domains/${q}.json`).then(res => res.text());
        if ($page.data.session) {
            user = (await octokit.rest.users.getAuthenticated()).data.login;
            if (JSON.parse(file).owner.username === user) editable = true;
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
            {#if !available}
                <div class="my-2">
                    <button class="rounded-l-full bg-ctp-sapphire"><a class="no-underline text-ctp-crust" href={
                        'https://' + q + '.part-of.my.id'
                    }>Visit</a></button>
                    <button class=""><a class="no-underline text-ctp-text" href={
                        'https://github.com/partofmyid/register/blob/main/domains/' + q + '.json'
                    }>File</a></button>
                    <button class="rounded-r-full"><a  class="text-ctp-text no-underline" href={
                        'https://github.com/' + JSON.parse(file)?.owner?.username
                    }>Owner</a></button>
                </div>
            {/if}
        </div>
        <div class="bg-ctp-base p-4 h-min">
            {#if !available}
                <div class="flex justify-between">
                    <code>domains/{q}.json</code>
                    {#if editable}
                        <button class="bg-ctp-green text-ctp-crust" disabled>
                            Commit
                        </button>
                    {/if}
                </div>
                <textarea class="block" cols="30" rows={file.split('\n').length + 1} readonly={!editable} value={file} spellcheck={false}></textarea>
            {:else}
                <form on:submit={() => register(records)}>
                    <div>
                        <!-- to be continued -->
                    </div>
                    <button class="rounded-full bg-ctp-sapphire text-ctp-crust" type="submit">Register</button>
                </form>
            {/if}
        </div>
    </div>
</main>
