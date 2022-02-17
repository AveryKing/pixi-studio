const SidebarButton = ({text}) => {
    return (
        <div className='sidebar-button'>
            <a data-type={text}><p>{text}</p></a>
        </div>
    )
}

export default SidebarButton;