import supabase from "./supabase.js";

export async function signUp({fullName, email, password}) {
    // Save the current session before signing up a new user.
    const {data: currentSession} = await supabase.auth.getSession();

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                fullName,
                avatar: ""
            }
        }
    });

    // If there was a previously authenticated user, restore their session.
    // This fixes bug of newly created users being signed in.
    if (currentSession) {
        await supabase.auth.setSession(currentSession.session);
    }

    // Handle errors.
    let authError = null;
    if (data.user && !data.user.identities.length) {
        authError = {
            name: "AuthApiError",
            message: "This email has already been registered",
        };
    } else if (error) {
        authError = {
            name: error.name,
            message: error.message,
        };
    }
    if (authError) throw new Error(authError.message);

    return data;
}

export async function login({email, password}) {
    let { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if(error) {
        throw new Error(error.message)
    }

    return data;
}

export async function getLoggedInUser() {
    const {data: session} = await supabase.auth.getSession();

    if (!session.session) return {};

    const { data, error } = await supabase.auth.getUser();

    if(error) {
        throw new Error(error.message);
    }

    return data?.user;
}

export async function logOut() {
    let { error } = await supabase.auth.signOut();

    if(error) {
        throw new Error(error.message);
    }
}

/*
export async function updateUser({email, password}) {
    let { data, error } = await supabase.auth.updateUser({
        password
    });

    if(error) {
        throw new Error(error.message)
    }

    console.log(data)
    return data;
}
*/
