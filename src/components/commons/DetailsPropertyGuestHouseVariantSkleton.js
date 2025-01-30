import React from 'react';
import Skeleton from "react-loading-skeleton";

function DetailsPropertyGuestHouseVariantSkleton() {
    return (
        <>
            <div className="col-xl-6 col-sm-6 col-12">
                <div className="input-blocks add-product">
                    <Skeleton height={80} count={1}  />
                </div>
            </div>
        </>
    );
}

export default DetailsPropertyGuestHouseVariantSkleton;