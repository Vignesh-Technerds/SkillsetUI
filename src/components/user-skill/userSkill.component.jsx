import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import DoneIcon from '@mui/icons-material/Done';
import { Box, Checkbox, Chip, FormControl, Grid, IconButton, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, Tooltip, Typography } from '@mui/material';
import { Delete, Edit } from "@mui/icons-material";
import { useResponsive } from '../common/responsive';
const columns = [
    { id: 'name', label: 'Technical Service', minWidth: 170 },
    { id: 'code', label: 'Category', minWidth: 100 },

    {
        id: 'size',
        label: 'Skill',
        minWidth: 170,
    },
    {
        id: 'action',
        label: 'Action',
        minWidth: 170,
        align: 'right',
    },
];

function createData(name, code, size) {

    const action = [<IconButton
        sx={{
            height: '40px'
        }}
        color='success' aria-label="Edit">
        <Tooltip title="Edit" arrow>
            <Edit sx={{ fontSize: 20 }} />
        </Tooltip>
    </IconButton>,
    <IconButton
        sx={{
            height: '40px'
        }}
        color='error' aria-label="Delete">
        <Tooltip title="Delete" arrow>
            <Delete sx={{ fontSize: 20 }} />
        </Tooltip>
    </IconButton>]

    return { name, code, size, action };
}

const rows = [
    createData('Airside Planning ', 'Computer Aided Design ', 'Computer Aided Design '),
    createData('Environmental', 'Computer Aided Design ', 'Revit'),
    createData('Airside', 'Computer Aided Design ', 'Revit'),
    createData('Airside Planning ', 'Computer Aided Design ', 'Revit'),
    createData('Environmental', 'Computer Aided Design ', 'Computer Aided Design '),
    createData('Airside', 'Computer Aided Design ', 'Revit'),
    createData('Airside Planning ', 'Computer Aided Design ', 'Revit'),
    createData('Environmental', 'Computer Aided Design ', 'Computer Aided Design '),
    createData('Airside', 'Computer Aided Design ', 'Revit'),
    createData('Airside Planning ', 'Computer Aided Design ', 'Computer Aided Design '),
    createData('Environmental', 'Computer Aided Design ', 'Revit'),
    createData('Airside', 'Computer Aided Design ', 'Computer Aided Design '),
    createData('Airside Planning ', 'Computer Aided Design ', 'Revit'),
    createData('Environmental', 'Computer Aided Design ', 'Computer Aided Design '),
    createData('Airside', 'Computer Aided Design ', 'Revit'),
];

export default function UserSkill() {
    const lgUp = useResponsive('up', 'sm');
    const isDesktop = useResponsive('up', 'sm');
    const [personName, setPersonName] = React.useState([]);
    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setPersonName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };
    const handleClick = () => {
        console.info('You clicked the Chip.');
    };
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };

    const names = [
        'Oliver Hansen',
        'Van Henry',
        'April Tucker',
        'Ralph Hubbard',
        'Omar Alexander',
        'Carlos Abbott',
        'Miriam Wagner',
        'Bradley Wilkerson',
        'Virginia Andrews',
        'Kelly Snyder',
    ];
    return (
        <>


            <Typography
                sx={{
                    marginBottom: '24px',
                    marginTop: '24px',
                }}
                variant="h6"
                component="h2">
                Existing Skills
            </Typography>


            <Grid container >
                <Grid xs={12} md={8}>
                    <Box
                        sx={{
                            border: '2px solid #004a6b',
                            height: 'auto',
                            py: 1,
                            marginRight: '20px',
                            borderRadius: '6px',
                            marginBottom: '12px',
                            ...(isDesktop && {
                                height: '70px',
                                marginBottom: '24px',
                            })
                        }}
                        component="div">
                        <Chip
                            sx={{
                                px: 1, mx: 1, background: '#41a26e', height: '24px'
                            }}
                            label="Power"
                            onClick={handleClick}
                            deleteIcon={<DoneIcon />}
                        />
                        <Chip
                            sx={{ px: 1, mx: 1, background: '#90B5EC', height: '24px' }}
                            label="C#"
                            onClick={handleClick}
                            deleteIcon={<DoneIcon />}
                        />
                        <Chip
                            sx={{ px: 1, mx: 1, background: '#FFC228', height: '24px' }}
                            label="AutoCAD"
                            onClick={handleClick}
                            deleteIcon={<DoneIcon />}
                        />

                    </Box>
                </Grid>
                <Grid xs={12} md={4}
                    sx={{
                        display: 'flex',
                        paddingRight: '12px',
                        marginBottom: '20px',
                        ...(isDesktop && {
                            display: 'block',
                        })
                    }}

                >
                    <Box sx={{
                        display: 'flex', alignItems: 'center', marginBottom: '4px',
                        paddingRight: 2,
                        ...(isDesktop && {
                            display: 'flex', alignItems: 'center', marginBottom: '4px',
                        })
                    }}>
                        <span style={{
                            height: '14px',
                            width: '14px',
                            background: '#FFC228',
                            borderRadius: '100%',
                            marginRight: '8px'
                        }}></span>
                        <span style={{ fontSize: '12px', fontWeight: '600' }}>Beginner</span>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{
                            height: '14px',
                            width: '14px',
                            background: '#41A26E',
                            borderRadius: '100%',
                            marginRight: '8px'
                        }}></span>
                        <span style={{ fontSize: '12px', fontWeight: '600' }}>Intermediate</span>
                    </Box>
                    <Box sx={{
                        display: 'flex', alignItems: 'center', marginBottom: '4px',
                        paddingLeft: 2,
                        ...(isDesktop && {
                            paddingLeft: 0,
                        })
                    }}>
                        <span style={{
                            height: '14px',
                            width: '14px',
                            background: '#90B5EC',
                            borderRadius: '100%',
                            marginRight: '8px'
                        }}></span>
                        <span style={{ fontSize: '12px', fontWeight: '600' }}>Expert</span>
                    </Box>
                </Grid>
            </Grid>

            <Typography
                sx={{
                    marginBottom: '16px'
                }}
                variant="h6"
                component="h2">
                Add Skill
            </Typography>
            <Grid container sx={{ marginBottom: '20px' }} >
                <Grid xs={3}>
                    <FormControl sx={{ width: 250 }}>
                        <InputLabel id="demo-multiple-checkbox-label">Mapped-Skills</InputLabel>
                        <Select
                            size="small"
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            value={personName}
                            onChange={handleChange}
                            input={<OutlinedInput label="Mapped-Skills" />}
                            renderValue={(selected) => selected.join(', ')}
                            MenuProps={MenuProps}
                        >
                            {names.map((name) => (
                                <MenuItem key={name} value={name}>
                                    <Checkbox checked={personName.indexOf(name) > -1} />
                                    <ListItemText primary={name} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid xs={3}>
                </Grid>
                <Grid xs={3}>
                </Grid>
                <Grid xs={3}>
                </Grid>
            </Grid>

            <Paper sx={{ width: '100%', height: '100%', overflow: 'auto' }}>
                <TableContainer
                >
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead
                        >
                            <TableRow>
                                {columns.map((column) => (
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
                            {rows
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                            {columns.map((column) => {
                                                const value = row[column.id];
                                                return (
                                                    <TableCell
                                                        sx={{
                                                            height: '36px',
                                                            padding: '2px 16px',
                                                        }}
                                                        key={column.id} align={column.align}>
                                                        {/* {column.format && typeof value === 'number'
                                                            ? column.format(value)
                                                            : value} */}
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
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>


        </>
    );
}