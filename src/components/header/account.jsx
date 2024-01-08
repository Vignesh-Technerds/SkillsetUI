import { useState } from 'react';
import { Box, Divider, Popover, MenuItem, Typography, IconButton} from '@mui/material';
import Logo from "../../assets/images/RicondoLogo.png";
import ProfileIcon from "../../assets/images/icons/profile.svg";
import Notify from "../../assets/images/icons/Vector.png";
import { useResponsive } from '../common/responsive';
import Hamburger from './hamburger';

export default function AccountPopover({ handleNav, openNav }) {
  const isDesktop = useResponsive('up', 'sm');
  const MENU_OPTIONS = [
    {
      label: 'Home',
      icon: 'eva:home-fill',
    },
    {
      label: 'Profile',
      icon: 'eva:person-fill',
    },
    {
      label: 'Settings',
      icon: 'eva:settings-2-fill',
    },
  ];
  const [open, setOpen] = useState(null);
  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };
  const handleClose = () => {
    setOpen(null);
  };
  return (
    <> {!isDesktop && <Hamburger handleNav={handleNav} openNav={openNav} />}
      <Box
        component="img"
        sx={{
          height: 32,
          ...(isDesktop && {
            height: 40,
          })
        }}
        src={Logo}
      >
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          paddingRight: '60px',
          ...(isDesktop && {
            paddingRight: '0px',
          })
        }}
      >
        <IconButton
          onClick={handleOpen}
          sx={{
            display: 'flex',
            width: 48,
            height: 48,
          }}
        >
          <Box
            component="img"
            sx={{
              height: 20,
            }}
            src={Notify}
          >
          </Box>
        </IconButton>
        <IconButton
          onClick={handleOpen}
          sx={{
            display: 'flex',
            width: 36,
            padding: 0,
            height: 36,
          }}
        >
          <Box
            component="img"
            sx={{
              height: 40,
            }}
            src={ProfileIcon}
          >
          </Box>
        </IconButton>
      </Box>
      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1,
            ml: 0.75,
            width: 200,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2 }}>
          <Typography variant="subtitle2" noWrap>
            Hari
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            hari@gmail.com
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {MENU_OPTIONS.map((option) => (
          <MenuItem key={option.label} onClick={handleClose}>
            {option.label}
          </MenuItem>
        ))}

        <Divider sx={{ borderStyle: 'dashed', m: 0 }} />

        <MenuItem
          disableRipple
          disableTouchRipple
          onClick={handleClose}
          sx={{ typography: 'body2', color: 'error.main', py: 1.5 }}
        >
          Logout
        </MenuItem>
      </Popover>
    </>
  );
}
