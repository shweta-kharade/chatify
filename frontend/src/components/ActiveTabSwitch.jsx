import React from 'react'
import { useChatStore } from '../store/useChatStore'

const ActiveTabSwitch = () => {
  const {activeTab, setActiveTab} = useChatStore();

  return (
    <div className='tabs tabs-boxed bg-transparent p-2 m-2'>
      <div className={`tab ${activeTab === "chats"? "bg-cyan-500/20 text-cyan-400" : "text-slate-400" }`} onClick={() => setActiveTab("chats")}>Chats</div>
      <div className={`tab ${activeTab === "contacts"? "bg-cyan-500/20 text-cyan-400" : "text-slate-400" }`} onClick={() => setActiveTab("contacts")}>Contacts</div>
    </div>
  )
}

export default ActiveTabSwitch