export type ContactHandle =
	| { channel: 'email'; email: string }
	| { channel: 'phone'; phone: string }
	| { channel: 'both'; email: string; phone: string };

export type ParseContactResult =
	| { ok: true; contact: ContactHandle }
	| { ok: false; error: string };

const MISSING_CONTACT = 'Please enter an email or a phone number.';

export function parseEmail(value: unknown): string | undefined {
	const email = (value ?? '').toString().trim().toLowerCase();
	if (!email || !email.includes('@')) return undefined;
	return email;
}

export function parsePhone(value: unknown): string | undefined {
	const display = (value ?? '').toString().trim();
	const digits = display.replace(/\D/g, '');
	if (digits.length < 10) return undefined;
	return display;
}

export function parseContactHandle(input: {
	email?: unknown;
	phone?: unknown;
}): ParseContactResult {
	const email = parseEmail(input.email);
	const phone = parsePhone(input.phone);

	if (email && phone) {
		return { ok: true, contact: { channel: 'both', email, phone } };
	}
	if (email) {
		return { ok: true, contact: { channel: 'email', email } };
	}
	if (phone) {
		return { ok: true, contact: { channel: 'phone', phone } };
	}
	return { ok: false, error: MISSING_CONTACT };
}

export function contactEmail(contact: ContactHandle): string | undefined {
	return contact.channel === 'phone' ? undefined : contact.email;
}

export function contactPhone(contact: ContactHandle): string | undefined {
	return contact.channel === 'email' ? undefined : contact.phone;
}
