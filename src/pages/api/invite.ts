import type { APIRoute } from 'astro';

const BEEHIIV_API_KEY = import.meta.env.BEEHIIV_API_KEY;
const PUBLICATION_ID = '77ff2834-9004-47f2-86c6-71a2670e6641';
const BEEHIIV_SUBSCRIBE_URL = `https://api.beehiiv.com/v2/publications/${PUBLICATION_ID}/subscriptions`;

export const POST: APIRoute = async ({ request }) => {
	// If no API key is configured, return a 500 so the gap is visible
	if (!BEEHIIV_API_KEY) {
		return new Response(JSON.stringify({ error: 'BEEHIIV_API_KEY is not configured' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	try {
		const body = await request.json();
		const email = (body.email || '').toString().trim();
		const guestName = (body.guestName || '').toString().trim();

		// Validate email: non-empty and contains @
		if (!email || !email.includes('@')) {
			return new Response(JSON.stringify({ error: 'Valid email is required' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		// Build subscription payload
		const subscriptionPayload: Record<string, unknown> = {
			email,
			subscribe: true,
			utm_source: 'invite'
		};

		// Add custom_fields if guestName is provided
		if (guestName) {
			subscriptionPayload.custom_fields = JSON.stringify([
				{ id: 'guestName', value: guestName }
			]);
		}

		const response = await fetch(BEEHIIV_SUBSCRIBE_URL, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${BEEHIIV_API_KEY}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(subscriptionPayload)
		});

		if (!response.ok) {
			return new Response(
				JSON.stringify({ error: 'Subscription failed', status: response.status }),
				{
					status: response.status,
					headers: { 'Content-Type': 'application/json' }
				}
			);
		}

		const data = await response.json();
		return new Response(JSON.stringify(data), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch {
		return new Response(JSON.stringify({ error: 'Internal server error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
