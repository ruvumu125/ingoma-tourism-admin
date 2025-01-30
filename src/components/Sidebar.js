import React, {useEffect, useState} from 'react';
import {Link, useLocation} from "react-router-dom";
import items from "../data/SidebarData.json"

const Sidebar = () => {
    const [selected, setSelected] = useState(null);
    const location = useLocation().pathname;
    const [activeLabelIndex, setActiveLabelIndex] = useState(null);


    useEffect(() => {
        items.forEach((parent, i) => {
            if (parent.childrens) {
                parent.childrens.forEach((child) => {
                    if (child.path === location) {
                        setSelected(i);
                        setActiveLabelIndex(child.id);
                    }
                });
            }
        });
    }, [location]);

    const toggle = (k, i) => {
        setSelected(k);
        setActiveLabelIndex(i);
    };

    // Function to render icons dynamically
    const renderIcon = (icon) => {
        // Assuming your icon format is 'data-feather="grid"', extract 'grid'
        const iconName = icon.match(/data-feather="([^"]+)"/)?.[1] || '';
        return <i data-feather={iconName}></i>;
    };

    return (
        <React.Fragment>
            <section>
                <div className="sidebar" id="sidebar">
                    <div className="sidebar-inner slimscroll">
                        <div id="sidebar-menu" className="sidebar-menu">
                            <ul>
                                <li className="submenu-open">
                                    <h6 className="submenu-hdr">Main</h6>
                                    <ul>
                                        {items.map((itemParent, i) => (
                                            itemParent.childrens && itemParent.childrens.length > 0 ? (
                                                // If the item has children, display the submenu layout
                                                <li key={i} className="submenu">
                                                    <a className={selected === i ? 'subdrop active' : ''}>
                                                        {renderIcon(itemParent.icon)}
                                                        <span>{itemParent.title}</span>
                                                        <span className="menu-arrow"></span>
                                                    </a>
                                                    <ul>
                                                        {itemParent.childrens.map((item, j) => (
                                                            <li key={j}>
                                                                <Link
                                                                    to={item.path}
                                                                    className={activeLabelIndex === item.id ? 'active' : ''}
                                                                    onClick={() => toggle(i, item.id)}
                                                                >
                                                                    {item.title}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </li>
                                            ) : (
                                                // If the item does not have children, display a simple item
                                                <li key={i} className={selected === i ? 'active' : ''}>
                                                    <Link to={itemParent.path || "#"} onClick={() => toggle(i, null)}>
                                                        {renderIcon(itemParent.icon)}
                                                        <span>{itemParent.title}</span>
                                                    </Link>
                                                </li>
                                            )
                                        ))}
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </React.Fragment>
    );
};

export default Sidebar;