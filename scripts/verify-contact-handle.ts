import {
	contactEmail,
	contactPhone,
	parseContactHandle,
} from '../src/lib/contact-handle.ts';

function assert(condition: unknown, message: string): asserts condition {
	if (!condition) throw new Error(message);
}

const emailOnly = parseContactHandle({ email: '  Jake@SearchOC.org ', phone: '' });
assert(emailOnly.ok && emailOnly.contact.channel === 'email', 'email-only channel');
assert(emailOnly.contact.email === 'jake@searchoc.org', 'email trimmed and lowercased');
assert(contactPhone(emailOnly.contact) === undefined, 'email-only has no phone');

const phoneOnly = parseContactHandle({ email: '', phone: '  (714) 555-0100 ' });
assert(phoneOnly.ok && phoneOnly.contact.channel === 'phone', 'phone-only channel');
assert(phoneOnly.contact.phone === '(714) 555-0100', 'phone keeps trimmed display input');
assert(contactEmail(phoneOnly.contact) === undefined, 'phone-only has no email');

const both = parseContactHandle({ email: 'a@b.co', phone: '7145550100' });
assert(both.ok && both.contact.channel === 'both', 'both channel');
assert(both.contact.email === 'a@b.co' && both.contact.phone === '7145550100', 'both values');

const shortPhone = parseContactHandle({ email: 'a@b.co', phone: '555-0100' });
assert(shortPhone.ok && shortPhone.contact.channel === 'email', 'short phone is dropped');

const neither = parseContactHandle({ email: 'not-an-email', phone: '123' });
assert(!neither.ok && neither.error.includes('email or a phone number'), 'neither is a parse failure');

const empty = parseContactHandle({});
assert(!empty.ok, 'empty input is a parse failure');

console.log('verify-contact-handle: ok');
