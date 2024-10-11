<script lang="ts">
    import { onMount, onDestroy } from "svelte";

    let exampleName = "your-name";
    let names = ["alex", "brian", "satr14", "your-name"];
    let i = 0;
    let typingEffectInterval: NodeJS.Timeout;

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    onMount(() => typingEffectInterval = setInterval(async () => {
        i++;
        if (i >= names.length) i = 0;
    
        for (let j = 0; j < names[i].length; j++) {
            await sleep(100);
            exampleName = names[i].slice(0, j + 1);
        }
    }, 2000));
    onDestroy(() => clearInterval(typingEffectInterval));
</script>

<svelte:head>
    <meta property="og:title" content="part-of.my.id" />
    <meta property="og:description" content="your id on the web" />
    <meta property="og:url" content="https://part-of.my.id" />
    <meta property="og:type" content="website" />
    <meta name="theme-color" content="#89dceb" />
</svelte:head>

<main class="flex flex-col gap-2 justify-center items-center">
    <span class="text-italic text-lg text-ctp-yellow">coming soon</span>
    <h1 class="text-5xl text-center">
        <span class="bg-gradient-to-tl from-ctp-sky to-ctp-green bg-clip-text text-transparent">{exampleName}</span>.part-of.<span class="text-ctp-subtext0">my.id</span>
    </h1>
    <p class="text-lg text-ctp-subtext1">your id on the web</p>
</main>
