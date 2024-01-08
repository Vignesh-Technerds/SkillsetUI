import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

const ApproveConfirmationDialog = ({ open, handleDialogClose, handleApproveClick }) => {
    
  return (
    <Dialog
        sx={{ m: 1, minWidth: 500, margin: '0 auto', width: '500px', display: 'block' }}
        open={open} maxWidth={"lg"}
        >
        <DialogTitle
            sx={{ padding: '16px 36px' }}>
            Confirm !
        </DialogTitle>
        <DialogContent
            sx={{
                margin: '2px 12px',
                height: 60,
            }}
        > 
            Are you sure, you want to approve ?
        </DialogContent>
        <DialogActions
            sx={{
                padding: '18px 8px',
                display:'flex',
                justifyContent:'end',
                marginLeft: 2,
            }}>
            <Button
                sx={{
                    marginRight: 1,
                    height: '32px',
                    width: '84px'
                }}
                variant="contained" size="medium" color="secondary"
                autoFocus onClick={handleDialogClose}>
                Cancel
            </Button >
            <Button
                sx={{
                    marginRight: 2,
                    height: '32px',
                    width: '84px'
                }}
                variant="contained" size="medium" color="primary"
                onClick={handleApproveClick}
                autoFocus>
                Approve
            </Button>
        </DialogActions>
    </Dialog>
  );
};

export default ApproveConfirmationDialog;
