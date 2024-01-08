import Enum from '../../helpers/constants';
import SkillSetForm from '../skillSetForm/skillSetForm.component';
const Skill = () => {
    const skillSetFormInfo = {
        heading: "Skill",
        label: "Skill",
        skillSetType: Enum.SkillSetType.Skill
    };
    return (
        <>
            <SkillSetForm
                {...skillSetFormInfo}
            />
        </>
    )
}
export default Skill;