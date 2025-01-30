import { api } from "./baseUrl";

/* This function adds a new amenity to the database */
export async function addAmenity(name, amenity_category_id) {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("amenity_category_id", amenity_category_id);

    const response = await api.post("/api/v1/amenities", formData);
    if (response.status === 200) {
        return true;
    } else {
        return false;
    }
}

/* This function updates an amenity in the database */
export async function updateAmenity(id, name, amenity_category_id) {

    const response = await api.put(`/api/v1/amenities/${id}`, {
        name,
        amenity_category_id
    });

    if (response.status === 200) {
        return true;
    } else {
        return false;
    }
}

/* This function gets all amenities with pagination */
export async function getAllAmenities(search, page) {
    const baseUrl = "/api/v1/amenities/paginate";
    const queryParams = [];
    queryParams.push(`page=${page}`);
    queryParams.push(`size=10`);
    if (search) {
        queryParams.push(`search=${search}`);
    }
    const constructedUrl = `${baseUrl}?${queryParams.join("&")}`;

    try {
        const response = await api.get(constructedUrl);
        return response.data;
    } catch (error) {
        throw new Error("Error fetching amenities");
    }
}

/* This function gets a list of all amenities */
export async function getAmenitiesList() {
    try {
        const response = await api.get("/api/v1/amenities");
        return response.data;
    } catch (error) {
        throw new Error(`Error fetching amenities ${error.message}`);
    }
}
/* This function gets a list of all amenities */
export async function getPropertyAmenitiesList() {
    try {
        const response = await api.get("/api/v1/property-amenities");
        return response.data;
    } catch (error) {
        throw new Error(`Error fetching amenities ${error.message}`);
    }
}

export async function getRoomAmenitiesList() {
    try {
        const response = await api.get("/api/v1/room-amenities");
        return response.data;
    } catch (error) {
        throw new Error(`Error fetching amenities ${error.message}`);
    }
}
/* This function gets an amenity by its ID */
export async function getAmenityById(amenityId) {
    try {
        const result = await api.get(`/api/v1/amenities/${amenityId}`);
        return result.data;
    } catch (error) {
        throw new Error(`Error fetching amenity ${error.message}`);
    }
}

/* This function deletes an amenity by its ID */
export async function deleteAmenity(amenityId) {
    const response = await api.delete(`/api/v1/amenities/${amenityId}`);

    if (response.status === 200) {
        return true;
    } else {
        return false;
    }
}
