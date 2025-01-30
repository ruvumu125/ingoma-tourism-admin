import React from 'react';
import Skeleton from "react-loading-skeleton";

function DetailsPropertyListSkleton() {
    return (
        <>
            <div className="row">
                <div className="col-lg-12 col-sm-12 col-12">
                    <div className="input-blocks add-product">
                        <Skeleton height={38} count={9}  />
                        <Skeleton height={120} count={1}  />
                    </div>
                </div>
            </div>
        </>
    );
}

export default DetailsPropertyListSkleton;