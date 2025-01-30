import { api } from "./baseUrl";

/* This function adds a new hotel type to the database */
export async function addHotelType(type_name, description) {
    const formData = new FormData();
    formData.append("type_name", type_name);
    formData.append("description", description);

    const response = await api.post("/api/v1/hotel-types", formData);
    if (response.status === 200) {
        return true;
    } else {
        return false;
    }
}

/* This function updates a hotel type in the database */
export async function updateHotelType(id, type_name, description) {

    const response = await api.put(`/api/v1/hotel-types/${id}`, {
        type_name,
        description
    });

    if (response.status === 200) {
        return true;
    } else {
        return false;
    }
}

/* This function gets all hotel types with pagination */
export async function getAllHotelTypes(search, page) {
    const baseUrl = "/api/v1/hotel-types";
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
        throw new Error("Error fetching hotel types");
    }
}

/* This function gets a list of all hotel types */
export async function getHotelTypesList() {
    try {
        const response = await api.get("/api/v1/hotel-types/list-all");
        return response.data;
    } catch (error) {
        throw new Error(`Error fetching hotel types ${error.message}`);
    }
}

/* This function gets a hotel type by its ID */
export async function getHotelTypeById(hotelTypeId) {
    try {
        const result = await api.get(`/api/v1/hotel-types/${hotelTypeId}`);
        return result.data;
    } catch (error) {
        throw new Error(`Error fetching hotel type ${error.message}`);
    }
}

/* This function deletes a hotel type by its ID */
export async function deleteHotelType(hotelTypeId) {
    const response = await api.delete(`/api/v1/hotel-types/${hotelTypeId}`);

    if (response.status === 200) {
        return true;
    } else {
        return false;
    }
}
