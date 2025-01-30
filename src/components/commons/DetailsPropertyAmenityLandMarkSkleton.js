import React from 'react';
import Skeleton from "react-loading-skeleton";

function DetailsPropertyAmenityLandMarkSkleton() {
    return (
        <>
            <div className="row">
                <div className="col-lg-12 col-sm-12 col-12">
                    <div className="input-blocks add-product">
                        <Skeleton height={60} count={9}  />
                    </div>
                </div>
            </div>
        </>
    );
}

export default DetailsPropertyAmenityLandMarkSkleton;