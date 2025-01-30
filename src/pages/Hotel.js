import React from 'react';

function Hotel() {
    return (
        <React.Fragment>
            <div className="page-header">
                <div className="row">
                    <div className="col">
                        <h3 className="page-title">Horizontal Form</h3>
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item">
                                <a href="index.html">Dashboard</a>
                            </li>
                            <li className="breadcrumb-item active">Horizontal Form</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="card-title">Two Column Horizontal Form</h5>
                        </div>
                        <div className="card-body">
                            <h6 className="mb-3">Personal Information</h6>
                            <form action="#">
                                <div className="row">
                                    <div className="col-xl-6">
                                        <div className="row mb-3">
                                            <label className="col-lg-3 col-form-label">First Name</label>
                                            <div className="col-lg-9">
                                                <input type="text" className="form-control"/>
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <label className="col-lg-3 col-form-label">Last Name</label>
                                            <div className="col-lg-9">
                                                <input type="text" className="form-control"/>
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <label className="col-lg-3 col-form-label">Gender</label>
                                            <div className="col-lg-9">
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="radio" name="gender" id="gender_male" value="option1" checked/>
                                                    <label className="form-check-label" htmlFor="gender_male">
                                                        Male
                                                    </label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="radio" name="gender" id="gender_female" value="option2"/>
                                                    <label className="form-check-label" htmlFor="gender_female">
                                                        Female
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <label className="col-lg-3 col-form-label">Blood Group</label>
                                            <div className="col-lg-9">
                                                <select className="form-select">
                                                    <option>Select</option>
                                                    <option value="1">A+</option>
                                                    <option value="2">O+</option>
                                                    <option value="3">B+</option>
                                                    <option value="4">AB+</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-6">
                                        <div className="row mb-3">
                                            <label className="col-lg-3 col-form-label">Username</label>
                                            <div className="col-lg-9">
                                                <input type="text" className="form-control"/>
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <label className="col-lg-3 col-form-label">Email</label>
                                            <div className="col-lg-9">
                                                <input type="text" className="form-control"/>
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <label className="col-lg-3 col-form-label">Password</label>
                                            <div className="col-lg-9">
                                                <input type="password" className="form-control"/>
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <label className="col-lg-3 col-form-label">Repeat Password</label>
                                            <div className="col-lg-9">
                                                <input type="password" className="form-control"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <h6 className="mb-3">Address</h6>
                                <div className="row">
                                    <div className="col-xl-6">
                                        <div className="row mb-3">
                                            <label className="col-lg-3 col-form-label">Address Line 1</label>
                                            <div className="col-lg-9">
                                                <input type="text" className="form-control"/>
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <label className="col-lg-3 col-form-label">Address Line 2</label>
                                            <div className="col-lg-9">
                                                <input type="text" className="form-control"/>
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <label className="col-lg-3 col-form-label">State</label>
                                            <div className="col-lg-9">
                                                <input type="text" className="form-control"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-6">
                                        <div className="row mb-3">
                                            <label className="col-lg-3 col-form-label">City</label>
                                            <div className="col-lg-9">
                                                <input type="text" className="form-control"/>
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <label className="col-lg-3 col-form-label">Country</label>
                                            <div className="col-lg-9">
                                                <input type="text" className="form-control"/>
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <label className="col-lg-3 col-form-label">Postal Code</label>
                                            <div className="col-lg-9">
                                                <input type="text" className="form-control"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-end">
                                    <button type="submit" className="btn btn-primary">Submit</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default Hotel;