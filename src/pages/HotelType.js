import React, {useEffect, useState} from 'react';
import {toast} from "react-toastify";
import ListSkleton from "../components/commons/ListSkleton";
import NoDataFound from "../components/commons/NoDataFound";
import Pagination from "../components/commons/Pagination";
import {Modal} from "react-bootstrap";
import {
    addHotelType,
    deleteHotelType,
    getAllHotelTypes,
    updateHotelType
} from "../utils/apiFunctions/hotelTypeApiFunctions";

function HotelType() {

    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [isNoDataFound, setIsNoDataFound] = useState(false);
    const [isDataFound, setIsDataFound] = useState(false);
    const [fetchingError, setFetchingError] = useState(null);
    const name = 'Aucun type d\'hôtel' ;

    //modal declaration
    const [operation, setOperation] = useState(1);
    const [modalTitle, setModalTitle] = useState("");
    const [showSaveEditModal, setShowSaveEditModal] = useState(false);

    //saving/update declaration
    const [savingErrors, setSavingErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    //update declaration
    const [hotelTypeIdUpdate, setHotelTypeIdUpdate] = useState(0);

    //delete declaration
    const [idHotelType, setIdHotelType] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    //search
    const [searchTerm, setSearchTerm] = useState();
    const [newHotelType, setNewHotelType] = useState({
        "type_name": "",
        "description": ""
    })
    //pagination
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchHotelTypes();
    }, [page,searchTerm]);

    const fetchHotelTypes = () => {

        getAllHotelTypes(searchTerm,page)
            .then((data) => {

                setTotalPages(data.data.pagination.total_pages);
                setData(data.data.hotel_types)
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

    const openAddEditModal = (op,id,type_name,description) => {

        setOperation(op);
        setSavingErrors({});

        if (op===1){
            setOperation(1);
            setShowSaveEditModal(true);
            setModalTitle("Créer un type d'hôtel");
        }
        else if (op===2){
            setOperation(2);
            setShowSaveEditModal(true);
            setModalTitle("Modifier un type d'hôtel");
            setHotelTypeIdUpdate(id);
            setNewHotelType({
                "type_name":type_name,
                "description":description
            });

        }

    }

    const openDeleteModal = (id) => {
        setIdHotelType(id);
        setShowModal(true);
    }

    const handleCloseModal = () => {
        fetchHotelTypes();
        setNewHotelType({
            "type_name": "",
            "description": ""
        });
        setSavingErrors({});
    }

    const handleCompanyInputChange = (e) => {
        const { name, value } = e.target
        setNewHotelType({ ...newHotelType, [name]: value })

        // Clear the error for the current field
        setSavingErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[name]; // Remove the specific field's error
            return newErrors;
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent page reload

        if (operation === 1) {
            saveNewHotelType().then(() => console.log("Company saved successfully"))
                .catch((error) => console.error("Error in handleSubmit:", error));
        } else {

            updateGivenHotelType().then(() => console.log("Company updated successfully"))
                .catch((error) => console.error("Error in handleSubmit:", error));
        }
    };

    const saveNewHotelType = async () => {

        setIsSaving(true);
        try {
            const success = await addHotelType(newHotelType.type_name, newHotelType.description);

            if (success !== undefined) {
                setNewHotelType({
                    "type_name": "",
                    "description": ""
                });
                setSavingErrors({});
                setIsSaving(false);
                setShowSaveEditModal(false);
                fetchHotelTypes();

                let msg = "Enregistré avec succès";

                // Toast
                toast.success(msg, {
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
        }
    };

    const updateGivenHotelType = async () => {

        setIsSaving(true);
        try {
            const success = await updateHotelType(hotelTypeIdUpdate,newHotelType.type_name, newHotelType.description);

            if (success !== undefined) {
                setNewHotelType({
                    "type_name": "",
                    "description": ""
                });
                setSavingErrors({});
                setIsSaving(false);
                setShowSaveEditModal(false);
                fetchHotelTypes();

                let msg = "Modifié avec succès";

                // Toast
                toast.success(msg, {
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
            setSavingErrors({});
            setSavingErrors(error.response?.data?.data || {});
            console.log(error.response?.data?.data || {});
            setIsSaving(false);
        }
    };


    const handleDelete = async (e) => {
        setIsDeleting(true);
        try {
            const result = await deleteHotelType(idHotelType);

            if (result)
            {

                setShowModal(false);
                setIsDeleting(false);
                fetchHotelTypes();

                //Toast
                toast.success("Supprimer avec succès",{
                    position: "top-right",
                    autoClose: 2500,
                    hideProgressBar: true,
                    closeOnClick:true,
                    pauseOnHover:true,
                    draggable:true,
                    progress:undefined,
                    theme:"colored"
                });
            }
            else
            {

                setShowModal(false);
                setIsDeleting(false);
                fetchHotelTypes();

                //Toast
                toast.error("Impossible de Supprimer cette catégorie d'équipement ",{
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

            setShowModal(false);
            setIsDeleting(false);
            fetchHotelTypes();

            //Toast
            toast.error("Impossible de Supprimer ce type d'hôtel",{
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
                        <h4>Type d'hôtel</h4>
                        <h6>Gérer des types d'hôtels</h6>
                    </div>
                </div>
                <div className="page-btn">
                    <a
                        onClick={() =>openAddEditModal(1) }
                        className="btn btn-added">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24" height="24"
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
                        </svg>Nouveau type d'hôtel
                    </a>
                </div>
            </div>


            <div className="card table-list-card">
                <div className="card-body">
                    {
                        isLoading ? (<ListSkleton title="Liste d'entreprises"/>):(
                            <>
                                <div className="table-top">
                                    <div className="search-set">
                                        <h4>Liste de types d'hôtels</h4>

                                    </div>

                                    <div className="search-path">
                                        <input
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                            placeholder="Chercher une entreprise"
                                            type="text"
                                            className="form-control"/>
                                    </div>

                                </div>

                                {
                                    data.length===0 ?(<NoDataFound name={name}/>):(
                                        <>
                                            <div className="table-responsive">
                                                <table className="table">
                                                    <thead>
                                                    <tr>
                                                        <th>Type d'hôtel</th>
                                                        <th>Description</th>
                                                        <th className="no-sort">Action</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {
                                                        data.map((company) => {


                                                            return(
                                                                <tr key={company.id}>
                                                                    <td>{company.type_name}</td>
                                                                    <td>{company.description}</td>
                                                                    <td className="action-table-data">
                                                                        <div className="edit-delete-action">

                                                                            <a
                                                                                onClick={(e) =>  openAddEditModal(2,company.id,company.type_name,company.description) }
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
                                                                                onClick={(e)=>openDeleteModal(company.id)}
                                                                                className="confirm-text-updated p-2">

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
                                                                                    className="feather feather-trash-2">
                                                                                    <polyline points="3 6 5 6 21 6"></polyline>
                                                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                                                    <line x1="10" y1="11" x2="10" y2="17"></line>
                                                                                    <line x1="14" y1="11" x2="14" y2="17"></line>
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

            <Modal show={showSaveEditModal} onHide={() => setShowSaveEditModal(false)} size="md" backdrop="static" centered>

                <Modal.Header closeButton>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Nom de la catégorie d'équipement</label>
                            <input
                                id="type_name"
                                name="type_name"
                                value={newHotelType.type_name}
                                onChange={handleCompanyInputChange}
                                type="text"
                                className={`form-control ${savingErrors.type_name ? "is-invalid" : ""}`}
                                placeholder="Nom de la catégorie d'équipement"/>

                            {savingErrors.type_name && (
                                <div className="invalid-feedback">{savingErrors.type_name[0]}</div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={newHotelType.description}
                                onChange={handleCompanyInputChange}
                                className="form-control h-100"
                                rows="2"
                                placeholder="Description">

                            </textarea>

                        </div>
                        <div className="modal-footer-btn">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="btn btn-submit">
                                {isSaving && (<><span style={{marginRight:"6px"}} className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    <span className="sr-only"></span></>)}
                                Enregistrer
                            </button>
                            <button
                                onClick={() => setShowSaveEditModal(false)}
                                style={{marginLeft:"10px"}}
                                type="button"
                                className="btn btn-cancel me-2"
                                data-bs-dismiss="modal">Fermer
                            </button>
                        </div>
                    </form>
                </Modal.Body>

            </Modal>

            {/*delete modal*/}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="sm" backdrop="static">
                <Modal.Body className="modal-body p-4">
                    <div className="text-center">
                        <i className="dripicons-information h1 text-info"></i>
                        <h4 className="mt-2">Confirmation!</h4>
                        <p className="mt-3">Voulez-vous vraiment supprimer ?.</p>
                        <div className="modal-footer-btn">

                            <button
                                onClick={handleDelete}
                                type="button"
                                disabled={isDeleting}
                                className="btn btn-danger">
                                {isDeleting && (<><span style={{marginRight:"6px"}} className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    <span className="sr-only"></span></>)}
                                Supprimer
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
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

export default HotelType;