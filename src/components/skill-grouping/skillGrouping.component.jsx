import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { DatasetLinkedOutlined, Search } from "@mui/icons-material";
import FormControl from '../form-controls/formControl.component';
import { useLoader } from "../loader/loaderContext";
import { HttpServices } from "../../services/httpService";
import { UrlService } from "../../services/urlService";
import { useToaster } from "../toaster/toasterContext";
import React, { useEffect, useState } from 'react';
import SkillGroupingDialog from "./skillGroupingDialog.component";
const gridColumns = [
    { id: 'technicalServiceName', label: 'Technical Service', minWidth: 170 },
    { id: 'categoryName', label: 'Category', minWidth: 100 },
    { id: 'skillName', label: 'Skill', minWidth: 170 },
];

const SkillGrouping = () => {
    const [isSkillGroupDialogOpen, setIsSkillGroupDialogOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const {showToast} = useToaster();
    const [searchText, setSearchText] = useState("");
    const [skillGroupingData, setSkillGroupingData] = useState([]);
    const [filteredSkillGroupingData, setFilteredSkillGroupingData] = useState([]);
    const [userId, setUserId] = useState(1);
    const [stepView, setStepView] = useState();
    const [onPageLoad, setOnPageLoad] = useState(false);

    useEffect(() => {
        getSkillGroupingData(true);
    }, []);

    useEffect(() => {
        let _filteredSkillGroupingData = getFilteredSkillGroupingData(searchText);
        setFilteredSkillGroupingData(_filteredSkillGroupingData);
    }, [skillGroupingData, searchText]);

    useEffect(() => {
        if (onPageLoad) {
            handleSkillGroupDialogShow();
        }
    }, [onPageLoad]);

    const getSkillGroupingData = (onload = false) => {
        HttpServices.Get(UrlService.getSkillGroupingData)
            .then((result) => result.data)
            .then((response) => {
                if (response.status) {
                    if (response.data) {
                        let data = JSON.parse(response.data);
                        setSkillGroupingData([...data]);
                        setOnPageLoad(onload);
                    } else showToast(response.data, "s");
                } else showToast(response.data, "e");
            }).catch((error) => {
                console.log(error);
                showToast("Server error: Please contact Administrator", "e");
            });
    }

    const handleSkillGroupDialogShow = () => {
        let _skillGroupingData = [...skillGroupingData];
        let filterGroupingData = _skillGroupingData.filter(x => x.createdBy == userId && x.technicalServiceName == null);
        if (filterGroupingData && filterGroupingData.length > 0) {
            setStepView('step 2');
            setIsSkillGroupDialogOpen(true);
        }
        else {
            setStepView('step 1');
        }
    }

    const handleSearchOnChange = (event) => {
        let _searchText = event.target.value;
        setSearchText(_searchText);
    };

    const getFilteredSkillGroupingData = (searchText) => {
        let _skillGroupingData = [...skillGroupingData];
        let _filteredSkillGroupingData = _skillGroupingData.filter(
            (x) =>
                x.technicalServiceName?.toLowerCase().trim().includes(searchText?.toLowerCase().trim()) ||
                x.categoryName?.toLowerCase().trim().includes(searchText?.toLowerCase().trim()) ||
                x.skillName?.toLowerCase().trim().includes(searchText?.toLowerCase().trim())
        );
        return _filteredSkillGroupingData;
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleSkillGroupPopupOpen = () => {
        handleSkillGroupDialogShow();
        setIsSkillGroupDialogOpen(true);
    };

    const handleSkillGroupPopupClose = () => {
        setIsSkillGroupDialogOpen(false);
        getSkillGroupingData();
    };

    return (
        <>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <Typography
                    sx={{
                        marginBottom: '24px',
                        marginTop: '24px',
                    }}
                    variant="h6"
                    component="h2">
                    Skill Grouping
                </Typography>
                <Box component="div"
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '16px'
                    }}
                >

                    <FormControl.TextField
                        sx={{
                            width: '100%'
                        }}
                        id="filled-search"
                        label="Search"
                        type="search"
                        size="small"
                        value={searchText}
                        onChange={handleSearchOnChange}
                        InputProps={{
                            startAdornment: (
                                <IconButton position="end"
                                    sx={{
                                        height: '40px',
                                        paddingLeft: '0px'
                                    }}>
                                    <Search />
                                </IconButton>
                            ),
                        }}
                    />
                    <Tooltip title="Add/Modify Grouping" arrow>
                        <IconButton onClick={handleSkillGroupPopupOpen}
                            sx={{
                                height: '40px',
                            }}
                            aria-label="Add Item">
                            <DatasetLinkedOutlined
                            />
                        </IconButton>
                    </Tooltip>
                </Box>
                <TableContainer sx={{ maxHeight: 'calc(100vh - 290px)' }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead
                        >
                            <TableRow>
                                {gridColumns.map((column) => (
                                    <TableCell

                                        sx={{
                                            background: '#004A6B',
                                            color: '#fff',
                                            height: '44px',
                                            padding: '6px 16px',
                                        }}
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredSkillGroupingData && filteredSkillGroupingData.length > 0 &&
                                filteredSkillGroupingData
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row) => {
                                        return (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={row.technicalServiceId}>
                                                {gridColumns.map((column) => {
                                                    const value = row[column.id];
                                                    return (
                                                        <TableCell
                                                            sx={{
                                                                height: '36px',
                                                                padding: '2px 16px',
                                                            }}
                                                            key={column.id} align={column.align}>
                                                            {column.format && typeof value === 'number'
                                                                ? column.format(value)
                                                                : value}
                                                        </TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                        );
                                    })}
                        </TableBody>
                    </Table>
                    {filteredSkillGroupingData.length == 0 && <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            padding: '40px 0px',
                            width: '100%',
                        }}
                        container="h3">
                        No Data Found
                    </Box>}
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={skillGroupingData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
                {isSkillGroupDialogOpen &&
                    <SkillGroupingDialog
                        stepView={stepView}
                        fullWidth={true}
                        handleDialogClose={handleSkillGroupPopupClose}>
                    </SkillGroupingDialog>}
            </Paper>
        </>
    );
};
export default SkillGrouping;