// @ts-nocheck
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ params, url, fetch }) {
	const subreddits = {
		animemes: 'Animemes',
		casual: 'CasualPH',
		cuties: 'aww',
		dogs: 'dogsofrph',
		cats: 'catsofrph',
		foods: 'filipinofood',
		foods2: 'PangetPeroMasarap'
	};

	const currUrl = `https://api.reddit.com/r/${
		subreddits[params.slug]
	}.json?after=${url.searchParams.get('after')}`;

	const res = await fetch(currUrl);

	if (res.ok) {
		return {
			data: (await res.json()).data
		};
	}

	throw error(404, 'Not found');
}
