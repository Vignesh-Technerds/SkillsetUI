import { Typography, Tooltip } from "@mui/material";
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import FormControl from "../form-controls/formControl.component";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import * as React from "react";
import { Search } from "@mui/icons-material";
import { UrlService } from "../../services/urlService";
import { HttpServices } from "../../services/httpService";
import { useToaster } from "../toaster/toasterContext";
import { useEffect } from "react";
import {  Edit } from "@mui/icons-material";
import TablePagination from '@mui/material/TablePagination';
import { MenuItem, Select } from '@mui/material';

const gridColumns = [
  { id: "userName", label: "Name", width: "20%" },
  { id: "technicalServiceName", label: "Technical Service", width: "20%" },
  { id: "categoryName", label: "Category", width: "20%" },
  { id: "skillName", label: "Skill", width: "15%" },
  { id: "skillLevelName", label: "Select Level", width: "20%"},
  { id: "action", label: "Action", width: "5%" },
];

const User = () => {
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [userSkillData, setUserSkillData] = useState([]);
  const [skillLevelData, setSkillLevelData] = useState([]);
  const { showToast } = useToaster();
  const [filteredUserSkillData, setFilteredUserSkillData] = useState([]);
  const [editUserSkillId, setEditedUserSkillId] = useState();

  useEffect(() => {
    getSkillLevelData();
    getUserSkillData();
  }, []);

  useEffect(() => {
    let _filteredUserSkillData = getFilteredUserSkillData(searchText);
    setFilteredUserSkillData(_filteredUserSkillData);
  }, [userSkillData, searchText]);

  const getSkillLevelData = () => {
    HttpServices.Get(UrlService.getSkillLevelData)
    .then((result) => result .data)
      .then((response) => {
        if (response.status) {
            let data = JSON.parse(response.data);
            setSkillLevelData([...data]);
        }
      })
      .catch((error) => {
        console.log(error);
        showToast("Server error: Please contact Administrator", "e");
      });
  };

  const getUserSkillData = () => {
    HttpServices.Get(UrlService.getSkillVerificationData)
    .then((result) => result .data)
      .then((response) => {
        if (response.status) {
            let data = JSON.parse(response.data);
            setUserSkillData([...data]);
        }
      })
      .catch((error) => {
        console.log(error);
        showToast("Server error: Please contact Administrator", "e");
      });
  };

  const handleSearch = (event) => {
    let _searchText = event.target.value;
    setSearchText(_searchText);
  };

  const getFilteredUserSkillData = (searchText) => {
    let _userSkillData = [...userSkillData];
    let _filteredUserSkillData = _userSkillData.filter(
      (x) =>
        x.technicalServiceName?.toLowerCase().trim().includes(searchText?.toLowerCase().trim()) ||
        x.categoryName?.toLowerCase().trim().includes(searchText?.toLowerCase().trim()) ||
        x.skillName?.toLowerCase().trim().includes(searchText?.toLowerCase().trim()) ||
        x.skillLevelName?.toLowerCase().trim().includes(searchText?.toLowerCase().trim()) ||
        x.userName?.toString().includes(searchText?.toLowerCase().trim())
    );
    return _filteredUserSkillData;
  };

  const getGridRows = (row, column) => {
    const value = row[column.id];
    const rowId = row?.userSkillId;
    if (column.id == "action"){
      return <IconButton
                sx={{
                    height: '40px'
                }}
                color='success' aria-label="Edit"
                onClick={() => handleEditIconClick(rowId)}
                >
                <Tooltip title="Edit" arrow>
                    <Edit sx={{ fontSize: 20 }} />
                </Tooltip>
              </IconButton>;
    }
    else if (column.id == "skillLevelName"){
      let skillLevelId = row?.skillLevelId;
      return rowId == editUserSkillId ? <Select
      onChange={(event) => handleSkillLevelChange(rowId, event.target.value)}
        sx={{
          height: '40px',
          overflow: 'hidden',
          borderRadius: '4px', 
          borderColor: 'rgba(0, 0, 0, 0.23)', 
          '&:hover': {
            borderColor: 'rgba(0, 0, 0, 0.87)', 
          },
          '&:focus': {
            borderColor: '#1976D2', 
          },
          fontSize: '14px',
        }}
        value={skillLevelId}
    >
      {skillLevelData.map((level) => (
        <MenuItem key={level.skillLevelId} value={level.skillLevelId}>
          {level.skillLevelName}
        </MenuItem>
      ))}
    </Select> : value;
    }
    else{
      return value;
    }
  }

  const handleEditIconClick = (rowId) => {
    setEditedUserSkillId(rowId);
  };

  const handleSkillLevelChange = (userSkillId, selectedLevel) => {
    if(userSkillId != null && selectedLevel != null) updateSkillLevel(userSkillId, selectedLevel);
  };

  const updateSkillLevel = (userSkillId, skillLevelId) => {
    const updateSkillLevelRequest = {
      userSkillId: userSkillId,
      skillLevelId: skillLevelId
    };
    HttpServices.Post(UrlService.updateSkillLevel, updateSkillLevelRequest)
      .then((result) => result.data)
      .then((response) => {
        if (response.status) {
          showToast(response.message, "s"); 
          setEditedUserSkillId(null);
          getUserSkillData();
        }    
        else showToast(response.data, "e");
      })
      .catch((error) => {
        console.log(error);
        showToast("Server error: Please contact Administrator", "e");
      });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      <Typography
        sx={{
          marginBottom: "24px",
          marginTop: "15px",
        }}
        variant="h6" component="h2"
      >
        User
      </Typography>

      <FormControl.TextField
        sx={{
          width: "100%",
          marginBottom: "32px",
          cursor: "pointer",
        }}
        id="filled-search"
        label="Search"
        type="search"
        size="small"
        value={searchText}
        onChange={handleSearch}
        InputProps={{
          startAdornment: (
            <IconButton
              position="end"
              sx={{
                height: "40px",
                paddingLeft: "0px",
              }}
            >
              <Search />
            </IconButton>
          ),
        }}
        isDesktop
      />

      <TableContainer sx={{ maxHeight: "calc(100vh - 290px)" }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {gridColumns.map((column) => (
                <TableCell
                  sx={{
                    background: "#004A6B",
                    color: "#fff",
                    height: "44px",
                    padding: "6px 16px",
                  }}
                  key={column.id}
                  width={column.width}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUserSkillData
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              ?.map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.userSkillId}>
                    {gridColumns.map((column) => {
                      return (
                        <TableCell
                          sx={{
                            height: "36px",
                            padding: "2px 16px",
                          }}
                          key={column.id}
                        >
                          {getGridRows(row, column)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={filteredUserSkillData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
    </>
  );
};
export default User;