import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";


export const useChatStore = create((set) => ({
    allContacts: [],
    chats: [],
    messages: [],
    activeTab: "chats",
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isSoundEnabled: localStorage.getItem('isSoundEnabled') === true,

    toggleSound: () => {
        localStorage.setItem('isSoundEnabled', !get().isSoundEnabled);
        set({inSoundEnabled: !get().isSoundEnabled});
    },

    setActiveTab : (tab) => set({activeTab: tab}),
    setSelectedUser : (selectedUser) => set({selectedUser: selectedUser}),

    getAllContacts: async() => {    
        set({isUsersLoading:true});
        try {
            const res = await axiosInstance.post("/messages/contacts", data);
            set({allContacts: res.data});

        } catch (error) {
            //toast
            toast.error(error.response.data.message);
            
        }
        finally{
            set({isUsersLoading:false});
        }
    },

    getMyChatPartners: async() => {
        set({isUsersLoading:true});
        try {
            const res = await axiosInstance.post("/auth/chats", data);
            set({messages: res.data});  

        } catch (error) {
            //toast
            toast.error(error.response.data.message);
            
        }
        finally{
            set({isUsersoading: false});
        }
    }

}))

