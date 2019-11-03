function appReducer(state, action) {
  switch (action.type) {
    case "Login": {
      return {
        ...state,
        username: action.payload.username,
        chats: action.payload.chats
      };
    }
    case "AddMessage": {
      const { reciever, sender } = action.payload;
      // console.log({ reciever, sender });
      const newChats = JSON.parse(JSON.stringify(state.chats));
      let obj = {};
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
      return { ...state, ...obj };
    }
    case "ChatInView": {
      return { ...state, chatInView: action.payload };
    }
    case "DeleteChatTemporary": {
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
