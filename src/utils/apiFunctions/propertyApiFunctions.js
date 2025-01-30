import { api } from "./baseUrl";

export async function getPropertiesList() {
    try {
        const response = await api.get("/api/v1/properties");
        return response.data;
    } catch (error) {
        throw new Error(`Error fetching properties ${error.message}`);
    }
}

export async function getAllPropertiesPaginate(search, page) {
    const baseUrl = "/api/v1/properties/paginate";
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
        throw new Error("Error fetching properties");
    }
}

export async function addProperty(hotelData) {
    const formData = new FormData();

    // Append basic hotel data
    formData.append('name', hotelData.name);
    formData.append('description', hotelData.description);
    formData.append('address', hotelData.address);
    formData.append('city_id', hotelData.city_id);
    formData.append('property_type', hotelData.property_type);
    formData.append('whatsapp_number1', hotelData.whatsapp_number1);
    formData.append('whatsapp_number2', hotelData.whatsapp_number2);
    if (hotelData.rating) {
        formData.append('rating', Number(hotelData.rating));
    }
    if (hotelData.property_type==="hotel") {
        formData.append('hotel_type', hotelData.hotel_type);
    }

    // Append amenities
    if (Array.isArray(hotelData.amenities)) {
        hotelData.amenities.forEach((amenity, index) => {
            formData.append(`amenities[${index}][amenity_id]`, amenity.amenity_id);
            formData.append(`amenities[${index}][description]`, amenity.description || '');
        });
    }

    // Append landmarks
    if (Array.isArray(hotelData.landmarks)) {
        hotelData.landmarks.forEach((landmark, index) => {
            formData.append(`landmarks[${index}][name]`, landmark.name);
            formData.append(`landmarks[${index}][distance]`, landmark.distance || '');
        });
    }

    // Append rules
    if (Array.isArray(hotelData.rules)) {
        hotelData.rules.forEach((rule, index) => {
            formData.append(`rules[${index}][rule_description]`, rule.rule_description);
        });
    }

    // Append images
    if (Array.isArray(hotelData.images)) {
        hotelData.images.forEach((image, index) => {
            formData.append(`images[${index}][image_url]`, image.file); // Use the actual file object
            formData.append(`images[${index}][is_main]`, image.is_main ? "true" : "false");
        });
    }

    // Append guest house variants
    if (Array.isArray(hotelData.guest_house_variants) && hotelData.property_type==="guesthouse") {
        hotelData.guest_house_variants.forEach((variant, index) => {
            formData.append(`guest_house_variants[${index}][property_guest_house_id]`, variant.property_guest_house_id);
            formData.append(`guest_house_variants[${index}][variant]`, variant.variant);
            formData.append(`guest_house_variants[${index}][price]`, Number(variant.price));
        });
    }

    // Append images
    if (Array.isArray(hotelData.images)) {
        hotelData.images.forEach((image, index) => {
            formData.append(`images[${index}][image_url]`, image.image_url);
            formData.append(`images[${index}][is_main]`, image.is_main ? 'true' : 'false');
        });
    }

    const response = await api.post("/api/v1/properties",formData)
    if (response.status === 200) {
        return true
    } else {
        return false
    }
}

export async function getPropertyById(propertyId) {
    try {
        const result = await api.get(`/api/v1/properties/${propertyId}`);
        return result.data;
    } catch (error) {
        throw new Error(`Error fetching property ${error.message}`);
    }
}

export async function getPropertyDetails(propertyId) {
    try {
        const result = await api.get(`/api/v1/property-details/${propertyId}`);
        return result.data;
    } catch (error) {
        throw new Error(`Error fetching property ${error.message}`);
    }
}

export async function updateProperty(propertyId,hotelData) {
    const formData = new FormData();

    // Append basic hotel data
    formData.append('name', hotelData.name);
    formData.append('description', hotelData.description);
    formData.append('address', hotelData.address);
    formData.append('city_id', hotelData.city_id);
    formData.append('property_type', hotelData.property_type);
    formData.append('whatsapp_number1', hotelData.whatsapp_number1);
    formData.append('whatsapp_number2', hotelData.whatsapp_number2);
    if (hotelData.rating) {
        formData.append('rating', Number(hotelData.rating));
    }
    if (hotelData.property_type==="hotel") {
        formData.append('hotel_type', hotelData.hotel_type);
    }

    // Append amenities
    if (Array.isArray(hotelData.amenities)) {
        hotelData.amenities.forEach((amenity, index) => {
            formData.append(`amenities[${index}][amenity_id]`, amenity.amenity_id);
            formData.append(`amenities[${index}][description]`, amenity.description || '');
        });
    }

    // Append landmarks
    if (Array.isArray(hotelData.landmarks)) {
        hotelData.landmarks.forEach((landmark, index) => {
            formData.append(`landmarks[${index}][name]`, landmark.name);
            formData.append(`landmarks[${index}][distance]`, landmark.distance || '');
        });
    }

    // Append rules
    if (Array.isArray(hotelData.rules)) {
        hotelData.rules.forEach((rule, index) => {
            formData.append(`rules[${index}][rule_description]`, rule.rule_description);
        });
    }

    // Append images
    if (Array.isArray(hotelData.images)) {
        hotelData.images.forEach((image, index) => {
            formData.append(`images[${index}][image_url]`, image.file); // Use the actual file object
            formData.append(`images[${index}][is_main]`, image.is_main ? "true" : "false");
        });
    }

    // Append guest house variants
    if (Array.isArray(hotelData.guest_house_variants) && hotelData.property_type==="guesthouse") {
        hotelData.guest_house_variants.forEach((variant, index) => {
            formData.append(`guest_house_variants[${index}][property_guest_house_id]`, variant.property_guest_house_id);
            formData.append(`guest_house_variants[${index}][variant]`, variant.variant);
            formData.append(`guest_house_variants[${index}][price]`, Number(variant.price));
        });
    }

    // Append images
    if (Array.isArray(hotelData.images)) {
        hotelData.images.forEach((image, index) => {
            formData.append(`images[${index}][image_url]`, image.image_url);
            formData.append(`images[${index}][is_main]`, image.is_main ? 'true' : 'false');
        });
    }

    const response = await api.post(`/api/v1/properties/${propertyId}`,formData)
    if (response.status === 200) {
        return true
    } else {
        return false
    }
}

export async function enableProperty(id) {

    const response= await api.put(`/api/v1/enableProperty/${id}`)

    if (response.status === 200) {
        return true;
    } else {
        return false;
    }

}

export async function desableProperty(id) {

    const response= await api.put(`/api/v1/desableProperty/${id}`)

    if (response.status === 200) {
        return true;
    } else {
        return false;
    }

}






