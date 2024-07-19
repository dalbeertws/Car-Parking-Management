import * as React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid, GridPagination } from "@mui/x-data-grid";
import { Typography } from "@mui/material";
import { setAlert } from "redux/slices/alertSlice";
import { AiFillPlusCircle } from "react-icons/ai";
import { PiTrashFill } from "react-icons/pi";
import { BiSolidPencil } from "react-icons/bi";
import { ValidatorForm } from "react-material-ui-form-validator";
import CustomPagination from "Components/CustomPagination";
import { getAllUsers, updateUser, deleteUser, createUser } from "redux/slices/UserSlice";
import Loader from "Loader";
import Adduser from "Assets/Dialog box/Adduser";
import Deletebox from "Assets/Dialog box/Deletebox";

export default function UserManagment() {
  const dispatch = useDispatch();
  const [openadd, setOpenadd, openedit, setOpenedit, opendelete, setOpendelete, addLoader, setAddLoader, isLoading, setIsLoading] = useState([false, false, false, false, false]);
  const getUsers = useSelector((state) => state.user.getAllUsers);
  const getUsersarr = Array.isArray(getUsers) ? getUsers : [];
  const errorMessage = useSelector((state) => state.user);
  const { totalPages: getTotalPages, currentPage } = useSelector((state) => state.user);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [formData, setFormData] = useState({ id: "", first_name: "", last_name: "", email: "" });

  ValidatorForm.addValidationRule("ismax30", (value) => (value.trim().length <= 30 && value !== ""));

  const PaginationComponent = (props) => (
    <GridPagination
      ActionsComponent={(paginationProps) => (
        <CustomPagination currentPage={currentPage} total={getTotalPages} getData={getAllUsers} {...paginationProps} />
      )}
      {...props}
    />
  );

  const handleCloseDelete = () => setOpendelete(false);
  const handleClickOpenadd = () => setOpenadd(true);
  const handleClickcloseedit = () => {
    setOpenedit(false);
    setFormData({ first_name: "", last_name: "", email: "" });
  };
  const handleCloseadd = () => setOpenadd(false);
  const handleFormChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAdduser = () => {
    setAddLoader(true);
    const { email, first_name, last_name } = formData;
    if (email === "" || first_name === "" || last_name === "") {
      dispatch(setAlert({ open: true, message: "Please fill in all required fields.", severity: "error", duration: 6000 }));
      setAddLoader(false);
      return;
    }
    formData.email = email.toLowerCase();
    dispatch(createUser(formData)).unwrap().then((res) => {
      if (res.status === 400) {
        const errorField = Object.keys(res.data)[0];
        dispatch(setAlert({ open: true, message: res.data[errorField][0], severity: "error", duration: 6000 }));
      } else {
        dispatch(getAllUsers(1));
        dispatch(setAlert({ open: true, message: "User Added Successfully", severity: "success", duration: 6000 }));
        setOpenadd(false);
        setFormData({ first_name: "", last_name: "", email: "" });
      }
    }).catch((error) => {
      dispatch(setAlert({ open: true, message: error.data.message, severity: "error", duration: 6000 }));
    }).finally(() => setAddLoader(false));
  };

  const handleClickOpenedit = (id) => {
    const obj = getUsersarr.find((item) => item.id === id);
    setFormData(obj);
    setOpenedit(true);
  };

  const UpdateUser = () => {
    setAddLoader(true);
    dispatch(updateUser({ userData: formData })).then((res) => {
      if (res.status === 400) {
        const errorField = Object.keys(res.data)[0];
        dispatch(setAlert({ open: true, message: res.data[errorField][0], severity: "error", duration: 6000 }));
      } else if (res.type === "user/updateUser/fulfilled") {
        dispatch(setAlert({ open: true, message: "User Updated Successfully!!!", severity: "success", duration: 6000 }));
        handleClickcloseedit();
      }
    }).catch(() => {
      dispatch(setAlert({ open: true, message: "Something went wrong", severity: "error", duration: 6000 }));
    }).finally(() => setAddLoader(false));
  };

  const handleDelete = (id) => {
    dispatch(deleteUser(id)).then(() => {
      dispatch(setAlert({ open: true, message: "Data Deleted Successfully", severity: "success", duration: 6000 }));
    }).catch(() => {
      dispatch(setAlert({ open: true, message: "Something went wrong", severity: "error", duration: 6000 }));
    }).finally(() => {
      setDeleteUserId(null);
      setOpendelete(false);
    });
  };

  const columns = [
    {
      field: "s.no",
      type: "string",
      flex: 1,
      minWidth: 165,
      renderHeader: () => (
        <strong>
          <Typography variant="overline" fontWeight="bold" sx={{ textDecodation: "none", paddingLeft: "20px" }}>
            Serial Number
          </Typography>
        </strong>
      ),
      renderCell: (params, index) => (
        <Typography sx={{ textDecodation: "none", paddingLeft: "30px" }}>{params.value}</Typography>
      ),
    },
    {
      field: "first_name",
      type: "string",
      flex: 1,
      minWidth: 230,
      renderHeader: () => (
        <strong>
          <Typography variant="overline" fontWeight="bold">
            First Name
          </Typography>
        </strong>
      ),
      renderCell: (params) => (
        <Typography sx={{ textDecodation: "none" }}>{params.value}</Typography>
      ),
    },
    {
      field: "last_name",
      type: "string",
      flex: 1,
      minWidth: 230,
      renderHeader: () => (
        <strong>
          <Typography variant="overline" fontWeight="bold">
            Last Name
          </Typography>
        </strong>
      ),
      renderCell: (params) => (
        <Typography sx={{ textDecodation: "none" }}>{params.value}</Typography>
      ),
    },
    {
      field: "email",
      type: "string",
      flex: 1,
      minWidth: 350,
      renderHeader: () => (
        <strong>
          <Typography variant="overline" fontWeight="bold">
            Email
          </Typography>
        </strong>
      ),
      renderCell: (params) => (
        <Typography className="email-box" sx={{ textDecodation: "none" }}>{params.value}</Typography>
      ),
    },
    {
      field: "action",
      type: "string",
      flex: 1,
      minWidth: 90,
      renderHeader: () => (
        <strong>
          <Typography variant="overline" fontWeight="bold">
            Action
          </Typography>
        </strong>
      ),
      renderCell: (params) => (
        <div className="actions">
          <div className="actionitems" onClick={() => handleClickOpenedit(params.row.id)}>
            <BiSolidPencil />
          </div>
          <div className="actionitems" onClick={() => { setDeleteUserId(params.row.id); setOpendelete(true); }}>
            <PiTrashFill />
          </div>
        </div>
      ),
    },
  ];


  useEffect(() => {
    setIsLoading(true);
    dispatch(getAllUsers());
    if (getUsers && getUsers.length >= 0) setIsLoading(false);
  }, [dispatch]);

  return (
    <div>
      <div className="sectiontitle">
        <div className="title">
          <label className="titletag">User Management</label>
        </div>
        <label className="addbtn">
          <button className="addbuttoncontrol" onClick={handleClickOpenadd}><AiFillPlusCircle /> Add User</button>
        </label>
      </div>

      <div className="section-inner">
        {isLoading ? <Loader /> : (
          <DataGrid
            sx={{ margin: "0px 10px" }}
            autoHeight
            className="custom-table"
            pagination
            slots={{ pagination: (props) => <PaginationComponent getData={getAllUsers} currentPage={currentPage} total={getTotalPages} pagesize={getUsersarr?.length} rows={getUsersarr?.map((item, index) => ({ ...item, "s.no": currentPage > 1 ? index + (currentPage * 10 - 9) : index + 1 }))} {...props} /> }}
            rows={getUsersarr}
            columns={columns}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          />
        )}
      </div>

      <Adduser
        open={openadd}
        onClose={handleCloseadd}
        title="Add User"
        onConfirm={handleAdduser}
        formData={formData}
        handleFormChange={handleFormChange}
        buttonName="Add User"
        handleSubmit={formData.email === "" || formData.first_name === "" || formData.last_name === "" ? null : handleAdduser}
        setAddLoader={setAddLoader}
        addLoader={addLoader}
      />

      <Adduser
        open={openedit}
        onClose={handleClickcloseedit}
        title="Edit User"
        onConfirm={UpdateUser}
        formData={formData}
        handleFormChange={handleFormChange}
        buttonName="Update User"
        handleSubmit={formData.email === "" || formData.first_name === "" || formData.last_name === "" ? null : UpdateUser}
        setAddLoader={setAddLoader}
        addLoader={addLoader}
      />

      <Deletebox
        open={opendelete}
        onClose={handleCloseDelete}
        title="Are you sure you want to delete ?"
        onConfirm={() => handleDelete(deleteUserId)}
      />
    </div>
  );
}
