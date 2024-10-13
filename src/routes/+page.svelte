<script lang="ts">
    import { goto } from "$app/navigation";
    import { onMount, onDestroy } from "svelte";

    let exampleName = "your-name";
    let names = ["alex", "bob", "satr14", "your-name"];
    let i = -1;
    let typingEffectInterval: NodeJS.Timeout;

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    onMount(() => typingEffectInterval = setInterval(async () => {
        i++;
        if (i >= names.length) clearInterval(typingEffectInterval);
    
        for (let j = 0; j < names[i].length; j++) {
            await sleep(150);
            exampleName = names[i].slice(0, j + 1);
        }
    }, 2000));
    onDestroy(() => clearInterval(typingEffectInterval));
</script>

<svelte:head>
    <title>part-of.my.id</title>
    <meta property="og:title" content="part-of.my.id" />
    <meta property="og:description" content="your id on the web" />
    <meta property="og:url" content="https://part-of.my.id" />
    <meta property="og:type" content="website" />
    <meta name="theme-color" content="#89dceb" />
</svelte:head>

<main class="flex flex-col justify-center items-center gap-8 max-w-4xl mx-auto">
    <div class="flex flex-col justify-center items-center">
        <span class="bg-ctp-yellow px-2 py-0.5 rounded-full text-ctp-crust font-bold">coming soon</span>
        <h1 class="text-3xl md:text-4xl lg:text-5xl text-center my-2">
            <span class="bg-gradient-to-tl from-ctp-sky to-ctp-green bg-clip-text text-transparent">{exampleName}</span>.part-of.<span class="text-transparent bg-gradient-to-tl from-ctp-subtext0 to-ctp-red bg-clip-text">my.id</span>
        </h1>
        <p class="lg:text-xl text-ctp-subtext1 text-center">your id on the web</p>
    </div>
    <!-- <button type="submit" class="px-6 py-3 text-ctp-crust font-bold bg-gradient-to-br from-ctp-green to-ctp-sky rounded-full"><a href="https://github.com/SX-9/part-of-my-id" class="text-ctp-crust font-bold no-underline">get yours now</a></button> -->
    <!-- <form action="/search" class="flex flex-wrap justify-center items-center">
        <input type="text" name="q" placeholder="your-name" autocomplete="off" class="px-6 py-3 sm:rounded-l-full" />
        <button type="submit" class="px-6 py-3 text-ctp-crust font-bold bg-gradient-to-br from-ctp-green to-ctp-sky sm:rounded-r-full">search</button>
    </form> -->
</main>
