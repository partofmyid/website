<script lang="ts">
    import { page } from '$app/stores';
    import { Octokit } from 'octokit';
    import { apiBaseURL } from '$lib';
    import { onMount } from 'svelte';

    let username = '';
    let selectedDomain: {
        subdomain: string,
        properties: {
            owner: {
                username: string,
            },
            record: Record<string, string>,
        }
    } | null = null;
    let domains: {
        subdomain: string,
        properties: {
            owner: {
                username: string,
            },
            record: Record<string, string>,
        }
    }[] = [];
    let prs: {
        title: string,
        state: string,
        url: string,
        number: number,
        status: string,
    }[] = [];
    const octokit = new Octokit({
        // @ts-ignore
        auth: $page.data.session?.access_token || '',
    });

    onMount(async () => {
        if ($page.data.session) {
            const user = await octokit.rest.users.getAuthenticated();
            username = user.data.login;
            domains =  await fetch(apiBaseURL + '/query/username/' + username).then(res => res.json());
            prs = (await octokit.rest.pulls.list({
                owner: 'partofmyid',
                repo: 'register',
                state: 'all',
                per_page: 5,
                head: `${username}:main`,
                sort: 'created',
            })).data.filter(pr => pr.user?.login === username).map(pr => ({
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
    {#if $page.data.session}
        <div class="bg-ctp-base p-4">
            <div class="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-2">
                <h2 class="text-2xl">Subdomains:</h2>
                <i>Create a new subdomain from the home page</i>
            </div>
            {#if domains.length !== 0}
                <table>
                    <thead>
                        <tr>
                            <th>Subdomain</th>
                            <th>Records</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each domains as domain}
                            <tr>
                                <td>
                                    <a class="no-underline" href={'/search?q='+domain.subdomain}><b>{domain.subdomain}</b>.part-of.my.id</a>
                                </td>
                                <td class="break-all font-mono">
                                    <ul>
                                        {#each Object.keys(domain.properties?.record || {}) as record}
                                            <li><b>{record}</b>: {domain.properties.record[record]}</li>
                                        {/each}
                                    </ul>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            {:else}
                <p>
                    <i>You don't have any subdomains yet. Create one from the home page.</i>
                    <br><i>If your seeing this and have domains, try re-login.</i>
                </p>
            {/if}
        </div>
        {#if prs.length !== 0}
            <div class="bg-ctp-base p-4">
                <div class="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-2">
                    <h2 class="text-2xl">PRs:</h2>
                    <i><a href="https://github.com/partofmyid/register/pulls">View all PRs</a></i>
                </div>
                <ul>
                    {#each prs as pr}
                        <li class="ml-0 list-none">
                            - <span class="data-[open-pr]:italic data-[open-pr]:text-ctp-subtext0" data-open-pr={pr.state}>{pr.title}</span>
                            <a href={pr.url} class="no-underline italic">#{pr.number}</a>
                        </li>
                    {/each}
                </ul>
            </div>
        {/if}
    {:else}
        <h1 class="text-2xl">Please log in to view your domains</h1>
    {/if}
</main>
<a href="/api" class="w-min">_</a>