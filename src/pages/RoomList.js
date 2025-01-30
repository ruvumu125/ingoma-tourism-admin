import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {desableProperty, enableProperty, getAllPropertiesPaginate} from "../utils/apiFunctions/propertyApiFunctions";
import {toast} from "react-toastify";
import ListSkleton from "../components/commons/ListSkleton";
import NoDataFound from "../components/commons/NoDataFound";
import Pagination from "../components/commons/Pagination";
import {Modal} from "react-bootstrap";
import {getAllRoomsPaginate} from "../utils/apiFunctions/roomApiFunctions";

function RoomList() {

    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [isNoDataFound, setIsNoDataFound] = useState(false);
    const [isDataFound, setIsDataFound] = useState(false);
    const [fetchingError, setFetchingError] = useState(null);
    const navigate = useNavigate();
    const name = 'Aucune pièce' ;

    //search
    const [searchTerm, setSearchTerm] = useState();

    //pagination
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchAllRoomsPaginate();
    }, [page,searchTerm]);

    const fetchAllRoomsPaginate = () => {

        getAllRoomsPaginate(searchTerm,page)
            .then((data) => {

                console.log(data);

                setTotalPages(data.data.pagination.total_pages);
                setData(data.data.roomtypes)
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


    return (
        <React.Fragment>
            <div className="page-header">
                <div className="add-item d-flex">
                    <div className="page-title">
                        <h4>Pièces</h4>
                        <h6>Gérer des pièces</h6>
                    </div>
                </div>
                <div className="page-btn">

                    <a
                        onClick={() => navigate(`/room-add`)}
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
                        Nouvelle pièce
                    </a>

                </div>
            </div>

            <div className="card table-list-card">
                <div className="card-body">
                    {
                        isLoading ? (<ListSkleton title="Liste de pièces"/>):(
                            <>
                                <div className="row" style={{padding:"20px 20px 20px"}}>
                                    <div className="col-lg-7 col-sm-6 col-12" style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        textAlign: 'center',
                                    }}>
                                        <h4>Liste de pièces</h4>
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
                                                placeholder="Rechercher une pièce par nom, logement, ville"/>
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
                                                        <th>Nom de la pièce</th>
                                                        <th>Logement</th>
                                                        <th>Type de logement</th>
                                                        <th>Nb max de personnes</th>
                                                        <th>Taille</th>
                                                        <th className="no-sort">Action</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {
                                                        data.map((company) => {

                                                            let property_type="";
                                                            if (company.property.property_type === "hotel") {
                                                                property_type="Hôtel";
                                                            }else if (company.property.property_type === "guesthouse") {
                                                                property_type="Maison de passage";
                                                            }

                                                            return(
                                                                <tr key={company.id}>
                                                                    <td>{company.type_name}</td>
                                                                    <td>{company.property.property_name}</td>
                                                                    <td>{property_type}</td>
                                                                    <td>{company.max_guests}</td>
                                                                    <td>{company.room_size+" m²"}</td>

                                                                    <td className="action-table-data">
                                                                        <div className="edit-delete-action">

                                                                            <a
                                                                                onClick={() => navigate(`/room-edit/${company.id}`)}
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
                                                                                onClick={() => navigate(`/room-details/${company.id}`)}
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

        </React.Fragment>
    );
}

export default RoomList;