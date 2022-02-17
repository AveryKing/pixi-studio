import SidebarButton from "./SidebarButton";

const LeftSidebar = () => {
    const sidebarButtons = [
        {text: 'select'},
        {text: 'move'},
        {text: 'rectangle'},
        {text: 'circle'},
        {text: 'line'},
        {text: 'animation'},
        {text: 'filter'}
    ]

    return (
        <div id='sidebar-left'>
            {sidebarButtons.map(({text}) => <SidebarButton text={text} />)}
        </div>
    )
}

export default LeftSidebar;