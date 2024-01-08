import Enum from '../../helpers/constants';
import SkillSetForm from '../skillSetForm/skillSetForm.component';
const TechnicalService = () => {
    const skillSetFormInfo = {
        heading: "Technical Service",
        label: "Technical Service",
        skillSetType: Enum.SkillSetType.TechnicalService
    };
    return (
        <>
            <SkillSetForm {...skillSetFormInfo} />
        </>
    )
}
export default TechnicalService;