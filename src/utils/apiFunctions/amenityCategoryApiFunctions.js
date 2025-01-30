import {api} from "./baseUrl";

/* This function adds a new company to the database */
export async function addAmenityCategory(name,type) {
    const formData = new FormData()
    formData.append("name", name)
    formData.append("type", type)

    const response = await api.post("/api/v1/amenity-categories",formData)
    if (response.status === 200) {
        return true
    } else {
        return false
    }
}

export async function updateAmenityCategory(id, name,type) {

    const response = await api.put(`/api/v1/amenity-categories/${id}`, {
        name,
        type
    });

    if (response.status === 200) {
        return true;
    } else {
        return false;
    }
}


/* This function gets all companies from the database */
export async function getAllAmenityCategories(search,page) {

    const baseUrl ="/api/v1/amenity-categories/paginate";
    const queryParams = [];
    queryParams.push(`page=${page}`);
    queryParams.push(`size=10`);
    if (search) {
        queryParams.push(`search=${search}`);
    }
    const constructedUrl = `${baseUrl}?${queryParams.join("&")}`;

    try {
        const response = await api.get(constructedUrl)
        return response.data
    } catch (error) {
        throw new Error("Error fetching companies")
    }
}

export async function getAmenityCategoriesList() {
    try {
        const response = await api.get("/api/v1/amenity-categories")
        return response.data
    } catch (error) {
        throw new Error(`Error fetching parking space ${error.message}`)
    }
}


/* This function gets a company by the id */
export async function getAmenityCategoryById(amenityCategoryId) {
    try {
        const result = await api.get(`/amenity-categories/${amenityCategoryId}`)
        return result.data
    } catch (error) {
        throw new Error(`Error fetching company ${error.message}`)
    }
}

/* This isthe function to delete a company */
export async function deleteAmenityCategory(amenityCategoryId) {

    const response = await api.delete(`/api/v1/amenity-categories/${amenityCategoryId}`)

    if (response.status === 200) {
        return true;
    } else {
        return false;
    }
}