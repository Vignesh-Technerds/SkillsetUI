import { TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useResponsive } from '../common/responsive';
const TextFieldControl = styled(TextField)(({ theme }) => ({
   
    padding: '0px',
    '& label.Mui-focused': {
        color: theme.palette.primary,
        '&::placeholder': {
            color: 'red !important', // Customize the placeholder color
          },
    },
    '& .MuiInputBase-input::placeholder': {
        color: '#ccc !important', // Customize the placeholder color
      },
    '& .MuiInput-underline:after': {
        borderBottomColor: theme.palette.primary,
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: theme.palette.secondary,
            innerHeight:10,
        },
        '&:hover fieldset': {
            borderColor: theme.palette.secondary,
        },
        '&.Mui-focused fieldset': {
            borderColor: theme.palette.primary,
        },
        '& .Mui-disabled': {
            backgroundColor: '#eee',
            borderRadius:'8px',
            color: theme.palette.text.disabled,
            // Add any other styles for the disabled state here
          },
        width: '100%',
         ...(useResponsive('up', 'sm') && {
            width: '364px',
                        })
    },
}));
const FormControl = {
    TextField: TextFieldControl
}
export default FormControl;
