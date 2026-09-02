import { isBeehiivConfigured, subscribeToBeehiiv } from './beehiiv';
import {
	contactEmail,
	contactPhone,
	parseContactHandle,
} from './contact-handle';
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
	phone?: unknown;
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

	const parsed = parseContactHandle({ email: body.email, phone: body.phone });
	if (!parsed.ok) {
		return new Response(JSON.stringify({ error: parsed.error }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const email = contactEmail(parsed.contact);
	const phone = contactPhone(parsed.contact);
	const name = (body.name || '').toString().trim();
	const guestName = (body.guestName || '').toString().trim();
	const message = (body.message || '').toString().trim();
	const source = (body.source || 'website').toString().trim();
	const newsletter = Boolean(body.newsletter);
	const interests = parseInterests(body.interests);

	if (!email && !isNotificationConfigured()) {
		return new Response(
			JSON.stringify({
				error: 'Please enter an email. We cannot store a phone number alone.',
			}),
			{ status: 400, headers: { 'Content-Type': 'application/json' } }
		);
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
	const shouldSubscribe = Boolean(email) && (newsletter || interests.length > 0);
	const attemptedBeehiiv = shouldSubscribe && isBeehiivConfigured();
	if (attemptedBeehiiv && email) {
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
	const attemptedNotify = isNotificationConfigured();
	if (attemptedNotify) {
		const result = await notifyInterest({
			email,
			phone,
			name,
			source,
			interests,
			newsletter,
			guestName,
			message,
		});
		notifyOk = result.ok;
	}

	if (attemptedBeehiiv && !beehiivOk) {
		return new Response(JSON.stringify({ error: 'Could not save your interest.' }), {
			status: 502,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	if (!attemptedBeehiiv && attemptedNotify && !notifyOk) {
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
