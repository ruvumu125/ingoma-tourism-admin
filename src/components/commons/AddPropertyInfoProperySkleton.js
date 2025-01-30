import React from 'react';
import Skeleton from "react-loading-skeleton";

function AddPropertyInfoProperySkleton(props) {
    return (
        <>

            <div className="addservice-info">
                <div className="row">
                    <div className="col-12 col-sm-12 col-md-4 col-lg-4">
                        <div className="mb-3 add-product">
                            <Skeleton height={38} count={1}  />
                        </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-4 col-lg-4">
                        <div className="mb-3 add-product">
                            <Skeleton height={38} count={1}  />
                        </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-4 col-lg-4">
                        <div className="mb-3 add-product">
                            <Skeleton height={38} count={1}  />
                        </div>
                    </div>

                </div>
                <div className="row">
                    <div className="col-12 col-sm-12 col-md-4 col-lg-4">
                        <div className="mb-3 add-product">
                            <Skeleton height={38} count={1}  />
                        </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-4 col-lg-4">
                        <div className="mb-3 add-product">
                            <Skeleton height={38} count={1}  />
                        </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-4 col-lg-4">
                        <div className="mb-3 add-product">
                            <Skeleton height={38} count={1}  />
                        </div>
                    </div>

                </div>
                <div className="row">
                    <div className="col-12 col-sm-12 col-md-4 col-lg-4">
                        <div className="mb-3 add-product">
                            <Skeleton height={38} count={1}  />
                        </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-4 col-lg-4">
                        <div className="mb-3 add-product">
                            <Skeleton height={38} count={1}  />
                        </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-4 col-lg-4">
                        <div className="mb-3 add-product">
                            <Skeleton height={38} count={1}  />
                        </div>
                    </div>

                </div>
            </div>
            <div className="addservice-info">
                <div className="row">
                    <div className="col-12 col-sm-12 col-md-12 col-lg-12">
                        <div className="mb-3 add-product">
                            <Skeleton height={150} count={1}  />
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
}

export default AddPropertyInfoProperySkleton;