import SkillGroupingStepOne from "./skillGroupingStepOne.component";
import SkillGroupingStepTwo from "./skillGroupingStepTwo.component";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Button } from '@mui/material';
import { useResponsive } from "../common/responsive";
import { useEffect, useRef, useState } from "react";
import { HttpServices } from "../../services/httpService";
import { UrlService } from "../../services/urlService";
import { useToaster } from "../toaster/toasterContext";

const SkillGroupingDialog = (props) => {
    const isDesktop = useResponsive('up', 'sm');
    const [view, setView] = useState(props.stepView);
    const {showToast} = useToaster();
    const [skillSet, setSkillSet] = useState(null);
    const skillGroupingStepOneRef = useRef(null);
    const skillGroupingStepTwoRef = useRef(null);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

    useEffect(() => {
        initSkillGroupingData();
    }, []);

    const initSkillGroupingData = () => {
        HttpServices.Get(UrlService.initSkillGroupingData)
            .then((result) => result.data)
            .then((response) => {
                if (response.status) {
                    if (response.data) {
                        let data = JSON.parse(response.data);
                        setSkillSet({ ...data });
                    } else showToast(response.data, "s");
                } else showToast(response.data, "e");
            }).catch((error) => {
                console.log(error);
                showToast("Server error: Please contact Administrator", "e");
            });
    };

    const handleNext = () => {
        handleViewOperation(true);
    }

    const handleSubmit = () => {
        handleViewOperation();
    }

    const handleViewOperation = (isNextButtonClicked = false) => {
        if (view == "step 1") {
            if (skillGroupingStepOneRef.current) {
                skillGroupingStepOneRef.current.saveSkillCategoryData(isNextButtonClicked);
                if (isNextButtonClicked) setView("step 2");
            }
        }
        else {
            if (skillGroupingStepTwoRef.current) {
                skillGroupingStepTwoRef.current.saveTechnicalServiceSkillCategoryData();
            }
        }
    }

    const isDisabledSubmitcheck = (isDisabled = true) => {
        setIsSubmitDisabled(isDisabled);
    }

    return (
        <Dialog
            sx={{ m: 1, minWidth: 850, margin: '0 auto', width: '800px', display: 'block' }}
            open
            fullWidth={props.fullWidth}
            maxWidth={"lg"}
            onClose={props.handleDialogClose}
            aria-labelledby="responsive-dialog-title"
        >
            <DialogTitle
                sx={{ padding: '16px 36px' }}
                id="responsive-dialog-title">
                {(view == "step 1") ? 'Step 1/2' : 'Step 2/2'}
            </DialogTitle>
            <DialogContent
                sx={{
                    margin: '2px 12px',
                }}
            >
                {skillSet && (
                    (view == "step 1") ?
                        <SkillGroupingStepOne
                            ref={skillGroupingStepOneRef}
                            skillSet={skillSet}
                            isDisabledSubmitcheck={isDisabledSubmitcheck}
                        />
                        :
                        <SkillGroupingStepTwo
                            ref={skillGroupingStepTwoRef}
                            skillSet={skillSet}
                            handleDialogClose={props.handleDialogClose}
                            isDisabledSubmitcheck={isDisabledSubmitcheck}
                        />
                )}
            </DialogContent>
            <DialogActions
                sx={{
                    padding: '8px 0px 24px 28px',
                    marginRight: '28px',
                    display: 'flex',
                    justifyContent: 'start',
                    marginLeft: 2,
                    ...(isDesktop && {
                        justifyContent: 'end'
                    })
                }}>
                <Button
                    sx={{
                        marginRight: 2,
                        height: '32px',
                        width: '84px'

                    }}
                    variant="contained" size="medium" color="secondary"
                    autoFocus onClick={props.handleDialogClose}>
                    Cancel
                </Button >
                <Button
                    sx={{
                        marginRight: 2,
                        height: '32px',
                        width: '84px'
                    }}
                    variant="contained" size="medium" color="primary"
                    onClick={handleSubmit} autoFocus
                    disabled={isSubmitDisabled}>
                    Submit
                </Button>
                {(view == "step 1") && <Button
                    sx={{
                        marginRight: 2,
                        height: '32px',
                        width: '84px'
                    }}
                    variant="contained" size="medium" color="success"
                    onClick={handleNext} autoFocus>
                    Next
                </Button>}
            </DialogActions>
        </Dialog>
    );
}

export default SkillGroupingDialog;