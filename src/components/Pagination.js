import React from "react";

const Pagination = ({
  totalContacts,
  contactPerPage,
  setCurrentPage,
  currentPage,
}) => {
  let pages = [];
  for (let i = 1; i <= Math.ceil(totalContacts / contactPerPage); i++) {
    pages.push(i);
  }

  return (
    <div className="pagination-container">
      {pages.map((page, index) => (
        <button
          className={`pagination-button ${
            currentPage === page ? "active" : ""
          }`}
          key={index}
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
