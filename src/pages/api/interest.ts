import type { APIRoute } from 'astro';
import { handleInterestSubmission } from '../../lib/handle-interest';

export const POST: APIRoute = async ({ request }) => {
	const body = await request.json().catch(() => ({}));
	return handleInterestSubmission(body);
};
