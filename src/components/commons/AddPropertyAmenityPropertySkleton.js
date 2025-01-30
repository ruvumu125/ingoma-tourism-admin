import React from 'react';
import Skeleton from "react-loading-skeleton";

function AddPropertyAmenityPropertySkleton() {
    return (
        <>
            <div className="row">
                <div className="col-lg-4 col-sm-6 col-12">
                    <div className="input-blocks add-product">
                        <Skeleton height={38} count={1}  />
                    </div>
                </div>
                <div className="col-lg-7 col-sm-6 col-12">
                    <div className="input-blocks add-product">
                        <Skeleton height={38} count={1}  />
                    </div>
                </div>
                <div className="col-lg-1 col-sm-6 col-12">
                    <div className="input-blocks add-product"></div>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-2 col-sm-4 col-2">
                    <div className="input-blocks add-product">
                        <Skeleton height={38} count={1}  />
                    </div>
                </div>
            </div>
        </>
    );
}

export default AddPropertyAmenityPropertySkleton;