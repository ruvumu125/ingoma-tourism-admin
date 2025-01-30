import React, {useEffect, useState} from 'react';
import {getAllCities} from "../utils/apiFunctions/cityApiFunctions";
import {desableProperty, enableProperty, getAllPropertiesPaginate} from "../utils/apiFunctions/propertyApiFunctions";
import ListSkleton from "../components/commons/ListSkleton";
import NoDataFound from "../components/commons/NoDataFound";
import Pagination from "../components/commons/Pagination";
import {Modal} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

function PropertyList() {

    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [isNoDataFound, setIsNoDataFound] = useState(false);
    const [isDataFound, setIsDataFound] = useState(false);
    const [fetchingError, setFetchingError] = useState(null);
    const navigate = useNavigate();
    const name = 'Aucun logement' ;

    //search
    const [searchTerm, setSearchTerm] = useState();

    //pagination
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchAllPropertiesPaginate();
    }, [page,searchTerm]);

    const fetchAllPropertiesPaginate = () => {

        getAllPropertiesPaginate(searchTerm,page)
            .then((data) => {

                console.log(data);

                setTotalPages(data.data.pagination.total_pages);
                setData(data.data.properties)
                setIsLoading(false)
                setIsDataFound(true)

            })
            .catch((error) => {

                console.log(error);
                setFetchingError(error.message)
                setIsLoading(false)

            })

    }

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setPage(1); // Reset page to 1 when search term changes
    };
    function handleCheckboxChange(id,status) {

        if (status===1){

            openDisableModal(id);
        }
        else{
            openActivateModal(id);
        }
    }

    //enable admin modal declaration
    const [showActivateModal, setShowActivateModal] = useState(false);
    const [propertyId, setPropertyId] = useState(0);
    const [isActivatingProperty, setIsActivatingProperty] = useState(false);
    const openActivateModal = (id) => {
        setPropertyId(id);
        setShowActivateModal(true);
    }

    //desable admin modal declaration
    const [showDisableModal, setShowDisableModal] = useState(false);
    const [isDisablingProperty, setIsDisablingProperty] = useState(false);
    const openDisableModal = (id) => {
        setPropertyId(id);
        setShowDisableModal(true);
    }

    const handleActivateProperty = async (e) => {
        setIsActivatingProperty(true);
        try {
            const success = await enableProperty(propertyId);

            if (success !== undefined) {

                setShowActivateModal(false);
                setIsActivatingProperty(false);
                fetchAllPropertiesPaginate();

                //Toast
                toast.success("Activer avec succès",{
                    position: "top-right",
                    autoClose: 2500,
                    hideProgressBar: true,
                    closeOnClick:true,
                    pauseOnHover:true,
                    draggable:true,
                    progress:undefined,
                    theme:"colored"
                });
            } else {

                setShowActivateModal(false);
                setIsActivatingProperty(false);
                fetchAllPropertiesPaginate();

                //Toast
                toast.error("Impossible de Supprimer cette entreprise ",{
                    position: "top-right",
                    autoClose: 3500,
                    hideProgressBar: true,
                    closeOnClick:true,
                    pauseOnHover:true,
                    draggable:true,
                    progress:undefined,
                    theme:"colored"
                });
            }
        } catch (error) {

            setShowActivateModal(false);
            setIsActivatingProperty(false);
            fetchAllPropertiesPaginate();

            //Toast
            toast.error("Impossible de Supprimer cette entreprise ",{
                position: "top-right",
                autoClose: 3500,
                hideProgressBar: true,
                closeOnClick:true,
                pauseOnHover:true,
                draggable:true,
                progress:undefined,
                theme:"colored"
            });
        }
    }

    const handleDesableProperty = async (e) => {
        setIsDisablingProperty(true);
        try {
            const success = await desableProperty(propertyId);

            if (success !== undefined) {

                setShowDisableModal(false);
                setIsDisablingProperty(false);
                fetchAllPropertiesPaginate();

                //Toast
                toast.success("Désactiver avec succès",{
                    position: "top-right",
                    autoClose: 2500,
                    hideProgressBar: true,
                    closeOnClick:true,
                    pauseOnHover:true,
                    draggable:true,
                    progress:undefined,
                    theme:"colored"
                });
            } else {

                setShowDisableModal(false);
                setIsDisablingProperty(false);
                fetchAllPropertiesPaginate();

                //Toast
                toast.error("Impossible bas",{
                    position: "top-right",
                    autoClose: 3500,
                    hideProgressBar: true,
                    closeOnClick:true,
                    pauseOnHover:true,
                    draggable:true,
                    progress:undefined,
                    theme:"colored"
                });
            }
        } catch (error) {

            setShowDisableModal(false);
            setIsDisablingProperty(false);
            fetchAllPropertiesPaginate();

            //Toast
            toast.error("Impossible bassi ",{
                position: "top-right",
                autoClose: 3500,
                hideProgressBar: true,
                closeOnClick:true,
                pauseOnHover:true,
                draggable:true,
                progress:undefined,
                theme:"colored"
            });
        }
    }

    return (
        <React.Fragment>
            <div className="page-header">
                <div className="add-item d-flex">
                    <div className="page-title">
                        <h4>Logement</h4>
                        <h6>Gérer des logements</h6>
                    </div>
                </div>
                <div className="page-btn">

                    <a
                        onClick={() => navigate(`/property-add`)}
                        className="btn btn-secondary">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-plus-circle me-2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="16"></line>
                            <line x1="8" y1="12" x2="16" y2="12"></line>
                        </svg>
                        Nouveau logement
                    </a>

                </div>
            </div>

            <div className="card table-list-card">
                <div className="card-body">
                    {
                        isLoading ? (<ListSkleton title="Liste de logements"/>):(
                            <>
                                <div className="row" style={{padding:"20px 20px 20px"}}>
                                    <div className="col-lg-7 col-sm-6 col-12" style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        textAlign: 'center',
                                    }}>
                                        <h4>Liste de logements</h4>
                                    </div>
                                    <br/><br/>
                                    <div className="col-lg-5 col-sm-6 col-12">
                                        <div className="input-icon-start position-relative">
                                        <span className="input-icon-addon">
                                            <i className="ti ti-search"></i>
                                        </span>
                                            <input
                                                value={searchTerm}
                                                onChange={handleSearchChange}
                                                type="text"
                                                className="form-control"
                                                placeholder="Rechercher un logement par nom, type, ville"/>
                                        </div>
                                    </div>
                                </div>

                                {
                                    data.length===0 ?(<NoDataFound name={name}/>):(
                                        <>
                                            <div className="table-responsive">
                                                <table className="table">
                                                    <thead>
                                                    <tr>
                                                        <th>Nom du logement</th>
                                                        <th>Type de logement</th>
                                                        <th>Ville</th>
                                                        <th>Statut</th>
                                                        <th>Activer/Désactiver</th>
                                                        <th className="no-sort">Action</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {
                                                        data.map((company) => {

                                                            let property_type="";
                                                            if (company.property_type === "hotel") {
                                                                property_type="Hôtel";
                                                            }else if (company.property_type === "guesthouse") {
                                                                property_type="Maison de passage";
                                                            }

                                                            return(
                                                                <tr key={company.id}>
                                                                    <td>{company.name}</td>
                                                                    <td>{property_type}</td>
                                                                    <td>{company.city.name}</td>
                                                                    <td>
                                                                        {company.is_active === 1 ? (
                                                                            <span className="badge badge-linesuccess">Active</span>
                                                                        ) : (
                                                                            <span className="badges-inactive">Inactive</span>
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        <label className="checkboxs">
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={company.is_active === 1}
                                                                                onChange={() => handleCheckboxChange(company.id,company.is_active)}
                                                                            />
                                                                            <span className="checkmarks"></span>
                                                                        </label>
                                                                    </td>
                                                                    <td className="action-table-data">
                                                                        <div className="edit-delete-action">

                                                                            <a
                                                                                onClick={() => navigate(`/property-edit/${company.id}`)}
                                                                                className="me-2 p-2">
                                                                                <svg
                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                    width="24" height="24"
                                                                                    viewBox="0 0 24 24"
                                                                                    fill="none"
                                                                                    stroke="currentColor"
                                                                                    strokeWidth="2"
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                    className="feather feather-edit">
                                                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                                                </svg>
                                                                            </a>
                                                                            <a
                                                                                onClick={() => navigate(`/property-details/${company.id}`)}
                                                                                className="me-2 edit-icon  p-2">
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
                                                                                    className="feather feather-eye">
                                                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                                                    <circle cx="12" cy="12" r="3"></circle>
                                                                                </svg>
                                                                            </a>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="all_tables_pagination">
                                                <Pagination
                                                    totalPages={totalPages}
                                                    currentPage={page}
                                                    onPageChange={handlePageChange}
                                                />
                                            </div>
                                        </>


                                    )
                                }
                            </>
                        )
                    }
                </div>
            </div>

            {/*activate property modal*/}
            <Modal show={showActivateModal} onHide={() => setShowActivateModal(false)} size="sm">
                <Modal.Body className="modal-body p-4">
                    <div className="text-center">
                        <i className="dripicons-information h1 text-info"></i>
                        <h4 className="mt-2">Confirmation!</h4>
                        <p className="mt-3">Voulez-vous vraiment activer ce logement  ?</p>
                        <div className="modal-footer-btn">

                            <button
                                disabled={isActivatingProperty}
                                onClick={handleActivateProperty}
                                type="button"
                                className="btn btn-danger">
                                {isActivatingProperty && (<><span style={{marginRight:"6px"}} className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    <span className="sr-only"></span></>)}
                                Activer
                            </button>
                            <button
                                onClick={() => setShowActivateModal(false)}
                                style={{marginLeft:"10px"}}
                                type="button"
                                className="btn btn-cancel me-2">Annuler</button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            {/*disable property modal*/}
            <Modal show={showDisableModal} onHide={() => setShowDisableModal(false)} size="sm">
                <Modal.Body className="modal-body p-4">
                    <div className="text-center">
                        <i className="dripicons-information h1 text-info"></i>
                        <h4 className="mt-2">Confirmation!</h4>
                        <p className="mt-3">Voulez-vous vraiment désactiver ce logement  ?</p>
                        <div className="modal-footer-btn">

                            <button
                                disabled={isDisablingProperty}
                                onClick={handleDesableProperty}
                                type="button"
                                className="btn btn-danger">
                                {isDisablingProperty && (<><span style={{marginRight:"6px"}} className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    <span className="sr-only"></span></>)}
                                Désactiver
                            </button>
                            <button
                                onClick={() => setShowDisableModal(false)}
                                style={{marginLeft:"10px"}}
                                type="button"
                                className="btn btn-cancel me-2">Annuler</button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

        </React.Fragment>
    );
}

export default PropertyList;