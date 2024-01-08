import { Outlet, useRoutes } from 'react-router-dom';
import Layout from '../layout/layout';
import User from '../user/user.component';
import TechnicalService from '../technical-service/technicalService.component';
import Category from '../category/category.component';
import Skill from '../skill/skill.component';
import SkillGrouping from '../skill-grouping/skillGrouping.component';
import SkillVerification from '../skill-verification/skillVerification.component';
import { loginRequest, loginType } from '../../authConfig';
import Error from '../error/error.component';
import LoadingComponent from '../loader/loading.component';
import UserSkill from '../user-skill/userSkill.component';
import Enum, { StorageKeys } from '../../helpers/constants';
import { SessionStorage } from '../../helpers/storage';
import { MsalAuthenticationTemplate, useIsAuthenticated } from '@azure/msal-react';
export default function Router() {
    const RoleType = Enum.RoleType;
    const isAuthenticated = useIsAuthenticated();

    const privateRoute  = (component, allowedRoleTypes = []) => {
        const authRequest = { ...loginRequest, };
        const userInfo = JSON.parse(SessionStorage.getItem(StorageKeys.userInfo));

        if(isAuthenticated && userInfo){
            const roleAccess = allowedRoleTypes.indexOf(userInfo.roleId) !== -1;
            if(userInfo?.roleId && roleAccess){
                if(window.location.pathname === '/'){
                    //redirect to default path based on the user role.
                    if(userInfo?.roleId === RoleType.Admin){
                        window.location.href = '/user';
                    }
                    else if(userInfo?.roleId === RoleType.User){
                        window.location.href = '/user-skill';
                    }
                }
            }
            else{
                component = <Error message={"You are not authorized to view this page"} />;
            }
        }
        else{
            component = <></>;
        }
        
        
        return (
        <MsalAuthenticationTemplate
            interactionType={loginType}
            authenticationRequest={authRequest}
            errorComponent={Error}
            loadingComponent={LoadingComponent}
        >
          {component}
        </MsalAuthenticationTemplate>);
    }; 

    const routes = useRoutes([
        {
            path: "*",
            element: <Error message="Page Not Found" />
        },
        {
            path: "/access-denied",
            element: <Error />
        },
        {
            path: "/token-expired",
            element: <Error />
        },
        {
            path: "/server-error",
            element: <Error />
        },
        {
            path: "/",
            element: privateRoute(<Layout><Outlet /></Layout>, [RoleType.Admin, RoleType.User]),
            children: [
                { path: 'user', element: privateRoute(<User />, [RoleType.Admin] )},
                { path: 'technical-service', element: privateRoute(<TechnicalService /> , [RoleType.Admin]) },
                { path: 'category', element: privateRoute(<Category />, [RoleType.Admin]) },
                { path: 'skill', element: privateRoute(<Skill />, [RoleType.Admin]) },
                { path: 'skill-grouping', element: privateRoute(<SkillGrouping />, [RoleType.Admin]) },
                { path: 'skill-verification', element: privateRoute(<SkillVerification />, [RoleType.Admin]) },
                { path: 'user-skill', element: privateRoute(<UserSkill />, [RoleType.User])}
            ],
        },  
    ]);

    return routes;
}
