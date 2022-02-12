import { connectToDatabase } from '$lib/db';

export const get = async (context) => {
	// Connecting to DB
	const dbConnection = await connectToDatabase();
	const db = dbConnection.db;

	// Checking for auth coming from hooks' handle({ request, resolve })
	if (!context.locals.user.authenticated) {
		return {
			status: 401,
			body: {
				message: 'Unauthorized'
			}
		};
	}

	const user = await db.collection('users').findOne({ email: context.locals.user.email });

	if (!user) {
		return {
			status: 404,
			body: {
				message: 'User not found'
			}
		};
	}

	// Find a proper way in findOne(), I've run out of gas ;)
	delete user.password;

	return {
		status: 200,
		body: user
	};
};
