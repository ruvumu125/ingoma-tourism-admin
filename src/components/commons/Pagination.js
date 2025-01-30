import React from 'react';
import PaginationItem from './PaginationItem';
import PrevNextPaginationItem from "./PrevNextPaginationItem";

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
    const renderPaginationItems = () => {
        const items = [];
        // Previous button
        items.push(
            <PrevNextPaginationItem
                key="prev"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1} // Disable if on the first page
                iconClass="fa fa-angle-left"
            />
        );
        // Page numbers
        for (let i = 1; i <= totalPages; i++) { // Loop starts from 1
            items.push(
                <PaginationItem
                    key={i}
                    label={i}
                    onClick={() => onPageChange(i)}
                    active={i === currentPage} // Adjust for 1-based index
                />
            );
        }
        // Next button
        items.push(
            <PrevNextPaginationItem
                key="next"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages} // Disable if on the last page
                iconClass="fa fa-angle-right"
            />
        );
        return items;
    };

    return (
        <nav aria-label="Pagination">
            <ul className="pagination">
                {renderPaginationItems()}
            </ul>
        </nav>
    );
};

export default Pagination;


