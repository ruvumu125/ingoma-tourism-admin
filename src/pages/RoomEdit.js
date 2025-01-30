import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {getPropertiesList, getPropertyById, updateProperty} from "../utils/apiFunctions/propertyApiFunctions";
import {addRoom, getRoomById, updateRoom} from "../utils/apiFunctions/roomApiFunctions";
import AddPropertyInfoProperySkleton from "../components/commons/AddPropertyInfoProperySkleton";
import AddPropertyAmenityPropertySkleton from "../components/commons/AddPropertyAmenityPropertySkleton";
import AddPropertyPhotoSkleton from "../components/commons/AddPropertyPhotoSkleton";
import {toast} from "react-toastify";
import {getRoomAmenitiesList} from "../utils/apiFunctions/amenityApiFunctions";

function RoomEdit() {

    //general declarations
    const navigate = useNavigate();
    const { id } = useParams();
    const [isPropertiesFetched, setIsPropertiesFetched] = useState(false);
    const [isRoomAmenitiesFetched, setIsRoomAmenitiesFetched] = useState(false);
    const [isRoomDetailsFetched, setIsRoomDetailsFetched] = useState(false);

    //selector city declaration
    const [properties, setProperties] = useState([]);
    const [selectedPropertyId, setSelectedPropertyId] = useState('');
    const [selectedPropertyName, setSelectedPropertyName] = useState("---Sélectionner un logement---");


    const [roomAmenities, setRoomAmenities] = useState([]);
    const [selectedRoomAmenityId, setSelectedRoomAmenityId] = useState('');
    const [selectedRoomAmenityName, setSelectedRoomAmenityName] = useState("---Sélectionner une commodité---");


    //saving/update declaration
    const [savingErrors, setSavingErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    //images
    const [previewUrls, setPreviewUrls] = useState([]);

    const [hotelData, setHotelData] = useState({
        "id": 0,
        "type_name": "",
        "property_id": 0,
        "property": {
            "property_id": 0,
            "property_name": "",
            "property_type": ""
        },
        "room_size": "",
        "bed_type": "",
        "max_guests": 0,
        "description": "",
        "images": [

        ],
        "amenities": [

        ],
        "plans": [

        ],
        "created_at": "",
        "updated_at": ""
    });

    useEffect(() => {
        fetchRoomById();
        fetchProperties();
        fetchRoomAmenitiesList();
    }, [id]);

    const convertUrlToFile = async (url, filename) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const contentType = response.headers.get("Content-Type");
            if (!contentType || !contentType.startsWith("image/")) {
                throw new Error(`Unexpected content type: ${contentType}`);
            }

            const blob = await response.blob(); // Fetch the image as a Blob
            return new File([blob], filename, { type: contentType });
        } catch (error) {
            console.error("Error converting URL to File:", error);
            throw error; // Rethrow the error so you can handle it upstream
        }
    };

    const fetchRoomById=() => {
        getRoomById(id)
            .then(async (data) => {

                const propertyDetails = data.data;

                // Convert image URLs to File objects
                const imagesWithFiles = await Promise.all(
                    propertyDetails.images.map(async (image) => {
                        try {
                            const file = await convertUrlToFile(
                                `http://localhost:8000/api/v1/room-image/${image.image_url}`,
                                `image_${image.id}.jpg`
                            );
                            return {
                                ...image,
                                image_url: file, // Replace image_url with the File object
                            };
                        } catch (error) {
                            console.error(`Failed to process image ${image.image_url}:`, error);
                            return image; // Fallback to the original image object in case of error
                        }
                    })
                );


                // Set the state with converted data
                setHotelData({
                    ...propertyDetails,
                    images: imagesWithFiles, // Update images with File objects
                });


                if (data && data.data && data.data.images) {
                    const imageUrls = data.data.images.map(
                        image => `http://localhost:8000/api/v1/room-image/${image.image_url}`
                    );
                    setPreviewUrls(imageUrls);
                    setIsRoomDetailsFetched(true);
                }

            })
            .catch((error) => {

                setIsRoomDetailsFetched(false);
            })
    };

    const fetchProperties=() => {
        getPropertiesList()
            .then((data) => {

                console.log(data.data);
                setProperties(data.data)
                setIsPropertiesFetched(true);

            })
            .catch((error) => {
                setIsPropertiesFetched(false);
            })
    };

    const fetchRoomAmenitiesList=() => {
        getRoomAmenitiesList()
            .then((data) => {
                console.log(data);
                setRoomAmenities(data.data);
                setIsRoomAmenitiesFetched(true);

            })
            .catch((error) => {
                setIsRoomAmenitiesFetched(false);
            })
    };

    // Helper to handle updates for nested array fields
    const handleNestedFieldChange = (field, index, key, value) => {
        setHotelData((prevData) => {
            const updatedField = [...prevData[field]];
            updatedField[index] = { ...updatedField[index], [key]: value };
            return { ...prevData, [field]: updatedField };
        });
    };

    const handlePropertyInputChange = (event) => {
        const { name, value } = event.target;

        // Find the selected property
        const selectedProperty = properties.find(property => property.id.toString() === value);

        setHotelData(prevState => ({
            ...prevState,
            [name]: value, // Update the property_id
            property_type: selectedProperty ? selectedProperty.property_type : "" // Update property_type
        }));
    };


    // General input change handler
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setHotelData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleAddItem = (field, newItem) => {

        setHotelData((prevData) => ({
            ...prevData,
            [field]: [...prevData[field], newItem],
        }));
    };

    const handleRemoveItem = (field, index) => {
        setHotelData((prevData) => {
            const updatedField = prevData[field].filter((_, i) => i !== index);

            // Update previewUrls only if field is 'images'
            if (field === "images") {
                setPreviewUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
            }

            return {
                ...prevData,
                [field]: updatedField,
            };
        });
    };


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setPreviewUrls((prev) => [...prev, imageUrl]); // Store for UI preview
            handleAddItem("images", { image_url: file, is_main: false }); // Store file for API
        }
    };

    // Helper function to get errors for a specific field
    const getFieldError = (fieldPath) => {
        const fieldErrors = savingErrors[fieldPath] || [];
        return fieldErrors.join(", "); // Combine multiple errors if needed
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Hotel Data:", hotelData);

        updateSelectedRoom().then(() => console.log("Property saved successfully"))
            .catch((error) => console.error("Error in handleSubmit:", error));
    };

    const moveToTop = () => {
        window.scrollTo(0, 0); // Scroll to the top of the page
    };

    const updateSelectedRoom = async () => {

        setIsSaving(true);
        try {
            const success = await updateRoom(id, hotelData);

            if (success !== undefined) {

                setHotelData({
                    "id": 0,
                    "type_name": "",
                    "property_id": 0,
                    "property": {
                        "property_id": 0,
                        "property_name": "",
                        "property_type": ""
                    },
                    "room_size": "",
                    "bed_type": "",
                    "max_guests": 0,
                    "description": "",
                    "images": [

                    ],
                    "amenities": [

                    ],
                    "plans": [

                    ],
                    "created_at": "",
                    "updated_at": ""
                })
                setSavingErrors({});
                setIsSaving(false);

                // Toast
                toast.success("Modifié avec succès", {
                    position: "top-right",
                    autoClose: 2500,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored"
                });
            } else {
                setIsSaving(false);
                console.log(success);
            }
        } catch (error) {
            console.log(error);
            setSavingErrors(error.response?.data?.data || {});
            console.log(error.response?.data?.data || {});
            setIsSaving(false);
            moveToTop();

        }
    };

    return (
        <React.Fragment>
            <div className="page-header">
                <div className="add-item d-flex">
                    <div className="page-title">
                        <h4>Chambre/Pièce</h4>
                        <h6>Créer une chambre/pièce</h6>
                    </div>
                </div>
                <ul className="table-top-head">
                    <li>
                        <div className="page-btn">
                            <a
                                onClick={() => navigate(`/rooms`)}
                                className="btn btn-secondary">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="feather feather-arrow-left me-2">
                                    <line x1="19" y1="12" x2="5" y2="12"></line>
                                    <polyline points="12 19 5 12 12 5"></polyline>
                                </svg>
                                Liste de chambres/pièces
                            </a>
                        </div>
                    </li>
                </ul>

            </div>

            <form onSubmit={handleSubmit}>
                <div className="card" style={{paddingBottom:"30px"}}>
                    <div className="card-body add-product pb-0">

                        <div className="accordion-card-one accordion" id="accordionExample">
                            <div className="accordion-item">
                                <div className="accordion-header" id="headingOne">
                                    <div className="accordion-button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-controls="collapseOne">
                                        <div className="addproduct-icon">
                                            <h5><i data-feather="info" className="add-info"></i><span>Informations sur la chambre</span></h5>
                                            <a href="javascript:void(0);"><i data-feather="chevron-down" className="chevron-down-add"></i></a>
                                        </div>
                                    </div>
                                </div>
                                <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                    <div className="accordion-body">
                                        {
                                            isPropertiesFetched && isRoomAmenitiesFetched && isRoomDetailsFetched ? (
                                                <>
                                                    <div className="row">
                                                        <div className="col-12 col-sm-12 col-md-4 col-lg-4">
                                                            <div className="mb-3 add-product">
                                                                <label className="form-label">Logement <code>*</code></label>
                                                                <select
                                                                    name="property_id"
                                                                    value={hotelData.property_id || ""}
                                                                    onChange={handlePropertyInputChange}
                                                                    className={`form-select ${savingErrors.property_id ? "is-invalid" : ""}`}>

                                                                    <option value="">---- Sélectionner un logement ----</option>
                                                                    {
                                                                        properties.map((property, index) => (
                                                                            <option
                                                                                key={index}
                                                                                value={property.id}
                                                                                selected={property.id===selectedPropertyId}
                                                                            >{property.name}</option>
                                                                        ))
                                                                    }
                                                                </select>
                                                                {savingErrors.property_id && (
                                                                    <div className="invalid-feedback">{savingErrors.property_id[0]}</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="col-12 col-sm-12 col-md-4 col-lg-4">
                                                            <div className="mb-3 add-product">
                                                                <label className="form-label">Nom de la chambre <code>*</code></label>
                                                                <input
                                                                    name="type_name"
                                                                    value={hotelData.type_name}
                                                                    onChange={handleInputChange}
                                                                    type="text"
                                                                    className={`form-control ${savingErrors.type_name ? "is-invalid" : ""}`}
                                                                    placeholder="Nom de la chambre"/>

                                                                {savingErrors.type_name && (
                                                                    <div className="invalid-feedback">{savingErrors.type_name[0]}</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="col-12 col-sm-12 col-md-4 col-lg-4">
                                                            <div className="mb-3 add-product">
                                                                <label className="form-label">Nombre maximum de personnes <code>*</code></label>
                                                                <input
                                                                    name="max_guests"
                                                                    value={hotelData.max_guests}
                                                                    onChange={handleInputChange}
                                                                    type="number"
                                                                    className={`form-control ${savingErrors.max_guests ? "is-invalid" : ""}`}
                                                                    placeholder="Nombre maximum de personnes"/>
                                                                {savingErrors.max_guests && (
                                                                    <div className="invalid-feedback">{savingErrors.max_guests[0]}</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-12 col-sm-12 col-md-4 col-lg-4">
                                                            <div className="mb-3 add-product">
                                                                <label className="form-label">Taille de la pièce (en m²) <code>*</code></label>
                                                                <input
                                                                    name="room_size"
                                                                    value={hotelData.room_size}
                                                                    onChange={handleInputChange}
                                                                    type="number"
                                                                    className={`form-control ${savingErrors.room_size ? "is-invalid" : ""}`}
                                                                    placeholder="Taille de la pièce (en m²)"/>
                                                                {savingErrors.room_size && (
                                                                    <div className="invalid-feedback">{savingErrors.room_size[0]}</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="col-12 col-sm-12 col-md-4 col-lg-4">
                                                            <div className="mb-3 add-product">
                                                                <label className="form-label">Type de lit</label>
                                                                <input
                                                                    type="text"
                                                                    name="bed_type"
                                                                    value={hotelData.bed_type}
                                                                    onChange={handleInputChange}
                                                                    className="form-control"
                                                                    placeholder="Type de lit"/>
                                                            </div>
                                                        </div>

                                                    </div>
                                                    <div className="addservice-info">
                                                        <div className="row">
                                                            <div className="col-12 col-sm-12 col-md-12 col-lg-12">
                                                                <div className="mb-3 add-product">
                                                                    <label className="form-label">Description de la pièce <code>*</code></label>
                                                                    <textarea
                                                                        rows="5"
                                                                        cols="5"
                                                                        name="description"
                                                                        value={hotelData.description}
                                                                        onChange={handleInputChange}
                                                                        className="form-control"
                                                                        placeholder="Description de la pièce">
                                                                    </textarea>

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            ):(
                                                <AddPropertyInfoProperySkleton/>
                                            )
                                        }

                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="accordion-card-one accordion" id="accordionExample2">
                            <div className="accordion-item">
                                <div className="accordion-header" id="headingTwo">
                                    <div className="accordion-button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-controls="collapseTwo">
                                        <div className="text-editor add-list">
                                            <div className="addproduct-icon list icon">
                                                <h5><i data-feather="life-buoy" className="add-info"></i><span>Commodités de la pièce</span></h5>
                                                <a href="javascript:void(0);"><i data-feather="chevron-down" className="chevron-down-add"></i></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div id="collapseTwo" className="accordion-collapse collapse show" aria-labelledby="headingTwo" data-bs-parent="#accordionExample2">
                                    <div className="accordion-body">
                                        <div className="tab-content" id="pills-tabContent">
                                            <div className="tab-pane fade show active" id="pills-home" role="tabpanel"
                                                 aria-labelledby="pills-home-tab">

                                                {
                                                    isPropertiesFetched && isRoomAmenitiesFetched && isRoomDetailsFetched ? (
                                                        <>
                                                            <div className="row">

                                                                {hotelData.amenities.map((amenity, index) => (
                                                                    <div className="row" key={index}>
                                                                        <div className="col-lg-4 col-sm-6 col-12">
                                                                            <div className="input-blocks add-product">
                                                                                <label>Commodité <code>*</code></label>
                                                                                <select
                                                                                    value={amenity.amenity_id || roomAmenities[index]?.id || ""}
                                                                                    onChange={(e) =>
                                                                                        handleNestedFieldChange("amenities", index, "amenity_id", e.target.value)
                                                                                    }
                                                                                    className={`form-select ${getFieldError(`amenities.${index}.amenity_id`) ? "is-invalid" : ""}`}
                                                                                    id="autoSizingSelect" >

                                                                                    {
                                                                                        roomAmenities.map((amenityOption, optionIndex) => (
                                                                                            <option
                                                                                                key={optionIndex}
                                                                                                value={amenityOption.id}
                                                                                            >{amenityOption.name}</option>
                                                                                        ))
                                                                                    }
                                                                                </select>
                                                                                {getFieldError(`amenities.${index}.amenity_id`) && (
                                                                                    <div className="invalid-feedback">
                                                                                        {getFieldError(`amenities.${index}.amenity_id`)}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-lg-7 col-sm-6 col-12">
                                                                            <div className="input-blocks add-product">
                                                                                <label>Description de la commodité <code>*</code></label>
                                                                                <input
                                                                                    value={amenity.description || ""}
                                                                                    onChange={(e) =>
                                                                                        handleNestedFieldChange("amenities", index, "description", e.target.value)
                                                                                    }
                                                                                    type="text"
                                                                                    className="form-control"
                                                                                    placeholder="Description de la commodité"/>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-lg-1 col-sm-6 col-12">
                                                                            <div className="input-blocks add-product">
                                                                                {index !== 0 && (
                                                                                    <>
                                                                                        <label style={{color:"white"}}>lll</label>
                                                                                        <button
                                                                                            onClick={() => handleRemoveItem("amenities", index)}
                                                                                            className="btn btn-icon btn-danger">
                                                                                            <i className="fa fa-remove"></i>
                                                                                        </button>
                                                                                    </>

                                                                                )}

                                                                            </div>

                                                                        </div>
                                                                    </div>
                                                                ))}

                                                                <div className="col-auto" style={{paddingBottom:"40px"}}>
                                                                    <button
                                                                        onClick={() => handleAddItem("amenities", { amenity_id: "", description: "" })}
                                                                        type="button"
                                                                        className="btn btn-primary">
                                                                        <i className="fa fa-plus-circle fa-lg me-2"></i>Commodité
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </>
                                                    ):(
                                                        <AddPropertyAmenityPropertySkleton/>
                                                    )
                                                }

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="accordion-card-one accordion" id="accordionExample4">

                        </div>
                        {
                            hotelData.property.property_type==="hotel" && (
                                <div className="accordion-card-one accordion" id="accordionExample5">
                                    <div className="accordion-item">

                                        <div className="accordion-header" id="headingFive">
                                            <div className="accordion-button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-controls="collapseFive">
                                                <div className="text-editor add-list">
                                                    <div className="addproduct-icon list">
                                                        <h5><i data-feather="list" className="add-info"></i><span>Plans tarifaires de la pièce </span></h5>
                                                        <a href="javascript:void(0);"><i data-feather="chevron-down" className="chevron-down-add"></i></a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div id="collapseFive" className="accordion-collapse collapse show" aria-labelledby="headingFive" data-bs-parent="#accordionExample5">
                                            <div className="accordion-body">
                                                <div className="tab-content" id="pills-tabContent">
                                                    <div className="tab-pane fade show active" id="pills-home" role="tabpanel"
                                                         aria-labelledby="pills-home-tab">
                                                        <div className="row">
                                                            {hotelData.plans.map((variant, index) => (
                                                                <div className="row" key={index}>
                                                                    <div className="col-lg-7 col-sm-6 col-12">
                                                                        <div className="input-blocks add-product">
                                                                            <label>Plan tarifaire</label>
                                                                            <input
                                                                                value={variant.plan_type || ""}
                                                                                onChange={(e) =>
                                                                                    handleNestedFieldChange("plans", index, "plan_type", e.target.value)
                                                                                }
                                                                                className={`form-control ${getFieldError(`plans.${index}.plan_type`) ? "is-invalid" : ""}`}
                                                                                placeholder="Plan tarifaire"/>
                                                                            {getFieldError(`plans.${index}.plan_type`) && (
                                                                                <div className="invalid-feedback">
                                                                                    {getFieldError(`plans.${index}.plan_type`)}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-lg-4 col-sm-6 col-12">
                                                                        <div className="input-blocks add-product">
                                                                            <label>Prix</label>
                                                                            <input
                                                                                type="number"
                                                                                value={variant.price || ""}
                                                                                onChange={(e) =>
                                                                                    handleNestedFieldChange("plans", index, "price", e.target.value)
                                                                                }
                                                                                className={`form-control ${getFieldError(`plans.${index}.price`) ? "is-invalid" : ""}`}
                                                                                placeholder="Prix"/>

                                                                            {getFieldError(`plans.${index}.price`) && (
                                                                                <div className="invalid-feedback">
                                                                                    {getFieldError(`plans.${index}.price`)}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-lg-1 col-sm-6 col-12">
                                                                        <div className="input-blocks add-product">
                                                                            {index !== 0 && (
                                                                                <>
                                                                                    <label style={{color:"white"}}>lll</label>
                                                                                    <button
                                                                                        onClick={() => handleRemoveItem("plans", index)}
                                                                                        className="btn btn-icon btn-danger">
                                                                                        <i className="fa fa-remove"></i>
                                                                                    </button>
                                                                                </>
                                                                            )}

                                                                        </div>

                                                                    </div>
                                                                </div>
                                                            ))}

                                                            <div className="col-auto" style={{paddingBottom:"40px"}}>
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleAddItem("plans", { plan_type: "", price: "" })
                                                                    }
                                                                    className="btn btn-primary">
                                                                    <i className="fa fa-plus-circle fa-lg me-2"></i>Tarification
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        <div className="accordion-card-one accordion" id="accordionExample6">

                            <div className="accordion-item">
                                <div className="accordion-header" id="headingSix">
                                    <div className="accordion-button" data-bs-toggle="collapse" data-bs-target="#collapseSix" aria-controls="collapseSix">
                                        <div className="addproduct-icon list">
                                            <h5><i data-feather="image" className="add-info"></i><span>Images</span></h5>
                                            <a href="javascript:void(0);"><i data-feather="chevron-down" className="chevron-down-add"></i></a>
                                        </div>
                                    </div>
                                </div>
                                <div id="collapseSix" className="accordion-collapse collapse show" aria-labelledby="headingSix" data-bs-parent="#accordionExample6">
                                    <div className="accordion-body">

                                        <div className="text-editor add-list add">
                                            <div className="col-lg-12">
                                                <div className="add-choosen">
                                                    {
                                                        isPropertiesFetched && isRoomAmenitiesFetched && isRoomDetailsFetched ? (
                                                            <>
                                                                <div className="input-blocks">
                                                                    <div className="image-upload">
                                                                        <input type="file" accept="image/*" onChange={handleImageChange}/>
                                                                        <div className="image-uploads">
                                                                            <i data-feather="plus-circle" className="plus-down-add me-0"></i>
                                                                            <h4>Add Images</h4>
                                                                        </div>
                                                                    </div>
                                                                    {savingErrors.images && (
                                                                        <div style={{
                                                                            width: '100%',
                                                                            marginTop: '0.25rem',
                                                                            fontSize: '0.875em',
                                                                            color: '#dc3545',
                                                                        }}>{savingErrors.images[0]}</div>
                                                                    )}

                                                                </div>
                                                            </>
                                                        ):(
                                                            <AddPropertyPhotoSkleton/>
                                                        )
                                                    }

                                                    {previewUrls.map((url, index) => (
                                                        <>
                                                            <div className="phone-img" key={index} >
                                                                <figure className="figure">
                                                                    <div>
                                                                        <img
                                                                            style={{height:"117px",width:"129px"}}
                                                                            className="bd-placeholder-img figure-img img-fluid rounded card-img"
                                                                            src={url}
                                                                            alt={`Preview ${index}`}/>

                                                                        <a  onClick={() => handleRemoveItem("images", index)}>
                                                                            <svg
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                width="24"
                                                                                height="24"
                                                                                viewBox="0 0 24 24"
                                                                                fill="none"
                                                                                stroke="currentColor"
                                                                                strokeWidth="2"
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                className="feather feather-x x-square-add remove-product">
                                                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                                                            </svg>
                                                                        </a>
                                                                    </div>
                                                                    {getFieldError(`images.${index}.image_url`) && (
                                                                        <figcaption  className="figure-caption" style={{color: '#dc3545'}}>
                                                                            {getFieldError(`images.${index}.image_url`)}
                                                                        </figcaption>
                                                                    )}

                                                                </figure>

                                                            </div>

                                                        </>
                                                    ))}

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-12">
                    <div className="btn-addproduct mb-4">
                        <button
                            disabled={isSaving}
                            type="submit"
                            className="btn btn-submit">
                            {isSaving && (<><span style={{marginRight:"6px"}} className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                <span className="sr-only"></span></>)}
                            Enregistrer
                        </button>
                    </div>
                </div>
            </form>


        </React.Fragment>
    );
}

export default RoomEdit;