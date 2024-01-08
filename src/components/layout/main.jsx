import Box from '@mui/material/Box';
import { useResponsive } from '../common/responsive';
import { NAV, HEADER } from './config-layout';
const SPACING = 8;
export default function Main({ children, sx, ...other }) {
  const lgUp = useResponsive('up', 'lg');
  const isDesktop = useResponsive('up', 'lg');
  return (
    <Box
      component="main"
      sx={{ 
        flexGrow: 1,
        minHeight:'calc(100vh - 80px)',
        display: 'flex',        
        flexDirection: 'column',
         py: `${HEADER.H_MOBILE + SPACING}px`,
         background:'#fff',
         px:2,
        ...(lgUp && {
          px: 2,
          marginTop:8,
          paddingTop:2,
          background:'#fff',
          py: `${HEADER.H_DESKTOP + SPACING}px`,
          width: `calc(100% - ${NAV.WIDTH}px)`,
          ...(isDesktop && {
            padding:'0px 20px'
        })
        }),
        ...sx,
      }}
      {...other}
    >
      {children}
    </Box>
  );
}
