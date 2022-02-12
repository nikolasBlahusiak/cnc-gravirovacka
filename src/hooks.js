import * as cookie from 'cookie';
import { connectToDatabase } from '$lib/db';

// Sets context in endpoints
export const handle = async ({ request, resolve }) => {
	// Connecting to DB
	const dbConnection = await connectToDatabase();
	const db = dbConnection.db;

	// Getting cookies from request headers - all requests have cookies on them
	const cookies = cookie.parse(request.headers.cookie || '');
	request.locals.user = cookies;

	// If there are no cookies, the user is not authenticated
	if (!cookies.session_id) {
		request.locals.user.authenticated = false;
	}

	// Searching DB for the user with the right cookie
	const userSession = await db.collection('cookies').findOne({ cookieId: cookies.session_id });

	// If there is that user, authenticate him and pass his email to context
	if (userSession) {
		request.locals.user.authenticated = true;
		request.locals.user.email = userSession.email;
	} else {
		request.locals.user.authenticated = false;
	}

	const response = await resolve(request);

	return {
		...response,
		headers: {
			...response.headers
		}
	};
};

// Sets session on client-side
export const getSession = async (request) => {
	// Pass cookie with authenticated & email properties to session
	return request.locals.user
		? {
				user: {
					authenticated: true,
					email: request.locals.user.email
				}
		  }
		: {};
};
