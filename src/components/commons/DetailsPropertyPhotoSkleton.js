import React from 'react';
import Skeleton from "react-loading-skeleton";

function DetailsPropertyPhotoSkleton() {
    return (
        <>
            <Skeleton height={200} count={9}  />
        </>
    );
}

export default DetailsPropertyPhotoSkleton;