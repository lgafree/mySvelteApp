<script>
	// @ts-nocheck

	import { page } from '$app/stores';
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';

	const subreddits = {
		animemes: 'Animemes',
		babies: 'babies',
		casual: 'CasualPH',
		cuties: 'aww',
		dogs: 'dogsofrph',
		earth: 'EarthPorn',
		cats: 'catsofrph',
		foods: 'filipinofood',
		foods2: 'PangetPeroMasarap',
		'old babies': 'oldBabies',
		satisfying: 'satisfying',
		sky: 'SkyPorn',
		sunrise: 'sunrise',
		sunset: 'sunset',
		//xRATED
		bad_yaaan: 'hubaderangpinay'
	};
	/** @type {import('./$types').PageData} */
	export let data;
	let posts = [...data.data.children];
	let after = data.data.after;
	let isLoading = false;
	/**
	 * @type {HTMLDivElement}
	 */
	let elemCarousel;
	let selectSubreddit;
	let searchOpen = false;
	let searchBox;

	onMount(() => {
		window.addEventListener('scroll', handleScroll);
		selectSubreddit.addEventListener('change', fetchSubreddit);
		selectSubreddit.value = $page.params.slug;

		return () => {
			selectSubreddit.removeEventListener('change', fetchSubreddit);
			window.removeEventListener('scroll', handleScroll);
		};
	});

	async function handleScroll() {
		if (
			window.innerHeight + Math.round(window.scrollY) >= document.body.offsetHeight - 5 &&
			after &&
			!isLoading
		) {
			fetchMore();
		}
	}

	async function fetchMore() {
		isLoading = true;

		const currUrl = `https://api.reddit.com/r/${
			subreddits[$page.params.slug]
		}.json?raw_json=1&after=${after}`;

		const res = await fetch(currUrl);
		if (res.ok) {
			let newBatch = (await res.json()).data;
			posts.push.apply(posts, newBatch.children);
			posts = posts;
			after = newBatch.after;
		}

		isLoading = false;
	}

	function carouselLeft() {
		const x =
			elemCarousel.scrollLeft === 0
				? elemCarousel.clientWidth * elemCarousel.childElementCount // loop
				: elemCarousel.scrollLeft - elemCarousel.clientWidth; // step left
		elemCarousel.scroll(x, 0);
	}

	function carouselRight() {
		const x =
			elemCarousel.scrollLeft === elemCarousel.scrollWidth - elemCarousel.clientWidth
				? 0 // loop
				: elemCarousel.scrollLeft + elemCarousel.clientWidth; // step right
		elemCarousel.scroll(x, 0);
	}

	function toggleSearch() {
		searchOpen = !searchOpen;
		selectSubreddit.hidden = searchOpen;
	}

	function fetchSubreddit() {
		let url = window.location.href;
		window.location.href = new URL(
			url.substring(0, url.lastIndexOf('/')) + '/' + selectSubreddit.value
		);
	}
	async function searchOnSubreddit() {
		isLoading = true;
		posts = [];
		posts = posts;

		const currUrl = `https://api.reddit.com/r/${
			subreddits[$page.params.slug]
		}/search.json?raw_json=1&q=${searchBox.value}&sort=hot`;
		const res = await fetch(currUrl);

		if (res.ok) {
			let newBatch = (await res.json()).data;
			posts.push.apply(posts, newBatch.children);
			posts = posts;
			after = newBatch.after;
		}

		isLoading = false;
	}
</script>

<main>
	<div class="flex fixed top-0 z-50 w-full px-3 space-x-2">
		<select bind:this={selectSubreddit} class="select variant-glass-error" size="1" value="1">
			{#each Object.entries(subreddits) as [key, subreddit]}
				{#if key !== 'bad_yaaan'}
					<option value={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</option>
				{/if}
			{/each}
		</select>
		{#if searchOpen}
			<form class="w-full" on:submit|preventDefault={searchOnSubreddit}>
				<input
					bind:this={searchBox}
					class="input variant-glass-error"
					type="text"
					placeholder="Search"
					autofocus
					on:blur={toggleSearch}
				/>
			</form>
		{:else}
			<button type="button" class="btn-icon variant-glass-error" on:click={toggleSearch}>
				<i class="fa-solid fa-search fa-1x" />
			</button>
		{/if}
	</div>
	<div class="mx-auto lg:w-1/2 md:w-3/4 py-5 px-3 space-y-3 mt-10">
		{#each posts as post}
			{#if post.data.thumbnail_width != null}
				<div class="card card-hover max-h-fit variant-glass-surface">
					<header class="card-header overflow-hidden">
						{#if post.data.secure_media}
							{#if post.data.secure_media.reddit_video}
								<video
									class="bg-black/50 w-full"
									autoplay
									loop
									src={post.data.secure_media.reddit_video.fallback_url}
								/>
							{/if}
						{:else if post.data.media_metadata}
							<div class="card p-4 grid grid-cols-[auto_1fr_auto] gap-4 items-center">
								<!-- Button: Left -->
								<button type="button" class="btn-icon variant-filled" on:click={carouselLeft}>
									<i class="fa-solid fa-arrow-left" />
								</button>
								<!-- Full Images -->
								<div
									bind:this={elemCarousel}
									class="snap-x snap-mandatory scroll-smooth flex overflow-x-auto"
								>
									{#each Object.entries(post.data.media_metadata) as [key, value]}
										{#if value.p[3]}
											<img
												class="snap-center w-[1024px] rounded-container-token"
												src={value.p[3].u}
												loading="lazy"
											/>
										{:else}
											<img
												class="snap-center w-[1024px] rounded-container-token"
												src={value.p[value.p.length - 1].u.replaceAll('amp;', '')}
												loading="lazy"
											/>
										{/if}
									{/each}
								</div>
								<!-- Button: Right -->
								<button type="button" class="btn-icon variant-filled" on:click={carouselRight}>
									<i class="fa-solid fa-arrow-right" />
								</button>
							</div>
						{:else if post.data.post_hint === 'image'}
							<img class="w-full" alt={post.data.title} src={post.data.url} />
						{/if}
					</header>
					<section class="p-4">
						<h4>{post.data.title}</h4>
					</section>
				</div>
			{/if}
		{/each}
		{#if isLoading}
			{#if posts.length === 0}
				<div class="h-80" />
			{/if}
			<ProgressRadial stroke={50} width="w-10" class="w-15 m-auto" value={undefined} />
		{/if}
	</div>
</main>
