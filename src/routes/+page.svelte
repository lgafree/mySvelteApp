<script>
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	let isLoading = false;

	function start() {
		isLoading = true;

		let url = window.location.href;
		window.location.href = new URL(url.substring(0, url.lastIndexOf('/')) + '/' + 'tag/cuties');

		isLoading = false;
	}
</script>

<main class="h-screen flex">
	{#if isLoading}
		<ProgressRadial stroke={50} width="w-10" class="w-15 m-auto" value={undefined} />
	{:else}
		<div class="m-auto flex flex-col">
			<button type="button" class="btn-icon btn-icon-xl variant-filled mx-auto" on:click={start}>
				<i class="fa-solid fa-paw fa-2x" />
			</button>
			<span>🐾Press Me🐾</span>
		</div>
	{/if}
</main>
