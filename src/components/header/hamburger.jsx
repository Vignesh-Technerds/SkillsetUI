import { Box } from "@mui/material";
import HamburgerImg from "../../assets/images/icons/Hamburger_Menu.svg";
import { useResponsive } from "../common/responsive";

const Hamburger = ({ openNav, handleNav }) => {
    const isDesktop = useResponsive('up', 'sm');
    return <Box
        sx={{
            position: 'absolute',
            right: 30,
            top: '12px',
            zIndex: 9,
            ...(isDesktop && {
                top: '72px',
            })
        }}
    >
        <Box
            component="img"
            sx={{
                height: 14,
                cursor: 'pointer'
            }}
            src={HamburgerImg}
            onClick={() => handleNav(!openNav)}
        >
        </Box>
    </Box>
}
export default Hamburger;