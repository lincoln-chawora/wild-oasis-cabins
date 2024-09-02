import supabase from "./supabase.js";

export async function login({email, password}) {
    let { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if(error) {
        throw new Error(error.message)
    }

    console.log(data)
    return data;
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
