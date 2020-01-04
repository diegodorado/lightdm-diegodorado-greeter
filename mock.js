/* mock lightdm for testing purposes */
if (typeof lightdm == 'undefined') {
    lightdm = {};
    lightdm.hostname = "test-host";
    lightdm.languages = [{code: "en_US", name: "English(US)", territory: "USA"}, {code: "en_UK", name: "English(UK)", territory: "UK"}];
    lightdm.default_language = lightdm.languages[0];
    lightdm.layouts = [{name: "test", short_description: "test description", short_description:"really long epic description"}];
    lightdm.default_layout = lightdm.layouts[0];
    lightdm.layout = lightdm.layouts[0];
    lightdm.sessions=[{key: "gnome", name: "gnome", comment: "no comment"}, {key: "key2", name: "cinnamon", comment: "no comment"},{key: "key3", name: "openbox", comment: "no comment"}, {key: "key4", name: "kde", comment: "no comment"}];

    lightdm.default_session=lightdm.sessions[0];
    lightdm.authentication_user = null;
    lightdm.is_authenticated = false;
    lightdm.can_suspend = true;
    lightdm.can_hibernate = true;
    lightdm.can_restart = true;
    lightdm.can_shutdown = true;

    lightdm.users = [
        { name: "clarkk", real_name: "Superman", display_name: "Clark Kent", image: "", language: "en_US", layout: null, session: "gnome", logged_in: false },
				{ name: "diegodorado", username: "diegodorado", real_name:"Batman", display_name: "Bruce Wayne", image :"/home/brokenImage.gif", language: "en_US", layout: null, session: lightdm.sessions[1].key, logged_in: false},
        { name: "peterp", real_name: "Spiderman", display_name: "Peter Parker", image: "", language: "en_US", layout: null, session: "gnome", logged_in: true},
    ];

    lightdm.num_users = lightdm.users.length;
    lightdm.timed_login_delay = 0; //set to a number higher than 0 for timed login simulation
    lightdm.timed_login_user = lightdm.timed_login_delay > 0 ? lightdm.users[0] : null;

    lightdm.get_string_property = function() {};
    lightdm.get_integer_property = function() {};
    lightdm.get_boolean_property = function() {};
    lightdm.cancel_timed_login = function() {
	_lightdm_mock_check_argument_length(arguments, 0);
	lightdm._timed_login_cancelled = true;
    };

    lightdm.provide_secret = function(secret) {
        console.log("provide_secret: " + secret);
        console.log("lightdm._username : " + lightdm._username);
	if (typeof lightdm._username == 'undefined' || !lightdm._username) {
	    throw "must call start_authentication first"
	}
	_lightdm_mock_check_argument_length(arguments, 1);
	var user = _lightdm_mock_get_user(lightdm.username);

	if (!user && secret == lightdm._username) {
	    lightdm.is_authenticated = true;
	    lightdm.authentication_user = user;
	} else {
	    lightdm.is_authenticated = false;
	    lightdm.authentication_user = null;
	    lightdm._username = null;
	}
	authentication_complete();
    };

    lightdm.start_authentication = function(username) {
        console.log("start_auth: " + username);
	_lightdm_mock_check_argument_length(arguments, 1);
	if (lightdm._username) {
	    throw "Already authenticating!";
	}
	var user = _lightdm_mock_get_user(username);
	if (!user) {
	    show_error(username + " is an invalid user");
	}
	lightdm._username = username;
	show_prompt("Password: ");
    };

    lightdm.cancel_authentication = function() {
        console.log("cancel_auth");
	_lightdm_mock_check_argument_length(arguments, 0);
	if (!lightdm._username) {
	    throw "we are not authenticating";
	}
	lightdm._username = null;
    };

    lightdm.suspend = function() {
	console.log("System Suspended. Bye Bye");
    };

    lightdm.hibernate = function() {
	console.log("System Hibernated. Bye Bye");
    };

    lightdm.restart = function() {
	console.log("System restart. Bye Bye");
    };

    lightdm.shutdown = function() {
	console.log("System Shutdown. Bye Bye");
    };

    lightdm.login = function(user, session) {
        console.log("login: " + user + ", session: " + session);
	_lightdm_mock_check_argument_length(arguments, 2);
	if (!lightdm.is_authenticated) {
	    throw "The system is not authenticated";
	}
	if (user !== lightdm.authentication_user) {
	    throw "this user is not authenticated";
	}
	console.log("logged in successfully!!");
    };

    if (lightdm.timed_login_delay > 0) {
	setTimeout(function() {
                if (!lightdm._timed_login_cancelled()) {
                    timed_login();
                }
            },
            lightdm.timed_login_delay
        );
    }
}

function _lightdm_mock_check_argument_length(args, length) {
    if (args.length != length) {
	throw "incorrect number of arguments in function call";
    }
}

function _lightdm_mock_get_user(username) {
    var user = null;
    for (var i = 0; i < lightdm.users.length; ++i) {
	if (lightdm.users[i].name == username) {
	    user = lightdm.users[i];
	    break;
	}
    }
    return user;
}
