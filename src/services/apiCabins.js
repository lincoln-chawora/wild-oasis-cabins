import supabase, {supabaseUrl} from "./supabase.js";

export async function getCabins() {
    const { data, error } = await supabase
        .from('cabins')
        .select('*');

    if (error) {
        console.error(error);
        throw new Error('Cabins could not be loaded');
    }

    return data;
}

export async function deleteCabin(id) {
    const { data, error } = await supabase
        .from('cabins')
        .delete()
        .eq('id', id)

    if (error) {
        console.error(error);
        throw new Error('Cabins could not be deleted.');
    }

    return data;
}


export async function createCabin(newCabin) {
    const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll("/", "");

    const imagePath = `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;
    // https://hjcnwavumjijgeuzrjdm.supabase.co/storage/v1/object/public/cabin-images/cabin-001.jpg
    // Create cabin
    const { data, error } = await supabase.from('cabins').insert([{...newCabin, image: imagePath}]);

    if (error) {
        console.error(error);
        throw new Error('Cabins could not be created.');
    }

    // Upload image
    const  {error: storageError } = await supabase.storage
        .from("cabin-images")
        .upload(imageName, newCabin.image);

    // Delete cabin if there was an error
    if (storageError) {
        await supabase.from("cabins").delete().eq("id", data.id);

        console.error(storageError);
        throw new Error('Cabin image could not be uploaded and the cabin was not created');
    }


    return data;
}