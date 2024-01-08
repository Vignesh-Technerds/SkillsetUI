import { Backdrop } from '@mui/material';
import { Triangle } from 'react-loader-spinner';

const Loader = (props) => {

    return props.showLoader && <Backdrop open
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
        <Triangle
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="triangle-loading"
            wrapperStyle={{}}
            wrapperClassName=""
            visible={true}
        />
    </Backdrop>

}
export default Loader;