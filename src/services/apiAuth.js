import supabase from "./supabase.js";

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
