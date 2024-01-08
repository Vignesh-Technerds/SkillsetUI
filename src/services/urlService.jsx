const baseURL = "https://localhost:7179/api/";
//const baseURL = "https://ricondo-skillset.azurewebsites.net/api/";

export const UrlService = {
    processSkillSet: baseURL + "SkillSet/processSkillSet",
    getSkillSet: baseURL + "SkillSet/getSkillSet?skillSetType=#skillSetType#",

    // Skill Grouping
    getSkillGroupingData: baseURL + "Grouping/GetSkillGroupingInfos",
    initSkillGroupingData: baseURL + "Grouping/InitSkillGrouping",
    getSkillCategoryData: baseURL + "Grouping/GetSkillCategoryData",
    getSkillCategoryTechnicalServiceData: baseURL + "Grouping/GetSkillCategoryTechnicalServiceData",
    processSkillCategoryData: baseURL + "Grouping/ProcessSkillCategoryData",
    processSkillCategoryTechnicalServiceData: baseURL + "Grouping/ProcessSkillCategoryTechnicalServiceData",

    // Skill Verification
    getSkillVerificationData: baseURL + "UserProfile/getSkillVerificationData",
    approveUserSkill: baseURL + "UserProfile/approveUserSkill",
    getSkillLevelData: baseURL + "UserProfile/getSkillLevelData",
    updateSkillLevel: baseURL + "UserProfile/updateSkillLevel",

    //Account
    getUserInfo: baseURL + "Account/getUserInfo?emailId=#emailId#",
};