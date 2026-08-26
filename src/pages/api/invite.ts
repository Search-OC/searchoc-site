import type { APIRoute } from 'astro';
import { handleInterestSubmission } from '../../lib/handle-interest';

export const POST: APIRoute = async ({ request }) => {
	const body = await request.json().catch(() => ({}));
	return handleInterestSubmission({
		email: body.email,
		name: body.name,
		guestName: body.guestName,
		message: body.message,
		source: body.source || 'invite-legacy',
		newsletter: body.newsletter ?? true,
		interests: body.interests ?? ['open-forums'],
	});
};
