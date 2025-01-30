import React from 'react';
import Skeleton from "react-loading-skeleton";

function AddPropertyPhotoSkleton() {
    return (
        <div className="input-blocks">
            <div className="image-upload" style={{border:"none"}}>
                <Skeleton height={120} count={1}  />
            </div>

        </div>
    );
}

export default AddPropertyPhotoSkleton;