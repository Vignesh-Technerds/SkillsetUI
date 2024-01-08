import { Button, Grid, Typography } from "@mui/material";
import FormControl from "../form-controls/formControl.component";
import { AddCircle, Edit, Search } from "@mui/icons-material";
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { useEffect, useState } from "react";
import { CommonHelper } from "../../helpers/commonHelper";
import { useToaster } from "../toaster/toasterContext";
import { UrlService } from "../../services/urlService";
import { HttpServices } from "../../services/httpService";
import { useResponsive } from '../common/responsive';
import { Box } from "@mui/system";

const SkillSetForm = (props) => {
    const isDesktop = useResponsive('up', 'sm');
    const [originalSkillSet, setOriginalSkillSet] = useState([]);
    const [skillSet, setSkillSet] = useState([]);
    const [filteredSkillSet, setFilteredSkillSet] = useState([]);
    const [skillSetText, setSkillSetText] = useState("");
    const [searchText, setSearchText] = useState("");
    const [currentEditData, setCurrentEditData] = useState(null);
    const { showToast } = useToaster();
    const [isSaveDisabled, setIsSaveDisabled] = useState(true);

    useEffect(() => {
        getSkillSet();
    }, []);

    useEffect(() => {
        let _originalSkillSet = originalSkillSet.map(obj => ({ ...obj }));
        setSkillSet(_originalSkillSet);
    }, [originalSkillSet]);

    useEffect(() => {
        let _filteredSkillSet = getFilteredSkillSet(searchText);
        setFilteredSkillSet(_filteredSkillSet);
    }, [skillSet, searchText]);

    useEffect(() => {
        setIsSaveDisabled(isCheckSaveDisable());
    }, [skillSet]);

    const isCheckSaveDisable = () => {
        let isSaveDisable = true;
        let _skillSet = [...skillSet];
        let _originalSkillSet = [...originalSkillSet];
        if (_skillSet.length !== _originalSkillSet.length) {
            isSaveDisable = false;
        }
        else {
            _originalSkillSet.forEach((item) => {
                const skillSetItem = _skillSet.find(x => x.id === item.id);
                if (item.name !== skillSetItem.name || item.action !== skillSetItem.action) {
                    isSaveDisable = false;
                    return;
                }
            });
        }
        return isSaveDisable;
    }

    const getSkillSet = () => {
        let url = UrlService.getSkillSet;
        url = url.replace('#skillSetType#', props.skillSetType);
        HttpServices.Get(url)
            .then((result) => result.data)
            .then((response) => {
                if (response.status) {
                    let data = JSON.parse(response.data);
                    let formatedSkillSet = formatSkillSet(data, "none");
                    setOriginalSkillSet([...formatedSkillSet]);
                } else showToast(response.message, "e");
            }).catch((error) => {
                console.log(error);
                showToast("Server error: Please contact Administrator", "e");
            });
    }

    const formatSkillSet = (data, action) => {
        return data.map(x => {
            return {
                id: x.id,
                name: x.name,
                action: action,
                isEditable: false,
            };
        });
    }

    const handleTextChange = (event) => {
        setSkillSetText(event.target.value);
    }

    const handleCancelClick = () => {
        setOriginalSkillSet([...originalSkillSet]);
        setSkillSetText("");
        setSearchText("");
        setIsSaveDisabled(true);
    }
    const handleEditText = (data, value) => {
        let _skillSet = [...skillSet];
        let editData = _skillSet.find(a => a.id === data.id);
        if (editData) {
            editData.name = value;
            setCurrentEditData(editData);
        }
        if (editData.action === "none")
            editData.action = "update";
        setSkillSet(_skillSet);
    }

    const handleEditClick = (data) => {
        let _skillSet = [...skillSet];
        let editData = _skillSet.find(a => a.id === data.id);
        if (editData)
            editData.isEditable = true;
        setSkillSet(_skillSet);
    }

    const handleDeleteClick = (data) => {
        let _skillSet = [...skillSet];
        let deleteData = _skillSet.find(a => a.id === data.id);
        if (deleteData && (deleteData.action === "none" || deleteData.action === "update")) {
            deleteData.action = "delete"
        }
        else {
            _skillSet = _skillSet.filter(x => x.id !== data.id);
        }
        setSkillSet(_skillSet);
    }
    const handleAddClick = () => {
        if (skillSetText?.trim()) {
            let _skillSet = [...skillSet];
            if (!_skillSet.some(x => x.name.trim().toLowerCase() === skillSetText.trim().toLowerCase())) {
                let masterRowValue = { id: CommonHelper.GetRandomUniqueNumber(), name: skillSetText.trim(), action: "create", isEditable: false };
                _skillSet.push(masterRowValue);
                setSkillSet(_skillSet);
                setSkillSetText("");
            }
            else {
                showToast(`The entered value "${skillSetText}" exists in the system`, "w");
            }

        } else {
            showToast(`Please enter the ${props.label}`, "w");
        }
    };

    const handleSearch = (event) => {
        let _searchText = event.target.value;
        setSearchText(_searchText);
        if (currentEditData) {
            setCurrentEditData(null);
        }
    }

    const getFilteredSkillSet = (searchText) => {
        let _skillSet = [...skillSet];
        let _filteredSkillSet = _skillSet.filter(x => x.name?.toLowerCase().includes(searchText?.toLowerCase())
            || (searchText && x.id == currentEditData?.id));
        return _filteredSkillSet;
    }

    const handleSaveClick = () => {
        let skillSetRequest = {};
        skillSetRequest.skillSetCreate = [];
        skillSetRequest.skillSetUpdate = [];
        skillSetRequest.skillSetDelete = [];
        skillSetRequest.skillSetType = props.skillSetType;
        skillSet.map(x => {
            if (x.action === "create") {
                skillSetRequest.skillSetCreate.push(x.name);
            }
            else if (x.action === "update") {
                skillSetRequest.skillSetUpdate.push({ id: x.id, name: x.name });
            }
            else if (x.action === "delete") {
                skillSetRequest.skillSetDelete.push(x.id);
            }
        });

        if (skillSetRequest.skillSetCreate.length > 0 ||
            skillSetRequest.skillSetUpdate.length > 0 ||
            skillSetRequest.skillSetDelete.length > 0) {
            HttpServices.Post(UrlService.processSkillSet, skillSetRequest)
                .then((result) => result.data)
                .then((response) => {
                    if (response.status) {
                        let data = JSON.parse(response.data);
                        if (data)
                            showToast(`The entered value "${data}" exists in the system`, "w");
                        else
                            showToast(response.message, "s");
                        getSkillSet();
                    } else showToast(response.message, "e");
                }).catch((error) => {
                    console.log(error);
                    showToast("Server error: Please contact Administrator", "e");
                });
        }
    }

    return (
        <>
            <Typography
                sx={{
                    marginBottom: '24px',
                    marginTop: '15px'
                }}
                variant="h6"
                component="h2">
                {props.heading}
            </Typography>
            <FormControl.TextField
                sx={{
                    width: '100%',
                    marginBottom: '32px',
                    cursor: 'pointer'
                }}
                id="filled-search"
                label="Search"
                type="search"
                size="small"
                value={searchText}
                onChange={handleSearch}
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
                isDesktop
            />
            <Grid container rowSpacing={1}
                sx={{
                    marginBottom: 1,
                    marginLeft: '0px',
                }}
            >
                <Stack direction="row" spacing={1}>
                    <FormControl.TextField
                        id="SkillSetInput"
                        size="small"
                        label={props.label}
                        value={skillSetText}
                        onChange={handleTextChange}
                        isDesktop
                        InputLabelProps={{
                            style: { color: '#999' }, // Inline styles for the label
                        }}
                    />
                    <IconButton
                        sx={{
                            height: '34px',
                            width: '34px',
                            padding: '3px',
                            marginTop: '4px !important',
                        }}
                        aria-label="Add Item"
                        onClick={handleAddClick}>
                        <AddCircle
                        />
                    </IconButton>
                </Stack>

            </Grid>
            <Box container="div"
                sx={{
                    height: 'calc(100vh - 302px)',
                    marginBottom: 2,
                    paddingTop: 2,
                    overflow: 'auto',
                    width: '100%',
                    ...(isDesktop && {
                        width: '48%',
                    })
                }}
            >
                <Grid container rowSpacing={1}
                    sx={{
                        marginLeft: '0px',
                    }}
                    columnSpacing={{ sm: 0, md: 0 }}
                >
                    {filteredSkillSet && filteredSkillSet.length > 0 && filteredSkillSet.filter(data => data.action !== "delete").map((data, index) => (<Stack
                        sx={{
                            width: '100%',
                            height: 'auto',
                            marginBottom: '12px'
                        }}
                        key={index} direction="row" spacing={1}>
                        <FormControl.TextField
                            size="small"
                            value={data.name}
                            disabled={!data.isEditable}
                            onChange={(event) => { handleEditText(data, event.target.value) }}
                            isDesktop
                        />
                        <IconButton
                            sx={{
                                height: '34px',
                                width: '34px',
                                padding: '3px',
                                marginTop: '4px !important',
                            }}
                            aria-label="Edit" onClick={() => { handleEditClick(data) }}>
                            <Edit />
                        </IconButton>
                        <IconButton
                            sx={{
                                height: '34px',
                                width: '34px',
                                padding: '3px',
                                marginTop: '4px !important',
                            }}
                            aria-label="Delete" onClick={() => { handleDeleteClick(data) }}>
                            <RemoveCircleIcon color="error"
                            />
                        </IconButton>
                    </Stack>))}
                </Grid>
            </Box>


            <Grid xs md={4} mdOffset={8} display={'flex'} right={'10px'} width={'100%'} bottom={'30px'} justifyContent={'end'} position={'absolute'} >
                <Button
                    sx={{
                        marginRight: 2,
                        height: '32px',
                        width: '94px'

                    }}
                    variant="contained" size="medium" color="secondary"
                    onClick={handleCancelClick}>
                    Cancel
                </Button>
                <Button
                    sx={{
                        marginRight: 2,
                        height: '32px',
                        width: '94px'

                    }}
                    variant="contained" size="medium" color="primary"
                    disabled={isSaveDisabled}
                    onClick={handleSaveClick}>
                    Save
                </Button>
            </Grid>
        </>
    )
}

export default SkillSetForm;