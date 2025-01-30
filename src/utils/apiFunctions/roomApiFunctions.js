import { api } from "./baseUrl";

export async function getAllRoomsPaginate(search, page) {
    const baseUrl = "/api/v1/room-types/paginate";
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

export async function addRoom(hotelData) {
    const formData = new FormData();

    // Append basic hotel data
    formData.append('type_name', hotelData.type_name);
    formData.append('description', hotelData.description);
    formData.append('property_id', hotelData.property_id);
    formData.append('max_guests', hotelData.max_guests);
    formData.append('room_size', hotelData.room_size);
    formData.append('bed_type', hotelData.bed_type);

    // Append amenities
    if (Array.isArray(hotelData.amenities)) {
        hotelData.amenities.forEach((amenity, index) => {
            formData.append(`amenities[${index}][amenity_id]`, amenity.amenity_id);
            formData.append(`amenities[${index}][description]`, amenity.description || '');
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
    if (Array.isArray(hotelData.plans)) {
        hotelData.plans.forEach((variant, index) => {
            formData.append(`plans[${index}][room_type_id]`, variant.room_type_id);
            formData.append(`plans[${index}][plan_type]`, variant.plan_type);
            formData.append(`plans[${index}][price]`, Number(variant.price));
        });
    }

    // Append images
    if (Array.isArray(hotelData.images)) {
        hotelData.images.forEach((image, index) => {
            formData.append(`images[${index}][image_url]`, image.image_url);
            formData.append(`images[${index}][is_main]`, image.is_main ? 'true' : 'false');
        });
    }

    const response = await api.post("/api/v1/room-types",formData)
    if (response.status === 200) {
        return true
    } else {
        return false
    }
}

export async function getRoomById(roomId) {
    try {
        const result = await api.get(`/api/v1/room-types/${roomId}`);
        return result.data;
    } catch (error) {
        throw new Error(`Error fetching property ${error.message}`);
    }
}

export async function getRoomDetails(roomId) {
    try {
        const result = await api.get(`/api/v1/room-details/${roomId}`);
        return result.data;
    } catch (error) {
        throw new Error(`Error fetching room ${error.message}`);
    }
}

export async function updateRoom(roomId,hotelData) {
    const formData = new FormData();

    // Append basic hotel data
    formData.append('type_name', hotelData.type_name);
    formData.append('description', hotelData.description);
    formData.append('property_id', hotelData.property_id);
    formData.append('max_guests', hotelData.max_guests);
    formData.append('room_size', hotelData.room_size);
    formData.append('bed_type', hotelData.bed_type);

    // Append amenities
    if (Array.isArray(hotelData.amenities)) {
        hotelData.amenities.forEach((amenity, index) => {
            formData.append(`amenities[${index}][amenity_id]`, amenity.amenity_id);
            formData.append(`amenities[${index}][description]`, amenity.description || '');
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
    if (Array.isArray(hotelData.plans)) {
        hotelData.plans.forEach((variant, index) => {
            formData.append(`plans[${index}][room_type_id]`, variant.room_type_id);
            formData.append(`plans[${index}][plan_type]`, variant.plan_type);
            formData.append(`plans[${index}][price]`, Number(variant.price));
        });
    }

    // Append images
    if (Array.isArray(hotelData.images)) {
        hotelData.images.forEach((image, index) => {
            formData.append(`images[${index}][image_url]`, image.image_url);
            formData.append(`images[${index}][is_main]`, image.is_main ? 'true' : 'false');
        });
    }

    const response = await api.post(`/api/v1/room-types/${roomId}`,formData)
    if (response.status === 200) {
        return true
    } else {
        return false
    }
}