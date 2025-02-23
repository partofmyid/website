<script lang="ts">
    import { page } from '$app/state';
    import { Octokit } from 'octokit';
    import { onMount } from 'svelte';

    let username = '';
    let domains: string[] = $state([]);
    let prs: {
        title: string,
        state: string,
        url: string,
        number: number,
        status: string,
    }[] = $state([]);
    const octokit = new Octokit({
        // @ts-ignore
        auth: page.data.session?.access_token || '',
    });

    onMount(async () => {
        if (page.data.session) {
            const user = await octokit.rest.users.getAuthenticated();
            username = user.data.login;
            domains = await fetch('https://raw.githubusercontent.com/partofmyid/register/refs/heads/main/stats/dict.json').then(res => res.json()).then(data => data[username]);
            prs = (await octokit.rest.pulls.list({
                owner: 'partofmyid',
                repo: 'register',
                state: 'all',
                direction: 'desc',
                sort: 'created',
            })).data.filter(pr => pr.user?.login === username).slice(0,10).map(pr => ({
                title: pr.title,
                state: pr.state,
                url: pr.html_url,
                number: pr.number,
                status: pr.state,
            }));
        }
    });
</script>

<main class="flex flex-col md:flex-row gap-2 justify-center items-center">
    {#if page.data.session}
        <div class="bg-ctp-base p-4">
            <div class="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-2">
                <h2 class="text-2xl">Subdomains:</h2>
                <a href="/">New</a>
            </div>
            {#if domains.length !== 0}
                <ul class="flex flex-col gap-2">
                    {#each domains as domain}
                        <li class="ml-0 flex gap-4">
                            <span><b>{domain}</b><span class="text-ctp-subtext1">.part-of.my.id</span></span>
                            <span class="text-xs">
                                <button class="rounded-l-full bg-ctp-sapphire"><a class="no-underline text-ctp-crust" href={"/search?q=" + encodeURIComponent(domain)}>View</a></button>
                                <button class="rounded-r-full"><a class="no-underline text-ctp-text" href={"https://" + domain + ".part-of.my.id"} target="_blank">Visit</a></button>
                            </span>
                        </li>
                    {/each}
                </ul>
            {:else}
                <p class="text-sm">
                    <i>You don't have any subdomains yet. Create one from the home page.</i>
                    <br><i>If your seeing this and have domains, try re-login.</i>
                </p>
            {/if}
        </div>
        {#if prs.length !== 0}
            <div class="bg-ctp-base p-4">
                <div class="flex flex-col sm:flex-row justify-between sm:items-center mb-2 gap-2">
                    <h2 class="text-2xl">PRs:</h2>
                    <i><a href="https://github.com/partofmyid/register/pulls">View all PRs</a></i>
                </div>
                <ul>
                    {#each prs as pr}
                        <li class="ml-0 list-none">
                            - <a href={pr.url} class="data-[open-pr=false]:italic data-[open-pr=true]:font-bold no-underline" data-open-pr={pr.state === 'open'}>{pr.title}</a> <span class="italic">#{pr.number}</span>
                        </li>
                    {/each}
                </ul>
            </div>
        {/if}
    {:else}
        <h1 class="text-2xl">Please log in to view your domains</h1>
    {/if}
</main>