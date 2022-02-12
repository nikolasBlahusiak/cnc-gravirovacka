<script context="module">
	export async function load({ session }) {
		if (!session.user.authenticated) {
			return {
				status: 302,
				redirect: '/auth/unauthorized'
			};
		}

		return {
			props: {
				email: session.user.email
			}
		};
	}
</script>

<script>
	import { onMount } from 'svelte';

	export let email;
	let name;

	onMount(async () => {
		const res = await fetch('/user');
		const user = await res.json();
		name = user.name;
	});
</script>

<h1>Profile</h1>
<p>Hello {name} you are logged in with the email {email}</p>
