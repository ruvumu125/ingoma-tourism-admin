import React from 'react';
import {Route, Routes} from "react-router-dom";
import Home from "../pages/Home";
import AmenityCategory from "../pages/AmenityCategory";
import City from "../pages/City";
import HotelType from "../pages/HotelType";
import Amenity from "../pages/Amenity";
import PropertyAdd from "../pages/PropertyAdd";
import PropertyList from "../pages/PropertyList";
import PropertyDetails from "../pages/PropertyDetails";
import PropertyEdit from "../pages/PropertyEdit";
import RoomAdd from "../pages/RoomAdd";
import RoomList from "../pages/RoomList";
import RoomEdit from "../pages/RoomEdit";
import RoomDetails from "../pages/RoomDetails";

function NavPage() {
    return (
        <React.Fragment>
            <section>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/amenity-categories" element={<AmenityCategory />} />
                    <Route path="/cities" element={<City />} />
                    <Route path="/hotel-types" element={<HotelType />} />
                    <Route path="/amenities" element={<Amenity />} />
                    <Route path="/property-add" element={<PropertyAdd />} />
                    <Route path="/properties" element={<PropertyList />} />
                    <Route path="/property-edit/:id" element={<PropertyEdit />} />
                    <Route path="/property-details/:id" element={<PropertyDetails />} />

                    <Route path="/room-add" element={<RoomAdd />} />
                    <Route path="/rooms" element={<RoomList />} />
                    <Route path="/room-edit/:id" element={<RoomEdit />} />
                    <Route path="/room-details/:id" element={<RoomDetails />} />
                </Routes>
            </section>
        </React.Fragment>
    );
}

export default NavPage;