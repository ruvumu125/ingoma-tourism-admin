import { api } from "./baseUrl";

/* This function adds a new city to the database */
export async function addCity(name, description) {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);

    const response = await api.post("/api/v1/cities", formData);
    if (response.status === 200) {
        return true;
    } else {
        return false;
    }
}

/* This function updates a city in the database */
export async function updateCity(id, name, description) {

    const response = await api.put(`/api/v1/cities/${id}`, {
        name,
        description
    });

    if (response.status === 200) {
        return true;
    } else {
        return false;
    }
}

/* This function gets all cities with pagination */
export async function getAllCities(search, page) {
    const baseUrl = "/api/v1/cities";
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
        throw new Error("Error fetching cities");
    }
}

/* This function gets a list of all cities */
export async function getCitiesList() {
    try {
        const response = await api.get("/api/v1/cities/list-all");
        return response.data;
    } catch (error) {
        throw new Error(`Error fetching cities ${error.message}`);
    }
}

/* This function gets a city by its ID */
export async function getCityById(cityId) {
    try {
        const result = await api.get(`/api/v1/cities/${cityId}`);
        return result.data;
    } catch (error) {
        throw new Error(`Error fetching city ${error.message}`);
    }
}

/* This function deletes a city by its ID */
export async function deleteCity(cityId) {
    const response = await api.delete(`/api/v1/cities/${cityId}`);

    if (response.status === 200) {
        return true;
    } else {
        return false;
    }
}
