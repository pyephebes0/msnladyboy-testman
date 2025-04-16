// src/routes/(auth)/+layout.server.js
import { redirect } from '@sveltejs/kit';

export async function load({ cookies, url }) {
	const token = cookies.get('token');

	if (!token && !url.pathname.startsWith('/login') && !url.pathname.startsWith('/register')) {
		throw redirect(302, '/login');
	}

	return {};
}
