import React from 'react';
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';

const ListSkleton =({ title })=> {
    return (
        <>
            <div className="premio">
                <div className="deuxio"><h4>{title}</h4></div>
                <div className="trio">
                    <Skeleton height={38} count={1}  />
                </div>
            </div>
            <div className="table-responsive">
                <Skeleton height={70} count={10}  />
            </div>
            <div className="pagination-premio">
                <div className="pagination-deuxio"></div>
                <div className="pagination-trio">
                    <Skeleton height={38} count={1}  />
                </div>
            </div>
        </>
    );
}

export default ListSkleton;