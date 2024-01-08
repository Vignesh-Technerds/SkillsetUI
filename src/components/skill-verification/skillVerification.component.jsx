import { Button, Grid, Typography } from "@mui/material";
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
import Checkbox from "@mui/material/Checkbox";
import ApproveConfirmationDialog from '../skill-verification/approveConfirmationDialog.component';
import TablePagination from '@mui/material/TablePagination';

const gridColumns = [
  { id: "userName", label: "Name", width: "20%" },
  { id: "technicalServiceName", label: "Technical Service", width: "20%"  },
  { id: "categoryName", label: "Category", width: "20%"  },
  { id: "skillName", label: "Skill", width: "15%"  },
  { id: "skillLevelName", label: "Skill Level", width: "20%"  },
  { id: "isApproved", label: "Approved", width: "5%"},
];
const SkillVerification = () => {
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [skillVerificationData, setSkillVerificationData] = useState([]);
  const [originalSkillVerificationData, setOriginalSkillVerificationData] = useState([]);
  const { showToast } = useToaster();
  const [filteredSkillVerificationData, setFilteredSkillVerificationData] = useState([]);
  const [isApproveDisabled, setIsApproveDisabled] = useState(true);
  const [selectedUserSkillIds, setSelectedUserSkillIds] = useState([]);
  const [isApproveConfirmationDialogOpen, isSetApproveConfirmationDialogOpen] = useState(false);

  useEffect(() => {
    getSkillVerificationData();
  }, []);

  useEffect(() => {
    let _originalSkillVerificationData = JSON.parse(JSON.stringify(originalSkillVerificationData));
    setSkillVerificationData(_originalSkillVerificationData);
  }, [originalSkillVerificationData]);


  useEffect(() => {
    let _filteredSkillVerificationData = getFilteredSkillVerificationData(searchText);
    setFilteredSkillVerificationData(_filteredSkillVerificationData);
  }, [skillVerificationData, searchText]);

  useEffect(() => {
    if(selectedUserSkillIds.length > 0) setIsApproveDisabled(false);
    else setIsApproveDisabled(true);
  }, [selectedUserSkillIds]);


  const getSkillVerificationData = () => {
    HttpServices.Get(UrlService.getSkillVerificationData)
      .then((result) => result.data)
      .then((response) => {
        if (response.status) {        
          let data = JSON.parse(response.data);
          setOriginalSkillVerificationData([...data]);
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

  const getFilteredSkillVerificationData = (searchText) => {
    let _skillVerificationData = [...skillVerificationData];
    let _filteredSkillVerificationData = _skillVerificationData.filter(
      (x) =>
        x.technicalServiceName?.toLowerCase().trim().includes(searchText?.toLowerCase().trim()) ||
        x.categoryName?.toLowerCase().trim().includes(searchText?.toLowerCase().trim()) ||
        x.skillName?.toLowerCase().trim().includes(searchText?.toLowerCase().trim()) ||
        x.skillLevelName?.toLowerCase().trim().includes(searchText?.toLowerCase().trim()) ||
        x.userName?.toString().includes(searchText?.toLowerCase().trim())
    );
    return _filteredSkillVerificationData;
  };

  const isDisableCheckbox = (userSkillId, isApproved) => {
    let disableCheckbox = false;
    if (isApproved && !(selectedUserSkillIds.some(x=> x == userSkillId))) 
        disableCheckbox = true;  
    return disableCheckbox;
 }

  const handleApproveClick = () => {
    if (selectedUserSkillIds.length > 0 && selectedUserSkillIds != null){
        approveUserSkill();
    }
  }

  const handleCancelClick = () => {
    setSelectedUserSkillIds([]);
    setOriginalSkillVerificationData([...originalSkillVerificationData]);
  }

  const approveUserSkill = () => {
    HttpServices.Post(UrlService.approveUserSkill, selectedUserSkillIds)
      .then((result) => result.data)
      .then((response) => {
        if (response.status) {
          showToast(response.message, "s"); 
          setSelectedUserSkillIds([]);
          getSkillVerificationData();
        }    
        else showToast(response.data, "e");
        handleDialogClose();
      })
      .catch((error) => {
        console.log(error);
        showToast("Server error: Please contact Administrator", "e");
      });
  };

  const handleCheckboxChange = (userSkillId, isChecked) => {
    let _selectedUserSkillIds = [...selectedUserSkillIds]
    if (isChecked) {
        skillVerificationData.map(x=> {
          if(x.userSkillId == userSkillId){
            x.isApproved = true;
         }
         return x;
        });
    setSkillVerificationData(skillVerificationData);
    _selectedUserSkillIds.push(userSkillId);
    setSelectedUserSkillIds(_selectedUserSkillIds);
    } else {
        skillVerificationData.map(x=> {
          if(x.userSkillId == userSkillId){
            x.isApproved = false;
        }
        return x;
        });
    setSkillVerificationData(skillVerificationData);
    _selectedUserSkillIds = _selectedUserSkillIds.filter(id => id !== userSkillId)
    setSelectedUserSkillIds(_selectedUserSkillIds);
    }
};

const handleClickOpen = () => {
  isSetApproveConfirmationDialogOpen(true);
};

const handleDialogClose = () => {
  isSetApproveConfirmationDialogOpen(false);
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
        Skill Verification
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
                  width={column.width}
                  key={column.id}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSkillVerificationData
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              ?.map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.userSkillId}>
                    {gridColumns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell
                          sx={{
                            height: "36px",
                            padding: "2px 16px",
                          }}
                          key={column.id}
                        >
                          {column.id === "isApproved" ? (
                            <Checkbox
                              sx={{ height: "40px",
                            }}
                              checked ={row.isApproved}  
                              disabled={isDisableCheckbox(row.userSkillId, row.isApproved)} 
                              onChange={(event) => handleCheckboxChange(row.userSkillId, event.target.checked)}
                            />
                          ) : (
                            value
                          )}
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
                count={filteredSkillVerificationData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

      <Grid
        xs
        md={4}
        mdOffset={8}
        display={"flex"}
        right={"10px"}
        width={"100%"}
        bottom={"30px"}
        justifyContent={"end"}
        position={"absolute"}
      >
        <Button
          sx={{
            marginRight: 2,
            height: "32px",
            width: "94px",
          }}
          variant="contained"
          size="medium"
          color="secondary"
          onClick={handleCancelClick}
        >
          CANCEL
        </Button>
        <Button
          sx={{
            marginRight: 2,
            height: "32px",
            width: "94px",
          }}
          variant="contained" size="medium" color="primary"
          disabled={isApproveDisabled}
          onClick={handleClickOpen}
        >
          APPROVE
        </Button>
      </Grid>

      <ApproveConfirmationDialog
        open={isApproveConfirmationDialogOpen}
        handleDialogClose={handleDialogClose}
        handleApproveClick={handleApproveClick}
      />
    </>
  );
};
export default SkillVerification;