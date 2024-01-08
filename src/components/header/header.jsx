
import { AppBar, Stack, Toolbar } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { HEADER } from '../layout/config-layout';
import { useResponsive } from '../common/responsive';
import AccountPopover from './account';
export default function Header({ handleNav, openNav }) {
    const lgUp = useResponsive('up', 'sm');
    const theme = useTheme();
    return (
        <AppBar
            sx={{
                boxShadow: 'none',
                backgroundColor: '#ebf1f4',
                height: HEADER.H_MOBILE,
                zIndex: theme.zIndex.appBar + 1,
                transition: theme.transitions.create(['height'], {
                    duration: theme.transitions.duration.shorter,

                }),
                ...(lgUp && {
                    width: `calc(100%)`,
                    height: HEADER.H_DESKTOP,
                })
            }}
        >
            <Toolbar
                sx={{
                    height: 1, px: { lg: 5 },
                    paddingLeft: '16px !important',
                    paddingRight: '16px !important',
                    boxShadow: '0 1px 5px rgba(64,64,64,.06), 0 1px 4px rgba(64,64,64,.2)',
                }}
            >
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: "100%" }}>
                    <AccountPopover handleNav={handleNav} openNav={openNav} />
                </Stack>
            </Toolbar>
        </AppBar>
    );
}