const INTEREST_NOTIFICATION_EMAIL = import.meta.env.INTEREST_NOTIFICATION_EMAIL;

export interface InterestNotification {
	email: string;
	name?: string;
	source: string;
	interests: string[];
	newsletter: boolean;
	guestName?: string;
	message?: string;
}

export async function notifyInterest(data: InterestNotification): Promise<{ ok: boolean }> {
	if (!INTEREST_NOTIFICATION_EMAIL) {
		// Notification email is optional when Beehiiv handles subscriptions.
		return { ok: true };
	}

	const subject = `Search OC interest: ${data.interests.join(', ') || 'general'}`;
	const body = {
		_subject: subject,
		_template: 'table',
		_captcha: 'false',
		email: data.email,
		name: data.name || '(not provided)',
		source: data.source,
		interests: data.interests.join(', ') || 'none selected',
		newsletter: data.newsletter ? 'yes' : 'no',
		guest_name: data.guestName || '(not provided)',
		message: data.message || '(not provided)',
	};

	const response = await fetch(
		`https://formsubmit.co/ajax/${encodeURIComponent(INTEREST_NOTIFICATION_EMAIL)}`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			body: JSON.stringify(body),
		}
	);

	return { ok: response.ok };
}

export function isNotificationConfigured(): boolean {
	return Boolean(INTEREST_NOTIFICATION_EMAIL);
}
