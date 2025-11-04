import ReactPaginate from "react-paginate";
import styles from "./Pagination.module.scss";
const Pagination = ({ pageCount, onChangePage}) => {
  return (
    <ReactPaginate
    className={styles.root}
      breakLabel="..."
      nextLabel=">"
      previousLabel="<"
      onPageChange={(event) => onChangePage(event.selected + 1)}
      pageRangeDisplayed={4}
      pageCount={3} // это число должны получать с бэка, но наш бэк не умеет делать это
      forcePage={pageCount - 1}
      renderOnZeroPageCount={null}
    />
  );
};

export default Pagination;
