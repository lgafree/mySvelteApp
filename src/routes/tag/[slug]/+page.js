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
		foods2: 'PangetPeroMasarap',
		bad_yaaan: 'hubaderangpinay'
	};

	let after = url.searchParams.get('after');

	let currUrl = `https://api.reddit.com/r/${
		subreddits[params.slug]
	}/new.json?raw_json=1&after=${after}`;

	const res = await fetch(currUrl);

	if (res.ok) {
		return {
			data: (await res.json()).data
		};
	}

	throw error(404, 'Not found');
}
