import { isBeehiivConfigured, subscribeToBeehiiv } from './beehiiv';
import { isNotificationConfigured, notifyInterest } from './notify-interest';

const VALID_INTERESTS = new Set(['formation', 'open-forums', 'general']);

function parseInterests(value: unknown): string[] {
	if (!Array.isArray(value)) return [];
	return value
		.map((item) => item?.toString().trim().toLowerCase())
		.filter((item) => VALID_INTERESTS.has(item));
}

export interface InterestPayload {
	email?: unknown;
	name?: unknown;
	guestName?: unknown;
	message?: unknown;
	source?: unknown;
	newsletter?: unknown;
	interests?: unknown;
}

export async function handleInterestSubmission(body: InterestPayload): Promise<Response> {
	if (!isBeehiivConfigured() && !isNotificationConfigured()) {
		return new Response(
			JSON.stringify({ error: 'Interest form is not configured on the server.' }),
			{ status: 503, headers: { 'Content-Type': 'application/json' } }
		);
	}

	const email = (body.email || '').toString().trim().toLowerCase();
	const name = (body.name || '').toString().trim();
	const guestName = (body.guestName || '').toString().trim();
	const message = (body.message || '').toString().trim();
	const source = (body.source || 'website').toString().trim();
	const newsletter = Boolean(body.newsletter);
	const interests = parseInterests(body.interests);

	if (!email || !email.includes('@')) {
		return new Response(JSON.stringify({ error: 'Valid email is required.' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	if (!newsletter && interests.length === 0) {
		return new Response(
			JSON.stringify({ error: 'Select at least one way to stay in touch.' }),
			{ status: 400, headers: { 'Content-Type': 'application/json' } }
		);
	}

	const customFields: Record<string, string> = {
		source,
		interests: interests.join(', '),
	};
	if (name) customFields.name = name;
	if (guestName) customFields.guestName = guestName;
	if (message) customFields.message = message;

	let beehiivOk = true;
	const shouldSubscribe = newsletter || interests.length > 0;
	if (shouldSubscribe && isBeehiivConfigured()) {
		const result = await subscribeToBeehiiv({
			email,
			utmSource: source,
			customFields: {
				...customFields,
				newsletter: newsletter ? 'yes' : 'no',
			},
		});
		beehiivOk = result.ok;
	}

	let notifyOk = true;
	if (isNotificationConfigured()) {
		const result = await notifyInterest({
			email,
			name,
			source,
			interests,
			newsletter,
			guestName,
			message,
		});
		notifyOk = result.ok;
	}

	if (!beehiivOk && shouldSubscribe && isBeehiivConfigured()) {
		return new Response(JSON.stringify({ error: 'Could not save your interest.' }), {
			status: 502,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	if (!notifyOk && !shouldSubscribe) {
		return new Response(JSON.stringify({ error: 'Could not save your interest.' }), {
			status: 502,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	if (!beehiivOk && !notifyOk) {
		return new Response(JSON.stringify({ error: 'Could not save your interest.' }), {
			status: 502,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	return new Response(JSON.stringify({ ok: true }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
	});
}
