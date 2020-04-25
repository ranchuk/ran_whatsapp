function appReducer(state, action) {
  switch (action.type) {
    case "OPEN_CLOSE_NAVBAR": {
          return {
            ...state,
            isNavbarOpen : action.payload
          };
    }
    case "Login": {
      return {
        ...state,
        username: action.payload.username,
        chats: action.payload.chats,
        token: action.payload.token,
        chatInView: {}
      };
    }
    case "Logout": {
      return {
        ...state,
        username: '',
        chats: [],
        chatInView: {},
        token: ''
      };
    }
    case "OnlineStatus": {
      const { username, status } = action.payload;
      const newChats = JSON.parse(JSON.stringify(state.chats));
      let newChatInView = JSON.parse(JSON.stringify(state.chatInView));
      state.chats.forEach((chat, index) => {
        if (chat.username1 === username || chat.username2 === username) {
          newChats[index].isOnline = status === "online" ? true : false;
        }

        if (Object.keys(state.chatInView).length > 0) {
          //maby we didnt pick chat yet
          if (state.chatInView.username1 === username || state.chatInView.username2 === username) {
            newChatInView = {
                ...state.chatInView,
                isOnline:  newChats[index].isOnline
            }
          }
        }
      });

      return {
        ...state,
        chats: newChats,
        chatInView: newChatInView
      };
    }
    case "AddMessage": {
      const { reciever, sender } = action.payload;
      const newChats = JSON.parse(JSON.stringify(state.chats));
      let obj = {};
      const isChatExist = state.chats.find((chat)=> (chat.username1 === sender && chat.username2 === reciever) || (chat.username1 === reciever && chat.username2 === sender))
      if(isChatExist){
        state.chats.forEach((chat, index) => {
          if (
            (chat.username1 === sender && chat.username2 === reciever) ||
            (chat.username1 === reciever && chat.username2 === sender)
          ) {
            newChats[index].chat.push(action.payload);
            obj = { chats: newChats };
            if (Object.keys(state.chatInView).length > 0) {
              //maby we didnt pick chat yet
              if (
                (state.chatInView.username1 === reciever &&
                  state.chatInView.username2 === sender) ||
                (state.chatInView.username2 === reciever &&
                  state.chatInView.username1 === sender)
              ) {
                const newChatInView = JSON.parse(JSON.stringify(newChats[index]));
                newChats[index].chat[newChats[index].chat.length -1].isRead = true; // the message include in chatInView so we need ot update that we read the message already
                obj = {
                  ...state,
                  chats: newChats,
                  chatInView: {
                    ...state.chatInView,
                    chat: [...newChatInView.chat]
                  }
                };
                // console.log(obj);
              }
            }
            return;
          }
        });
      }
      else {
        // both users online, first user add other user to the chat so we need to create new cht in client side
        // This else statement will happend max only once for chat in lifetime or not at all
        const newChat = {
                username1:action.payload.sender,
                username2:action.payload.reciever,
                chat : [{...action.payload}],
                isOnline:true
        }
        newChats.push(newChat)
        obj = {
          chats: newChats,
        };
      }
      return { ...state, ...obj };
    }
    case "ChatInView": {
      if(Object.keys(action.payload).length > 0){
          let newChatInView = JSON.parse(JSON.stringify(action.payload));
          newChatInView.chat.forEach((message)=>{
            if(message.reciever === state.username){
              message.isRead = true;
            }
          })

          let newChats = JSON.parse(JSON.stringify(state.chats))
          let newChat = newChats.find((chat)=>{
          return (chat.username1 === newChatInView.username1 && chat.username2 === newChatInView.username2) || (chat.username1 === newChatInView.username2 && chat.username2 === newChatInView.username1)
          })
          newChat.chat.forEach((message)=>{
            if(message.reciever === state.username){
              message.isRead = true;
            }
          })
          return { ...state, chatInView: newChatInView, chats: newChats};
      }
      else {
        return { ...state, chatInView: {}};
      }
    }
    // case "updateChatInViewReadStatus": {
    //   let newChatInView = JSON.parse(JSON.stringify(state.chatInView));
    //   newChatInView.chat.forEach((message)=>{
    //     if(message.reciever === state.username){
    //       message.isRead = true;
    //     }
    //   })

    //   console.log(newChatInView)
    //   return { ...state, chatInView: newChatInView};
    // }
    case "DeleteChat": {
      const { reciever } = action.payload;
      const newChats = JSON.parse(JSON.stringify(state.chats));
      state.chats.forEach((chat, index) => {
        if (chat.username1 === reciever || chat.username2 === reciever) {
          newChats[index].chat = [];
          return;
        }
      });
      return { ...state, chats: newChats };
    }
    case "someoneWriting": {
      if (Object.keys(state.chatInView).length > 0) {
        //maby we didnt pick chat yet
        const { sender, length } = action.payload;
        const newChatInView = JSON.parse(JSON.stringify(state.chatInView));

        if (
          (state.chatInView.username1 === sender ||
            state.chatInView.username2 === sender) &&
          length > 0
        ) {
          newChatInView.isWriting = true;
        } else {
          newChatInView.isWriting = false;
        }

        return { ...state, chatInView: newChatInView };
      } else return state;
    }
    case "AddContact": {
      const newChats = JSON.parse(JSON.stringify(state.chats));
      newChats.push(action.payload);
      return { ...state, chats: newChats };
    }
    default: {
      return state;
    }
  }
}

export default appReducer;
