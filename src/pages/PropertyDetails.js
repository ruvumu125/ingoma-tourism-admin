import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {getCitiesList} from "../utils/apiFunctions/cityApiFunctions";
import {getPropertyById, getPropertyDetails} from "../utils/apiFunctions/propertyApiFunctions";
import DetailsPropertyListSkleton from "../components/commons/DetailsPropertyListSkleton";
import DetailsPropertyPhotoSkleton from "../components/commons/DetailsPropertyPhotoSkleton";
import DetailsPropertyAmenityLandMarkSkleton from "../components/commons/DetailsPropertyAmenityLandMarkSkleton";
import DetailsPropertyGuestHouseVariantSkleton from "../components/commons/DetailsPropertyGuestHouseVariantSkleton";
import BASE_URL from "../config";

function PropertyDetails() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [property, setProperty] = useState({
        "id": 0,
        "name": "",
        "property_type": "",
        "description": "",
        "address": "",
        "latitude": null,
        "longitude": null,
        "is_active":"",
        "city": {
            "id": 0,
            "name": "",
            "description": "",
            "created_at": "",
            "updated_at": ""
        },
        "hotel_type": {
            "property_id": 0,
            "hotel_type_id": 0,
            "hotel_type_name": ""
        },
        "whatsapp_number1": "",
        "whatsapp_number2": "",
        "rating": 0,
        "amenities": [

        ],
        "landmarks": [

        ],
        "rules": [

        ],
        "images": [

        ],
        "created_at": "",
        "updated_at": ""
    });
    const [isLoading, setIsLoading] = useState(true);
    const [loadedImages, setLoadedImages] = useState(0);

    useEffect(() => {
        fetchPropertyDetails();
    }, [id]);

    const handleImageLoad = (index) => {
        setLoadedImages((prev) => prev + 1);
    };

    const getTranslatedPropertyType = (type) => {
        if (type === 'hotel') return 'Hôtel';
        if (type === 'guesthouse') return 'Maison de passage';
        return 'Type inconnu'; // Default if no match
    };


    const fetchPropertyDetails=() => {
        getPropertyDetails(id)
            .then((data) => {
                setProperty(data.data);

                console.log(data.data);


                if (loadedImages === property.images.length) {
                    setIsLoading(false);
                }

            })
            .catch((error) => {
                setIsLoading(true);
            })
    };

    return (
        <React.Fragment>
            <div className="page-header">
                <div className="add-item d-flex">
                    <div className="page-title">
                        <h4>Logement</h4>
                        <h6>Informations détaillées d'un logement</h6>
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
            <div className="row">
                <div className="col-xxl-3 col-xl-8 col-lg-8 col-md-8 col-sm-12">
                    <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title" style={{textTransform:"none"}}>Informations sur l'hébergement</div>
                            </div>
                            <div className="card-body">
                                <div className="productdetails">
                                    {
                                        isLoading ? (
                                            <DetailsPropertyListSkleton/>
                                        ):(
                                            <>
                                                <ul className="product-bar">

                                                    <li>
                                                        <h4>Type d'hébergement</h4>
                                                        <h6>{getTranslatedPropertyType(property.property_type)}</h6>
                                                    </li>
                                                    <li>
                                                        <h4>Nom de l'hébergement</h4>
                                                        <h6>{property.name}</h6>
                                                    </li>
                                                    {
                                                        property.property_type==="hotel" && (
                                                            <li>
                                                                <h4>Type d'hôtel</h4>
                                                                <h6>{property.hotel_type.hotel_type_name}</h6>
                                                            </li>
                                                        )
                                                    }

                                                    <li>
                                                        <h4>Ville</h4>
                                                        <h6>{property.city.name}</h6>
                                                    </li>
                                                    <li>
                                                        <h4>Adresse</h4>
                                                        <h6>{property.address}</h6>
                                                    </li>
                                                    <li>
                                                        <h4>Latitude</h4>
                                                        <h6>{property.latitude}</h6>
                                                    </li>
                                                    <li>
                                                        <h4>Longitude</h4>
                                                        <h6>{property.longitude}</h6>
                                                    </li>
                                                    <li>
                                                        <h4>Premier N° WhatsApp </h4>
                                                        <h6>{property.whatsapp_number1}</h6>
                                                    </li>
                                                    <li>
                                                        <h4>Deuxième N° WhatsApp</h4>
                                                        <h6>{property.whatsapp_number2}</h6>
                                                    </li>
                                                    <li>
                                                        <h4>Statut</h4>
                                                        <h6>
                                                            {property.is_active === 1 ? (
                                                                <span className="badge badge-linesuccess">Active</span>
                                                            ) : (
                                                                <span className="badges-inactive">Inactive</span>
                                                            )}
                                                        </h6>
                                                    </li>
                                                    <li>
                                                        <h4>Description</h4>
                                                        <h6>{property.description}</h6>
                                                    </li>
                                                </ul>
                                            </>
                                        )
                                    }

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12">
                        <div className="row">
                            <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                <div className="card">
                                    <div className="card-header">
                                        <div className="card-title" style={{textTransform:"none"}}>Commodités</div>
                                    </div>
                                    <div className="card-body">
                                        {
                                            isLoading ? (
                                                <DetailsPropertyAmenityLandMarkSkleton/>
                                            ):(
                                                <>
                                                    {property.amenities.map((amenity, index) => (
                                                        <div key={index} className="bg-light rounded flex-fill p-2" style={{marginBottom:"10px"}}>
                                                            <div className="d-flex align-items-center mb-1">
                                                                <h5>{amenity.name}</h5>
                                                            </div>
                                                            <p className="mb-1">{amenity.description}</p>
                                                        </div>
                                                    ))}
                                                </>
                                            )
                                        }

                                    </div>
                                </div>
                            </div>
                            <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                <div className="card">
                                    <div className="card-header">
                                        <div className="card-title" style={{textTransform:"none"}}>Lieux à proximité</div>
                                    </div>
                                    <div className="card-body">
                                        {
                                            isLoading ? (
                                                <DetailsPropertyAmenityLandMarkSkleton/>
                                            ):(
                                                <>
                                                    {property.landmarks.map((landmark, index) => (
                                                        <div key={index} className="bg-light rounded flex-fill p-2" style={{marginBottom:"10px"}}>
                                                            <div className="d-flex align-items-center mb-1">
                                                                <h5>{landmark.name}</h5>
                                                            </div>
                                                            <p className="mb-1">{landmark.distance}</p>
                                                        </div>
                                                    ))}
                                                </>
                                            )
                                        }

                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    {
                        property.property_type==="guesthouse" && (
                            <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                <div className="card">
                                    <div className="card-header">
                                        <div className="card-title" style={{textTransform:"none"}}>Tarification de l'hébergement</div>
                                    </div>
                                    <div className="card-body">
                                        <div className="row">

                                            {
                                                isLoading ? (
                                                    <DetailsPropertyGuestHouseVariantSkleton/>
                                                ):(
                                                    <>
                                                        {property.guest_house_variants.map((variant, index) => (
                                                            <div className="col-xl-6 col-sm-6 col-12 d-flex" key={index}>
                                                                <div className="dash-widget w-100">
                                                                    <div className="dash-widgetcontent">
                                                                        <h5>BIF<span className="counters" data-count="307144.00"> {variant.price}</span></h5>
                                                                        <h6>{variant.variant}</h6>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </>
                                                )
                                            }

                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
                <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-4 col-sm-12">
                    <div className="card">
                        <div className="card-header justify-content-between">
                            <div className="card-title" style={{textTransform:"none"}}>
                                Photos
                            </div>
                        </div>
                        <div className="card-body justify-content-between gap-2" style={{ minHeight: '300px', transition: 'height 0.3s ease-in-out', overflow: 'hidden' }} >

                            {
                                isLoading ? (
                                    <DetailsPropertyPhotoSkleton/>
                                ):(
                                    <>
                                        {property.images.map((img, index) => (
                                            <figure className="figure" key={index} style={{ display: 'inline-block', width: '100%', height: '200px',borderRadius:"4px" , backgroundColor: '#e0e0e0' }}>
                                                <img
                                                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                                    loading="lazy"
                                                    onLoad={handleImageLoad}
                                                    className="bd-placeholder-img figure-img img-fluid rounded card-img"
                                                    src={`${BASE_URL}/api/v1/property-image/${img.image_url}`}
                                                    alt="..."

                                                />
                                            </figure>
                                        ))}
                                    </>
                                )
                            }

                        </div>
                    </div>
                </div>

            </div>
        </React.Fragment>
    );
}

export default PropertyDetails;