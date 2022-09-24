function SideBarButton(props) {
  return (
    <button
      onClick={props.onClick}
      className={`text-left px-4 py-2 rounded-lg ${
        props.selected
          ? `bg-slate-200 text-black font-semibold`
          : `hover:bg-slate-200 text-slate-500 hover:text-black`
      }`}
    >
      {props.title}
    </button>
  )
}

function SideBar(props) {
  const { messageType, setMessageType } = props

  return (
    <div className="space-y-2 flex flex-col">
      <SideBarButton
        onClick={() => setMessageType('Inbox')}
        title="Inbox"
        selected={messageType === 'Inbox'}
      />
      <SideBarButton
        onClick={() => setMessageType('Sent')}
        title="Sent"
        selected={messageType === 'Sent'}
      />
    </div>
  )
}

export default SideBar
