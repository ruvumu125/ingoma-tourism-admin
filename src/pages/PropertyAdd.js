import React, {useEffect, useState} from 'react';
import {getCitiesList} from "../utils/apiFunctions/cityApiFunctions";
import {getHotelTypesList} from "../utils/apiFunctions/hotelTypeApiFunctions";
import {getPropertyAmenitiesList} from "../utils/apiFunctions/amenityApiFunctions";
import {addProperty} from "../utils/apiFunctions/propertyApiFunctions";
import AddPropertyInfoProperySkleton from "../components/commons/AddPropertyInfoProperySkleton";
import AddPropertyAmenityPropertySkleton from "../components/commons/AddPropertyAmenityPropertySkleton";
import AddPropertyRulePropertySkleton from "../components/commons/AddPropertyRulePropertySkleton";
import AddPropertyLandMarkSkleton from "../components/commons/AddPropertyLandMarkSkleton";
import AddPropertyPhotoSkleton from "../components/commons/AddPropertyPhotoSkleton";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";

function PropertyAdd() {
    
    //general declarations
    const navigate = useNavigate();
    const [isCitiesFetched, setIsCitiesFetched] = useState(false);
    const [isHotelTypesFetched, setIsHotelTypesFetched] = useState(false);
    const [isHotelAmenities, setIsHotelAmenities] = useState(false);

    //selector city declaration
    const [cities, setCities] = useState([]);
    const [selectedCityId, setSelectedCityId] = useState('');
    const [selectedCityName, setSelectedCityName] = useState("---Sélectionner une ville---");

    const [hotelTypes, setHotelTypes] = useState([]);
    const [selectedHotelTypeId, setSelectedHotelTypeId] = useState('');
    const [selectedHotelTypeName, setSelectedHotelTypeName] = useState("---Sélectionner un type d'hôtel---");

    const [propertyAmenities, setPropertyAmenities] = useState([]);
    const [selectedPropertyAmenityId, setSelectedPropertyAmenityId] = useState('');
    const [selectedPropertyAmenityName, setSelectedPropertyAmenityName] = useState("---Sélectionner une commodité---");

    //saving/update declaration
    const [savingErrors, setSavingErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    //images
    const [previewUrls, setPreviewUrls] = useState([]);

    const [hotelData, setHotelData] = useState({
        name: "",
        description: "",
        address: "",
        city_id: "",
        property_type: "",
        hotel_type: "",
        whatsapp_number1: "",
        whatsapp_number2: "",
        rating: "0",
        amenities: [
            {"amenity_id": "", "description": "" }
        ],
        landmarks: [
            {"name": "", "distance": ""}
        ],
        rules: [
            { "rule_description": "" }
        ],
        images: [],
        guest_house_variants: [
            {"variant": "", "price": "" },
        ],
    });

    useEffect(() => {
        fetchCities();
        fetchHotelTypes();
        fetchPropertyAmenitiesList();
    }, []);

    const fetchCities=() => {
        getCitiesList()
            .then((data) => {
                setCities(data.data)
                setIsCitiesFetched(true);

            })
            .catch((error) => {
                setIsCitiesFetched(false);
            })
    };

    const fetchHotelTypes=() => {
        getHotelTypesList()
            .then((data) => {
                setHotelTypes(data.data);
                setIsHotelTypesFetched(true);

            })
            .catch((error) => {
                setIsHotelTypesFetched(false);
            })
    };

    const fetchPropertyAmenitiesList=() => {
        getPropertyAmenitiesList()
            .then((data) => {
                console.log(data);
                setPropertyAmenities(data.data);
                setIsHotelAmenities(true);

            })
            .catch((error) => {
                setIsHotelAmenities(false);
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
        saveNewProperty().then(() => console.log("Property saved successfully"))
            .catch((error) => console.error("Error in handleSubmit:", error));
    };

    const moveToTop = () => {
        window.scrollTo(0, 0); // Scroll to the top of the page
    };

    const saveNewProperty = async () => {

        setIsSaving(true);

        try {
            const success = await addProperty(hotelData);

            if (success !== undefined) {

                setHotelData({
                    name: "",
                    description: "",
                    address: "",
                    city_id: "",
                    property_type: "",
                    hotel_type: "",
                    whatsapp_number1: "",
                    whatsapp_number2: "",
                    rating: "0",
                    amenities: [
                        {"amenity_id": "", "description": "" }
                    ],
                    landmarks: [
                        {"name": "", "distance": ""}
                    ],
                    rules: [
                        { "rule_description": "" }
                    ],
                    images: [],
                    guest_house_variants: [
                        {"variant": "", "price": "" },
                    ],
                })
                setSavingErrors({});
                setIsSaving(false);

                // Toast
                toast.success("Enregistré avec succès", {
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
                        <h4>Logement</h4>
                        <h6>Créer un nouveau logement</h6>
                    </div>
                </div>
                <ul className="table-top-head">
                    <li>
                        <div className="page-btn">
                            <a
                                onClick={() => navigate(`/properties`)}
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
                                Liste de logements
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
                                            <h5><i data-feather="info" className="add-info"></i><span>Informations sur l'hébergement</span></h5>
                                            <a href="javascript:void(0);"><i data-feather="chevron-down" className="chevron-down-add"></i></a>
                                        </div>
                                    </div>
                                </div>
                                <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                    <div className="accordion-body">
                                        {
                                            isCitiesFetched && isHotelTypesFetched && isHotelAmenities ? (
                                                <>
                                                    <div className="row">
                                                        <div className="col-12 col-sm-12 col-md-4 col-lg-4">
                                                            <div className="mb-3 add-product">
                                                                <label className="form-label">Type d'hébergement <code>*</code></label>
                                                                <select
                                                                    name="property_type"
                                                                    value={hotelData.property_type}
                                                                    onChange={handleInputChange}
                                                                    className={`form-select ${savingErrors.property_type ? "is-invalid" : ""}`}>

                                                                    <option value="">---- Sélectionner un type hébergement ----</option>
                                                                    <option value="hotel">Hôtel</option>
                                                                    <option value="guesthouse">Maison de passage</option>
                                                                </select>
                                                                {savingErrors.property_type && (
                                                                    <div className="invalid-feedback">{savingErrors.property_type[0]}</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="col-12 col-sm-12 col-md-4 col-lg-4">
                                                            <div className="mb-3 add-product">
                                                                <label className="form-label">Nom de l'hébergement <code>*</code></label>
                                                                <input
                                                                    name="name"
                                                                    value={hotelData.name}
                                                                    onChange={handleInputChange}
                                                                    type="text"
                                                                    className={`form-control ${savingErrors.name ? "is-invalid" : ""}`}
                                                                    placeholder="Nom de l'hébergement"/>

                                                                    {savingErrors.name && (
                                                                        <div className="invalid-feedback">{savingErrors.name[0]}</div>
                                                                    )}
                                                            </div>
                                                        </div>
                                                        <div className="col-12 col-sm-12 col-md-4 col-lg-4">
                                                            <div className="mb-3 add-product">
                                                                <label className="form-label">Ville <code>*</code></label>
                                                                <select
                                                                    name="city_id"
                                                                    value={hotelData.city_id}
                                                                    onChange={handleInputChange}
                                                                    className={`form-select ${savingErrors.city_id ? "is-invalid" : ""}`}>
                                                                    <option value={selectedCityId}>{selectedCityName}</option>
                                                                    {
                                                                        cities.map((city, index) => (
                                                                            <option
                                                                                key={index}
                                                                                value={city.id}
                                                                                selected={city.id===selectedCityId}
                                                                            >{city.name}</option>                                                        ))
                                                                    }
                                                                </select>
                                                                {savingErrors.city_id && (
                                                                    <div className="invalid-feedback">{savingErrors.city_id[0]}</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-12 col-sm-12 col-md-4 col-lg-4">
                                                            <div className="mb-3 add-product">
                                                                <label className="form-label">Adresse <code>*</code></label>
                                                                <input
                                                                    name="address"
                                                                    value={hotelData.address}
                                                                    onChange={handleInputChange}
                                                                    type="text"
                                                                    className={`form-control ${savingErrors.address ? "is-invalid" : ""}`}
                                                                    placeholder="Adresse où se situe l'hébergement"/>
                                                                    {savingErrors.address && (
                                                                        <div className="invalid-feedback">{savingErrors.address[0]}</div>
                                                                    )}
                                                            </div>
                                                        </div>
                                                        <div className="col-12 col-sm-12 col-md-4 col-lg-4">
                                                            <div className="mb-3 add-product">
                                                                <label className="form-label">Latitude</label>
                                                                <input
                                                                    type="text"
                                                                    name="latitude"
                                                                    value={hotelData.latitude}
                                                                    onChange={handleInputChange}
                                                                    className="form-control"
                                                                    placeholder="Latitude de l'hébergement"/>
                                                            </div>
                                                        </div>
                                                        <div className="col-12 col-sm-12 col-md-4 col-lg-4">
                                                            <div className="mb-3 add-product">
                                                                <label className="form-label">Longitude</label>
                                                                <input
                                                                    type="text"
                                                                    name="longitude"
                                                                    value={hotelData.longitude}
                                                                    onChange={handleInputChange}
                                                                    className="form-control"
                                                                    placeholder="Longitude de l'hébergement "/>
                                                            </div>
                                                        </div>

                                                    </div>
                                                    <div className="row">

                                                        <div className="col-12 col-sm-12 col-md-4 col-lg-4">
                                                            <div className="input-blocks add-product list">
                                                                <label>Premier numéro WhatsApp <code>*</code></label>
                                                                <input
                                                                    name="whatsapp_number1"
                                                                    value={hotelData.whatsapp_number1}
                                                                    onChange={handleInputChange}
                                                                    className={`form-control ${savingErrors.whatsapp_number1 ? "is-invalid" : ""}`}
                                                                    placeholder="Premier numéro WhatsApp du personne de contact"/>

                                                                    {savingErrors.whatsapp_number1 && (
                                                                        <div className="invalid-feedback">{savingErrors.whatsapp_number1[0]}</div>
                                                                    )}
                                                            </div>
                                                        </div>
                                                        <div className="col-12 col-sm-12 col-md-4 col-lg-4">
                                                            <div className="mb-3 add-product">
                                                                <div className="add-newplus">
                                                                    <label className="form-label">Deuxième numéro WhatsApp</label>
                                                                </div>
                                                                <input
                                                                    type="text"
                                                                    name="whatsapp_number2"
                                                                    value={hotelData.whatsapp_number2}
                                                                    onChange={handleInputChange}
                                                                    className="form-control"
                                                                    placeholder="Deuxième numéro WhatsApp du personne de contact"/>
                                                            </div>
                                                        </div>
                                                        {
                                                            hotelData.property_type==="hotel" && (
                                                                <div className="col-12 col-sm-12 col-md-4 col-lg-4">
                                                                    <div className="mb-3 add-product">
                                                                        <label className="form-label">Type d'hôtel <code>*</code></label>
                                                                        <select
                                                                            name="hotel_type"
                                                                            value={hotelData.hotel_type}
                                                                            onChange={handleInputChange}
                                                                            className={`form-select ${savingErrors.whatsapp_number1 ? "is-invalid" : ""}`}>

                                                                            <option value={selectedHotelTypeId}>{selectedHotelTypeName}</option>
                                                                            {
                                                                                hotelTypes.map((hotel_type, index) => (
                                                                                    <option
                                                                                        key={index}
                                                                                        value={hotel_type.id}
                                                                                        selected={hotel_type.id===selectedHotelTypeId}
                                                                                    >{hotel_type.type_name}</option>                                                        ))
                                                                            }
                                                                        </select>
                                                                        {savingErrors.hotel_type && (
                                                                            <div className="invalid-feedback">{savingErrors.hotel_type[0]}</div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )
                                                        }

                                                    </div>
                                                    <div className="addservice-info">
                                                        <div className="row">
                                                            <div className="col-12 col-sm-12 col-md-12 col-lg-12">
                                                                <div className="mb-3 add-product">
                                                                    <label className="form-label">Description de l'hébergement <code>*</code></label>
                                                                    <textarea
                                                                        rows="5"
                                                                        cols="5"
                                                                        name="description"
                                                                        value={hotelData.description}
                                                                        onChange={handleInputChange}
                                                                        className={`form-control ${savingErrors.description ? "is-invalid" : ""}`}
                                                                        placeholder="Description de l'hébergement">
                                                                    </textarea>
                                                                    {savingErrors.description && (
                                                                        <div className="invalid-feedback">{savingErrors.description[0]}</div>
                                                                    )}
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
                                                <h5><i data-feather="life-buoy" className="add-info"></i><span>Commodités de l'hébergement</span></h5>
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
                                                    isCitiesFetched && isHotelTypesFetched && isHotelAmenities ? (
                                                        <>
                                                            <div className="row">

                                                                {hotelData.amenities.map((amenity, index) => (
                                                                    <div className="row" key={index}>
                                                                        <div className="col-lg-4 col-sm-6 col-12">
                                                                            <div className="input-blocks add-product">
                                                                                <label>Commodité <code>*</code></label>
                                                                                <select
                                                                                    value={amenity.amenity_id || ""}
                                                                                    onChange={(e) =>
                                                                                        handleNestedFieldChange("amenities", index, "amenity_id", e.target.value)
                                                                                    }
                                                                                    className={`form-select ${getFieldError(`amenities.${index}.amenity_id`) ? "is-invalid" : ""}`}
                                                                                    id="autoSizingSelect" >
                                                                                    <option value={selectedPropertyAmenityId}>{selectedPropertyAmenityName}</option>
                                                                                    {
                                                                                        propertyAmenities.map((amenity, index) => (
                                                                                            <option
                                                                                                key={index}
                                                                                                value={amenity.id}
                                                                                                selected={amenity.id===selectedPropertyAmenityId}
                                                                                            >{amenity.name}</option>                                                        ))
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

                        <div className="accordion-card-one accordion" id="accordionExample3">
                            <div className="accordion-item">
                                <div className="accordion-header" id="headingThree">
                                    <div className="accordion-button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-controls="collapseTwo">
                                        <div className="text-editor add-list">
                                            <div className="addproduct-icon list icon">
                                                <h5><i data-feather="life-buoy" className="add-info"></i><span>Règles de l'hébergement</span></h5>
                                                <a href="javascript:void(0);"><i data-feather="chevron-down" className="chevron-down-add"></i></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div id="collapseThree" className="accordion-collapse collapse show" aria-labelledby="headingTwo" data-bs-parent="#accordionExample2">
                                    <div className="accordion-body">
                                        <div className="tab-content" id="pills-tabContent">
                                            <div className="tab-pane fade show active" id="pills-home" role="tabpanel"
                                                 aria-labelledby="pills-home-tab">
                                                {
                                                    isCitiesFetched && isHotelTypesFetched && isHotelAmenities ? (
                                                        <>
                                                            <div className="row">


                                                                {hotelData.rules.map((rule, index) => (
                                                                    <div className="row" key={index}>
                                                                        <div className="col-lg-11 col-sm-11 col-12">
                                                                            <div className="input-blocks add-product">
                                                                                <label>Règle <code>*</code></label>
                                                                                <input
                                                                                    name="rule_description"
                                                                                    value={rule.rule_description || ""}
                                                                                    onChange={(e) =>
                                                                                        handleNestedFieldChange("rules", index, "rule_description", e.target.value)
                                                                                    }
                                                                                    className={`form-control ${getFieldError(`rules.${index}.rule_description`) ? "is-invalid" : ""}`}
                                                                                    placeholder="Règle"/>
                                                                                    {getFieldError(`rules.${index}.rule_description`) && (
                                                                                        <div className="invalid-feedback">
                                                                                            {getFieldError(`rules.${index}.rule_description`)}
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
                                                                                            onClick={() => handleRemoveItem("rules", index)}
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
                                                                        onClick={() => handleAddItem("rules", { rule_description: "" })}
                                                                        type="button"
                                                                        className="btn btn-primary">
                                                                        <i className="fa fa-plus-circle fa-lg me-2"></i>Règle
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </>
                                                    ):(
                                                        <AddPropertyRulePropertySkleton/>
                                                    )
                                                }
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="accordion-card-one accordion" id="accordionExample4">
                            <div className="accordion-item">

                                <div className="accordion-header" id="headingFour">
                                    <div className="accordion-button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-controls="collapseFour">
                                        <div className="text-editor add-list">
                                            <div className="addproduct-icon list">
                                                <h5><i data-feather="list" className="add-info"></i><span>Lieux à proximité de l'hébergement</span></h5>
                                                <a href="javascript:void(0);"><i data-feather="chevron-down" className="chevron-down-add"></i></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div id="collapseFour" className="accordion-collapse collapse show" aria-labelledby="headingFour" data-bs-parent="#accordionExample4">
                                    <div className="accordion-body">
                                        <div className="tab-content" id="pills-tabContent">
                                            <div className="tab-pane fade show active" id="pills-home" role="tabpanel"
                                                 aria-labelledby="pills-home-tab">
                                                {
                                                    isCitiesFetched && isHotelTypesFetched && isHotelAmenities ? (
                                                        <>
                                                            <div className="row">

                                                                {hotelData.landmarks.map((landmark, index) => (
                                                                    <div className="row" key={index}>
                                                                        <div className="col-lg-4 col-sm-6 col-12">
                                                                            <div className="input-blocks add-product">
                                                                                <label>Lieu à proximité <code>*</code></label>
                                                                                <input
                                                                                    value={landmark.name || ""}
                                                                                    onChange={(e) =>
                                                                                        handleNestedFieldChange("landmarks", index, "name", e.target.value)
                                                                                    }
                                                                                    className={`form-control ${getFieldError(`landmarks.${index}.name`) ? "is-invalid" : ""}`}
                                                                                    placeholder="Lieu à proximité"/>
                                                                                    {getFieldError(`landmarks.${index}.name`) && (
                                                                                        <div className="invalid-feedback">
                                                                                            {getFieldError(`landmarks.${index}.name`)}
                                                                                        </div>
                                                                                    )}
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-lg-7 col-sm-6 col-12">
                                                                            <div className="input-blocks add-product">
                                                                                <label>Distance <code>*</code></label>
                                                                                <input
                                                                                    value={landmark.distance || ""}
                                                                                    onChange={(e) =>
                                                                                        handleNestedFieldChange("landmarks", index, "distance", e.target.value)
                                                                                    }
                                                                                    className={`form-control ${getFieldError(`landmarks.${index}.distance`) ? "is-invalid" : ""}`}
                                                                                    placeholder="Distance"
                                                                                />
                                                                                {getFieldError(`landmarks.${index}.distance`) && (
                                                                                    <div className="invalid-feedback">
                                                                                        {getFieldError(`landmarks.${index}.distance`)}
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
                                                                                            onClick={() => handleRemoveItem("landmarks", index)}
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
                                                                        onClick={() => handleAddItem("landmarks", { name: "", distance: "" })}
                                                                        className="btn btn-primary">
                                                                        <i className="fa fa-plus-circle fa-lg me-2"></i>Lieu à proximité
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </>
                                                    ):(
                                                        <AddPropertyLandMarkSkleton/>
                                                    )
                                                }

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {
                            hotelData.property_type==="guesthouse" && (
                                <div className="accordion-card-one accordion" id="accordionExample5">
                                    <div className="accordion-item">

                                        <div className="accordion-header" id="headingFive">
                                            <div className="accordion-button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-controls="collapseFive">
                                                <div className="text-editor add-list">
                                                    <div className="addproduct-icon list">
                                                        <h5><i data-feather="list" className="add-info"></i><span>Tarification de l'hébergement</span></h5>
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
                                                            {hotelData.guest_house_variants.map((variant, index) => (
                                                                <div className="row" key={index}>
                                                                    <div className="col-lg-7 col-sm-6 col-12">
                                                                        <div className="input-blocks add-product">
                                                                            <label>Description de la tarification</label>
                                                                            <input
                                                                                value={variant.variant || ""}
                                                                                onChange={(e) =>
                                                                                    handleNestedFieldChange("guest_house_variants", index, "variant", e.target.value)
                                                                                }
                                                                                className={`form-control ${getFieldError(`guest_house_variants.${index}.variant`) ? "is-invalid" : ""}`}
                                                                                placeholder="Description de la tarification"/>
                                                                                {getFieldError(`guest_house_variants.${index}.variant`) && (
                                                                                    <div className="invalid-feedback">
                                                                                        {getFieldError(`guest_house_variants.${index}.variant`)}
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
                                                                                    handleNestedFieldChange("guest_house_variants", index, "price", e.target.value)
                                                                                }
                                                                                className={`form-control ${getFieldError(`guest_house_variants.${index}.price`) ? "is-invalid" : ""}`}
                                                                                placeholder="Prix"/>

                                                                                {getFieldError(`guest_house_variants.${index}.price`) && (
                                                                                    <div className="invalid-feedback">
                                                                                        {getFieldError(`guest_house_variants.${index}.price`)}
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
                                                                                        onClick={() => handleRemoveItem("guest_house_variants", index)}
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
                                                                        handleAddItem("guest_house_variants", { variant: "", price: "" })
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
                                                        isCitiesFetched && isHotelTypesFetched && isHotelAmenities ? (
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

export default PropertyAdd;