import { useState } from 'react';
import Box from '@mui/material/Box';
import Main from './main';
import Header from '../header/header';
import Nav from '../side-nav/side-nav';
import { useResponsive } from '../common/responsive';

export default function Layout({ children }) {
  const isDesktop = useResponsive('up', 'sm');
  const [openNav, setOpenNav] = useState(isDesktop ? true : false);
  const handleNav = (nav) => {
    setOpenNav(nav);
  }
  return (
    <>
      <Header openNav={openNav} handleNav={handleNav} />
      <Box
        sx={{
          minHeight: 100,
          height: '100%',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        <Nav
          sx={{
            innerHeight: 100,
            minHeight: 100,
          }}
          openNav={openNav} handleNav={handleNav}
        />

        <Main>{children}</Main>
      </Box>
    </>
  );
}
