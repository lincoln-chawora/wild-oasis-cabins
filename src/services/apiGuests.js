import supabase from "./supabase.js";

export async function getGuests() {
    const { data, error } = await supabase
        .from('guests')
        .select('*');

    if (error) {
        console.error(error);
        throw new Error('Guests could not be loaded');
    }

    return {data};
}

export async function deleteGuest(id) {
    const { data, error } = await supabase
        .from('guests')
        .delete()
        .eq('id', id)

    if (error) {
        console.error(error);
        throw new Error('Guest could not be deleted.');
    }

    return data;
}

export async function createEditGuest(id, guestData) {
    let query = supabase.from('guests');
    // Create guest.
    if (!id) {
        query = query.insert([{...guestData}]);
    }

    // Update guest.
    if (id) {
        query = query.update({...guestData}).eq('id', id).select();
    }

    // Get data from query.
    const {data, error} = await query.select().single();

    if (error) {
        console.error(error);
        throw new Error('Cabins could not be created.');
    }

    return data;
}