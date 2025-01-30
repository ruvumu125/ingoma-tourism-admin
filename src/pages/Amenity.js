import React, {useEffect, useState} from 'react';
import {toast} from "react-toastify";
import ListSkleton from "../components/commons/ListSkleton";
import NoDataFound from "../components/commons/NoDataFound";
import Pagination from "../components/commons/Pagination";
import {Modal} from "react-bootstrap";
import {addAmenity, deleteAmenity, getAllAmenities, updateAmenity} from "../utils/apiFunctions/amenityApiFunctions";
import {getAmenityCategoriesList} from "../utils/apiFunctions/amenityCategoryApiFunctions";

function Amenity() {

    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [isNoDataFound, setIsNoDataFound] = useState(false);
    const [isDataFound, setIsDataFound] = useState(false);
    const [fetchingError, setFetchingError] = useState(null);
    const name = 'Aucun équipement' ;

    //modal declaration
    const [operation, setOperation] = useState(1);
    const [modalTitle, setModalTitle] = useState("");
    const [showSaveEditModal, setShowSaveEditModal] = useState(false);

    //saving/update declaration
    const [savingErrors, setSavingErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    //update declaration
    const [amenityCategoryIdUpdate, setAmenityCategoryIdUpdate] = useState(0);

    //selector amenity declaration
    const [amenityCategories, setAmenityCategories] = useState([]);
    const [selectedAmenityCategoryId, setSelectedAmenityCategoryId] = useState('');
    const [selectedAmenityCategoryName, setSelectedAmenityCategoryName] = useState("---Sélectionner une entreprise---")

    //delete declaration
    const [idAmenityCategory, setIdAmenityCategory] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    //search
    const [searchTerm, setSearchTerm] = useState();
    const [newAmenityCategory, setNewAmenityCategory] = useState({
        "name": "",
        "amenity_category_id": ""
    });

    //pagination
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchAmenityCategories();
        fetchAmenities();
    }, [page,searchTerm]);

    const fetchAmenities = () => {

        getAllAmenities(searchTerm,page)
            .then((data) => {
                console.log(data);
                setTotalPages(data.data.pagination.total_pages);
                setData(data.data.amenities)
                setIsLoading(false)
                setIsDataFound(true)

            })
            .catch((error) => {

                console.log(error);
                setFetchingError(error.message)
                setIsLoading(false)

            })

    }

    const fetchAmenityCategories=() => {
        getAmenityCategoriesList()
            .then((data) => {
                setAmenityCategories(data.data)

            })
            .catch((error) => {
            })
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setPage(1); // Reset page to 1 when search term changes
    };

    const openAddEditModal = (op,id,name,amenity_category_id,amenity_category_name) => {

        setOperation(op);
        setSavingErrors({});

        if (op===1){
            setOperation(1);
            setShowSaveEditModal(true);
            setModalTitle("Créer un équipement");
        }
        else if (op===2){
            setOperation(2);
            setShowSaveEditModal(true);
            setModalTitle("Modifier un équipement");
            setAmenityCategoryIdUpdate(id);
            setNewAmenityCategory({
                "name":name,
                "amenity_category_id":amenity_category_id
            });
            setSelectedAmenityCategoryId(amenity_category_id);
            setSelectedAmenityCategoryName(amenity_category_name);

        }

    }

    const openDeleteModal = (id) => {
        setIdAmenityCategory(id);
        setShowModal(true);
    }

    const handleCloseModal = () => {
        fetchAmenityCategories();
        setNewAmenityCategory({
            "name": "",
            "amenity_category_id": ""
        });
        setSavingErrors({});
    }

    const handleCompanyInputChange = (e) => {
        const { name, value } = e.target
        setNewAmenityCategory({ ...newAmenityCategory, [name]: value })

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
            saveNewAmenityCategory().then(() => console.log("Company saved successfully"))
                .catch((error) => console.error("Error in handleSubmit:", error));
        } else {

            updateGivenAmenityCategory().then(() => console.log("Company updated successfully"))
                .catch((error) => console.error("Error in handleSubmit:", error));
        }
    };

    const saveNewAmenityCategory = async () => {

        setIsSaving(true);
        try {
            const success = await addAmenity(newAmenityCategory.name, newAmenityCategory.amenity_category_id);

            if (success !== undefined) {
                setNewAmenityCategory({
                    "name": "",
                    "amenity_category_id": ""
                });
                setSavingErrors({});
                setIsSaving(false);
                setShowSaveEditModal(false);
                fetchAmenities();

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

    const updateGivenAmenityCategory = async () => {

        setIsSaving(true);
        try {
            const success = await updateAmenity(amenityCategoryIdUpdate,newAmenityCategory.name, newAmenityCategory.amenity_category_id);

            if (success !== undefined) {
                setNewAmenityCategory({
                    "name": "",
                    "amenity_category_id": ""
                });
                setSavingErrors({});
                setIsSaving(false);
                setShowSaveEditModal(false);
                fetchAmenities();

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
            const result = await deleteAmenity(idAmenityCategory);

            if (result)
            {

                setShowModal(false);
                setIsDeleting(false);
                fetchAmenities();

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
                fetchAmenities();

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
            fetchAmenities();

            //Toast
            toast.error("Impossible de Supprimer cette catégorie d'équipement",{
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
                        <h4>Équipement</h4>
                        <h6>Gérer des équipements</h6>
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
                        </svg>Nouvel équipement
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
                                        <h4>Liste d'équipements</h4>

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
                                                        <th>Nom de l'équipement</th>
                                                        <th>Catégorie</th>
                                                        <th className="no-sort">Action</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {
                                                        data.map((company) => {


                                                            return(
                                                                <tr key={company.id}>
                                                                    <td>{company.name}</td>
                                                                    <td>{company.category.name}</td>
                                                                    <td className="action-table-data">
                                                                        <div className="edit-delete-action">

                                                                            <a
                                                                                onClick={(e) =>  openAddEditModal(2,company.id,company.name,company.category.id,company.category.name) }
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
                            <label className="form-label">Nom de l'équipement</label>
                            <input
                                id="name"
                                name="name"
                                value={newAmenityCategory.name}
                                onChange={handleCompanyInputChange}
                                type="text"
                                className={`form-control ${savingErrors.name ? "is-invalid" : ""}`}
                                placeholder="Nom de la catégorie d'équipement"/>

                            {savingErrors.name && (
                                <div className="invalid-feedback">{savingErrors.name[0]}</div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Type de catégorie</label>
                            <select
                                id="amenity_category_id"
                                name="amenity_category_id"
                                className="form-select"
                                value={newAmenityCategory.type}
                                onChange={handleCompanyInputChange}>

                                {operation === 1 && (
                                    <option value={selectedAmenityCategoryId}>{selectedAmenityCategoryName}</option>
                                )}
                                {
                                    amenityCategories.map((agent, index) => (
                                        <option
                                            key={index}
                                            value={agent.id}
                                            selected={agent.id===selectedAmenityCategoryId}
                                        >{agent.name}</option>                                                        ))
                                }
                            </select>

                            {savingErrors.amenity_category_id && (
                                <div style={{
                                    width: '100%',
                                    marginTop: '0.25rem',
                                    fontSize: '0.875em',
                                    color: '#dc3545',
                                }}>{savingErrors.amenity_category_id[0]}</div>
                            )}
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

export default Amenity;