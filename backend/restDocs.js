//SO LETS TALK ABOUT REST
//THE IDEA IS RESOURCES ARE REPRESENTED AS URLS
//we use the basic functions of http to accomplish this
//so lets talk about a simple blog example
//We can have Users, Posts, Comments


/* Users */ 
/*
	GET /users
	{
		users : [
			{
				firstName : 'matt',
				lastName : 'mattmatt',
				age : 21
			},
			{
				firstName : 'eric',
				lastName : 'wuut',
				age : 22
			}
		],
		pagingation : {
			next : 'localhost/users?offset=XX&limit=XX',
			prev : 'see above'
		}
	}

	GET /users/{ID}
	where the ID is being parsed we get the user by that ID
	we can decide if we want numerical ID or username kindal ike what twitter does
	{
		users : [
			{
				firstName : 'matt',
				lastName : 'mattmatt',
				age : 21
			}
		]
	}

	POST /users
	we create a user, send a 201 if created, otherwise an errors object
	format of errors object TBD

	PUT /users/{ID}
	we edit the specified user by the given ID

	DELETE /users/{ID}
	we delete the user by the specified ID
*/