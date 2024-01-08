import Enum from "../../helpers/constants";
import SvgColor from "../common/svg-color";

const icon = (name) => {
    const iconsContext = require.context('../../assets/images/icons/navbar', false, /\.svg$/);
    const iconPath = iconsContext(`./${name}.svg`);
    return <SvgColor src={iconPath} sx={{ width: 1, height: 1 }} />
};

const getNavConfig = (roleType) => {
    let navConfig = [];
    if(roleType === Enum.RoleType.Admin){
        navConfig = getAdminNavConfig;
    }
    else if(roleType === Enum.RoleType.User){
        navConfig = getUserNavConfig;
    }
    return navConfig;
}

const getAdminNavConfig = [
    {
        title: 'User',
        path: '/user',
        icon: icon('people'),
       
    },
    {
        title: 'Skill Master',
        path: '/skill-master',
        icon: icon('skill-master'),
        children: [
            {
                title: 'Technical Service',
                path: '/technical-service',
                icon: icon('skill'),
            },
            {
                title: 'Category',
                path: '/category',
                icon: icon('skill'),
            },
            {
                title: 'Skill',
                path: '/skill',
                icon: icon('skill'),
            }
        ]
    },
    {
        title: 'Skill Grouping',
        path: '/skill-grouping',
        icon: icon('skill-group'),
    },
    {
        title: 'Skill Verification',
        path: '/skill-verification',
        icon: icon('verification'),
    },
];

const getUserNavConfig = [
    {
        title: 'Skills',
        path: '/user-skill',
        icon: icon('people')
    }
];

const NavConfig = {
    getNavConfig 
}

export default NavConfig;
