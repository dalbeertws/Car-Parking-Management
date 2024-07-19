import React from "react";
import Pagination from "@mui/material/Pagination";
import { styled } from "@mui/material/styles";
import { useDispatch } from "react-redux";


function CustomPagination(props) {
  const dispatch = useDispatch();
  const { onPageChange, className,search, total, getData, currentPage } = props;
  const CustomPaginationRoot = styled("div")(({ theme }) => ({
    "& .MuiDataGrid-footerConentair": {
      border: "none !important",
    },
    "& .Mui-selected": {
      background: theme.palette.primary.bggradient,
      color: theme.palette.primary.contrastText + "!important",
      "&:hover": {
        backgroundColor: theme.palette.primary.dark,
      },
    },
    "& .MuiPaginationItem-root": {
      color: theme.palette.text.primary,
      background: theme.palette.secondary.main,
      "&:hover": {
        backgroundColor: theme.palette.secondary.dark,
      },
    },

    "& .MuiPaginationItem-root.Mui-disabled": {
      color: theme.palette.text.disabled,
    },
  }));

  const handlePageChange = async (event, newPage) => {
    const pageNumber = newPage;
    onPageChange(event, pageNumber);
    if(search!=="" && search!==null && search!==undefined){

      const value=search;
    }
    else{
      dispatch(getData(pageNumber));
    }

  };

  return (
    <CustomPaginationRoot className={`${className} custom-pagination`}>
      <Pagination
        count={total}
        total
        size="large"
        page={currentPage}
        onChange={(event, newPage) => {
          handlePageChange(event, newPage);
        }}
      />
    </CustomPaginationRoot>
  );
}

export default CustomPagination;
