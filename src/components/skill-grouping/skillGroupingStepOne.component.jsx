
import Checkbox from '@mui/material/Checkbox';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormLabel from '@mui/material/FormLabel';
import { useResponsive } from '../common/responsive';
import { Box, IconButton, Grid, FormGroup, FormControlLabel, TextField } from '@mui/material';
import { Search } from "@mui/icons-material";
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { HttpServices } from '../../services/httpService';
import { UrlService } from '../../services/urlService';
import { useToaster } from '../toaster/toasterContext';

const SkillGroupingStepOne = forwardRef((props, ref) => {
    const isDesktop = useResponsive('up', 'sm');
    const categoryData = props.skillSet?.categoryData;
    const skillData = props.skillSet?.skillData;
    const [filteredCategoryData, setFilteredCategoryData] = useState([]);
    const [filteredSkillData, setFilteredSkillData] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(props.skillSet?.categoryData[0]?.id);
    const [skillCategoryData, setSkillCategoryData] = useState([]);
    const [originalSkillCategoryData, setOriginalSkillCategoryData] = useState([]);
    const { showToast } = useToaster();
    const [categorySearchText, setCategorySearchText] = useState("");
    const [skillSearchText, setSkillSearchText] = useState("");

    useEffect(() => {
        getSkillCategory();
    }, []);

    useEffect(() => {
        let _originalSkillCategoryData = JSON.parse(JSON.stringify(originalSkillCategoryData));
        setSkillCategoryData(_originalSkillCategoryData);
    }, [originalSkillCategoryData]);

    useEffect(() => {
        let skillCategoryActionData = getSkillCategoryActionData();
        if (skillCategoryActionData?.skillCategoryCreate.length > 0 
            || skillCategoryActionData?.skillCategoryDelete.length > 0) {
            props.isDisabledSubmitcheck(false);
        } else props.isDisabledSubmitcheck(true);
    }, [skillCategoryData]);

    useEffect(() => {
        let _filteredCategoryData = getFilteredCategoryData(categorySearchText);
        setFilteredCategoryData(_filteredCategoryData);
    }, [categoryData, categorySearchText]);

    useEffect(() => {
        let _filteredSkillData = getFilteredSkillData(skillSearchText);
        setFilteredSkillData(_filteredSkillData);
    }, [skillData, skillSearchText]);

    useImperativeHandle(ref, () => ({
        saveSkillCategoryData
    }));

    const handleCategorySearch = (event) => {
        let _searchText = event.target.value;
        setCategorySearchText(_searchText);
    };

    const handleSkillSearch = (event) => {
        let _searchText = event.target.value;
        setSkillSearchText(_searchText);
    };

    const getFilteredCategoryData = (searchText) => {
        let _categoryData = [...categoryData];
        let _filteredCategoryData = _categoryData.filter((x) =>
            x.name?.toLowerCase().trim().includes(searchText?.toLowerCase().trim()));
        return _filteredCategoryData;
    };

    const getFilteredSkillData = (searchText) => {
        let _skillData = [...skillData];
        let _filteredSkillData = _skillData.filter((x) =>
            x.name?.toLowerCase().trim().includes(searchText?.toLowerCase().trim()));
        return _filteredSkillData;
    };

    const getSkillCategory = () => {
        HttpServices.Get(UrlService.getSkillCategoryData)
            .then((result) => result.data)
            .then((response) => {
                if (response.status) {
                    let data = JSON.parse(response.data);
                    setOriginalSkillCategoryData(formatSkillCategoryData(data));
                } else showToast(response.message, "e");
            }).catch((error) => {
                console.log(error);
                showToast("Server error: Please contact Administrator", "e");
            });
    }

    const handleCategoryChange = (event) => {
        setSelectedCategoryId(parseInt(event.target.value, 10));
    }

    const handleCheckboxChange = (data) => {
        let _skillCategoryData = [...skillCategoryData];
        const existingIndex = _skillCategoryData.findIndex(item => item.skillId === data.id);
        if (existingIndex === -1) {
            let skillCategoryCreation = {
                categoryId: selectedCategoryId,
                skillId: data.id
            };
            _skillCategoryData.push(skillCategoryCreation);
        } else _skillCategoryData.splice(existingIndex, 1);
        setSkillCategoryData(_skillCategoryData);
    }

    const formatSkillCategoryData = (data) => {
        return data.map(x => {
            return {
                skillId: x.skillId,
                categoryId: x.categoryId
            };
        });
    }

    const isDisableSkill = (data) => {
        let disableCheckbox = true;
        if (skillCategoryData.length > 0 && skillCategoryData.some(x => x.categoryId == selectedCategoryId && x.skillId == data.id)) {
            disableCheckbox = false;
        }
        else {
            disableCheckbox = skillCategoryData.some(x => x.categoryId != selectedCategoryId && x.skillId == data.id);
        }
        return disableCheckbox;
    }

    const isDefaultChecked = (data) => {
        return skillCategoryData.some(x => x.skillId == data.id);
    }

    const getSkillCategoryActionData = () =>{
        let _originalSkillCategoryData = [...originalSkillCategoryData];
        let _skillCategoryData = [...skillCategoryData];

        let skillCategoryCreate = _skillCategoryData.filter(x => !_originalSkillCategoryData.map(x => x.skillId).includes(x.skillId));
        let skillCategoryDelete = _originalSkillCategoryData.filter(x => !_skillCategoryData.map(x => x.skillId).includes(x.skillId));
        
        let skillCategoryRequest = {
            skillCategoryCreate,
            skillCategoryDelete
        };
        return skillCategoryRequest;
    }

    const saveSkillCategoryData = (isNextButtonClicked) => {
        let skillCategoryRequest = getSkillCategoryActionData();
        if (skillCategoryRequest.skillCategoryCreate.length > 0 || skillCategoryRequest.skillCategoryDelete.length > 0) {
            HttpServices.Post(UrlService.processSkillCategoryData, skillCategoryRequest)
                .then((result) => result.data)
                .then((response) => {
                    if (response.status) {
                        showToast(response.message, "s");
                        if(!isNextButtonClicked) getSkillCategory();
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
                        container='h4'>
                        Category
                    </Box>
                </Box>
                <Box
                    sx={{
                        border: '1px solid #ccc',
                        height: '300px',
                        overflow: 'auto',
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
                        value={categorySearchText}
                        onChange={handleCategorySearch}
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
                        <FormLabel id="demo-radio-buttons-group-label"></FormLabel>
                        <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            value={selectedCategoryId}
                            name="radio-buttons-group"
                            onChange={handleCategoryChange}
                            sx={{
                                padding: '8px 4px',
                                marginLeft: '4px',
                            }}
                        >
                            {filteredCategoryData && filteredCategoryData.map((category) => (
                                <FormControlLabel
                                    key={category.id}
                                    value={category.id}
                                    control={
                                        <Radio
                                            sx={{
                                                padding: '2px 4px',
                                                fontSize: '12px'
                                            }}
                                        />
                                    }
                                    label={category.name}
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
                        Skill
                    </Box>
                </Box>

                <Box
                    sx={{
                        border: '1px solid #ccc',
                        height: '300px',
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
                        value={skillSearchText}
                        onChange={handleSkillSearch}
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
                        {filteredSkillData && filteredSkillData.map((skillData, index) => (
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
                                        checked={isDefaultChecked(skillData)}
                                        onChange={() => handleCheckboxChange(skillData)}
                                        disabled={isDisableSkill(skillData)}
                                    />
                                }
                                label={skillData.name}
                            />
                        ))}
                    </FormGroup>
                </Box>
            </Grid>
        </Grid>
    </Grid>);
});

export default SkillGroupingStepOne;