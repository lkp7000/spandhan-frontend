import {
    HiOutlineColorSwatch,
    HiOutlineDesktopComputer,
    HiOutlineTemplate,
    HiOutlineViewGridAdd,
    HiOutlineHome,
    HiDocumentText,
    HiUserAdd,
    HiOutlineUserGroup,
    HiOutlineUserCircle,
    HiOutlineFolderAdd 
} from 'react-icons/hi'


export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
    home: <HiOutlineHome />,
    prescription : <HiDocumentText />,
    addUser : <HiUserAdd />,
    doctor : <HiOutlineFolderAdd />,
    patientGroup : <HiOutlineUserGroup />,
    patient : <HiOutlineUserCircle />,
    singleMenu: <HiOutlineViewGridAdd />,
    collapseMenu: <HiOutlineTemplate />,
    groupSingleMenu: <HiOutlineDesktopComputer />,
    groupCollapseMenu: <HiOutlineColorSwatch />,
}

export default navigationIcon
