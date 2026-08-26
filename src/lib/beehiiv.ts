const BEEHIIV_API_KEY = import.meta.env.BEEHIIV_API_KEY;
const PUBLICATION_ID = '77ff2834-9004-47f2-86c6-71a2670e6641';
const BEEHIIV_SUBSCRIBE_URL = `https://api.beehiiv.com/v2/publications/${PUBLICATION_ID}/subscriptions`;

export interface BeehiivSubscribeOptions {
	email: string;
	utmSource: string;
	customFields?: Record<string, string>;
}

export async function subscribeToBeehiiv({
	email,
	utmSource,
	customFields = {},
}: BeehiivSubscribeOptions): Promise<{ ok: boolean; status: number }> {
	if (!BEEHIIV_API_KEY) {
		return { ok: false, status: 500 };
	}

	const payload: Record<string, unknown> = {
		email,
		subscribe: true,
		utm_source: utmSource,
	};

	const fieldEntries = Object.entries(customFields).filter(([, value]) => value.trim());
	if (fieldEntries.length > 0) {
		payload.custom_fields = fieldEntries.map(([id, value]) => ({ name: id, value }));
	}

	const response = await fetch(BEEHIIV_SUBSCRIBE_URL, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${BEEHIIV_API_KEY}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(payload),
	});

	return { ok: response.ok, status: response.status };
}

export function isBeehiivConfigured(): boolean {
	return Boolean(BEEHIIV_API_KEY);
}
