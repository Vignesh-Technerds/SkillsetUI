import Enum from '../../helpers/constants';
import SkillSetForm from '../skillSetForm/skillSetForm.component';
const Category = () => {
    const skillSetFormInfo = {
        heading: "Category",
        label: "Category",
        skillSetType: Enum.SkillSetType.Category
    };
    return (
        <>
            <SkillSetForm {...skillSetFormInfo} />
        </>
    )
}
export default Category;