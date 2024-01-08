
import Checkbox from '@mui/material/Checkbox';
import { useResponsive } from '../common/responsive';
import { Box, IconButton, Grid, FormGroup, FormControlLabel, TextField, RadioGroup, Radio, FormLabel } from '@mui/material';
import { Search } from "@mui/icons-material";
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { HttpServices } from '../../services/httpService';
import { UrlService } from '../../services/urlService';
import { useToaster } from '../toaster/toasterContext';

const SkillGroupingStepTwo = forwardRef((props, ref) => {
    const isDesktop = useResponsive('up', 'sm');
    const { showToast } = useToaster();
    const technicalServiceData = props.skillSet?.techincalServiceData;
    const [skillCategoryData, setSkillCategoryData] = useState([]);
    const [originalTechnicalServiceSkillCategoryData, setOriginalTechnicalServiceSkillCategoryData] = useState([]);
    const [technicalServiceSkillCategoryData, setTechnicalServiceSkillCategoryData] = useState([]);
    const [filteredTechnicalServiceData, setfilteredTechnicalServiceData] = useState([]);
    const [technicalServiceSearchText, setTechnicalServiceSearchText] = useState("");
    const [filteredSkillCategoryData, setFilteredSkillCategoryData] = useState([]);
    const [skillCategorySearchText, setSkillCategorySearchText] = useState("");
    const [selectedTechnicalServiceId, setSelectedTechnicalServiceId] = useState(props.skillSet?.techincalServiceData[0]?.id);

    useEffect(() => {
        getSkillCategory();
        getTechnicalServiceSkillCategory();
        props.isDisabledSubmitcheck(true);
    }, []);

    useEffect(() => {
        let _originalTechnicalServiceSkillCategoryData = originalTechnicalServiceSkillCategoryData.map(obj => ({ ...obj }));
        setTechnicalServiceSkillCategoryData(_originalTechnicalServiceSkillCategoryData);
    }, [originalTechnicalServiceSkillCategoryData]);

    useEffect(() => {
        let _filteredTechnicalServiceData = getfilteredTechnicalServiceData(technicalServiceSearchText);
        setfilteredTechnicalServiceData(_filteredTechnicalServiceData);
    }, [technicalServiceData, technicalServiceSearchText]);

    useEffect(() => {
        let _filteredSkillCategoryMasterData = getFilteredSkillCategoryMasterData(skillCategorySearchText);
        setFilteredSkillCategoryData(_filteredSkillCategoryMasterData);
    }, [skillCategoryData, skillCategorySearchText]);

    useEffect(() => {
        let skillCategoryTechnicalServiceActionData = getSkillCategoryTechnicalServiceActionData();
        if (skillCategoryTechnicalServiceActionData?.skillCategoryTechnicalServiceCreate.length > 0 
            || skillCategoryTechnicalServiceActionData?.skillCategoryTechnicalServiceDelete.length > 0) {
            props.isDisabledSubmitcheck(false);
        } else props.isDisabledSubmitcheck(true);
    }, [technicalServiceSkillCategoryData]);

    useImperativeHandle(ref, () => ({
        saveTechnicalServiceSkillCategoryData
    }));

    const getSkillCategory = () => {
        HttpServices.Get(UrlService.getSkillCategoryData)
            .then((result) => result.data)
            .then((response) => {
                if (response.status) {
                    let data = JSON.parse(response.data);
                    setSkillCategoryData([...data]);
                } else showToast(response.message, "e");
            }).catch((error) => {
                console.log(error);
                showToast("Server error: Please contact Administrator", "e");
            });
    }

    const handleTechnicalServiceSearch = (event) => {
        let _searchText = event.target.value;
        setTechnicalServiceSearchText(_searchText);
    };

    const handleSkillCategorySearch = (event) => {
        let _searchText = event.target.value;
        setSkillCategorySearchText(_searchText);
    };

    const getfilteredTechnicalServiceData = (searchText) => {
        let _technicalServiceData = [...technicalServiceData];
        let _filteredTechnicalServiceData = _technicalServiceData.filter(
            (x) =>
                x.name?.toLowerCase().trim().includes(searchText?.toLowerCase().trim()));
        return _filteredTechnicalServiceData;
    };

    const getFilteredSkillCategoryMasterData = (searchText) => {
        let _skillCategoryData = [...skillCategoryData];
        let _filteredSkillCategoryMasterData = _skillCategoryData.filter(
            (x) =>
            (x.categoryName?.toLowerCase().trim().includes(searchText?.toLowerCase().trim()) ||
                x.skillName?.toLowerCase().trim().includes(searchText?.toLowerCase().trim()))
        );
        return _filteredSkillCategoryMasterData;
    };

    const getTechnicalServiceSkillCategory = () => {
        HttpServices.Get(UrlService.getSkillCategoryTechnicalServiceData)
            .then((result) => result.data)
            .then((response) => {
                if (response.status) {
                    let data = JSON.parse(response.data);
                    setOriginalTechnicalServiceSkillCategoryData(formatSkillCategoryTechnicalServiceData(data));
                } else showToast(response.message, "e");
            }).catch((error) => {
                console.log(error);
                showToast("Server error: Please contact Administrator", "e");
            });
    }

    const formatSkillCategoryTechnicalServiceData = (data) => {
        return data.map(x => {
            return {
                skillCategoryId: x.skillCategoryId,
                technicalServiceId: x.technicalServiceId
            };
        });
    }

    const handleTechnicalServiceChange = (event) => {
        setSelectedTechnicalServiceId(parseInt(event.target.value, 10));
    }

    const handleCheckboxChange = (data) => {
        let _technicalServiceSkillCategoryData = [...technicalServiceSkillCategoryData];
        const existingIndex = _technicalServiceSkillCategoryData.findIndex(item =>
            item.skillCategoryId === data.skillCategoryId &&
            item.technicalServiceId === selectedTechnicalServiceId);
        if (existingIndex === -1) {
            let technicalServiceSkillCategoryDataCreation = {
                skillCategoryId: data.skillCategoryId,
                technicalServiceId: selectedTechnicalServiceId
            };
            _technicalServiceSkillCategoryData.push(technicalServiceSkillCategoryDataCreation);
        } else _technicalServiceSkillCategoryData.splice(existingIndex, 1);
        setTechnicalServiceSkillCategoryData(_technicalServiceSkillCategoryData);
    }

    const isDefaultChecked = (data) => {
        return technicalServiceSkillCategoryData.some(x => x.skillCategoryId == data.skillCategoryId && x.technicalServiceId == selectedTechnicalServiceId);
    }

    const handleDialogClose = () => {
        props.handleDialogClose();
    }

    const getSkillCategoryTechnicalServiceActionData = () => {
        let _originalTechnicalServiceSkillCategoryData = [...originalTechnicalServiceSkillCategoryData];
        let _technicalServiceSkillCategoryData = [...technicalServiceSkillCategoryData];

        let skillCategoryTechnicalServiceCreate = _technicalServiceSkillCategoryData.filter((newItem) =>
            !_originalTechnicalServiceSkillCategoryData.some((originalItem) =>
                originalItem.technicalServiceId === newItem.technicalServiceId &&
                originalItem.skillCategoryId === newItem.skillCategoryId
            )
        );
        let skillCategoryTechnicalServiceDelete = _originalTechnicalServiceSkillCategoryData.filter(
            (originalItem) => !_technicalServiceSkillCategoryData.some((newItem) =>
                originalItem.technicalServiceId === newItem.technicalServiceId &&
                originalItem.skillCategoryId === newItem.skillCategoryId
            ));
       
        let skillCategoryTechnicalServiceData = {
            skillCategoryTechnicalServiceCreate,
            skillCategoryTechnicalServiceDelete
        };
        return skillCategoryTechnicalServiceData;
    }

    const saveTechnicalServiceSkillCategoryData = () => {
        let skillCategoryTechnicalServiceRequest = getSkillCategoryTechnicalServiceActionData();
        if (skillCategoryTechnicalServiceRequest.skillCategoryTechnicalServiceCreate.length > 0 ||
            skillCategoryTechnicalServiceRequest.skillCategoryTechnicalServiceDelete.length > 0) {
            HttpServices.Post(UrlService.processSkillCategoryTechnicalServiceData, skillCategoryTechnicalServiceRequest)
                .then((result) => result.data)
                .then((response) => {
                    if (response.status) {
                        showToast(response.message, "s");
                        handleDialogClose();
                    } else showToast(response.message, "e");
                }).catch((error) => {
                    console.log(error);
                    showToast("Server error: Please contact Administrator", "e");
                });
        }
    }

    return (<Grid
        sx={{
            margin: '2px 12px',
        }}
    >
        <Grid container spacing={0}>
            <Grid sx={{
                marginTop: '14px',
                ...(isDesktop && {
                    paddingRight: '8px',
                    marginTop: '0px',
                })
            }} xs={12} md={6}>
                <Box
                    sx={{
                        border: '1px solid #ccc',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                    }}
                    container='div'>
                    <Box
                        sx={{
                            px: 1,
                        }}
                        container='h5'>
                        Technical Service
                    </Box>
                </Box>

                <Box
                    sx={{
                        border: '1px solid #ccc',
                        px: 2,
                    }}
                    container='div'>
                    <TextField
                        sx={{
                            width: '100%',
                            marginTop: '20px'
                        }}
                        id="filled-search"
                        label="Search"
                        type="search"
                        size="small"
                        value={technicalServiceSearchText}
                        onChange={handleTechnicalServiceSearch}
                        InputProps={{
                            startAdornment: (
                                <IconButton position="end"
                                    sx={{
                                        height: '40px',
                                        padding: '4px 0px'
                                    }}>
                                    <Search />
                                </IconButton>
                            ),
                        }}
                    />
                    <Box
                        sx={{
                            overflowY: 'auto',
                            height: '230px',
                            flexWrap: 'nowrap',
                        }}
                        container="div">
                        <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            value={selectedTechnicalServiceId}
                            name="radio-buttons-group"
                            onChange={handleTechnicalServiceChange}
                            sx={{
                                padding: '8px 4px',
                                marginLeft: '4px',
                            }}
                        >
                            {filteredTechnicalServiceData && filteredTechnicalServiceData.map((technicalServiceData) => (
                                <FormControlLabel
                                    key={technicalServiceData.id}
                                    value={technicalServiceData.id}
                                    control={
                                        <Radio
                                            sx={{
                                                padding: '2px 4px',
                                                fontSize: '12px'
                                            }}
                                        />
                                    }
                                    label={technicalServiceData.name}
                                />
                            ))}
                        </RadioGroup>
                    </Box>
                </Box>
            </Grid>
            <Grid xs={12} md={6}>
                <Box
                    sx={{
                        border: '1px solid #ccc',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                    }}
                    container='div'>
                    <Box
                        sx={{
                            px: 1,
                        }}
                        container='h5'>
                        Mapped Skills - Categories
                    </Box>
                </Box>

                <Box
                    sx={{
                        border: '1px solid #ccc',
                        px: 2,
                    }}
                    container='div'>
                    <TextField
                        sx={{
                            width: '100%',
                            marginTop: '20px'
                        }}
                        id="filled-search"
                        label="Search"
                        type="search"
                        size="small"
                        value={skillCategorySearchText}
                        onChange={handleSkillCategorySearch}
                        InputProps={{
                            startAdornment: (
                                <IconButton position="end"
                                    sx={{
                                        height: '40px',
                                        padding: '4px 0px'
                                    }}>
                                    <Search />
                                </IconButton>
                            ),
                        }}
                    />
                    <FormGroup
                        sx={{
                            paddingLeft: '10px',
                            paddingTop: '8px',
                            fontSize: '14px',
                            overflowY: 'auto',
                            height: '230px',
                            flexWrap: 'nowrap',
                            '.MuiFormControlLabel-label': {
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                width: '100%',
                                position: 'relative'
                            }
                        }}
                    >
                        {filteredSkillCategoryData && filteredSkillCategoryData.map((skillCategoryData, index) => (
                            <FormControlLabel
                                key={index}
                                sx={{
                                    py: 0,

                                }}
                                control={
                                    <Checkbox

                                        sx={{
                                            py: 0.5,
                                            padding: '4px 2px',
                                            fontSize: '14px'
                                        }}
                                        checked={isDefaultChecked(skillCategoryData)}
                                        onChange={() => handleCheckboxChange(skillCategoryData)}
                                    />
                                }
                                label={`${skillCategoryData.categoryName} - ${skillCategoryData.skillName}`}
                            />
                        ))}
                    </FormGroup>
                </Box>
            </Grid>
        </Grid>
    </Grid>);
});

export default SkillGroupingStepTwo;