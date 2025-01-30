import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {getPropertyDetails} from "../utils/apiFunctions/propertyApiFunctions";
import DetailsPropertyListSkleton from "../components/commons/DetailsPropertyListSkleton";
import DetailsPropertyAmenityLandMarkSkleton from "../components/commons/DetailsPropertyAmenityLandMarkSkleton";
import DetailsPropertyGuestHouseVariantSkleton from "../components/commons/DetailsPropertyGuestHouseVariantSkleton";
import DetailsPropertyPhotoSkleton from "../components/commons/DetailsPropertyPhotoSkleton";
import {getRoomDetails} from "../utils/apiFunctions/roomApiFunctions";
import BASE_URL from "../config";

function RoomDetails(props) {

    const { id } = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState({
        "id": 0,
        "type_name": "",
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
    const [isLoading, setIsLoading] = useState(true);
    const [loadedImages, setLoadedImages] = useState(0);

    useEffect(() => {
        fetchRoomDetails();
    }, [id]);

    const handleImageLoad = (index) => {
        setLoadedImages((prev) => prev + 1);
    };

    const getTranslatedPropertyType = (type) => {
        if (type === 'hotel') return 'Hôtel';
        if (type === 'guesthouse') return 'Maison de passage';
        return 'Type inconnu'; // Default if no match
    };


    const fetchRoomDetails=() => {
        getRoomDetails(id)
            .then((data) => {
                setRoom(data.data);

                console.log(data.data);


                if (loadedImages === room.images.length) {
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
                        <h4>Pièce</h4>
                        <h6>Informations détaillées sur la pièce</h6>
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
                                Liste de pièces
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
                                <div className="card-title" style={{textTransform:"none"}}>Informations sur la pièce</div>
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
                                                        <h4>Nom de la pièce</h4>
                                                        <h6>{room.type_name}</h6>
                                                    </li>
                                                    <li>
                                                        <h4>Logement</h4>
                                                        <h6>{room.property.property_name}</h6>
                                                    </li>
                                                    <li>
                                                        <h4>Type de logement</h4>
                                                        <h6>{getTranslatedPropertyType(room.property.property_type)}</h6>
                                                    </li>
                                                    <li>
                                                        <h4>Capacité d'accueil</h4>
                                                        <h6>{room.max_guests}</h6>
                                                    </li>
                                                    <li>
                                                        <h4>Superficie</h4>
                                                        <h6>{room.room_size}</h6>
                                                    </li>

                                                    <li>
                                                        <h4>Description</h4>
                                                        <h6>{room.description}</h6>
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
                            <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12">
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
                                                    {room.amenities.map((amenity, index) => (
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

                        </div>

                    </div>
                    {
                        room.property.property_type==="hotel" && (
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
                                                        {room.plans.map((variant, index) => (
                                                            <div className="col-xl-6 col-sm-6 col-12 d-flex" key={index}>
                                                                <div className="dash-widget w-100">
                                                                    <div className="dash-widgetcontent">
                                                                        <h5>BIF<span className="counters" data-count="307144.00"> {variant.price}</span></h5>
                                                                        <h6>{variant.plan_type}</h6>
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
                                        {room.images.map((img, index) => (
                                            <figure className="figure" key={index} style={{ display: 'inline-block', width: '100%', height: '200px',borderRadius:"4px" , backgroundColor: '#e0e0e0' }}>
                                                <img
                                                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                                    loading="lazy"
                                                    onLoad={handleImageLoad}
                                                    className="bd-placeholder-img figure-img img-fluid rounded card-img"
                                                    src={`${BASE_URL}/api/v1/room-image/${img.image_url}`}
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

export default RoomDetails;