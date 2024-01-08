import { Box, Collapse, Drawer, List, ListItemButton, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePathname } from '../common/pathname';
import { NAV } from '../layout/config-layout';
import NavConfig from './config-navigation';
import Menuline from "../../assets/images/icons/navbar/menuline.svg";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useResponsive } from '../common/responsive';
import Hamburger from "../header/hamburger";
import { SessionStorage } from '../../helpers/storage';
import { StorageKeys } from '../../helpers/constants';
export default function Nav({ handleNav, openNav }) {
    const isDesktop = useResponsive('up', 'sm');
    const pathname = usePathname();
    const upLg = true;
    const [activeParent, setActiveParent] = useState('');
    const [activeChild, setChildParent] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
    }, [activeParent])
    const handleParent = (item, collapse) => {
        setActiveParent(collapse ? '' : item.title);
        if (!(item.children && item.children.length > 0)) {
            !isDesktop && handleNav(false);
            navigate(item.path);
        }
    }
    const handleChild = (item) => {
        setChildParent(item.title);
        !isDesktop && handleNav(false);
        navigate(item.path);
    }
    const handleHamBurger = () => {
        if (openNav) {
            setActiveParent('');
        }
        handleNav(!openNav);
    }
    const renderContent = () => {
        const userInfo = JSON.parse(SessionStorage.getItem(StorageKeys.userInfo));
        let navList = NavConfig.getNavConfig(userInfo?.roleId);
        return <Stack
            sx={{
                height: 1,
                '& .simplebar-content': {
                    height: 1,
                    display: 'flex',
                    flexDirection: 'column',
                },
            }}
        >
            {isDesktop && <Hamburger handleNav={handleHamBurger} openNav={openNav} />}
            <Stack component="nav" spacing={0.5} sx={{
                marginTop: 10,
                position: 'relative',
                backgroundColor: '#f0f6ff',
                ...(isDesktop && {
                    marginTop: 10,
                    py: 3,
                    px: 1,
                })
            }}>
                <Box
                    sx={{
                        position: 'absolute',
                        right: '10px',
                    }}
                >

                </Box>
                {navList.map((item) => (
                    <NavItem
                        key={item.title}
                        item={item}
                        activeParent={activeParent}
                        activeChild={activeChild}
                        handleParent={handleParent}
                        handleChild={handleChild}
                        openNav={openNav}
                    />
                ))}
            </Stack>
        </Stack>
    };
    return (
        <Box
            sx={{
                flexShrink: { sm: 0 },
                width: { sm: openNav ? NAV.WIDTH : NAV.WIDTH - 150 }
            }}  
        >
            {upLg ? (
                <Box
                    sx={{
                        height: 1,
                        position: 'fixed',
                        width: openNav ? NAV.WIDTH : NAV.WIDTH - 230,
                        background: '#f0f6ff',
                        zIndex: '9',
                        // padding:'0px',
                        borderRight: (theme) => `solid 1px ${theme.palette.divider}`,
                        ...(isDesktop && {
                            width: openNav ? NAV.WIDTH : NAV.WIDTH - 150,
                        })
                        // ...(isDesktop && {
                        //     padding:'0px 8px'
                        // })
                    }}
                >

                    {renderContent()}
                </Box>
            ) : (
                <Drawer
                    open={openNav}
                    onClose={() => { handleNav(false) }}
                    PaperProps={{
                        sx: {
                            width: NAV.WIDTH,
                        },
                    }}
                >
                    {renderContent()}
                </Drawer>
            )}
        </Box>
    );
}

function NavItem({ item, handleParent, handleChild, activeParent, activeChild, openNav }) {
    const active = item.title === activeParent;
    return (
        <>
            <ListItemButton
                sx={{
                    minHeight: 44,
                    display: 'unset',
                    py: 0,
                    borderRadius: 0.75,
                    typography: 'body2',
                    color: 'text.secondary',
                    textTransform: 'capitalize',
                    fontWeight: 'fontWeightMedium',
                    ...(active && {
                        color: 'primary.main',
                        fontWeight: 'fontWeightSemiBold',
                        background: 'transparent',
                    }),
                }}
                onClick={() => { handleParent(item, active) }}
            >
                <Box
                    component="div"
                    sx={{
                        minHeight: 44,
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    <Box component="span" sx={{ width: 24, height: 24, mr: 1 }}>
                        {item.icon}
                    </Box>
                    {openNav && <Box component="span">{item.title} </Box>}
                    {item && item.children && item.children.length > 0 && openNav &&
                        (active ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />)}
                </Box>
            </ListItemButton>
            {item && item.children && item.children.length > 0 &&
                <>
                    <Collapse in={active} timeout="auto" unmountOnExit>
                        {item.children.map(child => {
                            const childActive = child.title === activeChild;
                            return <List component="div"
                                sx={{
                                    ml: 3,
                                    ...(openNav && {
                                        borderLeft: '2px solid #cfd4db',
                                        ':last-child': {
                                            borderLeft: '2px solid transparent',
                                        },
                                    })
                                }}
                                disablePadding onClick={() => { handleChild(child) }}>
                                <ListItemButton sx={{
                                    minHeight: 44,
                                    marginBottom: .5,
                                    margin: '0px',
                                    px: 0,
                                    borderRadius: '0px !important',
                                    typography: 'body2',
                                    color: 'text.secondary',
                                    textTransform: 'capitalize',
                                    fontWeight: 'fontWeightMedium',
                                    ...(childActive && {
                                        color: 'primary.main',
                                        fontWeight: 'fontWeightSemiBold',
                                    }),

                                    ...openNav && {
                                    }
                                }}>
                                    <Box component="span"
                                        sx={{
                                            position: 'relative',
                                            display: 'flex',
                                            '&::before': {
                                                content: "' '",
                                                display: 'block',
                                                position: 'absolute',
                                                left: '-24px',
                                                top: '-12px',
                                                width: '36px',
                                                height: '42px',
                                                ...(openNav && {
                                                    background: `url(${Menuline}) center/cover`,
                                                })
                                            },
                                        }}
                                    >

                                        {openNav && <>
                                            <Box component="span"
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    paddingLeft: '20px'
                                                }}
                                            >{child.title} </Box>
                                        </>
                                        }
                                    </Box>
                                </ListItemButton>
                            </List>

                        })}

                    </Collapse>
                </>
            }
        </>

    );
}

